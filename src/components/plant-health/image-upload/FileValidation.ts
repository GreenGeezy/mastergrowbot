
export function useFileValidation() {
  const validateFile = (file: File): boolean => {
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
        console.error('Invalid file type:', file.type, 'with extension:', extension);
        return false;
      }
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return false;
    }

    return true;
  };

  return { validateFile };
}
