
import mongoose from 'mongoose';

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

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

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export { connectToDatabase, MONGODB_URI, isBrowser };
