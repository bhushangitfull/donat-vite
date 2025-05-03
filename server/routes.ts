import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();



export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the nonprofit app

  const razorpay = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID, // Corrected variable name
    key_secret: process.env.VITE_RAZORPAY_SECRET_ID,
  });


  //Create Razorpay order
  app.post("/api/create-order", async (req, res) => {
    try {
      console.log("Received request body:", req.body);
      const { amount } = req.body;
  
      if (!razorpay) {
        return res.status(500).json({
          message: "Razorpay is not configured.",
        });
      }
  
      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Invalid donation amount" });
      }
  
      const options = {
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: "rcp1",
      };
  
      const order = await razorpay.orders.create(options);
      res.status(200).json({ orderId: order.id });
    } catch (error: any) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({
        message: "Error creating Razorpay order: " + error.message,
      });
    }
  });

  // Get all donations (admin only route in a real app)
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error: any) {
      console.error("Error getting donations:", error);
      res.status(500).json({ 
        message: "Error retrieving donations: " + error.message 
      });
    }
  });

  // Get events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error: any) {
      console.error("Error getting events:", error);
      res.status(500).json({ 
        message: "Error retrieving events: " + error.message 
      });
    }
  });

  // Get a specific event
  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error: any) {
      console.error("Error getting event:", error);
      res.status(500).json({ 
        message: "Error retrieving event: " + error.message 
      });
    }
  });

  // Create a new event (admin only route in a real app)
  app.post("/api/events", async (req, res) => {
    try {
      const { title, description, date, location, imageUrl } = req.body;
      
      if (!title || !description || !date || !location) {
        return res.status(400).json({ message: "Please provide all required fields" });
      }
      
      const event = await storage.createEvent({
        title,
        description,
        date: new Date(date),
        location,
        imageUrl
      });
      
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Error creating event:", error);
      res.status(500).json({ 
        message: "Error creating event: " + error.message 
      });
    }
  });

  // Update an event (admin only route in a real app)
  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const { title, description, date, location, imageUrl } = req.body;
      const updateData: any = {};
      
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (date) updateData.date = new Date(date);
      if (location) updateData.location = location;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      
      const updatedEvent = await storage.updateEvent(id, updateData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error: any) {
      console.error("Error updating event:", error);
      res.status(500).json({ 
        message: "Error updating event: " + error.message 
      });
    }
  });

  // Delete an event (admin only route in a real app)
  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const result = await storage.deleteEvent(id);
      res.json({ success: result });
    } catch (error: any) {
      console.error("Error deleting event:", error);
      res.status(500).json({ 
        message: "Error deleting event: " + error.message 
      });
    }
  });

  // Get news posts
  app.get("/api/news", async (req, res) => {
    try {
      const posts = await storage.getNewsPosts();
      res.json(posts);
    } catch (error: any) {
      console.error("Error getting news posts:", error);
      res.status(500).json({ 
        message: "Error retrieving news posts: " + error.message 
      });
    }
  });

  // Get a specific news post
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid news post ID" });
      }
      
      const post = await storage.getNewsPost(id);
      if (!post) {
        return res.status(404).json({ message: "News post not found" });
      }
      
      res.json(post);
    } catch (error: any) {
      console.error("Error getting news post:", error);
      res.status(500).json({ 
        message: "Error retrieving news post: " + error.message 
      });
    }
  });

  // Create a new news post (admin only route in a real app)
  app.post("/api/news", async (req, res) => {
    try {
      const { title, content, category, imageUrl, authorName, authorImageUrl } = req.body;
      
      if (!title || !content || !category || !authorName) {
        return res.status(400).json({ message: "Please provide all required fields" });
      }
      
      const post = await storage.createNewsPost({
        title,
        content,
        category,
        imageUrl,
        authorName,
        authorImageUrl
      });
      
      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error creating news post:", error);
      res.status(500).json({ 
        message: "Error creating news post: " + error.message 
      });
    }
  });

  // Update a news post (admin only route in a real app)
  app.put("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid news post ID" });
      }
      
      const { title, content, category, imageUrl, authorName, authorImageUrl } = req.body;
      const updateData: any = {};
      
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (category) updateData.category = category;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (authorName) updateData.authorName = authorName;
      if (authorImageUrl !== undefined) updateData.authorImageUrl = authorImageUrl;
      
      const updatedPost = await storage.updateNewsPost(id, updateData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "News post not found" });
      }
      
      res.json(updatedPost);
    } catch (error: any) {
      console.error("Error updating news post:", error);
      res.status(500).json({ 
        message: "Error updating news post: " + error.message 
      });
    }
  });

  // Delete a news post (admin only route in a real app)
  app.delete("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid news post ID" });
      }
      
      const result = await storage.deleteNewsPost(id);
      res.json({ success: result });
    } catch (error: any) {
      console.error("Error deleting news post:", error);
      res.status(500).json({ 
        message: "Error deleting news post: " + error.message 
      });
    }
  });

  // Get menu items
  app.get("/api/menu", async (req, res) => {
    try {
      const menuItems = await storage.getMenuItems();
      res.json(menuItems);
    } catch (error: any) {
      console.error("Error getting menu items:", error);
      res.status(500).json({ 
        message: "Error retrieving menu items: " + error.message 
      });
    }
  });

  // Create a new menu item (admin only route in a real app)
  app.post("/api/menu", async (req, res) => {
    try {
      const { title, path, order, isActive } = req.body;
      
      if (!title || !path || order === undefined) {
        return res.status(400).json({ message: "Please provide all required fields" });
      }
      
      const menuItem = await storage.createMenuItem({
        title,
        path,
        order,
        isActive: isActive !== undefined ? isActive : true
      });
      
      res.status(201).json(menuItem);
    } catch (error: any) {
      console.error("Error creating menu item:", error);
      res.status(500).json({ 
        message: "Error creating menu item: " + error.message 
      });
    }
  });

  // Update a menu item (admin only route in a real app)
  app.put("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      
      const { title, path, order, isActive } = req.body;
      const updateData: any = {};
      
      if (title) updateData.title = title;
      if (path) updateData.path = path;
      if (order !== undefined) updateData.order = order;
      if (isActive !== undefined) updateData.isActive = isActive;
      
      const updatedMenuItem = await storage.updateMenuItem(id, updateData);
      
      if (!updatedMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json(updatedMenuItem);
    } catch (error: any) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ 
        message: "Error updating menu item: " + error.message 
      });
    }
  });

  // Delete a menu item (admin only route in a real app)
  app.delete("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      
      const result = await storage.deleteMenuItem(id);
      res.json({ success: result });
    } catch (error: any) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ 
        message: "Error deleting menu item: " + error.message 
      });
    }
  });

  // Add newsletter subscriber
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Please provide a valid email address" });
      }
      
      const subscriber = await storage.addSubscriber({ email });
      
      res.json({ 
        success: true, 
        message: "Subscription successful",
        subscriber
      });
    } catch (error: any) {
      console.error("Error adding subscriber:", error);
      res.status(500).json({ 
        message: "Error adding subscriber: " + error.message 
      });
    }
  });

  // Send contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Please fill in all required fields" });
      }
      
      // In a full implementation, this would send an email or store the message
      
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      res.status(500).json({ 
        message: "Error sending message: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
