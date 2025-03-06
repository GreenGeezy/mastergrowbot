
// Web Worker for image compression
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

// Listen for messages from the main thread
self.addEventListener('message', async (event: MessageEvent<CompressionRequest>) => {
  try {
    const { imageData, maxSizeMB, quality, mimeType, fileName } = event.data;
    
    // Create an image from the data
    const image = await createImageFromDataUrl(imageData);
    
    // Compress the image
    const result = await compressImageInWorker(image, maxSizeMB, quality, mimeType);
    
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

// Helper function to create an image from a data URL
function createImageFromDataUrl(dataUrl: string): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = async () => {
      try {
        // Use createImageBitmap which is optimized for performance
        const bitmap = await self.createImageBitmap(image);
        resolve(bitmap);
      } catch (error) {
        reject(error);
      }
      // Clean up by revoking the object URL
      URL.revokeObjectURL(image.src);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(image.src);
      reject(error);
    };
    image.src = dataUrl;
  });
}

// Calculate the size of a base64 data URL in bytes
function calculateSizeFromDataUrl(dataUrl: string): number {
  // Remove the data:image/xxx;base64, part
  const base64 = dataUrl.split(',')[1];
  // Calculate size: Base64 encodes 3 bytes in 4 chars
  return Math.ceil(base64.length * 0.75);
}

// Compress image using canvas
async function compressImageInWorker(
  image: ImageBitmap,
  maxSizeMB: number,
  quality: number,
  mimeType: string
): Promise<string> {
  // Maximum dimension for any side
  const MAX_DIMENSION = 1600;
  
  // Create a canvas to draw the image
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Resize the image if needed
  let { width, height } = image;
  
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
