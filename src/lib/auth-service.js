// API service for authentication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  async register(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  },

  async logout() {
    // Optional: Call backend logout endpoint if it exists
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Verify token validity
  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  },

  // Get user profile
  async getProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  },


  async firebaseLogin({ idToken, provider, email, displayName, photoURL, uid }) {
    const response = await fetch(`${API_BASE_URL}/auth/firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        provider,   
        email,
        displayName,
        photoURL,
        uid,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `${provider} login failed`);
    }

    return await response.json();
  },

  // Request password reset - sends reset link to email
  async forgotPassword(email) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      // Extract detailed validation errors if available
      let errorMessage = error.message || 'Failed to send reset email';
      
      // Handle validation errors array (common in express-validator, Zod, etc.)
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        const messages = error.errors.map(e => e.message || e.msg || e).filter(Boolean);
        if (messages.length > 0) {
          errorMessage = messages.join('. ');
        }
      }
      
      // Handle nested validation details
      if (error.details && typeof error.details === 'object') {
        const details = Object.values(error.details).flat().join('. ');
        if (details) {
          errorMessage = details;
        }
      }

      // Handle specific status codes with user-friendly messages
      if (response.status === 404) {
        errorMessage = 'No account found with this email address.';
      } else if (response.status === 429) {
        errorMessage = 'Too many requests. Please wait a few minutes and try again.';
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  // Reset password using token from email
  async resetPassword(token, password) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      // Extract detailed validation errors if available
      let errorMessage = error.message || 'Failed to reset password';
      
      // Handle validation errors array
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        const messages = error.errors.map(e => e.message || e.msg || e).filter(Boolean);
        if (messages.length > 0) {
          errorMessage = messages.join('. ');
        }
      }
      
      // Handle nested validation details
      if (error.details && typeof error.details === 'object') {
        const details = Object.values(error.details).flat().join('. ');
        if (details) {
          errorMessage = details;
        }
      }

      // Handle specific status codes with user-friendly messages
      if (response.status === 400 && errorMessage.toLowerCase().includes('token')) {
        errorMessage = 'This reset link is invalid or has expired. Please request a new one.';
      } else if (response.status === 404) {
        errorMessage = 'Reset link not found. Please request a new password reset.';
      } else if (response.status === 410) {
        errorMessage = 'This reset link has expired. Please request a new one.';
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  },
};
