
import mongoose from 'mongoose';
import { mockPosts } from './mockData';
import PostModel from '../models/Post';
import TagModel from '../models/Tag';

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Is this running on the server?
const isServer = !isBrowser && process.env.NODE_ENV !== 'test';

// Safely access environment variables in browser or Node.js context
const MONGODB_URI = typeof process !== 'undefined' && process.env.MONGODB_URI 
  ? process.env.MONGODB_URI 
  : "mongodb+srv://aditya:aditya@cluster0.yytesl0.mongodb.net/dev-replit";

// Define the cached mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // In browser environment, we won't actually connect
  if (isBrowser) {
    console.log("Running in browser environment, using mock data");
    return null;
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connection established");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Function to seed mock data into the database
async function seedDatabase() {
  try {
    // Only run on server and if not in browser
    if (isBrowser) {
      console.log("Cannot seed database in browser environment");
      return;
    }

    // Make sure we have a database connection first
    const connection = await connectToDatabase();
    if (!connection) {
      console.log("No database connection, cannot seed data");
      return;
    }
    
    // Ensure the models are properly loaded
    const PostModelInstance = mongoose.model('Post');
    
    // Check if we already have data
    const postCount = await PostModelInstance.countDocuments();
    
    if (postCount > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }
    
    console.log("Seeding database with mock data...");
    
    // Process each mock post
    for (const post of mockPosts) {
      // First update tags
      const tagNames = post.tags || [];
      for (const name of tagNames) {
        const normalizedName = name.toLowerCase().trim();
        await TagModel.findOneAndUpdate(
          { name: normalizedName },
          { $inc: { count: 1 } },
          { new: true, upsert: true }
        ).exec();
      }
      
      // Create the post
      await PostModel.create({
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        authorName: post.authorName,
        createdAt: new Date(post.createdAt),
        tags: post.tags,
        upvotes: post.upvotes,
        views: post.views,
        answers: post.answers.map(answer => ({
          content: answer.content,
          authorId: answer.authorId,
          authorName: answer.authorName,
          createdAt: new Date(answer.createdAt),
          upvotes: answer.upvotes
        }))
      });
    }
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export { connectToDatabase, seedDatabase, MONGODB_URI, isBrowser, isServer };
