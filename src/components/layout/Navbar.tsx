
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Home,
  Tag,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  Plus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { auth, signOut } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/auth/AuthModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  const handleAskQuestion = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to ask a question.",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      navigate("/posts/ask");
    }
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold flex items-center">
            StackLite
          </Link>
          
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4 ml-10">
              <Link to="/" className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/posts" className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary">
                <MessageSquare size={18} />
                <span>Posts</span>
              </Link>
              <Link to="/tags" className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary">
                <Tag size={18} />
                <span>Tags</span>
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <Button 
            variant="default" 
            onClick={handleAskQuestion}
            className="hidden md:flex items-center gap-1"
          >
            <Plus size={16} />
            Ask a Question
          </Button>
          
          {!isMobile ? (
            <>
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-0 w-10 h-10">
                      <Avatar>
                        <AvatarImage src={currentUser.photoURL || undefined} />
                        <AvatarFallback>
                          {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={confirmLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Login / Register</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <AuthModal onSuccess={() => setAuthOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-background border-b px-4 py-2 space-y-2"
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link 
            to="/posts" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MessageSquare size={18} />
            <span>Posts</span>
          </Link>
          <Link 
            to="/tags" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Tag size={18} />
            <span>Tags</span>
          </Link>
          
          <Button 
            variant="default" 
            onClick={handleAskQuestion}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Ask a Question
          </Button>
          
          {currentUser ? (
            <>
              <Link 
                to="/settings" 
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
              <Button 
                variant="ghost"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  confirmLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login / Register
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <AuthModal onSuccess={() => {
                  setAuthOpen(false);
                  setMobileMenuOpen(false);
                }} />
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
