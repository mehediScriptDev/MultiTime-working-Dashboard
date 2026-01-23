import { users, type User, type InsertUser, timezones, type Timezone, type InsertTimezone } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPremiumStatus(id: number, isPremium: boolean): Promise<User | undefined>;
  
  getTimezones(userId: number): Promise<Timezone[]>;
  getTimezone(id: number): Promise<Timezone | undefined>;
  createTimezone(timezone: InsertTimezone): Promise<Timezone>;
  updateTimezone(id: number, timezone: Partial<InsertTimezone>): Promise<Timezone | undefined>;
  deleteTimezone(id: number): Promise<boolean>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private timezones: Map<number, Timezone>;
  private userIdCounter: number;
  private timezoneIdCounter: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.timezones = new Map();
    this.userIdCounter = 1;
    this.timezoneIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, isPremium: false };
    this.users.set(id, user);
    return user;
  }

  async updateUserPremiumStatus(id: number, isPremium: boolean): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, isPremium };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getTimezones(userId: number): Promise<Timezone[]> {
    return Array.from(this.timezones.values()).filter(
      (timezone) => timezone.userId === userId
    );
  }

  async getTimezone(id: number): Promise<Timezone | undefined> {
    return this.timezones.get(id);
  }

  async createTimezone(timezone: InsertTimezone): Promise<Timezone> {
    const id = this.timezoneIdCounter++;
    const newTimezone: Timezone = { ...timezone, id };
    this.timezones.set(id, newTimezone);
    return newTimezone;
  }

  async updateTimezone(id: number, timezoneData: Partial<InsertTimezone>): Promise<Timezone | undefined> {
    const timezone = await this.getTimezone(id);
    if (!timezone) return undefined;
    
    const updatedTimezone = { ...timezone, ...timezoneData };
    this.timezones.set(id, updatedTimezone);
    return updatedTimezone;
  }

  async deleteTimezone(id: number): Promise<boolean> {
    return this.timezones.delete(id);
  }
}

export const storage = new MemStorage();
