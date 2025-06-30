import React, { useState, useEffect } from 'react';
import { getMessaging, getToken } from "firebase/messaging";
import app from "services/firebase";
import { VAPID_KEY } from "constants/config";
import profileService from "services/profile";

interface FCMDebugInfo {
  notificationPermission: string;
  fcmToken: string | null;
  tokenLength: number;
  tokenValid: boolean;
  registrationAttempted: boolean;
  registrationSuccess: boolean;
  registrationError: string | null;
  backendResponse: any;
}

const FCMDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<FCMDebugInfo>({
    notificationPermission: 'unknown',
    fcmToken: null,
    tokenLength: 0,
    tokenValid: false,
    registrationAttempted: false,
    registrationSuccess: false,
    registrationError: null,
    backendResponse: null
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check notification permission
    setDebugInfo(prev => ({
      ...prev,
      notificationPermission: Notification.permission
    }));
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setDebugInfo(prev => ({
        ...prev,
        notificationPermission: permission
      }));
      console.log('[FCM Debugger] Permission result:', permission);
    } catch (error) {
      console.error('[FCM Debugger] Permission request failed:', error);
    }
  };

  const generateFCMToken = async () => {
    try {
      console.log('[FCM Debugger] Generating FCM token...');
      const messaging = getMessaging(app);
      
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (token) {
        const isValid = token.length >= 100 && token.length <= 500 && /^[a-zA-Z0-9_\-:]+$/.test(token);
        
        setDebugInfo(prev => ({
          ...prev,
          fcmToken: token,
          tokenLength: token.length,
          tokenValid: isValid
        }));
        
        console.log('[FCM Debugger] Token generated:', {
          length: token.length,
          prefix: token.substring(0, 20) + '...',
          suffix: '...' + token.substring(token.length - 10),
          valid: isValid
        });
      } else {
        console.error('[FCM Debugger] No token generated');
        setDebugInfo(prev => ({
          ...prev,
          fcmToken: null,
          tokenLength: 0,
          tokenValid: false
        }));
      }
    } catch (error) {
      console.error('[FCM Debugger] Token generation failed:', error);
      setDebugInfo(prev => ({
        ...prev,
        fcmToken: null,
        tokenLength: 0,
        tokenValid: false
      }));
    }
  };

  const registerToken = async () => {
    if (!debugInfo.fcmToken) {
      console.error('[FCM Debugger] No token to register');
      return;
    }

    try {
      console.log('[FCM Debugger] Registering token with backend...');
      setDebugInfo(prev => ({
        ...prev,
        registrationAttempted: true,
        registrationSuccess: false,
        registrationError: null
      }));

      // Use the test endpoint instead of the main profile service
      const token = localStorage.getItem('token') || '';
      const response = await fetch('/api/v1/test/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token: debugInfo.fcmToken })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('[FCM Debugger] Non-JSON response received:', {
          status: response.status,
          contentType,
          response: textResponse.substring(0, 200) + '...'
        });
        throw new Error(`Expected JSON but got ${contentType}. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[FCM Debugger] Registration successful:', data);
      setDebugInfo(prev => ({
        ...prev,
        registrationSuccess: true,
        registrationError: null,
        backendResponse: data
      }));
    } catch (error: any) {
      console.error('[FCM Debugger] Registration failed:', error);
      setDebugInfo(prev => ({
        ...prev,
        registrationSuccess: false,
        registrationError: error?.message || 'Unknown error',
        backendResponse: { error: error.message }
      }));
    }
  };

  const testAlternativeEndpoint = async () => {
    if (!debugInfo.fcmToken) {
      console.error('[FCM Debugger] No token to test');
      return;
    }

    try {
      console.log('[FCM Debugger] Testing test endpoint...');
      const token = localStorage.getItem('token') || '';
      
      // Use the test endpoint that we know exists
      const response = await fetch('/api/v1/test/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token: debugInfo.fcmToken })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('[FCM Debugger] Non-JSON response received:', {
          status: response.status,
          contentType,
          response: textResponse.substring(0, 200) + '...'
        });
        throw new Error(`Expected JSON but got ${contentType}. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[FCM Debugger] Test endpoint response:', data);
      
      setDebugInfo(prev => ({
        ...prev,
        backendResponse: { test_endpoint: data, status: response.status }
      }));
    } catch (error: any) {
      console.error('[FCM Debugger] Test endpoint failed:', error);
      setDebugInfo(prev => ({
        ...prev,
        backendResponse: { 
          test_endpoint: { error: error.message }, 
          status: 'error' 
        }
      }));
    }
  };

  const sendTestNotification = async () => {
    try {
      console.log('[FCM Debugger] Sending test notification...');
      const response = await fetch('/api/v1/test/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test notification from FCM Debugger',
          data: { type: 'test', timestamp: Date.now() }
        })
      });

      const data = await response.json();
      console.log('[FCM Debugger] Test notification response:', data);
    } catch (error) {
      console.error('[FCM Debugger] Test notification failed:', error);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        FCM Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '80vh',
      backgroundColor: 'white',
      border: '2px solid #007bff',
      borderRadius: '10px',
      padding: '20px',
      zIndex: 10000,
      overflowY: 'auto',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#007bff' }}>FCM Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Notification Permission:</strong> 
        <span style={{ 
          color: debugInfo.notificationPermission === 'granted' ? 'green' : 
                 debugInfo.notificationPermission === 'denied' ? 'red' : 'orange',
          marginLeft: '10px'
        }}>
          {debugInfo.notificationPermission}
        </span>
        {debugInfo.notificationPermission !== 'granted' && (
          <button
            onClick={requestPermission}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Request
          </button>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>FCM Token:</strong>
        <div style={{ fontSize: '12px', marginTop: '5px' }}>
          {debugInfo.fcmToken ? (
            <>
              <div>Length: {debugInfo.tokenLength}</div>
              <div>Valid: {debugInfo.tokenValid ? '✅' : '❌'}</div>
              <div>Prefix: {debugInfo.fcmToken.substring(0, 20)}...</div>
              <div>Suffix: ...{debugInfo.fcmToken.substring(debugInfo.fcmToken.length - 10)}</div>
            </>
          ) : (
            <span style={{ color: 'red' }}>No token</span>
          )}
        </div>
        <button
          onClick={generateFCMToken}
          style={{
            marginTop: '10px',
            padding: '8px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Generate Token
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Registration Status:</strong>
        <div style={{ fontSize: '12px', marginTop: '5px' }}>
          {debugInfo.registrationAttempted ? (
            debugInfo.registrationSuccess ? (
              <span style={{ color: 'green' }}>✅ Success</span>
            ) : (
              <span style={{ color: 'red' }}>❌ Failed: {debugInfo.registrationError}</span>
            )
          ) : (
            <span style={{ color: 'gray' }}>Not attempted</span>
          )}
        </div>
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={registerToken}
            disabled={!debugInfo.fcmToken || !debugInfo.tokenValid}
            style={{
              padding: '8px 15px',
              backgroundColor: debugInfo.fcmToken && debugInfo.tokenValid ? '#28a745' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: debugInfo.fcmToken && debugInfo.tokenValid ? 'pointer' : 'not-allowed',
              marginRight: '10px'
            }}
          >
            Register Token
          </button>
          <button
            onClick={testAlternativeEndpoint}
            disabled={!debugInfo.fcmToken}
            style={{
              padding: '8px 15px',
              backgroundColor: debugInfo.fcmToken ? '#ffc107' : '#ccc',
              color: 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: debugInfo.fcmToken ? 'pointer' : 'not-allowed'
            }}
          >
            Test Alt Endpoint
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={sendTestNotification}
          style={{
            padding: '8px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Send Test Notification
        </button>
      </div>

      {debugInfo.backendResponse && (
        <div style={{ marginTop: '15px' }}>
          <strong>Backend Response:</strong>
          <pre style={{
            fontSize: '10px',
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '3px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(debugInfo.backendResponse, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Environment Info:</strong>
        <div>VAPID Key: {VAPID_KEY ? 'Present' : 'Missing'}</div>
        <div>Firebase App: {app ? 'Initialized' : 'Not initialized'}</div>
        <div>User Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</div>
      </div>
    </div>
  );
};

export default FCMDebugger; 