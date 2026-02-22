# TimeSync - Project Documentation

## Project Overview

**TimeSync** is a modern timezone management web application built with React that helps users track, compare, and manage multiple timezones with their team's working hours. The application provides both free and premium tiers, supports internationalization (English and Spanish), and features a responsive design with dark mode support.

### Key Technologies
- **Frontend**: React 19.2.0, Vite, TailwindCSS
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: Wouter
- **Authentication**: LocalStorage-based authentication system
- **UI Components**: Radix UI components with custom styling
- **Internationalization**: React i18next
- **Animation**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Styling**: TailwindCSS with class-variance-authority

---

## Features & Functionality

### Core Features

#### 1. **Authentication System**
- User registration and login
- LocalStorage-based persistence
- Password validation and security
- OAuth integration ready (UI components available)
- Forgot password dialog
- Remember me functionality

#### 2. **Timezone Management**
- Add, edit, and delete timezones
- Real-time timezone display
- Working hours configuration
- Visual working hours indicator
- Timezone search and selection
- Free plan limit (3 timezones)
- Premium unlimited timezones

#### 3. **Time Comparison Dashboard**
- Visual 24-hour timeline chart
- Multiple timezone comparison
- Current time indicators
- Working hours visualization
- Interactive hover time display
- Responsive timeline view

#### 4. **Premium Subscription**
- Free tier: 3 timezones maximum
- Premium tier: Unlimited timezones
- Advanced scheduling features
- Meeting suggestions saving
- PayPal payment integration ready
- $18/year pricing

#### 5. **Internationalization**
- English and Spanish language support
- Dynamic language switching
- Comprehensive translation coverage
- RTL support ready

#### 6. **Responsive Design**
- Mobile-first approach
- Dark mode support
- Responsive timeline charts
- Touch-friendly interface
- Adaptive layouts

---

## Data Objects by Functionality

### 1. User Authentication Objects

```javascript
// User Registration Schema
const userRegistrationData = {
  email: "user@example.com",
  username: "johndoe",
  password: "securePassword123"
};

// User Login Schema
const userLoginData = {
  email: "user@example.com", 
  password: "securePassword123"
};

// User Profile Object
const userProfile = {
  id: "user-1704067200000-abc123def",
  email: "user@example.com",
  username: "johndoe",
  isPremium: false,
  createdAt: "2024-01-29T12:00:00.000Z"
};

// Stored Users Array (localStorage)
const allUsers = [
  {
    id: "user-1704067200000-abc123def",
    email: "user@example.com",
    username: "johndoe",
    password: "hashedPassword", // In real app, this would be hashed
    isPremium: false,
    createdAt: "2024-01-29T12:00:00.000Z"
  }
];
```

### 2. Timezone Management Objects

```javascript
// Timezone Object
const timezoneObject = {
  id: "tz-1704067200000-xyz789abc",
  name: "New York",
  timezone: "America/New_York",
  region: "United States",
  abbreviation: "EST",
  offset: -300, // EST offset in minutes from UTC
  workingHoursStart: 9, // 9 AM
  workingHoursEnd: 17, // 5 PM
  label: "New York HQ", // Custom user label
  userId: "user-1704067200000-abc123def",
  createdAt: "2024-01-29T12:00:00.000Z"
};

// Timezone Collection (localStorage)
const timezonesArray = [
  {
    id: "tz-1",
    name: "New York",
    timezone: "America/New_York",
    region: "United States", 
    abbreviation: "EST",
    offset: -300,
    workingHoursStart: 9,
    workingHoursEnd: 17,
    label: "New York HQ",
    createdAt: "2024-01-29T12:00:00.000Z"
  },
  {
    id: "tz-2", 
    name: "London",
    timezone: "Europe/London",
    region: "United Kingdom",
    abbreviation: "GMT",
    offset: 0,
    workingHoursStart: 9,
    workingHoursEnd: 17,
    label: "London Office",
    createdAt: "2024-01-29T11:00:00.000Z"
  }
];

// Add Timezone Request
const addTimezoneRequest = {
  name: "Tokyo",
  timezone: "Asia/Tokyo", 
  region: "Japan",
  abbreviation: "JST",
  offset: 540,
  workingHoursStart: 9,
  workingHoursEnd: 18,
  label: "Tokyo Branch"
};

// Edit Timezone Request
const editTimezoneRequest = {
  id: "tz-1704067200000-xyz789abc",
  name: "Tokyo",
  label: "Tokyo HQ - Updated",
  workingHoursStart: 10,
  workingHoursEnd: 19
};
```

### 3. Time Display Objects

```javascript
// Time Display Data
const timeDisplayData = {
  time: "14:30", // 24-hour format or "2:30 PM" for 12-hour
  date: "Mon, Jan 29, 2024",
  isWorkingHours: true
};

// Working Hours Calculation
const workingHoursData = {
  workingHoursPercent: 75, // Percentage of working day completed
  workingHoursText: "9:00 AM - 5:00 PM", 
  isCurrentlyWorking: true
};

// Timeline Chart Data
const timelineData = {
  currentTimePercent: 62.5, // Current time position on 24h scale
  workingHoursStartPercent: 37.5, // 9 AM = 37.5% of day
  workingHoursWidthPercent: 33.33, // 8 hours = 33.33% of day
  isActive: true // Currently within working hours
};
```

### 4. Premium Subscription Objects

```javascript
// Premium Upgrade Data
const premiumUpgradeData = {
  currentPlan: "free",
  currentTimezoneCount: 3,
  maxTimezonesAllowed: 3,
  upgradeBenefits: [
    "Unlimited timezones",
    "Advanced scheduling features", 
    "Save meeting suggestions"
  ],
  pricing: {
    amount: 18,
    currency: "USD",
    billing: "annually"
  }
};

// Subscription Status
const subscriptionStatus = {
  isPremium: false,
  subscriptionId: null,
  expiresAt: null,
  paymentMethod: "paypal"
};
```

### 5. UI State Objects

```javascript
// Application State
const appState = {
  use24Hour: true,
  currentLanguage: "en", // "en" | "es"
  darkMode: false,
  addDialogOpen: false,
  editingTimezone: null,
  deleteConfirmOpen: false,
  toDeleteTimezone: null
};

// Toast Notification Data
const toastData = {
  title: "Timezone added",
  description: "The timezone has been added successfully.",
  variant: "default" // "default" | "destructive"
};

// Form Validation Data
const validationSchema = {
  email: "string().email('Please enter a valid email')",
  username: "string().min(3, 'Username must be at least 3 characters')",
  password: "string().min(6, 'Password must be at least 6 characters')"
};
```

---

## Authentication Request Bodies

### 1. User Registration

```javascript
// POST /api/auth/register
const registrationRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "john.doe@example.com",
    username: "johndoe",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
    acceptTerms: true
  })
};

// Expected Response
const registrationResponse = {
  success: true,
  user: {
    id: "user-1704067200000-abc123def",
    email: "john.doe@example.com", 
    username: "johndoe",
    isPremium: false,
    createdAt: "2024-01-29T12:00:00.000Z"
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  message: "Registration successful"
};
```

### 2. User Login

```javascript
// POST /api/auth/login
const loginRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "john.doe@example.com",
    password: "SecurePass123!",
    rememberMe: true
  })
};

// Expected Response
const loginResponse = {
  success: true,
  user: {
    id: "user-1704067200000-abc123def",
    email: "john.doe@example.com",
    username: "johndoe", 
    isPremium: false,
    lastLogin: "2024-01-29T12:00:00.000Z"
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  expiresIn: "7d", // if rememberMe is true
  message: "Login successful"
};
```

### 3. Password Reset

```javascript
// POST /api/auth/forgot-password
const forgotPasswordRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "john.doe@example.com"
  })
};

// Expected Response
const forgotPasswordResponse = {
  success: true,
  message: "Password reset instructions sent to your email",
  resetTokenSent: true
};

// POST /api/auth/password-reset
const resetPasswordRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    token: "reset-token-123abc456def",
    newPassword: "NewSecurePass123!",
    confirmPassword: "NewSecurePass123!"
  })
};
```

### 4. Token Refresh

```javascript
// POST /api/auth/refresh-token
const refreshTokenRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  body: JSON.stringify({
    refreshToken: "refresh-token-xyz789def456"
  })
};

// Expected Response
const refreshTokenResponse = {
  success: true,
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  expiresIn: "1h"
};
```

---

## Subscription Request Bodies

### 1. Premium Upgrade Initiation

```javascript
// POST /api/subscription/upgrade
const upgradeInitiationRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  body: JSON.stringify({
    userId: "user-1704067200000-abc123def",
    plan: "premium_annual",
    paymentMethod: "paypal",
    currency: "USD",
    amount: 18.00,
    billingCycle: "yearly",
    returnUrl: "https://timesync.app/payment/success",
    cancelUrl: "https://timesync.app/payment/cancel"
  })
};

// Expected Response
const upgradeInitiationResponse = {
  success: true,
  paymentUrl: "https://www.paypal.com/checkoutnow?token=EC-123ABC456DEF789GHI",
  subscriptionId: "sub-1704067200000-premium-abc123",
  message: "Payment initiated successfully"
};
```

### 2. Payment Confirmation

```javascript
// POST /api/subscription/confirm-payment
const confirmPaymentRequest = {
  method: "POST", 
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  body: JSON.stringify({
    subscriptionId: "sub-1704067200000-premium-abc123",
    paymentId: "PAY-123ABC456DEF789GHI",
    payerId: "PAYER123ABC456",
    transactionId: "TXN-789DEF456ABC123",
    amount: 18.00,
    currency: "USD"
  })
};

// Expected Response 
const confirmPaymentResponse = {
  success: true,
  subscription: {
    id: "sub-1704067200000-premium-abc123",
    userId: "user-1704067200000-abc123def", 
    plan: "premium_annual",
    status: "active",
    currentPeriodStart: "2024-01-29T12:00:00.000Z",
    currentPeriodEnd: "2025-01-29T12:00:00.000Z",
    cancelAtPeriodEnd: false,
    paymentMethod: "paypal",
    amount: 18.00,
    currency: "USD"
  },
  user: {
    id: "user-1704067200000-abc123def",
    isPremium: true,
    premiumActivatedAt: "2024-01-29T12:00:00.000Z"
  },
  message: "Premium subscription activated successfully"
};
```

### 3. Subscription Management

```javascript
// GET /api/subscription/status
const getSubscriptionRequest = {
  method: "GET",
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
};

// Expected Response
const subscriptionStatusResponse = {
  success: true,
  subscription: {
    id: "sub-1704067200000-premium-abc123",
    plan: "premium_annual",
    status: "active", // "active" | "canceled" | "past_due" | "expired"
    currentPeriodStart: "2024-01-29T12:00:00.000Z",
    currentPeriodEnd: "2025-01-29T12:00:00.000Z",
    cancelAtPeriodEnd: false,
    nextBillingDate: "2025-01-29T12:00:00.000Z",
    amount: 18.00,
    currency: "USD",
    paymentMethod: "paypal"
  }
};

// POST /api/subscription/cancel
const cancelSubscriptionRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  body: JSON.stringify({
    subscriptionId: "sub-1704067200000-premium-abc123",
    cancelAtPeriodEnd: true, // true = cancel at end of period, false = immediate cancel
    reason: "user_request", // "user_request" | "payment_failed" | "other"
    feedback: "Found a better alternative"
  })
};

// Expected Response
const cancelSubscriptionResponse = {
  success: true,
  subscription: {
    id: "sub-1704067200000-premium-abc123",
    status: "active", // Still active until period end
    cancelAtPeriodEnd: true,
    canceledAt: "2024-01-29T12:00:00.000Z",
    endsAt: "2025-01-29T12:00:00.000Z"
  },
  message: "Subscription will be canceled at the end of the current billing period"
};
```

### 4. Payment Methods

```javascript
// POST /api/subscription/add-payment-method
const addPaymentMethodRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  body: JSON.stringify({
    type: "paypal", // "paypal" | "credit_card" | "bank_transfer"
    paypalEmail: "john.doe@example.com",
    // For credit card:
    // cardNumber: "4111111111111111",
    // expiryMonth: "12",
    // expiryYear: "2025", 
    // cvc: "123",
    // cardholderName: "John Doe"
  })
};

// Expected Response
const addPaymentMethodResponse = {
  success: true,
  paymentMethod: {
    id: "pm-1704067200000-paypal-abc123",
    type: "paypal",
    email: "john.doe@example.com",
    isDefault: true,
    createdAt: "2024-01-29T12:00:00.000Z"
  },
  message: "Payment method added successfully"
};
```

---

## Storage Structure

### LocalStorage Keys

```javascript
// Authentication
const STORAGE_KEYS = {
  USER: "auth_user_v1",           // Current logged-in user
  USERS: "auth_users_v1",         // All registered users  
  TIMEZONES: "timezones_v1",      // User's saved timezones
  PREFERENCES: "user_preferences_v1", // UI preferences
  LANGUAGE: "app_language_v1"     // Selected language
};
```

### Data Persistence

The application currently uses LocalStorage for data persistence with the following structure:

- **User Authentication**: Stored with password hashing simulation
- **Timezone Data**: JSON array of timezone objects
- **User Preferences**: UI state and settings
- **Session Management**: Token-like user session data

---

## API Endpoints (Future Implementation)

```javascript
// Base URL: https://api.timesync.app/v1

const API_ENDPOINTS = {
  // Authentication
  REGISTER: "/auth/register",
  LOGIN: "/auth/login", 
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/password-reset",
  
  // User Management
  GET_PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile", 
  DELETE_ACCOUNT: "/user/account",
  
  // Timezones
  GET_TIMEZONES: "/timezones",
  CREATE_TIMEZONE: "/timezones",
  UPDATE_TIMEZONE: "/timezones/:id",
  DELETE_TIMEZONE: "/timezones/:id",
  
  // Subscription
  GET_SUBSCRIPTION: "/subscription/status",
  UPGRADE_SUBSCRIPTION: "/subscription/upgrade", 
  CANCEL_SUBSCRIPTION: "/subscription/cancel",
  ADD_PAYMENT_METHOD: "/subscription/payment-methods",
  GET_PAYMENT_METHODS: "/subscription/payment-methods",
  
  // Analytics (Premium)
  GET_USAGE_STATS: "/analytics/usage",
  GET_TEAM_INSIGHTS: "/analytics/team-insights"
};
```

---

## Component Architecture

### Main Components
- **App.jsx**: Main application wrapper with routing
- **HomePage**: Dashboard with timezone management
- **AuthPage**: Login/registration with form validation
- **TimezoneCard**: Individual timezone display card
- **TimeComparisonChart**: Visual timeline comparison
- **PremiumUpgrade**: Subscription upgrade component
- **Header/Footer**: Navigation and branding

### UI Component Library
- Built on Radix UI primitives
- Custom styled with TailwindCSS
- Consistent design system
- Accessibility compliant
- Dark mode support

---

This documentation provides a comprehensive overview of the TimeSync application's features, data structures, API contracts, and technical implementation details.