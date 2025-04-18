
import { connectToDatabase } from '@/lib/mongodb';
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

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Get user by firebase UID
export async function getUserByUid(uid: string): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    // In browser, make API request
    if (isBrowser) {
      const response = await fetch(`/api/users/${uid}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const user = await response.json();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        notificationSettings: user.notificationSettings,
        appearance: user.appearance
      };
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
    return null;
  }
}

// Create or update user
export async function createOrUpdateUser(userData: Partial<UserType> & { uid: string }): Promise<UserType> {
  try {
    await connectToDatabase();
    
    if (isBrowser) {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const user = await response.json();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        notificationSettings: user.notificationSettings,
        appearance: user.appearance
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
    
    if (isBrowser) {
      const response = await fetch(`/api/users/${uid}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const user = await response.json();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        notificationSettings: user.notificationSettings,
        appearance: user.appearance
      };
    }
    
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
    return null;
  }
}

// Update notification settings
export async function updateNotificationSettings(uid: string, settings: Partial<UserType['notificationSettings']>): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    if (isBrowser) {
      const response = await fetch(`/api/users/${uid}/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const user = await response.json();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        notificationSettings: user.notificationSettings,
        appearance: user.appearance
      };
    }
    
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
    return null;
  }
}

// Update appearance settings
export async function updateAppearanceSettings(uid: string, settings: Partial<UserType['appearance']>): Promise<UserType | null> {
  try {
    await connectToDatabase();
    
    if (isBrowser) {
      const response = await fetch(`/api/users/${uid}/appearance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const user = await response.json();
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        notificationSettings: user.notificationSettings,
        appearance: user.appearance
      };
    }
    
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
    return null;
  }
}
