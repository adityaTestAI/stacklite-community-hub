
import mongoose, { Document, Schema } from "mongoose";

export interface AnswerDocument extends Document {
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  upvotes: number;
}

export interface IPost extends Document {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  tags: string[];
  upvotes: number;
  views: number;
  answers: AnswerDocument[];
}

const AnswerSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  upvotes: {
    type: Number,
    default: 0
  }
});

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  answers: [AnswerSchema]
});

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

let PostModel;

if (isBrowser) {
  // In browser environment, create a mock model
  PostModel = {
    find: () => Promise.resolve([]),
    findById: () => Promise.resolve(null),
    findByIdAndUpdate: () => Promise.resolve(null),
    findByIdAndDelete: () => Promise.resolve(null),
    create: () => Promise.resolve({
      _id: 'mock-id',
      toObject: () => ({
        _id: 'mock-id',
        title: 'Mock Post',
        content: 'This is a mock post',
        authorId: 'mock-author',
        authorName: 'Mock User',
        createdAt: new Date(),
        tags: [],
        upvotes: 0,
        views: 0,
        answers: []
      })
    })
  };
} else {
  // In Node.js, use the actual Mongoose model
  try {
    // Check if the model already exists
    PostModel = mongoose.models.Post;
  } catch (error) {
    // If model doesn't exist yet, create it
    PostModel = mongoose.model<IPost>("Post", PostSchema);
  }
}

export default PostModel;
