import type { NextApiRequest, NextApiResponse } from 'next';

// Simple intent parser for when OpenAI is not available
function parseIntentSimple(text: string) {
  const lowerText = text.toLowerCase();
  
  // Payment method selection
  if (lowerText.includes('cash') || lowerText.includes('pay cash') || lowerText.includes('cash payment')) {
    return {
      intent: 'payment_cash',
      query: '',
      reply: 'Cash payment selected. Processing your order...'
    };
  }
  
  if (lowerText.includes('selcom') || lowerText.includes('mobile money') || lowerText.includes('card') || 
      lowerText.includes('credit card') || lowerText.includes('debit card')) {
    return {
      intent: 'payment_selcom',
      query: '',
      reply: 'Selcom Pay selected. Redirecting to payment gateway...'
    };
  }
  
  // Checkout intents
  if (lowerText.includes('checkout') || lowerText.includes('pay') || lowerText.includes('payment') ||
      lowerText.includes('complete order') || lowerText.includes('finish order')) {
    return {
      intent: 'checkout',
      query: '',
      reply: 'Great! Please choose your payment method: Cash or Selcom Pay (mobile money, cards)'
    };
  }
  
  // Order confirmation
  if (lowerText.includes('yes') || lowerText.includes('proceed') || lowerText.includes('continue') ||
      lowerText.includes('add to cart') || lowerText.includes('add it') || lowerText.includes('add this')) {
    return {
      intent: 'confirm_order',
      query: '',
      reply: 'Added to cart! Would you like to checkout now?'
    };
  }
  
  // Search intents
  if (lowerText.includes('pizza') || lowerText.includes('burger') || lowerText.includes('food') || 
      lowerText.includes('restaurant') || lowerText.includes('shop') || lowerText.includes('find') ||
      lowerText.includes('search') || lowerText.includes('look for') || lowerText.includes('order')) {
    return {
      intent: 'search',
      query: text,
      reply: `I'll search for "${text}" for you!`
    };
  }
  
  // Default to search
  return {
    intent: 'search',
    query: text,
    reply: `I'll search for "${text}" for you!`
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  console.log('Voice intent API called with:', text);

  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.log('No OpenAI API key found, using simple intent parser');
    const response = parseIntentSimple(text);
    console.log('Simple parser response:', response);
    res.setHeader('x-using-openai', 'false');
    return res.status(200).json(response);
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: `You are a helpful assistant for a food and shop ordering app. 
            Parse user intent and respond with JSON in this exact format:
            {
              "intent": "search|order|checkout|payment_cash|payment_selcom|confirm_order|help",
              "query": "product or shop name only (not the full phrase)",
              "reply": "friendly response message"
            }
            
            For the "query" field, always extract only the product or shop name, not the full user phrase. If the user says "Order Coca Cola", the query should be "Coca Cola". If the user says "Find pizza near me", the query should be "pizza". If the user says "Show me shops with offers", the query should be "shops with offers".
            
            Intent types:
            - "search": when user wants to find products/shops (e.g., "pizza", "find restaurants")
            - "order": when user wants to add items to cart (e.g., "add 2 burgers")
            - "checkout": when user wants to proceed to payment
            - "payment_cash": when user chooses cash payment
            - "payment_selcom": when user chooses Selcom Pay (mobile money, cards)
            - "confirm_order": when user confirms adding items to cart
            - "help": when user needs assistance
            
            Examples:
            - "Order Coca Cola" → {"intent": "order", "query": "Coca Cola", "reply": "Adding Coca Cola to your cart."}
            - "Find pizza near me" → {"intent": "search", "query": "pizza", "reply": "Here are some pizza options."}
            - "Show me shops with offers" → {"intent": "search", "query": "shops with offers", "reply": "Here are some shops with offers."}
            - "checkout" → {"intent": "checkout", "query": "", "reply": "Great! Please choose your payment method: Cash or Selcom Pay (mobile money, cards)"}
            - "cash" → {"intent": "payment_cash", "query": "", "reply": "Cash payment selected. Processing your order..."}
            - "selcom pay" → {"intent": "payment_selcom", "query": "", "reply": "Selcom Pay selected. Redirecting to payment gateway..."}
            - "yes" → {"intent": "confirm_order", "query": "", "reply": "Added to cart! Would you like to checkout now?"}
            
            Always respond with valid JSON only.`
          },
          { role: 'user', content: text },
        ],
        max_tokens: 150,
        temperature: 0.1,
      }),
    });
    
    const data = await openaiRes.json();
    const aiResponse = data.choices?.[0]?.message?.content || '{"intent": "help", "query": "", "reply": "Sorry, I did not understand."}';
    
    // Parse the AI response as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      parsedResponse = {
        intent: 'help',
        query: '',
        reply: 'Sorry, I did not understand. Please try again.'
      };
    }
    
    // Ensure we have the required fields
    const response = {
      intent: parsedResponse.intent || 'help',
      query: parsedResponse.query || '',
      reply: parsedResponse.reply || 'What would you like to do?'
    };
    
    console.log('OpenAI API response:', { input: text, output: response });
    res.setHeader('x-using-openai', 'true');
    res.status(200).json(response);
  } catch (err) {
    console.error('OpenAI API error:', err);
    // Fallback to simple parser if OpenAI fails
    const response = parseIntentSimple(text);
    console.log('Fallback response:', response);
    res.status(200).json(response);
  }
} 