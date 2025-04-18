
import { User as UserType } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api';

// Get user by firebase UID
export async function getUserByUid(uid: string): Promise<UserType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}`);
    
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
  } catch (error) {
    console.error(`Error fetching user ${uid}:`, error);
    return null;
  }
}

// Create or update user
export async function createOrUpdateUser(userData: Partial<UserType> & { uid: string }): Promise<UserType> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
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
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(uid: string, profileData: { displayName?: string; photoURL?: string }): Promise<UserType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}/profile`, {
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
  } catch (error) {
    console.error(`Error updating user profile ${uid}:`, error);
    return null;
  }
}

// Update notification settings
export async function updateNotificationSettings(uid: string, settings: Partial<UserType['notificationSettings']>): Promise<UserType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}/notifications`, {
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
  } catch (error) {
    console.error(`Error updating notification settings for user ${uid}:`, error);
    return null;
  }
}

// Update appearance settings
export async function updateAppearanceSettings(uid: string, settings: Partial<UserType['appearance']>): Promise<UserType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}/appearance`, {
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
  } catch (error) {
    console.error(`Error updating appearance settings for user ${uid}:`, error);
    return null;
  }
}
