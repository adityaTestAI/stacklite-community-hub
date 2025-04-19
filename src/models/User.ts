
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  notificationSettings: {
    emailNotifications: boolean;
    weeklyDigest: boolean;
    upvoteNotifications: boolean;
  };
  appearance: {
    darkMode: boolean;
    compactView: boolean;
    codeSyntaxHighlighting: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    displayName: {
      type: String,
      default: ""
    },
    photoURL: {
      type: String,
      default: ""
    },
    notificationSettings: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      weeklyDigest: {
        type: Boolean,
        default: true
      },
      upvoteNotifications: {
        type: Boolean,
        default: true
      }
    },
    appearance: {
      darkMode: {
        type: Boolean,
        default: false
      },
      compactView: {
        type: Boolean,
        default: false
      },
      codeSyntaxHighlighting: {
        type: Boolean,
        default: true
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
