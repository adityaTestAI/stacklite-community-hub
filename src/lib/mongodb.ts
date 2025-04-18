
import mongoose from 'mongoose';

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Is this running on the server?
const isServer = !isBrowser && process.env.NODE_ENV !== 'test';

// Safely access environment variables in browser or Node.js context
const MONGODB_URI = typeof process !== 'undefined' && process.env.MONGODB_URI 
  ? process.env.MONGODB_URI 
  : "mongodb+srv://stack-overflow:stack-overflow@stack-overflow.vbr5mww.mongodb.net/stack-overflow";

// Define the cached mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // In browser environment, we won't actually connect
  if (isBrowser) {
    console.log("Running in browser environment, not connecting to MongoDB");
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

export { connectToDatabase, MONGODB_URI, isBrowser, isServer };
