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

// Handle browser environment differently
let PostModel;

  // In Node.js, use the actual Mongoose model
  try {
    // Check if the model already exists
    PostModel = mongoose.models.Post;
  } catch (error) {
    // If model doesn't exist yet, create it
    PostModel = mongoose.model<IPost>("Post", PostSchema);
  }

export default PostModel;
