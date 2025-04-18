
import mongoose, { Document, Schema } from "mongoose";
import { createBrowserMock, isBrowser } from "../lib/mongodb";

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

// Handle browser environment differently
let TagModel;

if (isBrowser) {
  // In browser, provide a mock implementation
  TagModel = createBrowserMock();
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
