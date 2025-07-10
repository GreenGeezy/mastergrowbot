
// Optimized Web Worker for image compression
// This runs in a separate thread to prevent UI blocking

// Define the message interface
interface CompressionRequest {
  imageData: string;  // Base64 encoded image
  maxSizeMB: number;
  quality: number;
  mimeType: string;
  fileName: string;
}

interface CompressionResponse {
  success: boolean;
  result?: string;  // Base64 encoded compressed image
  error?: string;
  fileName: string;
  size?: number;
  mimeType?: string;
}

// Cache for already processed images
const processedImagesCache = new Map<string, string>();

// Listen for messages from the main thread
self.addEventListener('message', async (event: MessageEvent<CompressionRequest>) => {
  try {
    const { imageData, maxSizeMB, quality, mimeType, fileName } = event.data;
    
    // Generate cache key based on image data and compression settings
    const cacheKey = getCacheKey(imageData, maxSizeMB, quality);
    
    // Check if we've already processed this exact image with these settings
    if (processedImagesCache.has(cacheKey)) {
      self.postMessage({
        success: true,
        result: processedImagesCache.get(cacheKey),
        fileName,
        mimeType,
        size: calculateSizeFromDataUrl(processedImagesCache.get(cacheKey) || '')
      } as CompressionResponse);
      return;
    }
    
    // Create an image from the data
    const image = await createImageFromDataUrl(imageData);
    
    // Quick check if compression needed based on dimensions
    const skipFullCompression = image.width < 800 && image.height < 800;
    
    // Use simplified compression for small images
    const result = skipFullCompression 
      ? await quickCompressImage(image, quality, mimeType)
      : await optimizedCompressImage(image, maxSizeMB, quality, mimeType);
    
    // Cache the result
    processedImagesCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory issues
    if (processedImagesCache.size > 20) {
      const oldestKey = processedImagesCache.keys().next().value;
      processedImagesCache.delete(oldestKey);
    }
    
    // Send the compressed image back to the main thread
    self.postMessage({
      success: true,
      result,
      fileName,
      mimeType,
      size: calculateSizeFromDataUrl(result)
    } as CompressionResponse);
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      success: false,
      fileName: event.data.fileName,
      error: error instanceof Error ? error.message : 'Unknown compression error'
    } as CompressionResponse);
  }
});

// Generate cache key based on image and compression settings
function getCacheKey(imageData: string, maxSizeMB: number, quality: number): string {
  // Use a hash of the first 100 chars (header info) and last 100 chars + settings
  const dataSubstring = imageData.substring(0, 100) + imageData.substring(imageData.length - 100);
  return `${dataSubstring.length}_${maxSizeMB}_${quality}`;
}

// Helper function to create an image from a data URL
function createImageFromDataUrl(dataUrl: string): Promise<ImageBitmap> {
  return new Promise(async (resolve, reject) => {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Use createImageBitmap directly with the blob
      const bitmap = await self.createImageBitmap(blob);
      resolve(bitmap);
    } catch (error) {
      reject(error);
    }
  });
}

// Quick simple compression for small images
async function quickCompressImage(
  image: ImageBitmap,
  quality: number,
  mimeType: string
): Promise<string> {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Draw image with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, image.width, image.height);
  ctx.drawImage(image, 0, 0);
  
  // Get blob with quality parameter
  const blob = await canvas.convertToBlob({
    type: mimeType,
    quality
  });
  
  // Convert blob to base64
  return blobToBase64(blob);
}

// More advanced compression with resizing for larger images
async function optimizedCompressImage(
  image: ImageBitmap,
  maxSizeMB: number,
  quality: number,
  mimeType: string
): Promise<string> {
  // Maximum dimension for any side (adaptive based on image size)
  const MAX_DIMENSION = image.width > 3000 || image.height > 3000 ? 1200 : 1600;
  
  // Create a canvas to draw the image
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Resize the image if needed
  let width = image.width;
  let height = image.height;
  
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }
    
    // Resize the canvas
    canvas.width = width;
    canvas.height = height;
  } else {
    canvas.width = width;
    canvas.height = height;
  }
  
  // Draw a white background first (for images with transparency)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  
  // Draw the image
  ctx.drawImage(image, 0, 0, width, height);
  
  // Get blob with quality parameter
  const blob = await canvas.convertToBlob({
    type: mimeType,
    quality
  });
  
  // Convert blob to base64
  return blobToBase64(blob);
}

// Calculate the size of a base64 data URL in bytes
function calculateSizeFromDataUrl(dataUrl: string): number {
  // Remove the data:image/xxx;base64, part
  const base64 = dataUrl.split(',')[1];
  if (!base64) return 0;
  // Calculate size: Base64 encodes 3 bytes in 4 chars
  return Math.ceil(base64.length * 0.75);
}

// Convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Make TypeScript happy with web worker context
export {};
