
import { connectToDatabase, isBrowser } from '@/lib/mongodb';
import UserModel from '@/models/User';
import { User as UserType } from '@/types';

// Fallback data for browser environment
const mockUser: UserType = {
  uid: "sample-uid",
  email: "sample@example.com",
  displayName: "Sample User",
  photoURL: "",
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
};

// Get user by firebase UID
export async function getUserByUid(uid: string): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    // In browser, return mock data
    if (isBrowser) {
      console.log(`Browser environment detected, returning mock user data for ${uid}`);
      return mockUser;
    }
    
    const user = await UserModel.findOne({ uid }).exec();
    
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      notificationSettings: user.notificationSettings,
      appearance: user.appearance
    };
  } catch (error) {
    console.error(`Error fetching user ${uid}:`, error);
    throw error;
  }
}

// Create or update user
export async function createOrUpdateUser(userData: Partial<UserType> & { uid: string }): Promise<UserType> {
  try {
    await connectToDatabase();
    
    // In browser, return mock data
    if (isBrowser) {
      console.log(`Browser environment detected, returning mock user data for create/update ${userData.uid}`);
      return {
        ...mockUser,
        ...userData
      };
    }
    
    const { uid, ...restData } = userData;
    
    const user = await UserModel.findOneAndUpdate(
      { uid },
      { 
        ...restData,
        updatedAt: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      notificationSettings: user.notificationSettings,
      appearance: user.appearance
    };
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(uid: string, profileData: { displayName?: string; photoURL?: string }): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    const user = await UserModel.findOneAndUpdate(
      { uid },
      { 
        ...profileData,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      notificationSettings: user.notificationSettings,
      appearance: user.appearance
    };
  } catch (error) {
    console.error(`Error updating user profile ${uid}:`, error);
    throw error;
  }
}

// Update notification settings
export async function updateNotificationSettings(uid: string, settings: Partial<UserType['notificationSettings']>): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    const user = await UserModel.findOneAndUpdate(
      { uid },
      { 
        $set: Object.entries(settings).reduce((acc, [key, value]) => {
          acc[`notificationSettings.${key}`] = value;
          return acc;
        }, {} as Record<string, any>),
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      notificationSettings: user.notificationSettings,
      appearance: user.appearance
    };
  } catch (error) {
    console.error(`Error updating notification settings for user ${uid}:`, error);
    throw error;
  }
}

// Update appearance settings
export async function updateAppearanceSettings(uid: string, settings: Partial<UserType['appearance']>): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    const user = await UserModel.findOneAndUpdate(
      { uid },
      { 
        $set: Object.entries(settings).reduce((acc, [key, value]) => {
          acc[`appearance.${key}`] = value;
          return acc;
        }, {} as Record<string, any>),
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      notificationSettings: user.notificationSettings,
      appearance: user.appearance
    };
  } catch (error) {
    console.error(`Error updating appearance settings for user ${uid}:`, error);
    throw error;
  }
}
