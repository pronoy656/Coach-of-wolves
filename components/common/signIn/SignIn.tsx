"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Start loading
    setIsLoading(true);

    // Simulate an API call (Remove this setTimeout in production)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form Submitted", formData);

    // Stop loading
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#05050c] flex flex-col items-center justify-center font-sans text-white">
      <div className="mb-12 w-[250px] h-[280px] flex items-center justify-center bg-transparent">
        <div className="relative w-full h-full">
          <Image
            src="/wolves-logo-gym.png"
            alt="Coach of Wolves"
            fill
            className="w-full h-full"
            priority
          />
        </div>
      </div>

      {/* --- LOGIN FORM --- */}
      <div className="w-full max-w-[500px]">
        <h2 className="text-4xl font-bold mb-8 text-white">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-300 text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john.doe@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-[#0b0b14] border border-[#2e2e48] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4b4b7c] transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-300 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••••••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-[#0b0b14] border border-[#2e2e48] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4b4b7c] transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Checkbox & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-gray-400 rounded bg-transparent peer-checked:bg-white peer-checked:border-white transition-all"></div>
                {/* Custom Checkmark SVG */}
                <svg
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-[#05050c] opacity-0 peer-checked:opacity-100 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                Remember me
              </span>
            </label>

            <Link
              href="/email-verification"
              className="text-[#559f48] text-sm hover:text-[#6ecf5d] transition-colors font-medium"
            >
              Forgot Password ?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#10103b] hover:bg-[#1a1a5e] text-white font-bold py-3.5 rounded-lg border border-[#1e1e50] shadow-[0_0_15px_rgba(16,16,59,0.5)] transition-all mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5 text-white" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
