
/**
 * Optimized utility for compressing images before upload to improve performance
 * Uses Web Workers to prevent UI blocking during compression
 */

// Create a worker instance
let worker: Worker | null = null;

// Initialize the worker
function getWorker(): Worker {
  if (!worker) {
    // Create the worker only once
    worker = new Worker(
      new URL('./compressionWorker.ts', import.meta.url),
      { type: 'module' }
    );
  }
  return worker;
}

/**
 * Compresses an image file to reduce its size before uploading
 * Using a Web Worker to avoid blocking the main thread
 * 
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
    let mimeType = getMimeType(file);
    
    // Skip compression for unsupported formats
    const compressibleTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!compressibleTypes.includes(mimeType)) {
      console.log(`Skipping compression for ${mimeType} - not a compressible format`);
      return file;
    }
    
    // Convert file to base64 for the worker
    const base64Data = await fileToBase64(file);
    
    // Process image in the worker
    return await compressWithWorker(base64Data, file, mimeType, maxSizeMB, quality);
  } catch (error) {
    console.error('Error during image compression:', error);
    // If compression fails, return the original file
    return file;
  }
};

/**
 * Gets the MIME type from a file, with fallback to extension-based detection
 */
function getMimeType(file: File): string {
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
  return mimeType;
}

/**
 * Converts a file to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(new Error(`Error reading file: ${e}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Uses the web worker to compress an image
 */
function compressWithWorker(
  base64Data: string,
  originalFile: File,
  mimeType: string,
  maxSizeMB: number,
  quality: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const worker = getWorker();
      
      // Set up worker message handler
      const messageHandler = (event: MessageEvent) => {
        const response = event.data;
        
        // Clean up event listener
        worker.removeEventListener('message', messageHandler);
        
        if (response.success) {
          // Convert base64 back to a file
          const base64Response = response.result;
          const byteCharacters = atob(base64Response.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          
          // Create a new file
          const compressedFile = new File(
            [blob],
            originalFile.name,
            {
              type: mimeType,
              lastModified: originalFile.lastModified
            }
          );
          
          console.log(`Image compressed from ${(originalFile.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
          resolve(compressedFile);
        } else {
          console.warn('Compression failed in worker:', response.error);
          resolve(originalFile); // Fallback to original
        }
      };
      
      // Add event listener for worker response
      worker.addEventListener('message', messageHandler);
      
      // Send the image data to the worker
      worker.postMessage({
        imageData: base64Data,
        maxSizeMB,
        quality,
        mimeType,
        fileName: originalFile.name
      });
    } catch (error) {
      console.error('Error in worker communication:', error);
      resolve(originalFile); // Fallback to original
    }
  });
}

/**
 * Cleanup function to terminate the worker when no longer needed
 * Call this when your component unmounts
 */
export const cleanupCompression = () => {
  if (worker) {
    worker.terminate();
    worker = null;
  }
};
