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
import { useTheme } from "@/context/ThemeContext";
import { auth, updateProfile } from "@/lib/firebase";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  getUserByUid, 
  updateUserProfile, 
  updateNotificationSettings, 
  updateAppearanceSettings, 
  createOrUpdateUser, 
  updateUserProfileWithImage,
  deleteUserProfileImage
} from "@/api/users";
import { LoaderCircle } from "lucide-react";
import ImageUpload from "@/components/profile/ImageUpload";

const Settings = () => {
  const { currentUser, loading } = useAuth();
  
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
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [upvoteNotifications, setUpvoteNotifications] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [codeSyntaxHighlighting, setCodeSyntaxHighlighting] = useState(true);

  const { data: userData, isLoading: isLoadingUser, isError } = useQuery({
    queryKey: ['user', currentUser?.uid],
    queryFn: () => getUserByUid(currentUser?.uid || ''),
    enabled: !!currentUser?.uid,
  });

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '');
      setAvatarUrl(userData.photoURL || '');
      
      if (userData.notificationSettings) {
        setEmailNotifications(userData.notificationSettings.emailNotifications);
        setWeeklyDigest(userData.notificationSettings.weeklyDigest);
        setUpvoteNotifications(userData.notificationSettings.upvoteNotifications);
      }
      
      if (userData.appearance) {
        setCompactView(userData.appearance.compactView);
        setCodeSyntaxHighlighting(userData.appearance.codeSyntaxHighlighting);
      }
    } else if (currentUser && !isLoadingUser) {
      createUserMutation.mutate({
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
        photoURL: currentUser.photoURL || ''
      });
    }
  }, [userData, currentUser, isLoadingUser]);

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

  const profileMutation = useMutation({
    mutationFn: (data: { displayName: string; photoURL: string }) => 
      updateUserProfile(currentUser?.uid || '', data),
    onSuccess: () => {
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

  const handleImageUpload = async (file: File) => {
    if (!currentUser?.uid) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    const updatedUser = await updateUserProfileWithImage(currentUser.uid, formData);
    if (updatedUser) {
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          photoURL: updatedUser.photoURL
        });
      }
    }
  };

  const handleImageDelete = async () => {
    if (!currentUser?.uid) return;
    
    const updatedUser = await deleteUserProfileImage(currentUser.uid);
    if (updatedUser) {
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          photoURL: null
        });
      }
    }
  };

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
    const newValue = theme === "dark" ? "light" : "dark";
    setTheme(newValue);
    
    toast({
      title: `${newValue === "dark" ? "Dark" : "Light"} mode activated`,
      description: `Theme has been switched to ${newValue === "dark" ? "dark" : "light"} mode.`
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
                <ImageUpload
                  currentImage={avatarUrl}
                  displayName={displayName}
                  onImageUpload={handleImageUpload}
                  onImageDelete={handleImageDelete}
                />
                
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
                    checked={theme === "dark"}
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
