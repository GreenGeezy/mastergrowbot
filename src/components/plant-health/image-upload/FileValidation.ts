
/**
 * Enhanced file validation utility
 */

export function useFileValidation() {
  // Supported image formats for the application
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
  
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'gif', 'bmp', 'tiff'];
  
  // Maximum file size allowed (10MB)
  const maxSize = 10 * 1024 * 1024;

  /**
   * Validates a file based on type and size
   * @param file The file to validate
   * @returns Validation result with status and message
   */
  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file type
    if (!isValidFileType(file)) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      return { 
        valid: false, 
        message: `File type "${extension}" is not supported. Please upload a JPG, PNG, or other common image format.` 
      };
    }

    // Check file size
    if (!isValidFileSize(file)) {
      return { 
        valid: false, 
        message: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 10MB.` 
      };
    }

    return { valid: true };
  };

  /**
   * Checks if the file type is valid
   */
  const isValidFileType = (file: File): boolean => {
    // First check MIME type
    if (validTypes.includes(file.type)) {
      return true;
    }
    
    // If MIME type check fails, check extension as fallback
    const extension = file.name.split('.').pop()?.toLowerCase();
    return !!extension && validExtensions.includes(extension);
  };

  /**
   * Checks if the file size is valid
   */
  const isValidFileSize = (file: File): boolean => {
    return file.size <= maxSize;
  };

  /**
   * Gets a list of all supported file extensions
   */
  const getSupportedFormats = (): string[] => {
    return validExtensions;
  };

  return { 
    validateFile,
    isValidFileType,
    isValidFileSize,
    getSupportedFormats
  };
}
