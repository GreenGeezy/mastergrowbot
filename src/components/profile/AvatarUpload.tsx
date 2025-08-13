import React, { useState, useRef } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onAvatarUpdate: (url: string | null) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  userId,
  currentAvatarUrl,
  onAvatarUpdate,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Compress image if needed
      const compressedFile = await compressImage(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          avatar_url: publicUrl,
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        throw updateError;
      }

      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
      
      onAvatarUpdate(publicUrl);
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      
      // Revert preview on error
      setPreviewUrl(currentAvatarUrl || null);
      
      if (error.message?.includes('storage')) {
        toast.error('Failed to upload image. Please try again.');
      } else if (error.message?.includes('size')) {
        toast.error('Image too large. Please choose a smaller image.');
      } else {
        toast.error('Failed to update profile picture. Please try again.');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxSize = 800;
        let { width, height } = img;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);

    try {
      // Update user profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          avatar_url: null,
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        throw updateError;
      }

      setPreviewUrl(null);
      onAvatarUpdate(null);
      toast.success('Profile picture removed successfully!');
    } catch (error: any) {
      console.error('Avatar removal error:', error);
      toast.error('Failed to remove profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-gray-200">
                <AvatarImage src={previewUrl || undefined} alt="Profile picture" />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  <Camera className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              
              {/* Camera overlay */}
              <button
                onClick={triggerCameraInput}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 disabled:cursor-not-allowed"
                aria-label="Take photo with camera"
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-green-600" />
                )}
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-gray-600">Add Profile Picture for Personalized Touch</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={uploading}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {previewUrl ? 'Change' : 'Upload'}
        </Button>
        
        {previewUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Hidden file inputs */}
      {/* Gallery/Files input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        capture="environment" // iOS camera preference
      />
    </div>
  );
};

export default AvatarUpload;