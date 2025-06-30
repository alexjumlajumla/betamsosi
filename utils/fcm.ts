import { getMessaging, getToken } from "firebase/messaging";
import app from "services/firebase";
import { VAPID_KEY } from "constants/config";

/**
 * Get the current FCM token for the user
 * @returns Promise<string | null> - The FCM token or null if not available
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log('[FCM] Not in browser environment, skipping token generation');
      return null;
    }

    // Check if Firebase is available
    if (!app) {
      console.error('[FCM] Firebase app not initialized');
      return null;
    }

    // Check notification permission
    if (Notification.permission !== 'granted') {
      console.log('[FCM] Notification permission not granted:', Notification.permission);
      return null;
    }

    const messaging = getMessaging(app);
    
    // Get the current token
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (currentToken) {
      console.log('[FCM] Token retrieved successfully, length:', currentToken.length);
      return currentToken;
    } else {
      console.log('[FCM] No registration token available');
      return null;
    }
  } catch (error) {
    console.error('[FCM] Error getting FCM token:', error);
    return null;
  }
};

/**
 * Request notification permission and get FCM token
 * @returns Promise<string | null> - The FCM token or null if permission denied
 */
export const requestNotificationPermissionAndGetToken = async (): Promise<string | null> => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('[FCM] Notification permission denied:', permission);
        return null;
      }
    }

    return await getFcmToken();
  } catch (error) {
    console.error('[FCM] Error requesting permission and getting token:', error);
    return null;
  }
}; 