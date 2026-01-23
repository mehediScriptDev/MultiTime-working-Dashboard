import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isPremium: boolean("is_premium").default(false).notNull(),
  provider: text("provider").default("local").notNull(),
  providerId: text("provider_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  provider: true,
  providerId: true,
});

export const timezones = pgTable("timezones", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  region: text("region"),
  abbreviation: text("abbreviation").notNull(),
  offset: integer("offset").notNull(),
  workingHoursStart: integer("working_hours_start").default(9).notNull(),
  workingHoursEnd: integer("working_hours_end").default(17).notNull(),
  label: text("label"),
});

export const insertTimezoneSchema = createInsertSchema(timezones).pick({
  userId: true,
  name: true,
  city: true,
  region: true,
  abbreviation: true,
  offset: true,
  workingHoursStart: true,
  workingHoursEnd: true,
  label: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTimezone = z.infer<typeof insertTimezoneSchema>;
export type Timezone = typeof timezones.$inferSelect;
