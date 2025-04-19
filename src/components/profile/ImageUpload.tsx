
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface ImageUploadProps {
  currentImage: string | null;
  displayName: string;
  onImageUpload: (file: File) => Promise<void>;
  onImageDelete: () => Promise<void>;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  displayName,
  onImageUpload,
  onImageDelete,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  React.useEffect(() => {
    setImagePreview(currentImage);
  }, [currentImage]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      await onImageUpload(file);
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      setImagePreview(currentImage);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      setIsDeleting(true);
      await onImageDelete();
      setImagePreview(null);
      toast({
        title: "Success",
        description: "Profile image removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32 cursor-pointer hover:opacity-90 transition-opacity relative" onClick={() => fileInputRef.current?.click()}>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-full z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <AvatarImage src={imagePreview || undefined} alt={displayName} />
        <AvatarFallback className="text-2xl">
          {displayName?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>

        {imagePreview && (
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            disabled={isDeleting}
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Removing..." : "Remove"}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground">
        Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
      </p>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Profile Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove your profile image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUpload;
