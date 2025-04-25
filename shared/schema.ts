import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  email: text("email").notNull().unique(),
  firebaseUid: text("firebase_uid").unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
  firebaseUid: true,
});

// Events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  date: true,
  location: true,
  imageUrl: true,
});

// News/blog posts schema
export const newsPosts = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  authorName: text("author_name").notNull(),
  authorImageUrl: text("author_image_url"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

export const insertNewsPostSchema = createInsertSchema(newsPosts).pick({
  title: true,
  content: true,
  category: true,
  imageUrl: true,
  authorName: true,
  authorImageUrl: true,
});

// Donations schema
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  name: text("name"),
  email: text("email"),
  message: text("message"),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  purpose: text("purpose"),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  amount: true,
  name: true,
  email: true,
  message: true,
  isRecurring: true,
  purpose: true,
  stripePaymentId: true,
});

// Menu items schema
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  path: text("path").notNull(),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  title: true,
  path: true,
  order: true,
  isActive: true,
});

// Newsletter subscribers schema
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type NewsPost = typeof newsPosts.$inferSelect;
export type InsertNewsPost = z.infer<typeof insertNewsPostSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
