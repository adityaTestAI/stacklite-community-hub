
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload } from "lucide-react";

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

    try {
      setIsUploading(true);
      await onImageUpload(file);
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
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
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32 cursor-pointer hover:opacity-90 transition-opacity">
        <AvatarImage src={currentImage || undefined} />
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

        {currentImage && (
          <Button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            variant="destructive"
            className="flex items-center gap-2"
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
    </div>
  );
};

export default ImageUpload;
