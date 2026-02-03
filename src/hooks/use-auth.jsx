import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth-service";
import { subscriptionService } from "@/lib/subscription-service";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const AuthContext = createContext(null);

// localStorage keys
const USER_KEY = "auth_user_v2";
const TOKEN_KEY = "accessToken";
const SUBSCRIPTION_KEY = "subscription_data_v1";

export function AuthProvider({ children }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [isRegisterPending, setIsRegisterPending] = useState(false);
  
  // Load user and subscription from localStorage on mount and fetch fresh data from backend
  useEffect(() => {
    const loadUserAndSubscription = async () => {
      try {
        const savedUser = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);
        const savedSub = localStorage.getItem(SUBSCRIPTION_KEY);
        
        if (savedUser && token) {
          // Set the saved user first
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Set cached subscription if available
          if (savedSub) {
            try {
              setSubscription(JSON.parse(savedSub));
            } catch (e) {
              console.warn("Failed to parse cached subscription");
            }
          }
          
          // Fetch fresh profile from backend
          const profileResponse = await authService.getProfile(token);
          if (profileResponse?.data) {
            // Update with fresh data from backend
            saveUser(profileResponse.data, token);
          }

          // Fetch subscription status from backend
          try {
            const [statusResponse, usageResponse] = await Promise.all([
              subscriptionService.getStatus(token),
              subscriptionService.getUsage(token),
            ]);

            if (statusResponse?.data) {
              const subData = {
                ...statusResponse.data,
                usage: usageResponse?.data || null,
              };
              try {
                localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subData));
              } catch (e) {
                console.warn("Failed to cache subscription");
              }
              setSubscription(subData);
            }
          } catch (subError) {
            console.error("Failed to fetch subscription status:", subError);
          }
        } else {
          setUser(null);
          setSubscription(null);
        }
      } catch (e) {
        console.error("Failed to load user and subscription", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserAndSubscription();
  }, []);

  // Save user to localStorage
  const saveUser = (userData, token) => {
    try {
      if (userData && token) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_KEY, token);
        setUser(userData);
      } else {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SUBSCRIPTION_KEY);
        setUser(null);
        setSubscription(null);
      }
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }
  };

  const loginMutation = {
    mutate: async (credentials) => {
      setIsLoginPending(true);
      try {
        const response = await authService.login(credentials);
        
        if (response.success && response.data) {
          const { user: userData, accessToken } = response.data;
          saveUser(userData, accessToken);
          toast({ title: "Welcome back!", description: "You have successfully logged in." });
          return response;
        } else {
          toast({ title: "Login failed", description: response.message || "Unable to login", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } finally {
        setIsLoginPending(false);
      }
    },
    mutateAsync: async (credentials) => {
      return loginMutation.mutate(credentials);
    },
    get isPending() {
      return isLoginPending;
    },
  };

  const registerMutation = {
    mutate: async (credentials) => {
      setIsRegisterPending(true);
      try {
        const response = await authService.register(credentials);
        
        if (response.success && response.data) {
          const { user: userData, accessToken } = response.data;
          saveUser(userData, accessToken);
          toast({ title: "Registration successful!", description: "Your account has been created." });
          return response;
        } else {
          toast({ title: "Registration failed", description: response.message || "Unable to register", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Registration failed", description: error.message, variant: "destructive" });
      } finally {
        setIsRegisterPending(false);
      }
    },
    mutateAsync: async (credentials) => {
      return registerMutation.mutate(credentials);
    },
    get isPending() {
      return isRegisterPending;
    },
  };

  const logoutMutation = {
    mutate: () => {
      authService.logout();
      saveUser(null, null);
      toast({ title: "Logged out", description: "You have been successfully logged out." });
    },
    mutateAsync: async () => {
      logoutMutation.mutate();
    },
    isPending: false,
  };

  const signOut = () => {
    authService.logout();
    saveUser(null, null);
    toast({ title: "Signed out", description: "You have been signed out." });
    setTimeout(() => {
      window.location.href = "/auth";
    }, 100);
  };

  const upgradeMutation = {
    mutate: async (opts = {}) => {
      // opts can include returnUrl/cancelUrl for payment gateway
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const response = await subscriptionService.upgrade({
          returnUrl: opts.returnUrl || window.location.href,
          cancelUrl: opts.cancelUrl || window.location.href,
          token,
        });

        // If backend returns a Stripe checkout URL, redirect to payment
        if (response?.data && (response.data.checkoutUrl || response.data.url)) {
          const checkoutUrl = response.data.checkoutUrl || response.data.url;
          window.location.href = checkoutUrl;
          return response;
        }

        // If backend immediately marks user premium in response, update local user and subscription
        if (response?.success && response?.data) {
          if (response.data.isPremium) {
            const upgraded = { ...user, isPremium: true };
            saveUser(upgraded, token);
          }
          
          // Refresh subscription state from backend
          try {
            const [statusResponse, usageResponse] = await Promise.all([
              subscriptionService.getStatus(token),
              subscriptionService.getUsage(token),
            ]);

            if (statusResponse?.data) {
              const subData = {
                ...statusResponse.data,
                usage: usageResponse?.data || null,
              };
              localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subData));
              setSubscription(subData);
            }
          } catch (subError) {
            console.error("Failed to refresh subscription after upgrade:", subError);
          }

          toast({ title: "Upgrade successful!", description: "You now have access to premium features." });
          return response;
        }

        // Fallback: if backend didn't provide a direct upgrade flow, apply a local upgrade
        if (user) {
          const upgraded = { ...user, isPremium: true };
          saveUser(upgraded, token);
          toast({ title: "Upgrade applied locally", description: "Premium enabled locally (no backend confirmation)." });
        }
      } catch (error) {
        // If backend call fails, fallback to previous local-only behavior
        console.error("Upgrade mutation error details:", error);
        
        if (user) {
          const token = localStorage.getItem(TOKEN_KEY);
          const upgraded = { ...user, isPremium: true };
          saveUser(upgraded, token);
          toast({ 
            title: "Upgrade (offline)", 
            description: `Backend unavailable — ${error?.message || "upgrade applied locally"}` 
          });
        }
      }
    },
    mutateAsync: async (opts) => {
      return upgradeMutation.mutate(opts);
    },
    isPending: false,
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        subscription,
        isLoading, 
        error: null, 
        loginMutation, 
        logoutMutation, 
        registerMutation, 
        upgradeMutation, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
