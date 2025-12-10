// import React from "react";

// export default function ConfirmPassword() {
//   return <div>ConfirmPassword</div>;
// }

"use client";

import { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ConfirmPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle password update logic here
    console.log("Password reset submitted");
  };

  return (
    <div className="min-h-screen w-full bg-[#050511] flex items-center justify-center p-4">
      <div className="w-full max-w-[550px]">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Set a password
          </h1>
          <p className="text-gray-400 text-[15px] leading-relaxed">
            Your previous password has been reseted. Please set a new password
            for your account.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Create Password Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-white font-medium text-sm ml-1"
            >
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                defaultValue="7789BM6X@@H&$K_" // Pre-filled to match image style
                className="w-full bg-[#0A0A16] border border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-800 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Re-enter Password Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-white font-medium text-sm ml-1"
            >
              Re-enter Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                defaultValue="7789BM6X@@H&$K_" // Pre-filled to match image style
                className="w-full bg-[#0A0A16] border border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-800 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Link href="/">
            <button
              type="submit"
              className="w-full bg-[#0F0F4A] hover:bg-[#15155a] text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-[0_0_15px_rgba(15,15,74,0.5)] mt-2"
            >
              Set Password
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
