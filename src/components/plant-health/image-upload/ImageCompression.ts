
/**
 * Utility for compressing images before upload to improve performance
 */

/**
 * Compresses an image file to reduce its size before uploading
 * @param file The original image file to compress
 * @param maxSizeMB Maximum size in MB (default: 1MB)
 * @param quality Compression quality (0-1, default: 0.7)
 * @returns A promise that resolves to the compressed file
 */
export const compressImage = async (
  file: File, 
  maxSizeMB: number = 1, 
  quality: number = 0.7
): Promise<File> => {
  try {
    // Return the original file if it's already smaller than maxSizeMB
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size <= maxSizeBytes) {
      console.log('Image already smaller than target size, skipping compression');
      return file;
    }

    // Try to determine the correct mime type
    let mimeType = file.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      // Try to guess the mime type from extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'jpg' || extension === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (extension === 'png') {
        mimeType = 'image/png';
      } else if (extension === 'webp') {
        mimeType = 'image/webp';
      } else if (extension === 'gif') {
        mimeType = 'image/gif';
      } else if (extension === 'bmp') {
        mimeType = 'image/bmp';
      } else if (extension === 'tiff' || extension === 'tif') {
        mimeType = 'image/tiff';
      } else {
        // Default to jpeg if we can't determine
        mimeType = 'image/jpeg';
      }
    }
    
    // Load the image into a canvas
    try {
      const image = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      
      // Maintain aspect ratio while reducing dimensions if needed
      let { width, height } = image;
      const MAX_DIMENSION = 1600; // Maximum dimension for any side
      
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress the image
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get 2D context for canvas');
        return file;
      }
      
      // Use white background for images with transparency
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      ctx.drawImage(image, 0, 0, width, height);
      
      // Convert to blob with quality parameter
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('Canvas toBlob operation failed');
              reject(new Error('Image compression failed'));
              return;
            }
            
            // Create a new file from the blob
            const compressedFile = new File(
              [blob], 
              file.name, 
              {
                type: mimeType,
                lastModified: file.lastModified
              }
            );
            
            console.log(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      });
    } catch (imageError) {
      console.error('Error processing image with createImageBitmap:', imageError);
      return file; // Return original if we can't process it
    }
  } catch (error) {
    console.error('Error during image compression:', error);
    // If compression fails, return the original file
    return file;
  }
};
