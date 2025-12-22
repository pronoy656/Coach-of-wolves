

export const getImageUrl = (image: File | string | null | undefined): string => {
  console.log("getImageUrl input:", image);

  if (!image) {
    return "/placeholder.svg";
  }

  if (typeof image === "string") {
    // Full URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Blob URL
    if (image.startsWith("blob:")) {
      return image;
    }

    // Relative path
    if (image.startsWith("/")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      return `${baseUrl}${image}`; // ✅ FIXED
    }

    return image;
  }

  // ✅ SSR-safe File check (important for Next.js)
  if (typeof File !== "undefined" && image instanceof File) {
    return URL.createObjectURL(image);
  }

  return "/placeholder.svg";
};
