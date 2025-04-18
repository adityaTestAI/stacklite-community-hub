
import mongoose from 'mongoose';

// Define the MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://stack-overflow:stack-overflow@stack-overflow.vbr5mww.mongodb.net/stack-overflow";

// Define the cached mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
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

export { connectToDatabase };
