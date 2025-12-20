"use client";
import Navbar from "@/components/coach/navbar/Navbar";
import Sidebar from "@/components/coach/sidebar/Sidebar";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const authToken =
      token || (typeof window !== "undefined" && localStorage.getItem("token"));

    if (!authToken) {
      router.replace("/");
    }
  }, [token, router]);

  if (
    !token &&
    typeof window !== "undefined" &&
    !localStorage.getItem("token")
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
}
