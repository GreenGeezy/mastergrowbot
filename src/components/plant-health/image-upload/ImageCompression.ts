
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
  // Return the original file if it's already smaller than maxSizeMB
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size <= maxSizeBytes) {
    console.log('Image already smaller than target size, skipping compression');
    return file;
  }

  // Load the image into a canvas
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
            type: file.type,
            lastModified: file.lastModified
          }
        );
        
        console.log(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        resolve(compressedFile);
      },
      file.type,
      quality
    );
  });
};
