// NOTE: Make sure to install 'react-speech-recognition' and its types:
// npm install react-speech-recognition
// npm install --save-dev @types/react-speech-recognition

import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'containers/modal/modal';
import { useAppSelector, useAppDispatch } from 'hooks/useRedux';
import { selectUserCart } from 'redux/slices/userCart';
import { useAuth } from 'contexts/auth/auth.context';
import { MicFillIcon } from 'components/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import cls from './VoiceOrderChat.module.scss';
import productService from 'services/product';
import shopService from 'services/shop';
import ProductResultItem from 'components/searchResultItem/productResultItem';
import Price from 'components/price/price';
import orderService from 'services/order';
import cartService from 'services/cart';
import paymentService from 'services/payment';
import categoryService from 'services/category';
import useUserLocation from 'hooks/useUserLocation';
import qs from 'qs';
import useShopWorkingSchedule from 'hooks/useShopWorkingSchedule';
import categories from 'data/categories';

const SUGGESTIONS = [
  'Order Coca Cola',
  'Find pizza near me',
  'Add 2 burgers to cart',
  'Checkout',
  'Show me shops with offers',
];

// Conversational state machine
const CONVO_STEPS = {
  PREVIEW: 'preview',
  SELECTION: 'selection',
  CONFIRM_ADD: 'confirm_add',
  CONFIRM_CHECKOUT: 'confirm_checkout',
  DELIVERY_PICKUP: 'delivery_pickup',
  LOCATION_CONFIRM: 'location_confirm',
  PAYMENT: 'payment',
  DONE: 'done',
  ORDER_AGAIN: 'order_again',
};

const AFFIRMATIVE = ["yes", "yeah", "yep", "sure", "ok", "okay", "proceed", "continue", "checkout", "add", "confirm"];
const NEGATIVE = ["no", "nope", "not now", "go back", "cancel", "back", "continue shopping"];
const CHECKOUT = ["checkout", "check out", "proceed to checkout", "pay now"];
const LOGIN = ["login", "log in", "sign in"];

function parseSimpleIntent(text: string) {
  const t = text.trim().toLowerCase();
  if (AFFIRMATIVE.some((w) => t.includes(w))) return "affirmative";
  if (NEGATIVE.some((w) => t.includes(w))) return "negative";
  if (CHECKOUT.some((w) => t.includes(w))) return "checkout";
  if (LOGIN.some((w) => t.includes(w))) return "login";
  return null;
}

// Helper: extract shop name or number from user query
function extractShopQuery(text: string) {
  const lower = text.toLowerCase();
  
  // Search by name patterns
  const matchName = lower.match(/search for (.+)/i);
  if (matchName) return { type: 'name', value: matchName[1].trim() };
  
  // List specific number of shops
  const matchList = lower.match(/list (?:for me )?(\d+) shops?/i);
  if (matchList) return { type: 'list', value: parseInt(matchList[1], 10) };
  
  // Natural language patterns for general shop search
  const generalShopPatterns = [
    /any shops?/i,
    /show me shops?/i,
    /find shops?/i,
    /list shops?/i,
    /get shops?/i,
    /what shops?/i,
    /available shops?/i,
    /nearby shops?/i,
    /local shops?/i
  ];
  
  for (const pattern of generalShopPatterns) {
    if (pattern.test(lower)) {
      return { type: 'list', value: 10 }; // Default to 10 shops
    }
  }
  
  return null;
}

// Helper: get location string for shop queries
function getLocationParam(userLocation: any) {
  if (!userLocation) return undefined;
  if (typeof userLocation === 'string') return userLocation;
  if (typeof userLocation === 'object' && userLocation.latitude && userLocation.longitude) {
    return `${userLocation.latitude},${userLocation.longitude}`;
  }
  return undefined;
}

// Helper: debug log shop search
function debugShopSearch(params: any, result: any) {
  console.log('=== SHOP SEARCH DEBUG ===');
  console.log('Search params:', JSON.stringify(params, null, 2));
  console.log('Search result:', JSON.stringify(result, null, 2));
  console.log('Shops found:', result?.data?.length || 0);
  console.log('Total pages:', result?.meta?.last_page || 0);
  console.log('=== END SHOP DEBUG ===');
}

// Add product search patterns
function extractProductQuery(text: string) {
  const lower = text.toLowerCase();
  
  // Direct product search patterns
  const productPatterns = [
    /show me products?/i,
    /what products?/i,
    /what can i buy/i,
    /what do you have/i,
    /show me what you have/i,
    /i want to order/i,
    /i want to buy/i,
    /let me see products?/i,
    /display products?/i,
    /list products?/i,
    /get products?/i,
    /find products?/i
  ];
  
  for (const pattern of productPatterns) {
    if (pattern.test(lower)) {
      return { type: 'general', value: '' }; // General product search
    }
  }
  
  // Specific product search
  const matchProduct = lower.match(/(?:show me|find|get|buy|order) (.+)/i);
  if (matchProduct) return { type: 'specific', value: matchProduct[1].trim() };
  
  return null;
}

// Category name to ID mapping
const CATEGORY_NAME_TO_ID: Record<string, number> = {
  'all': 0,
  'burger': 1,
  'salad': 2,
  'pizza': 3,
  'soup': 4,
  'chicken': 5,
  'japanese': 6,
  'swahili foods': 7, // Add your real ID here if available
};

function getCategoryIdFromQuery(query: string): number | undefined {
  if (!query) return undefined;
  const normalized = query.trim().toLowerCase();
  // Try direct match
  if (CATEGORY_NAME_TO_ID[normalized] !== undefined) return CATEGORY_NAME_TO_ID[normalized];
  // Try partial match
  for (const key in CATEGORY_NAME_TO_ID) {
    if (normalized.includes(key)) return CATEGORY_NAME_TO_ID[key];
  }
  return undefined;
}

const VoiceOrderChat = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [productResults, setProductResults] = useState<any[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [shopResults, setShopResults] = useState<any[]>([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [micError, setMicError] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [orderStep, setOrderStep] = useState<'search' | 'select' | 'cart' | 'payment'>('search');
  const [usingOpenAI, setUsingOpenAI] = useState<boolean | null>(null);
  const [convoStep, setConvoStep] = useState(CONVO_STEPS.PREVIEW);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showMorePage, setShowMorePage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [showMoreShopPage, setShowMoreShopPage] = useState(1);
  const [hasMoreShops, setHasMoreShops] = useState(false);
  
  const { 
    transcript, 
    listening, 
    resetTranscript, 
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable 
  } = useSpeechRecognition();
  
  const cart = useAppSelector(selectUserCart);
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userLocation = useUserLocation();
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging for speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('=== SPEECH RECOGNITION DEBUG ===');
      console.log('browserSupportsSpeechRecognition:', browserSupportsSpeechRecognition);
      console.log('isMicrophoneAvailable:', isMicrophoneAvailable);
      console.log('listening:', listening);
      console.log('transcript:', transcript);
      console.log('input state:', input);
      
      // Test if Web Speech API is available
      if (typeof window !== 'undefined') {
        // @ts-ignore
        console.log('window.SpeechRecognition available:', !!window.SpeechRecognition);
        // @ts-ignore
        console.log('window.webkitSpeechRecognition available:', !!window.webkitSpeechRecognition);
      }
      
      console.log('=== END SPEECH DEBUG ===');
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable, listening, transcript, input]);

  // Check microphone permissions on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && browserSupportsSpeechRecognition) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          console.log('Microphone permission status:', permissionStatus.state);
          if (permissionStatus.state === 'denied') {
            setMicError('Microphone access denied. Please enable it in your browser settings.');
          }
        })
        .catch((err) => {
          console.log('Permission query failed:', err);
        });
    }
  }, [browserSupportsSpeechRecognition]);

  // Start/stop listening for voice
  const handleMicClick = async () => {
    console.log('=== MIC CLICK DEBUG ===');
    console.log('Mic button clicked. Current listening state:', listening);
    setMicError('');
    
    if (!browserSupportsSpeechRecognition) {
      setMicError('Sorry, your browser does not support speech recognition.');
      return;
    }

    if (!isMicrophoneAvailable) {
      setMicError('Microphone not available. Please check your microphone settings.');
      return;
    }

    try {
      if (listening) {
        console.log('Stopping speech recognition...');
        SpeechRecognition.stopListening();
        console.log('Stopped listening');
      } else {
        console.log('Starting speech recognition...');
        // Reset transcript and input before starting
        resetTranscript();
        setInput('');
        
        // Start listening with better configuration
        SpeechRecognition.startListening({ 
          continuous: true, 
          language: 'en-US',
          interimResults: true
        });
        console.log('Started listening');
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setMicError('Failed to start speech recognition. Please try again.');
    }
    console.log('=== END MIC CLICK DEBUG ===');
  };

  // When transcript changes, update input in real-time
  useEffect(() => {
    if (transcript) {
      console.log('Transcript updated:', transcript);
      setInput(transcript);
    }
  }, [transcript]);

  // Handle when listening stops and we have a transcript
  useEffect(() => {
    if (!listening && transcript.trim()) {
      console.log('Listening stopped, processing transcript:', transcript);
      handleSend(transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript]);

  // Helper: map category name to id (simplified, should be dynamic)
  const CATEGORY_MAP: Record<string, number> = {
    pharmacy: 1, // Example, replace with real IDs
    supermarket: 2,
    restaurant: 3,
    // ...
  };

  // Helper: advanced intent parser
  function parseAdvancedIntent(text: string) {
    const t = text.toLowerCase();
    if (t.includes('low calorie') || t.includes('diet')) return { type: 'diet', value: 'low_calorie' };
    if (t.includes('gluten free')) return { type: 'diet', value: 'gluten_free' };
    if (t.includes('allergy') || t.includes('allergic')) return { type: 'allergy' };
    if (t.includes('recipe') || t.includes('how to cook')) return { type: 'recipe' };
    return null;
  }

  // Handle sending a message (text or voice)
  const handleSend = useCallback(async (text: string) => {
    console.log('=== VOICE CHAT HANDLE SEND ===');
    console.log('Input text:', text);
    console.log('Current convo step:', convoStep);
    console.log('User location:', userLocation);
    console.log('Location param:', getLocationParam(userLocation));
    console.log('Selected shop:', selectedShop);
    
    if (!text.trim()) return;
    setMessages((msgs) => [...msgs, { sender: 'user', text }]);
    setLoading(true);
    setProductResults([]);
    setShopResults([]);
    const simpleIntent = parseSimpleIntent(text);
    const advIntent = parseAdvancedIntent(text);
    
    console.log('Simple intent:', simpleIntent);
    console.log('Advanced intent:', advIntent);
    
    // Check for affirmative responses when shop is selected
    if (selectedShop && convoStep === CONVO_STEPS.PREVIEW) {
      const isAffirmative = isAffirmativeResponse(text);
      const isProductRequest = isProductSearchRequest(text);
      
      if (isAffirmative || isProductRequest) {
        console.log('Detected affirmative response or product request, showing products from selected shop');
        setProductLoading(true);
        const searchParams = {
          search: '',
          page: 1,
          shop_id: selectedShop.id,
          address: getLocationParam(userLocation),
        };
        console.log('Product search with params:', searchParams);
        const res = await productService.search(searchParams);
        console.log('Product search result:', res);
        setProductResults(res.data || []);
        setHasMoreProducts(res.meta && res.meta.last_page > 1);
        setShowMorePage(2);
        setConvoStep(CONVO_STEPS.SELECTION);
        setMessages((msgs) => [...msgs, { sender: 'bot', text: `Here are products from ${selectedShop.translation?.title}:` }]);
        setLoading(false);
        setProductLoading(false);
        if (!res.data || res.data.length === 0) {
          setMessages((msgs) => [...msgs, { sender: 'bot', text: `Sorry, no products found at ${selectedShop.translation?.title}. Please try a different shop.` }]);
        }
        return;
      }
    }
    
    // Helper function to detect affirmative responses
    function isAffirmativeResponse(input: string): boolean {
      const affirmativePatterns = [
        /^yes\b/i,
        /^yeah\b/i,
        /^yep\b/i,
        /^sure\b/i,
        /^ok(ay)?\b/i,
        /^alright\b/i,
        /^absolutely\b/i,
        /^definitely\b/i,
        /^of course\b/i,
        /^i would like to order/i,
        /^i want to order/i,
        /^let me order/i,
        /^show me what/i,
        /^what can i buy/i,
        /^what do you have/i,
        /^what's available/i,
        /^what is available/i
      ];
      
      return affirmativePatterns.some(pattern => pattern.test(input.trim()));
    }

    // Helper function to detect product search requests
    function isProductSearchRequest(input: string): boolean {
      const productSearchPatterns = [
        /show me products/i,
        /show me the products/i,
        /what products/i,
        /what can i buy/i,
        /what do you have/i,
        /what's available/i,
        /what is available/i,
        /show me the menu/i,
        /show me food/i,
        /show me items/i,
        /what's on the menu/i,
        /what is on the menu/i,
        /show me dishes/i,
        /show me meals/i
      ];
      
      return productSearchPatterns.some(pattern => pattern.test(input.trim()));
    }
    
    // Handle order again
    if (convoStep === CONVO_STEPS.ORDER_AGAIN) {
      if (simpleIntent === 'affirmative') {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'What would you like to order?' }]);
        setConvoStep(CONVO_STEPS.PREVIEW);
        setSelectedProducts([]);
        setLoading(false);
        return;
      } else if (simpleIntent === 'negative') {
        SpeechRecognition.stopListening();
        onClose();
        setLoading(false);
        return;
      }
    }
    
    // Product search when shop is selected
    if (selectedShop && convoStep === CONVO_STEPS.PREVIEW) {
      const productQuery = extractProductQuery(text);
      if (productQuery) {
        console.log('=== PRODUCT SEARCH TRIGGERED ===');
        setProductLoading(true);
        const searchParams = {
          search: productQuery.value,
          page: 1,
          shop_id: selectedShop.id,
          address: getLocationParam(userLocation),
        };
        console.log('Product search with params:', searchParams);
        const res = await productService.search(searchParams);
        console.log('Product search result:', res);
        setProductResults(res.data || []);
        setHasMoreProducts(res.meta && res.meta.last_page > 1);
        setShowMorePage(2);
        setConvoStep(CONVO_STEPS.SELECTION);
        const productMessage = productQuery.value 
          ? `Here are ${productQuery.value} products from ${selectedShop.translation?.title}:`
          : `Here are products available at ${selectedShop.translation?.title}. What would you like to order?`;
        setMessages((msgs) => [...msgs, { sender: 'bot', text: productMessage }]);
        setLoading(false);
        if (!res.data || res.data.length === 0) {
          setMessages((msgs) => [...msgs, { sender: 'bot', text: `Sorry, no products found${productQuery.value ? ` for "${productQuery.value}"` : ''} at ${selectedShop.translation?.title}. Please try a different search.` }]);
        }
        return;
      }
    }
    
    // Delivery/pickup selection
    if (convoStep === CONVO_STEPS.DELIVERY_PICKUP) {
      if (text.toLowerCase().includes('delivery')) {
        setDeliveryType('delivery');
        setConvoStep(CONVO_STEPS.LOCATION_CONFIRM);
        setMessages((msgs) => [...msgs, { sender: 'bot', text: `Your delivery address is: ${userLocation?.address || 'unknown'}. Is this correct?` }]);
        setLoading(false);
        return;
      } else if (text.toLowerCase().includes('pickup')) {
        setDeliveryType('pickup');
        setConvoStep(CONVO_STEPS.LOCATION_CONFIRM);
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'You selected pickup. Is this correct?' }]);
        setLoading(false);
        return;
      }
    }
    
    // Location confirm
    if (convoStep === CONVO_STEPS.LOCATION_CONFIRM) {
      if (simpleIntent === 'affirmative') {
        setConvoStep(CONVO_STEPS.PAYMENT);
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Select your payment method: Cash or Selcom Pay (mobile money, card).' }]);
        setLoading(false);
        return;
      } else if (simpleIntent === 'negative') {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Please update your address in your profile and try again.' }]);
        setLoading(false);
        return;
      }
    }
    
    // Payment step
    if (convoStep === CONVO_STEPS.PAYMENT) {
      if (text.toLowerCase().includes('cash')) {
        await handlePlaceOrder('cash');
        setLoading(false);
        return;
      } else if (text.toLowerCase().includes('selcom')) {
        await handlePlaceOrder('selcom');
        setLoading(false);
        return;
      }
    }
    
    // Shop search by category
    if (advIntent && advIntent.type === 'diet' && advIntent.value) {
      // Filter products by diet
      setProductLoading(true);
      const res = await productService.search({ search: advIntent.value, page: 1 });
      setProductResults(res.data || []);
      setHasMoreProducts(res.meta && res.meta.last_page > 1);
      setShowMorePage(2);
      setConvoStep(CONVO_STEPS.SELECTION);
      setMessages((msgs) => [...msgs, { sender: 'bot', text: `Here are some ${advIntent.value.replace('_', ' ')} options:` }]);
      setLoading(false);
      return;
    }
    if (advIntent && advIntent.type === 'allergy') {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Please specify your allergy (e.g., peanuts, gluten, etc.)' }]);
      setLoading(false);
      return;
    }
    if (advIntent && advIntent.type === 'recipe') {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Recipe search is coming soon!' }]);
      setLoading(false);
      return;
    }
    
    // Shop search by category
    const catMatch = Object.keys(CATEGORY_MAP).find(cat => text.toLowerCase().includes(cat));
    if (catMatch) {
      setShopLoading(true);
      // Try both category and search by category name
      let searchParams = {
        category_id: CATEGORY_MAP[catMatch],
        page: 1,
        perPage: 10,
        address: getLocationParam(userLocation),
        open: 1,
        include: 'location,distance',
      };
      console.log('Searching shops by category with params:', searchParams);
      let res = await shopService.getAllShops(qs.stringify(searchParams));
      debugShopSearch(searchParams, res);
      if (!res.data || res.data.length === 0) {
        // Fallback: search by category name
        const fallbackParams = {
          search: catMatch,
          page: 1,
          address: getLocationParam(userLocation),
          open: 1,
        };
        console.log('Fallback: searching shops by category name with params:', fallbackParams);
        res = await shopService.search(fallbackParams);
        debugShopSearch(fallbackParams, res);
      }
      setShopResults(res.data || []);
      setHasMoreShops(res.meta && res.meta.last_page > 1);
      setShowMoreShopPage(2);
      setConvoStep(CONVO_STEPS.SELECTION);
      setMessages((msgs) => [...msgs, { sender: 'bot', text: `Here are the ${catMatch}s near you. Please select one to browse their products:` }]);
      setLoading(false);
      if (!res.data || res.data.length === 0) {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: `Sorry, no open ${catMatch}s found in your area. Please try a different category or check your location settings.` }]);
      }
      return;
    }
    
    // Step intent handling
    if (convoStep === CONVO_STEPS.CONFIRM_ADD) {
      if (simpleIntent === "affirmative") {
        handleAddToCart(); setLoading(false); return;
      } else if (simpleIntent === "negative") {
        setConvoStep(CONVO_STEPS.SELECTION); setLoading(false); return;
      }
    }
    if (convoStep === CONVO_STEPS.CONFIRM_CHECKOUT) {
      if (!selectedShop) {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Please select a shop before checking out.' }]);
        setConvoStep(CONVO_STEPS.SELECTION);
        setLoading(false);
        return;
      }
      if (!userLocation?.address || userLocation.address.length < 5) {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Please provide a valid delivery address before checking out.' }]);
        setConvoStep(CONVO_STEPS.LOCATION_CONFIRM);
        setLoading(false);
        return;
      }
      if (simpleIntent === 'affirmative' || simpleIntent === 'checkout') {
        setConvoStep(CONVO_STEPS.DELIVERY_PICKUP);
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Would you like delivery or pickup?' }]);
        setLoading(false);
        return;
      } else if (simpleIntent === 'negative') {
        setConvoStep(CONVO_STEPS.SELECTION);
        setLoading(false);
        return;
      }
    }
    if (convoStep === CONVO_STEPS.DONE) {
      setLoading(false); return;
    }

    // Shop selection (if shopResults are shown)
    if (shopResults.length > 0 && convoStep === CONVO_STEPS.SELECTION) {
      const shop = shopResults.find(s => text.toLowerCase().includes((s.translation?.title || '').toLowerCase()));
      if (shop) {
        // Check if shop is open
        if (!shop.open) {
          setMessages((msgs) => [...msgs, { sender: 'bot', text: `Sorry, ${shop.translation?.title} is currently closed. Please select another shop.` }]);
          setLoading(false);
          return;
        }
        setSelectedShop(shop);
        setMessages((msgs) => [...msgs, { 
          sender: 'bot', 
          text: `Great! You selected ${shop.translation?.title}. What would you like to order? You can say "show me products", "what can I buy", or ask for specific items.` 
        }]);
        setShopResults([]);
        setProductResults([]);
        setConvoStep(CONVO_STEPS.PREVIEW);
        setLoading(false);
        return;
      }
    }

    // Login intent
    if (simpleIntent === "login") {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Redirecting to login...' }]);
      setTimeout(() => router.push('/login'), 1000);
      setLoading(false);
      return;
    }

    // Add at the top
    const shopQuery = extractShopQuery(text);
    const locationParam = getLocationParam(userLocation);
    
    console.log('Shop query extracted:', shopQuery);
    console.log('Location param for shop search:', locationParam);
    
    if (shopQuery && shopQuery.type === 'name') {
      console.log('=== SHOP SEARCH BY NAME TRIGGERED ===');
      setShopLoading(true);
      const searchParams = {
        search: shopQuery.value,
        page: 1,
        address: locationParam,
        open: 1,
      };
      console.log('Searching shops by name with params:', searchParams);
      const res = await shopService.search(searchParams);
      debugShopSearch(searchParams, res);
      setShopResults(res.data || []);
      setHasMoreShops(res.meta && res.meta.last_page > 1);
      setShowMoreShopPage(2);
      setConvoStep(CONVO_STEPS.SELECTION);
      setMessages((msgs) => [...msgs, { sender: 'bot', text: `Here are some shops for you to choose from. Please select one to browse their products:` }]);
      setLoading(false);
      if (!res.data || res.data.length === 0) {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, no open shops found for your search. Please try a different search term.' }]);
      }
      return;
    }
    if (shopQuery && shopQuery.type === 'list') {
      console.log('=== SHOP SEARCH BY LIST TRIGGERED ===');
      setShopLoading(true);
      const searchParams = {
        page: 1,
        address: locationParam,
        open: 1,
        perPage: shopQuery.value,
      };
      console.log('Listing shops with params:', searchParams);
      const res = await shopService.search(searchParams);
      debugShopSearch(searchParams, res);
      setShopResults(res.data || []);
      setHasMoreShops(res.meta && res.meta.last_page > 1);
      setShowMoreShopPage(2);
      setConvoStep(CONVO_STEPS.SELECTION);
      setMessages((msgs) => [...msgs, { sender: 'bot', text: `Here are some shops for you to choose from. Please select one to browse their products:` }]);
      setLoading(false);
      if (!res.data || res.data.length === 0) {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, no open shops found in your area. Please try again later or check your location settings.' }]);
      }
      return;
    }

    // Default: call AI intent API
    try {
      console.log('=== CALLING AI INTENT API ===');
      const aiResponse = await fetch('/api/voice-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const openaiHeader = aiResponse.headers.get('x-using-openai');
      setUsingOpenAI(openaiHeader === 'true');
      if (!aiResponse.ok) throw new Error(`API error: ${aiResponse.status}`);
      const aiData = await aiResponse.json();
      console.log('AI response:', aiData);
      console.log('AI intent:', aiData.intent);
      console.log('AI query:', aiData.query);
      console.log('AI reply:', aiData.reply);
      
      // Shop search intent
      if ((aiData.intent === 'shop_search' || aiData.intent === 'find_shops') && aiData.query) {
        console.log('=== AI SHOP SEARCH TRIGGERED ===');
        setShopLoading(true);
        setOrderStep('search');
        setConvoStep(CONVO_STEPS.SELECTION);
        const searchParams = { 
          search: aiData.query, 
          page: 1,
          address: locationParam,
          open: 1,
        };
        console.log('AI shop search with params:', searchParams);
        const shopPromise = shopService.search(searchParams)
          .then(res => {
            debugShopSearch(searchParams, res);
            setShopResults(res.data || []);
            setHasMoreShops(res.meta && res.meta.last_page > 1);
            setShowMoreShopPage(2);
            return res.data || [];
          })
          .catch(err => {
            console.error('Shop search error:', err);
            setShopResults([]);
            setHasMoreShops(false);
            return [];
          })
          .finally(() => setShopLoading(false));
        await shopPromise;
        setMessages((msgs) => [...msgs, { sender: 'bot', text: aiData.reply }]);
        if (shopResults.length === 0) {
          setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, no shops found for your search. Please try a different search term.' }]);
        }
        setLoading(false);
        return;
      }
      // Product search intent
      if ((aiData.intent === 'search' || aiData.intent === 'order') && aiData.query) {
        setProductLoading(true);
        setOrderStep('search');
        setConvoStep(CONVO_STEPS.SELECTION);
        // Category mapping
        const categoryId = getCategoryIdFromQuery(aiData.query);
        const searchParams: any = { search: aiData.query, page: 1 };
        if (categoryId !== undefined) {
          searchParams.category_id = categoryId;
        }
        const productPromise = productService.search(searchParams)
          .then(res => {
            setProductResults(res.data || []);
            setHasMoreProducts(res.meta && res.meta.last_page > 1);
            setShowMorePage(2);
            return res.data || [];
          })
          .catch(err => {
            setProductResults([]);
            setHasMoreProducts(false);
            return [];
          })
          .finally(() => setProductLoading(false));
        await productPromise;
        setMessages((msgs) => [...msgs, { sender: 'bot', text: aiData.reply }]);
        setLoading(false);
        return;
      }
      // Checkout/payment intents
      if (aiData.intent === 'checkout') { handleCheckout(); setLoading(false); return; }
      if (aiData.intent === 'payment_cash') { handlePaymentSelection('cash'); setLoading(false); return; }
      if (aiData.intent === 'payment_selcom') { handlePaymentSelection('selcom'); setLoading(false); return; }
      setMessages((msgs) => [...msgs, { sender: 'bot', text: aiData.reply || 'What would you like to do next?' }]);
    } catch (error) {
      console.error('Voice chat error:', error);
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
    console.log('=== END VOICE CHAT HANDLE SEND ===');
  }, [router, convoStep, shopResults, userLocation, selectedShop]);

  // Handle product selection
  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setConvoStep(CONVO_STEPS.CONFIRM_ADD);
    setMessages((msgs) => [...msgs, { sender: 'bot', text: `Do you want me to add "${product.translation?.title}" to your cart?` }]);
  };

  // Handle checkout process
  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      setMessages((msgs) => [...msgs, { 
        sender: 'bot', 
        text: 'You need to select products first. What would you like to order?' 
      }]);
      return;
    }
    
    setMessages((msgs) => [...msgs, { 
      sender: 'bot', 
      text: 'Great! Please choose your payment method: Cash or Selcom Pay (mobile money, cards)' 
    }]);
    setOrderStep('payment');
  };

  // Handle payment selection
  const handlePaymentSelection = (method: string) => {
    setConvoStep(CONVO_STEPS.DONE);
    setMessages((msgs) => [...msgs, { sender: 'bot', text: `Thank you for shopping with ${process.env.NEXT_PUBLIC_APP_NAME || 'our app'}! Your order is being processed.` }]);
    // TODO: Payment logic
  };

  // Handle suggestion click
  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    handleSend(suggestion);
  };

  // Handle input submit
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
    setInput('');
    resetTranscript();
  };

  // Add to cart confirmation
  const handleAddToCart = () => {
    if (!user) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'You need to log in to add items to your cart. Would you like to log in now?' }]);
      setConvoStep(CONVO_STEPS.PREVIEW);
      return;
    }
    // Simulate add to cart
    const product = selectedProduct;
    setSelectedProducts((prev) => [...prev, product]);
    setConvoStep(CONVO_STEPS.CONFIRM_CHECKOUT);
    // Calculate total
    const total = [...selectedProducts, product].reduce((sum, p) => sum + (p.stocks?.length ? p.stocks[0]?.price : 0), 0);
    setMessages((msgs) => [...msgs, { sender: 'bot', text: `Added "${product.translation?.title}" to your cart.\nYou have ${selectedProducts.length + 1} item(s) in your cart totaling TSh ${total.toLocaleString()}. Do you want to checkout now?` }]);
  };

  // Checkout confirmation
  const handleCheckoutConfirm = () => {
    setConvoStep(CONVO_STEPS.PAYMENT);
    setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Select your payment method: Cash or Selcom Pay (mobile money, card).' }]);
  };

  // Show more pagination
  const handleShowMore = async () => {
    setProductLoading(true);
    const res = await productService.search({ search: input, page: showMorePage });
    setProductResults(prev => [...prev, ...(res.data || [])]);
    setHasMoreProducts(res.meta && res.meta.last_page > showMorePage);
    setShowMorePage(showMorePage + 1);
    setProductLoading(false);
  };

  // Show more shops pagination
  const handleShowMoreShops = async () => {
    setShopLoading(true);
    const searchParams = {
      search: input,
      page: showMoreShopPage,
      address: getLocationParam(userLocation),
      open: 1,
    };
    console.log('Loading more shops with params:', searchParams);
    const res = await shopService.search(searchParams);
    debugShopSearch(searchParams, res);
    setShopResults(prev => [...prev, ...(res.data || [])]);
    setHasMoreShops(res.meta && res.meta.last_page > showMoreShopPage);
    setShowMoreShopPage(showMoreShopPage + 1);
    setShopLoading(false);
  };

  // Auto-scroll to latest message
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, productResults, convoStep]);

  // Place order handler
  const handlePlaceOrder = async (paymentType: 'cash' | 'selcom') => {
    if (!selectedShop || !userLocation?.address || userLocation.address.length < 5) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Order cannot be placed. Please select a shop and provide a valid address.' }]);
      setConvoStep(CONVO_STEPS.DONE);
      return;
    }
    // Compose order data
    const orderData = {
      shop_id: selectedShop.id,
      delivery_type: deliveryType,
      location: userLocation,
      address: userLocation.address,
      products: selectedProducts.map(p => ({
        stock_id: p.stocks?.[0]?.id,
        quantity: 1,
      })),
      payment_type: paymentType,
      // ...add more fields as needed
    };
    try {
      const orderRes = await orderService.create(orderData);
      if (paymentType === 'cash') {
        await cartService.delete({});
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Order placed! Would you like to order again?' }]);
        setConvoStep(CONVO_STEPS.ORDER_AGAIN);
      } else if (paymentType === 'selcom') {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: "You'll be redirected to Selcom Pay to complete your payment." }]);
        const payRes = await paymentService.payExternal('selcom', { order_id: orderRes.data.id });
        if (payRes?.data?.redirect_url) {
          setTimeout(() => {
            window.location.href = payRes.data.redirect_url;
          }, 2000);
        }
        setConvoStep(CONVO_STEPS.DONE);
      }
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Failed to place order. Please try again.' }]);
      setConvoStep(CONVO_STEPS.DONE);
    }
  };

  // Stop mic on modal close
  useEffect(() => {
    if (!open) {
      SpeechRecognition.stopListening();
      setMessages([]);
      setProductResults([]);
      setShopResults([]);
      setSelectedProducts([]);
      setSelectedProduct(null);
      setConvoStep(CONVO_STEPS.PREVIEW);
      setOrderStep('search');
      setDeliveryType(null);
      setInput('');
      setMicError('');
      setLoading(false);
      setProductLoading(false);
      setShopLoading(false);
      setShowMorePage(1);
      setHasMoreProducts(false);
      setShowMoreShopPage(1);
      setHasMoreShops(false);
    }
  }, [open]);

  // Add welcome message on modal open
  useEffect(() => {
    if (open) {
      setMessages([{ 
        sender: 'bot', 
        text: `Hi! I'm your voice order assistant. I can help you find shops, browse products, and place orders. What would you like to do? You can say things like "show me pharmacies", "find restaurants", or "any shops near me".` 
      }]);
    } else {
      setMessages([]);
      setProductResults([]);
      setShopResults([]);
      setSelectedProducts([]);
      setSelectedProduct(null);
      setConvoStep(CONVO_STEPS.PREVIEW);
      setOrderStep('search');
      setDeliveryType(null);
      setInput('');
      setMicError('');
      setLoading(false);
      setProductLoading(false);
      setShopLoading(false);
      setShowMorePage(1);
      setHasMoreProducts(false);
      setShowMoreShopPage(1);
      setHasMoreShops(false);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} closable={false}>
      <div className={cls.voiceOrderChat}>
        <div className={cls.header}>
          <h2>Voice Order Assistant</h2>
          <button onClick={onClose}>×</button>
        </div>
        
        {!browserSupportsSpeechRecognition ? (
          <div className={cls.botMsg} style={{ color: 'red', textAlign: 'center' }}>
            Sorry, your browser does not support speech recognition.<br />
            Please use Chrome or Edge on desktop for best results.
          </div>
        ) : (
          <>
            <div className={cls.messages}>
              {messages.map((msg, idx) => (
                <div key={idx} className={msg.sender === 'user' ? cls.userMsg : cls.botMsg}>
                  {msg.text}
                </div>
              ))}
              {/* Render products as inline chat bubbles inside messages */}
              {convoStep === CONVO_STEPS.SELECTION && productResults.length > 0 && (
                <div className={cls.productResults}>
                  <h4>Found Products:</h4>
                  {productResults.map((product) => (
                    <div key={product.id} className={cls.productItem} onClick={() => handleProductSelect(product)}>
                      <img src={product.img} alt={product.translation?.title} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                      <div>
                        <h5>{product.translation?.title}</h5>
                        <p>{product.translation?.description}</p>
                        <span><Price number={product.stocks?.length ? product.stocks[0]?.price : 0} /></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {convoStep === CONVO_STEPS.SELECTION && shopResults.length > 0 && (
                <div className={cls.productResults}>
                  <h4>Found Shops:</h4>
                  {shopResults.map((shop) => (
                    <div key={shop.id} className={cls.productItem} onClick={() => {
                      if (!shop.open) {
                        setMessages((msgs) => [...msgs, { sender: 'bot', text: `Sorry, ${shop.translation?.title} is currently closed. Please select another shop.` }]);
                        return;
                      }
                      setSelectedShop(shop);
                      setMessages((msgs) => [...msgs, { sender: 'bot', text: `You selected ${shop.translation?.title}. What would you like to order from this shop?` }]);
                      setShopResults([]);
                      setProductResults([]);
                      setConvoStep(CONVO_STEPS.PREVIEW);
                    }}>
                      <img src={shop.logo_img} alt={shop.translation?.title} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                      <div>
                        <h5>{shop.translation?.title} {!shop.open && <span style={{color:'red',fontWeight:600}}>(Closed)</span>}</h5>
                        <p>{shop.translation?.description}</p>
                      </div>
                    </div>
                  ))}
                  {shopLoading && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#666' }}>
                      Loading more shops...
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Error message */}
            {micError && (
              <div className={cls.botMsg} style={{ color: 'red', textAlign: 'center' }}>
                {micError}
              </div>
            )}
            {usingOpenAI === false && (
              <div className={cls.botMsg} style={{ color: 'orange', textAlign: 'center' }}>
                <b>Warning:</b> OpenAI is not being used. Please check your API key and restart the server.
              </div>
            )}
            
            {/* Selected products */}
            {selectedProducts.length > 0 && (
              <div className={cls.selectedProducts}>
                <h4>Selected Products:</h4>
                {selectedProducts.map((product, idx) => (
                  <div key={idx} className={cls.productItem}>
                    <img src={product.img} alt={product.title} style={{ width: 40, height: 40, objectFit: 'cover' }} />
                    <span>{product.title}</span>
                  </div>
                ))}
              </div>
            )}
            
            {convoStep === CONVO_STEPS.SELECTION && (
              <div className={cls.suggestions}>
                <span className={cls.botMsg}>Please proceed with your selection:</span>
              </div>
            )}
            {convoStep === CONVO_STEPS.CONFIRM_ADD && selectedProduct && (
              <div className={cls.suggestions}>
                <button className={cls.selectedBubble} onClick={handleAddToCart}>Yes, add to cart</button>
                <button className={cls.selectedBubble} onClick={() => setConvoStep(CONVO_STEPS.SELECTION)}>No, go back</button>
              </div>
            )}
            {convoStep === CONVO_STEPS.CONFIRM_CHECKOUT && (
              <div className={cls.suggestions}>
                <button className={cls.selectedBubble} onClick={handleCheckoutConfirm}>Yes, checkout</button>
                <button className={cls.selectedBubble} onClick={() => setConvoStep(CONVO_STEPS.SELECTION)}>No, continue shopping</button>
              </div>
            )}
            {convoStep === CONVO_STEPS.PAYMENT && (
              <div className={cls.suggestions}>
                <button className={cls.selectedBubble} onClick={() => handlePaymentSelection('cash')}>Cash</button>
                <button className={cls.selectedBubble} onClick={() => handlePaymentSelection('selcom')}>Selcom Pay</button>
              </div>
            )}
            {convoStep === CONVO_STEPS.DELIVERY_PICKUP && (
              <div className={cls.suggestions}>
                <button className={cls.selectedBubble} onClick={() => handleSend('delivery')}>Delivery</button>
                <button className={cls.selectedBubble} onClick={() => handleSend('pickup')}>Pickup</button>
              </div>
            )}
            {convoStep === CONVO_STEPS.LOCATION_CONFIRM && (
              <div className={cls.suggestions}>
                <span className={cls.botMsg}>{deliveryType === 'delivery' ? `Your delivery address is: ${userLocation?.address || 'unknown'}. Is this correct?` : 'You selected pickup. Is this correct?'}</span>
                <button className={cls.selectedBubble} onClick={() => handleSend('yes')}>Yes</button>
                <button className={cls.selectedBubble} onClick={() => handleSend('no')}>No</button>
              </div>
            )}
            {convoStep === CONVO_STEPS.ORDER_AGAIN && (
              <div className={cls.suggestions}>
                <button className={cls.selectedBubble} onClick={() => handleSend('yes')}>Yes, order again</button>
                <button className={cls.selectedBubble} onClick={() => handleSend('no')}>No, close</button>
              </div>
            )}
            {hasMoreProducts && (
              <button className={cls.showMoreBubble} onClick={handleShowMore}>Show more products...</button>
            )}
            {hasMoreShops && (
              <button className={cls.showMoreBubble} onClick={handleShowMoreShops}>Show more shops...</button>
            )}
            
            {convoStep === CONVO_STEPS.PREVIEW && selectedShop && (
              <div className={cls.suggestions}>
                <span className={cls.botMsg}>What would you like to do at {selectedShop.translation?.title}?</span>
                <button className={cls.selectedBubble} onClick={() => handleSend('show me products')}>Show me products</button>
                <button className={cls.selectedBubble} onClick={() => handleSend('what can I buy')}>What can I buy?</button>
                <button className={cls.selectedBubble} onClick={() => handleSend('I want to order')}>I want to order</button>
              </div>
            )}

            {convoStep === CONVO_STEPS.SELECTION && productResults.length === 0 && !productLoading && (
              <div className={cls.suggestionsSmall}>
                <span className={cls.botMsg}>No products found. Try:</span>
                <button className={cls.selectedBubble} onClick={() => handleSend('show me all products')}>Show all products</button>
                <button className={cls.selectedBubble} onClick={() => handleSend('what do you have')}>What do you have?</button>
                <button className={cls.selectedBubble} onClick={() => setConvoStep(CONVO_STEPS.PREVIEW)}>Go back to shop selection</button>
              </div>
            )}

            {convoStep === CONVO_STEPS.SELECTION && shopResults.length === 0 && !shopLoading && (
              <div className={cls.suggestionsSmall}>
                <span className={cls.botMsg}>No shops found. Try:</span>
                <button className={cls.selectedBubble} onClick={() => handleSend('any shops')}>Show any shops</button>
                <button className={cls.selectedBubble} onClick={() => handleSend('show me restaurants')}>Show restaurants</button>
                <button className={cls.selectedBubble} onClick={() => handleSend('find pharmacies')}>Find pharmacies</button>
              </div>
            )}
            
            <form className={cls.inputBar} onSubmit={handleInputSubmit}>
              <button
                type="button"
                onClick={handleMicClick}
                disabled={!browserSupportsSpeechRecognition || !isMicrophoneAvailable || loading}
                style={{ 
                  background: listening ? '#e0ffe0' : undefined,
                  border: listening ? '2px solid green' : undefined,
                  animation: listening ? 'pulse 1s infinite' : undefined,
                  position: 'relative'
                }}
                aria-label={listening ? 'Listening... Click to stop' : 'Start voice input'}
              >
                <MicFillIcon color={listening ? 'green' : 'black'} />
                {listening && (
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}>
                    Listening...
                  </div>
                )}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message or use voice..."
                disabled={loading}
              />
              <button type="submit" disabled={!input.trim() || loading}>
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};

export default VoiceOrderChat; 