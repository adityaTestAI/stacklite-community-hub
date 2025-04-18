
import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
  name: string;
  count: number;
}

const TagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  count: {
    type: Number,
    default: 1
  }
});

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

let TagModel;

if (isBrowser) {
  // In browser environment, create a mock model
  TagModel = {
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    findOneAndUpdate: () => Promise.resolve(null),
    findByIdAndDelete: () => Promise.resolve(null)
  };
} else {
  // In Node.js, use the actual Mongoose model
  try {
    // Check if the model already exists
    TagModel = mongoose.models.Tag;
  } catch (error) {
    // If model doesn't exist yet, create it
    TagModel = mongoose.model<ITag>("Tag", TagSchema);
  }
}

export default TagModel;
