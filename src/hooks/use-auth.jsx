import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth-service";
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

export function AuthProvider({ children }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to load user from localStorage", e);
    } finally {
      setIsLoading(false);
    }
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
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }
  };

  const loginMutation = {
    mutate: async (credentials) => {
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
      }
    },
    mutateAsync: async (credentials) => {
      return loginMutation.mutate(credentials);
    },
    isPending: false,
  };

  const registerMutation = {
    mutate: async (credentials) => {
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
      }
    },
    mutateAsync: async (credentials) => {
      return registerMutation.mutate(credentials);
    },
    isPending: false,
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
    mutate: () => {
      if (user) {
        const upgraded = { ...user, isPremium: true };
        const token = localStorage.getItem(TOKEN_KEY);
        saveUser(upgraded, token);
        toast({ title: "Upgrade successful!", description: "You now have access to premium features." });
      }
    },
    mutateAsync: async () => {
      upgradeMutation.mutate();
    },
    isPending: false,
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
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
