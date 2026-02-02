// Token and auth utilities
const TOKEN_KEY = "accessToken";
const USER_KEY = "auth_user_v2";

export const tokenUtils = {
  // Get the current access token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set the access token
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Clear the access token
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Get user data
  getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  },

  // Set user data
  setUser(userData) {
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  // Clear all auth data
  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    return !!token && !!user;
  },
};

// Create axios-like fetch wrapper with auth headers
export const apiFetch = async (url, options = {}) => {
  const token = tokenUtils.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, clear auth and redirect
  if (response.status === 401) {
    tokenUtils.clearAuth();
    window.location.href = '/auth';
  }

  return response;
};
