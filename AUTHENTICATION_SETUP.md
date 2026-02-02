# Authentication Implementation with Real Backend

## Overview
The authentication system has been updated to use real backend API calls instead of localStorage-based mock authentication. All credentials are now validated against the backend server.

## Configuration

### Environment Variables (.env)
```
VITE_API_BASE_URL=https://backend-chagourrutia.mtscorporate.com/api/v1
```

This base URL is used for all API requests:
- **Register**: `POST {BASE_URL}/auth/register`
- **Login**: `POST {BASE_URL}/auth/login`
- **Logout**: `POST {BASE_URL}/auth/logout` (optional)
- **Verify Token**: `GET {BASE_URL}/auth/verify` (optional)

## Files Modified/Created

### 1. `.env` (Created)
Contains the base URL for the backend API.

### 2. `src/lib/auth-service.js` (Created)
Handles all API calls related to authentication:
- `register(credentials)` - Register a new user
- `login(credentials)` - Login with email and password
- `logout()` - Call backend logout endpoint
- `verifyToken(token)` - Verify if a token is valid

### 3. `src/lib/token-utils.js` (Created)
Utility functions for managing authentication tokens and user data:
- `getToken()` - Retrieve the current access token
- `setToken(token)` - Store the access token
- `clearToken()` - Remove the access token
- `getUser()` - Get stored user data
- `setUser(userData)` - Store user data
- `clearAuth()` - Clear all authentication data
- `isAuthenticated()` - Check if user is logged in
- `apiFetch(url, options)` - Fetch wrapper with automatic auth headers

### 4. `src/hooks/use-auth.jsx` (Updated)
Key changes:
- Removed localStorage-based mock authentication
- Integrated `authService` for real API calls
- Updated token handling to store and retrieve JWT tokens
- Modified `loginMutation` to call backend and save token
- Modified `registerMutation` to call backend and save token
- Updated `logoutMutation` to call backend logout
- Fixed `upgradeMutation` to preserve token

## Authentication Flow

### Sign Up
```
1. User fills registration form (email, username, password)
2. Form validates input using Zod schema
3. registerMutation calls authService.register()
4. Backend validates and creates user
5. Backend returns user data and accessToken
6. Token and user data are stored in localStorage
7. User is automatically logged in
8. Toast notification confirms success
```

### Sign In
```
1. User fills login form (email, password)
2. Form validates input using Zod schema
3. loginMutation calls authService.login()
4. Backend validates credentials
5. Backend returns user data and accessToken
6. Token and user data are stored in localStorage
7. User is logged in
8. Toast notification confirms success
```

### Token Management
- Tokens are stored in `localStorage` under the key `accessToken`
- User data is stored in `localStorage` under the key `auth_user_v2`
- Tokens are automatically included in API requests via the `apiFetch` helper
- If a 401 response is received, the app clears auth and redirects to `/auth`

## API Request Examples

### Register Request
```json
POST /api/v1/auth/register
{
  "email": "mehedi1@gmail.com",
  "username": "Mehedi1",
  "password": "password123"
}
```

### Register Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cml4oy26j000d65vnbshzri7t",
      "email": "mehedi1@gmail.com",
      "username": "Mehedi1",
      "isPremium": false,
      "createdAt": "2026-02-02T04:50:03.788Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully",
  "statusCode": 200
}
```

### Login Request
```json
POST /api/v1/auth/login
{
  "email": "mehedi1@gmail.com",
  "password": "password123"
}
```

### Login Response
Same structure as register response.

## Error Handling

All authentication errors are caught and displayed to the user via toast notifications:
- **Registration errors**: "Registration failed" with error message
- **Login errors**: "Login failed" with error message
- **Network errors**: Displayed with error message

## Using Authentication in Components

```jsx
import { useAuth } from "@/hooks/use-auth";

export function MyComponent() {
  const { user, isLoading, loginMutation, registerMutation, logoutMutation } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <p>Please log in</p>;
  }

  // Get user info
  console.log(user.email, user.username);

  // Login
  const handleLogin = () => {
    loginMutation.mutate({ 
      email: "user@example.com", 
      password: "password" 
    });
  };

  // Register
  const handleRegister = () => {
    registerMutation.mutate({ 
      email: "user@example.com", 
      username: "username",
      password: "password" 
    });
  };

  // Logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    // Component JSX
  );
}
```

## Making Authenticated API Requests

To make API requests that include the auth token, use the `apiFetch` helper:

```jsx
import { apiFetch } from "@/lib/token-utils";

// Automatic Authorization header
const response = await apiFetch(
  `${import.meta.env.VITE_API_BASE_URL}/timezones`,
  {
    method: 'GET'
  }
);
```

The `Authorization: Bearer {token}` header is automatically included.

## Protected Routes

Use the `ProtectedRoute` component to restrict access to authenticated users only:

```jsx
import ProtectedRoute from "@/lib/protected-route";
import Dashboard from "@/pages/dashboard";

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Notes

- Passwords are NOT stored locally; only the JWT token is stored
- Tokens should be included in all subsequent API requests
- Implement token refresh logic if your backend supports refresh tokens
- Consider adding HTTPS-only and SameSite attributes to cookies if switching to cookie-based storage
- The app automatically redirects to `/auth` if a 401 error is received (unauthorized)

## Testing the Implementation

1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Test sign-up with a new account
4. Test sign-in with existing credentials
5. Check the browser's localStorage to verify token storage
6. Test logout functionality
