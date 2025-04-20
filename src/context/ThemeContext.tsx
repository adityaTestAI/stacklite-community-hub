
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUserByUid, updateAppearanceSettings } from "@/api/users";
import { useToast } from "@/hooks/use-toast";
import "../styles/theme-toggle.css";

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
    
    // Add the transition class before changing the theme
    root.classList.add("theme-transition");
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Remove the transition class after the transition completes
    setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 500);
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
