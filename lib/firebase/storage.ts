/**
 * Storage utilities WITHOUT Firebase Storage
 * 
 * Since Firebase Storage requires a paid plan, this file provides alternatives:
 * 1. Convert images to base64 strings (stored directly in Firestore)
 * 2. Support external URLs (imgur, cloudinary, etc.)
 * 
 * Note: Base64 images are stored in Firestore with a 1MB document limit.
 * For larger images, consider using free external services like:
 * - Imgur API (free, no account needed)
 * - Cloudinary (free tier)
 * - imgbb (free)
 */

/**
 * Convert File to base64 string
 */
export const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Compress and convert image to base64 (optimized for Firestore)
 * @param file - Image file to compress
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - JPEG quality (0-1)
 */
export const compressImageToBase64 = async (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 JPEG
        const base64 = canvas.toDataURL('image/jpeg', quality);
        
        // Check size (Firestore has 1MB document limit)
        const sizeInBytes = Math.ceil((base64.length * 3) / 4);
        const sizeInKB = sizeInBytes / 1024;
        
        console.log(`Compressed image size: ${sizeInKB.toFixed(2)}KB`);
        
        if (sizeInKB > 900) {
          console.warn('Image is close to Firestore limit (1MB). Consider reducing quality or size.');
        }
        
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

/**
 * Upload component preview image (converts to base64)
 * Kept same signature as Firebase Storage version for compatibility
 */
export const uploadComponentPreview = async (
  file: File,
  componentId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (onProgress) onProgress(10);
  
  // Compress image to reduce Firestore storage (~600-800KB)
  const base64 = await compressImageToBase64(file, 1200, 900, 0.85);
  
  if (onProgress) onProgress(100);
  
  return base64;
};

/**
 * Upload component thumbnail (converts to base64, smaller size)
 */
export const uploadComponentThumbnail = async (
  file: File,
  componentId: string
): Promise<string> => {
  // Much smaller size for thumbnails (~50-100KB)
  return compressImageToBase64(file, 400, 300, 0.75);
};

/**
 * Upload user avatar (converts to base64)
 */
export const uploadUserAvatar = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (onProgress) onProgress(10);
  
  // Small size for avatars (~20-50KB)
  const base64 = await compressImageToBase64(file, 200, 200, 0.8);
  
  if (onProgress) onProgress(100);
  
  return base64;
};

/**
 * Upload collection cover image (converts to base64)
 */
export const uploadCollectionCover = async (
  file: File,
  collectionId: string
): Promise<string> => {
  // Medium size for collection covers (~400-600KB)
  return compressImageToBase64(file, 1000, 600, 0.85);
};

/**
 * Delete a file (no-op for base64, kept for API compatibility)
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  // No deletion needed for base64 strings
  // They're deleted automatically when the Firestore document is deleted
  return Promise.resolve();
};

/**
 * Delete component images (no-op for base64, kept for API compatibility)
 */
export const deleteComponentImages = async (
  previewUrl: string,
  thumbnailUrl?: string
): Promise<void> => {
  // No deletion needed for base64 strings
  return Promise.resolve();
};

/**
 * Validate if a string is a valid base64 image
 */
export const isBase64Image = (str: string): boolean => {
  return str.startsWith('data:image/');
};

/**
 * Validate if a string is a valid external URL
 */
export const isExternalUrl = (str: string): boolean => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Get image size from base64 string
 */
export const getBase64Size = (base64: string): number => {
  const sizeInBytes = Math.ceil((base64.length * 3) / 4);
  return sizeInBytes / 1024; // Return size in KB
};

/**
 * OPTIONAL: Upload to Imgur (free, no account needed)
 * Uncomment and use if you want to use external storage instead of base64
 */
/*
export const uploadToImgur = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      Authorization: 'Client-ID YOUR_IMGUR_CLIENT_ID', // Get free client ID from imgur.com/oauth2/addclient
    },
    body: formData,
  });
  
  const data = await response.json();
  
  if (data.success) {
    return data.data.link;
  } else {
    throw new Error('Failed to upload to Imgur');
  }
};
*/