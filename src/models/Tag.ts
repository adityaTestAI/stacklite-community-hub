
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

// Use the same defensive pattern as in Post model
let TagModel: mongoose.Model<ITag>;

try {
  // Check if the model already exists
  TagModel = mongoose.models.Tag as mongoose.Model<ITag>;
} catch (error) {
  // If model doesn't exist yet, create it
  TagModel = mongoose.model<ITag>("Tag", TagSchema);
}

export default TagModel;
