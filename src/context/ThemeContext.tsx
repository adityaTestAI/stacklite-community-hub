
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUserByUid, updateAppearanceSettings } from "@/api/users";
import { useToast } from "@/hooks/use-toast";

type ThemeType = "dark" | "light" | "system";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  loading: true
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>("dark");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Load theme from database when user changes
  useEffect(() => {
    const loadUserTheme = async () => {
      if (currentUser?.uid) {
        try {
          setLoading(true);
          const userData = await getUserByUid(currentUser.uid);
          
          if (userData?.appearance) {
            // Set theme based on user's saved preference
            const newTheme: ThemeType = userData.appearance.darkMode ? "dark" : "light";
            setThemeState(newTheme);
            applyThemeToDOM(newTheme);
          } else {
            // Default to dark theme for new users
            setThemeState("dark");
            applyThemeToDOM("dark");
          }
        } catch (error) {
          console.error("Error loading user theme:", error);
          // Default to dark theme if there's an error
          setThemeState("dark");
          applyThemeToDOM("dark");
        } finally {
          setLoading(false);
        }
      } else {
        // Default to dark theme for non-logged in users
        setThemeState("dark");
        applyThemeToDOM("dark");
        setLoading(false);
      }
    };

    loadUserTheme();
  }, [currentUser]);

  const applyThemeToDOM = (newTheme: ThemeType) => {
    const root = document.documentElement;
    
    if (newTheme === "dark") {
      root.classList.add("theme-transition");
      root.classList.add("dark");
      
      setTimeout(() => {
        root.classList.remove("theme-transition");
      }, 500);
    } else {
      root.classList.add("theme-transition");
      root.classList.remove("dark");
      
      setTimeout(() => {
        root.classList.remove("theme-transition");
      }, 500);
    }

    // Add transition styles in javascript to avoid them being always applied
    const style = document.createElement('style');
    style.id = 'theme-transition-style';
    style.textContent = `
      .theme-transition * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
      }
    `;
    
    const existingStyle = document.getElementById('theme-transition-style');
    if (!existingStyle) {
      document.head.appendChild(style);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    
    // Update user preference in database if logged in
    if (currentUser?.uid) {
      try {
        await updateAppearanceSettings(currentUser.uid, {
          darkMode: newTheme === "dark"
        });
      } catch (error) {
        console.error("Error saving theme preference:", error);
        toast({
          title: "Error saving theme",
          description: "Your theme preference couldn't be saved.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleTheme = () => {
    const newTheme: ThemeType = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
