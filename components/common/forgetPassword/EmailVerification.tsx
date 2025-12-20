"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/redux/features/auth/authSlice";

export default function EmailVerification() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { forgotPasswordSuccess } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const resultAction = await dispatch(forgotPassword({ email }));

    if (forgotPassword.fulfilled.match(resultAction)) {
      // build string URL for app router
      router.push(`/code-verification?email=${encodeURIComponent(email)}`);
    } else {
      console.error("Forgot password request failed:", resultAction.payload);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050511] flex items-center justify-center p-4">
      <div className="w-full max-w-[550px]">
        {/* Back to Login Link */}
        <Link
          href="/"
          className="group flex items-center text-sm font-medium text-gray-200 hover:text-white transition-colors mb-10 w-fit"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-gray-400 text-[15px] leading-relaxed">
            Don’t worry, happens to all of us. Enter your email below to recover
            your password
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-white font-medium text-sm ml-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john.doe@gmail.com"
              className="w-full bg-[#0A0A16] border border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-800 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F0F4A] hover:bg-[#15155a] text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-[0_0_15px_rgba(15,15,74,0.5)] mt-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
