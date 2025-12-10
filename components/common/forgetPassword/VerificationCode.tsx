// import React from "react";

// export default function VerificationCode() {
//   return <div>VerificationCode</div>;
// }

"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  ClipboardEvent,
} from "react";

export default function VerificationCode() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input change
  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 4 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move to previous input if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste functionality
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 5);

    if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 5) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the last filled input or the first empty one
    const focusIndex = Math.min(pastedData.length, 4);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    console.log("Verifying code:", code);
  };

  return (
    <div className="min-h-screen w-full bg-[#050511] flex items-center justify-center p-4">
      <div className="w-full max-w-[450px]">
        {/* Back to Login Link */}
        <Link
          href="/login"
          className="group flex items-center text-sm font-medium text-gray-200 hover:text-white transition-colors mb-10 w-fit"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Verify code
          </h1>
          <p className="text-gray-400 text-[15px]">
            An authentication code has been sent to your email.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-white font-medium text-sm ml-1">
              Enter Code
            </label>

            <div className="flex gap-4 sm:gap-5 justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0A0A16] border border-gray-700/50 text-white text-xl text-center rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-800 transition-all shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* Resend Link */}
          <div className="text-[15px] text-white">
            Didn’t receive a code?{" "}
            <button
              type="button"
              className="text-[#FA7070] hover:text-[#ff8585] font-medium transition-colors"
            >
              Resend
            </button>
          </div>

          {/* Submit Button */}
          <Link href="/create-password">
            <button
              type="submit"
              className="w-full bg-[#0F0F4A] hover:bg-[#15155a] text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-[0_0_15px_rgba(15,15,74,0.5)] mt-4"
            >
              Verify
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
