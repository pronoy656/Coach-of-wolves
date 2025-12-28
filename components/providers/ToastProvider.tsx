// components/providers/ToastProvider.tsx
"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Define default options
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
        },
        error: {
          duration: 4000,
          style: {
            background: "#ef4444",
            color: "#fff",
          },
        },
        loading: {
          duration: Infinity,
          style: {
            background: "#3b82f6",
            color: "#fff",
          },
        },
      }}
    />
  );
}
