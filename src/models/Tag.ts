
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

export default mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
