import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
const USER_KEY = "auth_user_v1";
const USERS_KEY = "auth_users_v1";

export function AuthProvider({ children }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load user from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage whenever it changes
  const saveUser = (userData) => {
    try {
      if (userData) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
      } else {
        localStorage.removeItem(USER_KEY);
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }
  };

  // Get all registered users from localStorage
  const getAllUsers = () => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  };

  // Save all users to localStorage
  const saveAllUsers = (users) => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users to localStorage", e);
    }
  };

  const loginMutation = {
    mutate: async (credentials) => {
      try {
        const users = getAllUsers();
        const foundUser = users.find(u => u.email === credentials.email);
        
        if (!foundUser) {
          toast({ title: "Login failed", description: "No account found with this email.", variant: "destructive" });
          return;
        }
        
        if (foundUser.password !== credentials.password) {
          toast({ title: "Login failed", description: "Incorrect password.", variant: "destructive" });
          return;
        }
        
        // Login successful
        const { password, ...userWithoutPassword } = foundUser;
        saveUser(userWithoutPassword);
        toast({ title: "Welcome back!", description: "You have successfully logged in." });
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
        const users = getAllUsers();
        
        // Check if user already exists
        if (users.find(u => u.email === credentials.email)) {
          toast({ title: "Registration failed", description: "An account with this email already exists.", variant: "destructive" });
          return;
        }
        
        // Create new user
        const newUser = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          email: credentials.email,
          username: credentials.username,
          password: credentials.password,
          isPremium: false,
          createdAt: new Date().toISOString(),
        };
        
        // Save to users list
        saveAllUsers([...users, newUser]);
        
        // Login the new user
        const { password, ...userWithoutPassword } = newUser;
        saveUser(userWithoutPassword);
        toast({ title: "Registration successful!", description: "Your account has been created." });
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
      saveUser(null);
      toast({ title: "Logged out", description: "You have been successfully logged out." });
    },
    mutateAsync: async () => {
      logoutMutation.mutate();
    },
    isPending: false,
  };

  const signOut = () => {
    saveUser(null);
    toast({ title: "Signed out", description: "You have been signed out." });
    setTimeout(() => {
      window.location.href = "/auth";
    }, 100);
  };

  const upgradeMutation = {
    mutate: () => {
      if (user) {
        const upgraded = { ...user, isPremium: true };
        saveUser(upgraded);
        
        // Also update in users list
        const users = getAllUsers();
        const updatedUsers = users.map(u => 
          u.id === user.id ? { ...u, isPremium: true } : u
        );
        saveAllUsers(updatedUsers);
        
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
