// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// // utils/imageUrl.ts

// /**
//  * Convert relative image paths from backend to full URLs
//  * @param imagePath - Relative image path from backend (e.g., "/image/filename.jpg")
//  * @returns Full URL to the image
//  */
// export const getFullImageUrl = (imagePath: string): string => {
//   if (!imagePath || imagePath.trim() === "") {
//     return "/placeholder.svg";
//   }
  
//   // If it's already a full URL, return as-is
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
  
//   // Get base URL from environment variable
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.10.7.102:5001';
  
//   // Remove any leading slash from baseUrl and trailing slash from imagePath
//   const cleanBaseUrl = baseUrl.replace(/\/$/, '');
//   const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
//   return `${cleanBaseUrl}${cleanImagePath}`;
// };




// utils/imageUrl.ts

export const getFullImageUrl = (imagePath?: string): string => {
  if (!imagePath || imagePath.trim() === "") {
    return "/placeholder.svg";
  }

  // Already absolute URL
  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://10.10.7.102:5001";

  // Ensure single leading slash
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${baseUrl}${normalizedPath}`;
};



// Helper function to get category color on Recent athlete
export const getCategoryColor = (category: string): string => {
  // Remove whitespace and standardize category name
  const cleanCategory = category.trim().toLowerCase();
  
  const colorMap: Record<string, { bg: string; text: string }> = {
    // Female categories
    "lifestyle": { bg: "bg-blue-500/20", text: "text-blue-400" },
    "fitmodel": { bg: "bg-purple-500/20", text: "text-purple-400" },
    "bikini": { bg: "bg-pink-500/20", text: "text-pink-400" },
    "figure": { bg: "bg-rose-500/20", text: "text-rose-400" },
    "wellness": { bg: "bg-teal-500/20", text: "text-teal-400" },
    "women's physique": { bg: "bg-amber-500/20", text: "text-amber-400" },
    "women's bodybuilding": { bg: "bg-red-500/20", text: "text-red-400" },
    
    // Male categories
    "men's physique": { bg: "bg-indigo-500/20", text: "text-indigo-400" },
    "classic physique": { bg: "bg-emerald-500/20", text: "text-emerald-400" },
    "212 bodybuilding": { bg: "bg-cyan-500/20", text: "text-cyan-400" },
    "bodybuilding": { bg: "bg-orange-500/20", text: "text-orange-400" },
    
    // Common categories
    "other": { bg: "bg-slate-500/20", text: "text-slate-400" }
  };
  
  const colors = colorMap[cleanCategory] || { bg: "bg-gray-500/20", text: "text-gray-400" };
  return `${colors.bg} ${colors.text}`;
};
