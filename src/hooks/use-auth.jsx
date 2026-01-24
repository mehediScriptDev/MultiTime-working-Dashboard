import { createContext, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { DUMMY_USER } from "@/lib/dummy-data";

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

const DUMMY_USER_DEFINED = {
  id: "dev-user-1",
  email: "admin@example.com",
  username: "admin",
  isPremium: true,
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }) {
  const { toast } = useToast();
  
  // In development, use dummy user if no backend is available
  const isDev = import.meta.env.DEV;
  
  const { data: user, error, isLoading } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const fn = getQueryFn({ on401: "returnNull" });
        const result = await fn();
        return result;
      } catch (e) {
        // If request fails in dev mode, return dummy user
        if (isDev) {
          console.log("Using dummy user for development");
          return DUMMY_USER;
        }
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
    },
    onError: (error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({ title: "Registration successful!", description: "Your account has been created." });
    },
    onError: (error) => {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/timezones"] });
      toast({ title: "Logged out", description: "You have been successfully logged out." });
    },
    onError: (error) => {
      toast({ title: "Logout failed", description: error.message, variant: "destructive" });
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/upgrade");
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({ title: "Upgrade successful!", description: "You now have access to premium features." });
    },
    onError: (error) => {
      toast({ title: "Upgrade failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, isLoading, error, loginMutation, logoutMutation, registerMutation, upgradeMutation }}
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
