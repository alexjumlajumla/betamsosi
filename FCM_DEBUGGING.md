# FCM (Firebase Cloud Messaging) Debugging Guide

This guide provides comprehensive tools and instructions for debugging FCM push notification issues in your e-commerce application.

## Problem Summary

The FCM notification system is not working because:
- **No FCM tokens are stored** for users in the database
- **Frontend token registration** is failing or not being triggered
- **Backend notification system** is working but has no tokens to send to

## Debugging Tools Implemented

### 1. Enhanced Frontend Debugging (`utils/firebaseMessageListener.ts`)

The FCM token registration process now includes comprehensive logging:

```typescript
// Check browser console for detailed logs:
[FCM Debug] Starting FCM token registration...
[FCM Debug] VAPID Key: Present/Missing
[FCM Debug] Firebase app initialized: true/false
[FCM Debug] Notification permission: granted/denied/default
[FCM Debug] FCM token generated successfully
[FCM Debug] Token validation passed, registering with backend...
[FCM Debug] Token registration successful/failed
```

### 2. FCM Debugger Component (`components/fcmDebugger.tsx`)

A visual debugging tool that appears in development mode:

- **Notification Permission Status**: Check and request permissions
- **FCM Token Generation**: Manually generate and validate tokens
- **Token Registration**: Test backend registration
- **Alternative Endpoint Testing**: Test different API endpoints
- **Test Notifications**: Send test notifications
- **Environment Info**: Check Firebase configuration

**Usage**: Look for the "FCM Debug" button in the bottom-right corner of your app (development mode only).

### 3. Backend Test Controller (`mapi/app/Http/Controllers/API/v1/TestController.php`)

New API endpoints for testing FCM functionality:

- `GET /api/v1/test/system-status` - Check FCM configuration
- `GET /api/v1/test/token-status` - Get user's FCM token status
- `POST /api/v1/test/register-token` - Manually register a token
- `POST /api/v1/test/send-notification` - Send test notification
- `POST /api/v1/test/clear-tokens` - Clear all user tokens

### 4. CLI Testing Script (`scripts/test-fcm.sh`)

Command-line tool for testing FCM functionality:

```bash
# Make script executable
chmod +x scripts/test-fcm.sh

# Run full test suite
./scripts/test-fcm.sh --full

# Test specific functionality
./scripts/test-fcm.sh --system          # Check system status
./scripts/test-fcm.sh --get-status      # Get token status
./scripts/test-fcm.sh --register "test_token_123"  # Register token
./scripts/test-fcm.sh --notify          # Send test notification
./scripts/test-fcm.sh --clear           # Clear tokens
```

## Step-by-Step Debugging Process

### Step 1: Check Frontend FCM Setup

1. **Open browser console** and look for FCM debug logs
2. **Check notification permissions**:
   ```javascript
   // In browser console
   Notification.permission
   ```
3. **Test FCM token generation**:
   ```javascript
   // In browser console
   import { getMessaging, getToken } from "firebase/messaging";
   import app from "services/firebase";
   import { VAPID_KEY } from "constants/config";
   
   const messaging = getMessaging(app);
   getToken(messaging, { vapidKey: VAPID_KEY })
     .then(token => console.log('FCM Token:', token))
     .catch(err => console.error('Error:', err));
   ```

### Step 2: Use FCM Debugger Component

1. **Open your app in development mode**
2. **Click the "FCM Debug" button** in the bottom-right corner
3. **Check notification permission** - request if needed
4. **Generate FCM token** - verify it's valid
5. **Register token** - test backend registration
6. **Send test notification** - verify end-to-end functionality

### Step 3: Test Backend API Endpoints

1. **Get system status**:
   ```bash
   curl -X GET "https://your-domain.com/api/v1/test/system-status" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN"
   ```

2. **Check token status**:
   ```bash
   curl -X GET "https://your-domain.com/api/v1/test/token-status" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN"
   ```

3. **Register test token**:
   ```bash
   curl -X POST "https://your-domain.com/api/v1/test/register-token" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"token": "test_fcm_token_123"}'
   ```

4. **Send test notification**:
   ```bash
   curl -X POST "https://your-domain.com/api/v1/test/send-notification" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "Test", "body": "Test notification"}'
   ```

### Step 4: Use CLI Testing Script

1. **Update the script configuration**:
   ```bash
   # Edit scripts/test-fcm.sh
   API_BASE_URL="https://your-domain.com/api/v1"
   ```

2. **Run full test suite**:
   ```bash
   ./scripts/test-fcm.sh --full
   ```

3. **Test specific functionality**:
   ```bash
   ./scripts/test-fcm.sh --system
   ./scripts/test-fcm.sh --get-status
   ./scripts/test-fcm.sh --register "test_fcm_token_123"
   ./scripts/test-fcm.sh --notify
   ```

### Step 5: Check Laravel Logs

Monitor Laravel logs for FCM activity:

```bash
# Check for FCM-related logs
grep -i fcm laravel-$(date +%Y-%m-%d).log | tail -n 50

# Check for notification-related logs
grep -i notif laravel-$(date +%Y-%m-%d).log | tail -n 50

# Monitor logs in real-time
tail -f laravel-$(date +%Y-%m-%d).log | grep -i fcm
```

## Common Issues and Solutions

### Issue 1: No FCM Tokens in Database

**Symptoms**: Logs show "No valid FCM tokens found for user"

**Solutions**:
1. Check if users are granting notification permissions
2. Verify VAPID key is configured correctly
3. Test token generation in browser console
4. Check if token registration API is working

### Issue 2: Token Registration Failing

**Symptoms**: Frontend shows "Token registration failed"

**Solutions**:
1. Check authentication token is valid
2. Verify API endpoint is accessible
3. Check backend validation rules
4. Test with CLI script

### Issue 3: Notifications Not Received

**Symptoms**: Tokens exist but notifications don't arrive

**Solutions**:
1. Check Firebase project configuration
2. Verify service account credentials
3. Test with simple notification first
4. Check browser notification settings

### Issue 4: Permission Denied

**Symptoms**: "Notification permission denied"

**Solutions**:
1. Guide users to enable notifications in browser
2. Check if site is served over HTTPS
3. Verify VAPID key is correct
4. Test in incognito mode

## Environment Configuration

### Frontend Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

### Backend Environment Variables

Ensure these are set in your Laravel `.env`:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key
FIREBASE_SENDER_ID=your_sender_id
FIREBASE_VAPID_KEY=your_vapid_key
FCM_SERVER_KEY=your_server_key
FIREBASE_ALLOW_TEST_TOKENS=true
```

## Testing Checklist

- [ ] Notification permissions granted
- [ ] FCM token generated successfully
- [ ] Token format is valid (100-500 characters, alphanumeric + special chars)
- [ ] Token registered with backend
- [ ] Backend shows token in database
- [ ] Test notification sent successfully
- [ ] Notification received in browser/app
- [ ] Real notifications triggered by events

## Support

If you're still experiencing issues after following this guide:

1. **Check the logs** for specific error messages
2. **Use the FCM Debugger** to isolate the problem
3. **Test with the CLI script** to verify backend functionality
4. **Verify Firebase project configuration** in Firebase Console
5. **Check browser console** for JavaScript errors

## Files Modified

- `utils/firebaseMessageListener.ts` - Enhanced debugging
- `components/fcmDebugger.tsx` - Visual debug tool
- `pages/_app.tsx` - Added debugger component
- `mapi/app/Http/Controllers/API/v1/TestController.php` - Backend test endpoints
- `mapi/routes/api.php` - Added test routes
- `scripts/test-fcm.sh` - CLI testing script
- `FCM_DEBUGGING.md` - This documentation 