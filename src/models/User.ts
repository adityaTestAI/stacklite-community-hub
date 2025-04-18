
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

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

let UserModel;

if (isBrowser) {
  // In browser environment, create a mock model
  UserModel = {
    findOne: () => Promise.resolve(null),
    findOneAndUpdate: () => Promise.resolve({
      uid: 'mock-uid',
      email: 'mock@example.com',
      displayName: 'Mock User',
      photoURL: '',
      notificationSettings: {
        emailNotifications: true,
        weeklyDigest: true,
        upvoteNotifications: true
      },
      appearance: {
        darkMode: false,
        compactView: false,
        codeSyntaxHighlighting: true
      }
    }),
    create: () => Promise.resolve({
      _id: 'mock-id',
      uid: 'mock-uid',
      email: 'mock@example.com',
      displayName: 'Mock User',
      photoURL: '',
      notificationSettings: {
        emailNotifications: true,
        weeklyDigest: true,
        upvoteNotifications: true
      },
      appearance: {
        darkMode: false,
        compactView: false,
        codeSyntaxHighlighting: true
      }
    })
  };
} else {
  // In Node.js, use the actual Mongoose model
  try {
    // Check if the model already exists
    UserModel = mongoose.models.User;
  } catch (error) {
    // If model doesn't exist yet, create it
    UserModel = mongoose.model<IUser>("User", UserSchema);
  }
}

export default UserModel;
