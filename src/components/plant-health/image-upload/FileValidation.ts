
export function useFileValidation() {
  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file type - expanded support for more image formats
    const validTypes = [
      'image/jpeg', 
      'image/jpg',
      'image/png', 
      'image/webp', 
      'image/heic', 
      'image/heif',
      'image/gif',
      'image/bmp',
      'image/tiff'
    ];
    
    // If file type is not directly recognized, check file extension as fallback
    if (!validTypes.includes(file.type)) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'gif', 'bmp', 'tiff'];
      
      if (!extension || !validExtensions.includes(extension)) {
        return { 
          valid: false, 
          message: `File type "${extension || 'unknown'}" is not supported. Please upload a JPG, PNG, or other common image format.` 
        };
      }
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return { 
        valid: false, 
        message: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 10MB.` 
      };
    }

    return { valid: true };
  };

  return { validateFile };
}
