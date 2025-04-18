
import React, { useState, useEffect } from "react";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  getUserByUid, 
  updateUserProfile, 
  updateNotificationSettings, 
  updateAppearanceSettings, 
  createOrUpdateUser 
} from "@/api/users";
import { LoaderCircle } from "lucide-react";

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
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [upvoteNotifications, setUpvoteNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [codeSyntaxHighlighting, setCodeSyntaxHighlighting] = useState(true);

  // Fetch user data from API
  const { data: userData, isLoading: isLoadingUser, isError } = useQuery({
    queryKey: ['user', currentUser?.uid],
    queryFn: () => getUserByUid(currentUser?.uid || ''),
    enabled: !!currentUser?.uid,
    meta: {
      onSuccess: (data) => {
        if (!data) {
          // Create user if not exists
          if (currentUser) {
            createUserMutation.mutate({
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || ''
            });
          }
          return;
        }
        
        // Set form values from fetched user data
        setDisplayName(data.displayName || '');
        setAvatarUrl(data.photoURL || '');
        
        // Set notification settings
        if (data.notificationSettings) {
          setEmailNotifications(data.notificationSettings.emailNotifications);
          setWeeklyDigest(data.notificationSettings.weeklyDigest);
          setUpvoteNotifications(data.notificationSettings.upvoteNotifications);
        }
        
        // Set appearance settings
        if (data.appearance) {
          setDarkMode(data.appearance.darkMode);
          setCompactView(data.appearance.compactView);
          setCodeSyntaxHighlighting(data.appearance.codeSyntaxHighlighting);
          
          // Apply dark mode if set
          if (data.appearance.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    }
  });

  // Use useEffect to handle the success case since we can't use onSuccess directly
  useEffect(() => {
    if (userData) {
      // Set form values from fetched user data
      setDisplayName(userData.displayName || '');
      setAvatarUrl(userData.photoURL || '');
      
      // Set notification settings
      if (userData.notificationSettings) {
        setEmailNotifications(userData.notificationSettings.emailNotifications);
        setWeeklyDigest(userData.notificationSettings.weeklyDigest);
        setUpvoteNotifications(userData.notificationSettings.upvoteNotifications);
      }
      
      // Set appearance settings
      if (userData.appearance) {
        setDarkMode(userData.appearance.darkMode);
        setCompactView(userData.appearance.compactView);
        setCodeSyntaxHighlighting(userData.appearance.codeSyntaxHighlighting);
        
        // Apply dark mode if set
        if (userData.appearance.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } else if (currentUser && !isLoadingUser) {
      // Create user if not exists and query has completed but no data returned
      createUserMutation.mutate({
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
        photoURL: currentUser.photoURL || ''
      });
    }
  }, [userData, currentUser, isLoadingUser]);

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createOrUpdateUser,
    onSuccess: () => {
      toast({
        title: "Profile created",
        description: "Your profile has been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating profile",
        description: error.message || "Failed to create profile.",
        variant: "destructive"
      });
    }
  });

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: (data: { displayName: string; photoURL: string }) => 
      updateUserProfile(currentUser?.uid || '', data),
    onSuccess: () => {
      // Also update Firebase profile
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName,
          photoURL: avatarUrl
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile information.",
        variant: "destructive"
      });
    }
  });

  // Notification settings mutation
  const notificationMutation = useMutation({
    mutationFn: (settings: Partial<{ emailNotifications: boolean; weeklyDigest: boolean; upvoteNotifications: boolean }>) => 
      updateNotificationSettings(currentUser?.uid || '', settings),
    onSuccess: () => {
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update notification settings.",
        variant: "destructive"
      });
    }
  });

  // Appearance settings mutation
  const appearanceMutation = useMutation({
    mutationFn: (settings: Partial<{ darkMode: boolean; compactView: boolean; codeSyntaxHighlighting: boolean }>) => 
      updateAppearanceSettings(currentUser?.uid || '', settings),
    onSuccess: () => {
      toast({
        title: "Appearance settings saved",
        description: "Your appearance preferences have been updated."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update appearance settings.",
        variant: "destructive"
      });
    }
  });

  const handleUpdateProfile = () => {
    profileMutation.mutate({ 
      displayName, 
      photoURL: avatarUrl 
    });
  };

  const handleToggleEmailNotifications = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    notificationMutation.mutate({ emailNotifications: newValue });
  };

  const handleToggleWeeklyDigest = () => {
    const newValue = !weeklyDigest;
    setWeeklyDigest(newValue);
    notificationMutation.mutate({ weeklyDigest: newValue });
  };

  const handleToggleUpvoteNotifications = () => {
    const newValue = !upvoteNotifications;
    setUpvoteNotifications(newValue);
    notificationMutation.mutate({ upvoteNotifications: newValue });
  };

  const handleToggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    
    // Update document class
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    appearanceMutation.mutate({ darkMode: newValue });
    
    toast({
      title: `${newValue ? "Dark" : "Light"} mode activated`,
      description: `Theme has been switched to ${newValue ? "dark" : "light"} mode.`
    });
  };

  const handleToggleCompactView = () => {
    const newValue = !compactView;
    setCompactView(newValue);
    appearanceMutation.mutate({ compactView: newValue });
  };

  const handleToggleCodeSyntaxHighlighting = () => {
    const newValue = !codeSyntaxHighlighting;
    setCodeSyntaxHighlighting(newValue);
    appearanceMutation.mutate({ codeSyntaxHighlighting: newValue });
  };

  if (isLoadingUser) {
    return (
      <div className="container mx-auto py-6 px-4 flex justify-center items-center min-h-[50vh]">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Settings</CardTitle>
              <CardDescription>
                There was a problem loading your settings. Please try again later.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

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
                  disabled={profileMutation.isPending}
                >
                  {profileMutation.isPending ? "Saving..." : "Save Changes"}
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
                    disabled={notificationMutation.isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of popular questions in your topics.
                    </p>
                  </div>
                  <Switch 
                    checked={weeklyDigest} 
                    onCheckedChange={handleToggleWeeklyDigest}
                    disabled={notificationMutation.isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Upvote Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone upvotes your post or answer.
                    </p>
                  </div>
                  <Switch 
                    checked={upvoteNotifications} 
                    onCheckedChange={handleToggleUpvoteNotifications}
                    disabled={notificationMutation.isPending}
                  />
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
                    disabled={appearanceMutation.isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Show more content with less spacing.
                    </p>
                  </div>
                  <Switch 
                    checked={compactView}
                    onCheckedChange={handleToggleCompactView}
                    disabled={appearanceMutation.isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Code Syntax Highlighting</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable syntax highlighting in code blocks.
                    </p>
                  </div>
                  <Switch 
                    checked={codeSyntaxHighlighting}
                    onCheckedChange={handleToggleCodeSyntaxHighlighting}
                    disabled={appearanceMutation.isPending}
                  />
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
