import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTimezoneSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Timezone routes
  app.get("/api/timezones", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const timezones = await storage.getTimezones(req.user.id);
      res.json(timezones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timezones" });
    }
  });

  app.post("/api/timezones", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      // Count user's existing timezones
      const userTimezones = await storage.getTimezones(req.user.id);
      
      // Check if user is trying to add more than 3 timezones without premium
      if (userTimezones.length >= 3 && !req.user.isPremium) {
        return res.status(403).json({ 
          message: "Free tier limit reached", 
          code: "PREMIUM_REQUIRED" 
        });
      }

      // Validate request body
      const validatedData = insertTimezoneSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const timezone = await storage.createTimezone(validatedData);
      res.status(201).json(timezone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid timezone data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create timezone" });
    }
  });

  app.put("/api/timezones/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid timezone ID" });
    }
    
    try {
      const timezone = await storage.getTimezone(id);
      if (!timezone) {
        return res.status(404).json({ message: "Timezone not found" });
      }
      
      if (timezone.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this timezone" });
      }
      
      const updatedTimezone = await storage.updateTimezone(id, req.body);
      res.json(updatedTimezone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid timezone data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update timezone" });
    }
  });

  app.delete("/api/timezones/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid timezone ID" });
    }
    
    try {
      const timezone = await storage.getTimezone(id);
      if (!timezone) {
        return res.status(404).json({ message: "Timezone not found" });
      }
      
      if (timezone.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this timezone" });
      }
      
      await storage.deleteTimezone(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete timezone" });
    }
  });

  // Premium upgrade route
  app.post("/api/upgrade", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      // In a real app, this would process the payment through PayPal
      // For now, we'll just upgrade the user's status
      const updatedUser = await storage.updateUserPremiumStatus(req.user.id, true);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update the session with the updated user
      req.login(updatedUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to update session" });
        }
        return res.json(updatedUser);
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to upgrade account" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
