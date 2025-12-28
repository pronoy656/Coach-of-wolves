"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { resetPassword } from "@/redux/features/auth/authSlice";

export default function ConfirmPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted");

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      console.error("Token or email missing in URL");
      return;
    }

    const form = e.currentTarget;

    const newPassword = (
      form.elements.namedItem("password") as HTMLInputElement
    )?.value;

    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    )?.value;

    if (!newPassword || !confirmPassword) {
      console.error("Password fields are empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const resultAction = await dispatch(
        resetPassword({ email, token, newPassword, confirmPassword })
      );

      if (resetPassword.fulfilled.match(resultAction)) {
        console.log("Password reset successful");
        router.push("/");
      } else {
        console.error("Password reset failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
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
          {/* Create Password */}
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
                className="w-full bg-[#0A0A16] border border-gray-700/50 text-white rounded-lg px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-800 transition-all"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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

          {/* Confirm Password */}
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
                className="w-full bg-[#0A0A16] border border-gray-700/50 text-white rounded-lg px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-800 transition-all"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
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
          <button
            type="submit"
            className="w-full bg-[#0F0F4A] hover:bg-[#15155a] text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-[0_0_15px_rgba(15,15,74,0.5)] mt-2"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}
