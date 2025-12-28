/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      toast.success("Login successful 🎉");

      const { role } = result;
      if (role === "SUPER_ADMIN") router.push("/admin");
      else if (role === "COACH") router.push("/coach");
    } catch (err: any) {
      toast.error(err || "Invalid email or password");
    }
  };

  return (
    <div className="mt-8 bg-[#05050c] flex flex-col items-center justify-center text-white">
      <div className="mb-12">
        <Image
          src="/wolves-logo-gym.png"
          alt="Coach of Wolves"
          width={250}
          height={330}
          priority
        />
      </div>

      <div className="w-full max-w-[500px]">
        <h2 className="text-4xl font-bold mb-8">Login</h2>

        <div className="flex items-center gap-6 text-xl mb-6">
          <div>
            <h2>
              <span className="text-green-500">Admin:</span>{" "}
              litonakash13@gmail.com
            </h2>
            <h2>Password: 123456789</h2>
          </div>
          <div>
            <h2>
              <span className="text-green-500">Coach:</span>{" "}
              pronoypl56@gmail.com
            </h2>
            <h2>Password: 123456789</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full bg-[#0b0b14] border border-[#2e2e48] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4b4b7c] transition-colors pr-10"
          />
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-[#0b0b14] border border-[#2e2e48] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4b4b7c] transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>{" "}
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
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-[#10103b] py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
