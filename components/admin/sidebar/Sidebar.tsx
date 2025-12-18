"use client";

import type React from "react";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Apple,
  BarChart3,
  // Settings,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeToken } from "@/redux/features/auth/authSlice";

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const handleLogout = async () => {
    dispatch(removeToken());
    router.push("/");
  };

  return (
    <aside className="w-60 bg-[#101021] border-r border-[#2F312F] flex flex-col">
      {/* Logo */}
      <div className="p-4">
        {/* Image height increase */}
        <div className="relative w-full h-24 md:h-32 lg:h-70">
          {" "}
          {/* Responsive heights */}
          <Image
            src="/logo (2).png"
            alt="Coach of Wolves Logo"
            fill
            className=""
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          href="/admin"
          active={pathname === "/admin"}
        />

        <NavItem
          icon={<Users size={20} />}
          label="Athlete Management"
          href="/admin/athlete-Management"
          active={pathname === "/admin/athlete-Management"}
        />
        <NavItem
          icon={<Users size={20} />}
          label="Coach Management"
          href="/admin/coach-Management"
          active={pathname === "/admin/coach-Management"}
        />

        <NavItem
          icon={<Dumbbell size={20} />}
          label="Exercise Database"
          href="/admin/exercise-Database"
          active={pathname === "/admin/exercise-Database"}
        />

        <NavItem
          icon={<Apple size={20} />}
          label="Nutrition Database"
          href="/admin/nutrition-Database"
          active={pathname === "/admin/nutrition-Database"}
        />

        <NavItem
          icon={<Dumbbell size={20} />}
          label="Supplement Database"
          href="/admin/supplement-Database"
          active={pathname === "/admin/supplement-Database"}
        />

        <NavItem
          icon={<BarChart3 size={20} />}
          label="PED Database"
          href="/admin/ped-Database"
          active={pathname === "/admin/ped-Database"}
        />

        {/* <NavItem
          icon={<Settings size={20} />}
          label="Show Management"
          href="/admin/show-Management"
          active={pathname === "/admin/show-Management"}
        /> */}
        <NavItem
          icon={<User size={20} />}
          label="Weekly Check-ins"
          href="/admin/weekly-check-ins"
          active={pathname === "/admin/weekly-check-ins"}
        />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border" onClick={handleLogout}>
        <NavItem
          icon={<LogOut size={20} />}
          label="Logout"
          href="/"
          active={pathname === "/logout"}
        />
      </div>
    </aside>
  );
}

/* -----------------------------------------------------------
   NavItem Component
----------------------------------------------------------- */

function NavItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
        active
          ? "bg-[#4C8B1B] text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
