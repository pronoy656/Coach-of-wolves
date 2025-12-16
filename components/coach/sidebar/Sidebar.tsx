"use client";

import type React from "react";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Apple,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

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
          href="/coach"
          active={pathname === "/coach"}
        />

        <NavItem
          icon={<Users size={20} />}
          label="Athletes"
          href="/coach/athletes"
          active={pathname === "/coach/athletes"}
        />

        <NavItem
          icon={<Dumbbell size={20} />}
          label="Exercise Database"
          href="/coach/exercise-Database"
          active={pathname === "/coach/exercise-Database"}
        />

        <NavItem
          icon={<Apple size={20} />}
          label="Nutrition Database"
          href="/coach/nutrition-Database"
          active={pathname === "/coach/nutrition-Database"}
        />

        <NavItem
          icon={<Dumbbell size={20} />}
          label="Supplement Database"
          href="/coach/supplement-Database"
          active={pathname === "/coach/supplement-Database"}
        />

        <NavItem
          icon={<BarChart3 size={20} />}
          label="PED Database"
          href="/coach/ped-Database"
          active={pathname === "/coach/ped-Database"}
        />

        <NavItem
          icon={<Settings size={20} />}
          label="Show Management"
          href="/coach/show-Management"
          active={pathname === "/coach/show-Management"}
        />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <NavItem
          icon={<LogOut size={20} />}
          label="Logout"
          href="/logout"
          active={pathname === "/logout"}
        />
      </div>
    </aside>
  );
}

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
