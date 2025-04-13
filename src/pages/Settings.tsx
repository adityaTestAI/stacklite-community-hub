
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { auth, updateProfile } from "@/lib/firebase";

const Settings = () => {
  const { currentUser, loading } = useAuth();
  
  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-8 bg-secondary rounded w-1/3"></div>
          <div className="h-64 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to home
  if (!currentUser) {
    toast({
      title: "Authentication required",
      description: "You need to be logged in to access settings.",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return <SettingsContent />;
};

const SettingsContent = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.photoURL || "");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    
    try {
      setSaving(true);
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: avatarUrl
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile information.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, we would save this preference and update the theme
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    
    toast({
      title: `${darkMode ? "Light" : "Dark"} mode activated`,
      description: `Theme has been switched to ${darkMode ? "light" : "dark"} mode.`
    });
  };

  const handleToggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
    // In a real app, we would save this preference
    toast({
      title: "Notification settings saved",
      description: `Email notifications ${!emailNotifications ? "enabled" : "disabled"}.`
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your profile details and public information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback>
                      {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="avatar-url">Avatar URL</Label>
                    <Input
                      id="avatar-url"
                      value={avatarUrl || ""}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a URL for your profile picture
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={currentUser?.email || ""}
                    disabled
                    placeholder="your.email@example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about answers and comments on your posts.
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={handleToggleEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of popular questions in your topics.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Upvote Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone upvotes your post or answer.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how StackLite looks for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes.
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={handleToggleDarkMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Show more content with less spacing.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Code Syntax Highlighting</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable syntax highlighting in code blocks.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
