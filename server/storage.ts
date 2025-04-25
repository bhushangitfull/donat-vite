import { 
  users, 
  events, 
  newsPosts, 
  donations, 
  menuItems, 
  subscribers,
  type User, 
  type InsertUser,
  type Event,
  type InsertEvent,
  type NewsPost,
  type InsertNewsPost,
  type Donation,
  type InsertDonation,
  type MenuItem,
  type InsertMenuItem,
  type Subscriber,
  type InsertSubscriber
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // News methods
  getNewsPosts(): Promise<NewsPost[]>;
  getNewsPost(id: number): Promise<NewsPost | undefined>;
  createNewsPost(post: InsertNewsPost): Promise<NewsPost>;
  updateNewsPost(id: number, post: Partial<InsertNewsPost>): Promise<NewsPost | undefined>;
  deleteNewsPost(id: number): Promise<boolean>;
  
  // Donation methods
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  
  // Menu methods
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Subscriber methods
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscribers(): Promise<Subscriber[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.date);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateEvent(id: number, updateData: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db
      .delete(events)
      .where(eq(events.id, id));
    return true;
  }

  // News methods
  async getNewsPosts(): Promise<NewsPost[]> {
    return await db.select().from(newsPosts).orderBy(newsPosts.publishedAt);
  }

  async getNewsPost(id: number): Promise<NewsPost | undefined> {
    const [post] = await db.select().from(newsPosts).where(eq(newsPosts.id, id));
    return post;
  }

  async createNewsPost(insertPost: InsertNewsPost): Promise<NewsPost> {
    const [post] = await db
      .insert(newsPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateNewsPost(id: number, updateData: Partial<InsertNewsPost>): Promise<NewsPost | undefined> {
    const [updatedPost] = await db
      .update(newsPosts)
      .set(updateData)
      .where(eq(newsPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteNewsPost(id: number): Promise<boolean> {
    const result = await db
      .delete(newsPosts)
      .where(eq(newsPosts.id, id));
    return true;
  }

  // Donation methods
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db
      .insert(donations)
      .values(insertDonation)
      .returning();
    return donation;
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(donations.createdAt);
  }

  // Menu methods
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).orderBy(menuItems.order);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db
      .insert(menuItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updatedItem] = await db
      .update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id));
    return true;
  }

  // Subscriber methods
  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db
      .insert(subscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }

  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers);
  }
}

export const storage = new DatabaseStorage();
