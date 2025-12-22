import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




// utils/imageUrl.ts

/**
 * Convert relative image paths from backend to full URLs
 * @param imagePath - Relative image path from backend (e.g., "/image/filename.jpg")
 * @returns Full URL to the image
 */
export const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath || imagePath.trim() === "") {
    return "/placeholder.svg";
  }
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.10.7.102:5001';
  
  // Remove any leading slash from baseUrl and trailing slash from imagePath
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${cleanBaseUrl}${cleanImagePath}`;
};