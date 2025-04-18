
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "@/lib/firebase";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { createOrUpdateUser } from "@/api/users";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userObject = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        };
        
        setCurrentUser(userObject);
        
        // Create or update user in database
        try {
          await createOrUpdateUser({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || ''
          });
        } catch (error) {
          console.error("Error updating user in database:", error);
          toast({
            title: "Error",
            description: "Failed to update user profile. Some features may be limited.",
            variant: "destructive",
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [toast]);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
