
// User types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  notificationSettings?: {
    emailNotifications: boolean;
    weeklyDigest: boolean;
    upvoteNotifications: boolean;
  };
  appearance?: {
    darkMode: boolean;
    compactView: boolean;
    codeSyntaxHighlighting: boolean;
  };
}

// Post types
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  tags: string[];
  upvotes: number;
  views: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  upvotes: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

// Authentication state context
export interface AuthState {
  currentUser: User | null;
  loading: boolean;
}
