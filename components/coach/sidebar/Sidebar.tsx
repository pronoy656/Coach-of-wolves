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

export default function Sidebar() {
  return (
    <aside className="w-60 bg-[#101021] border-r border-[#2F312F] flex flex-col">
      {/* Logo */}
      <div className="p-4">
        <Image
          src="/logo (2).png"
          alt="Coach of Wolves Logo"
          width={500}
          height={350}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active
        />
        <NavItem icon={<Users size={20} />} label="Athletes" />
        <NavItem icon={<Dumbbell size={20} />} label="Exercise Database" />
        <NavItem icon={<Apple size={20} />} label="Nutrition Database" />
        <NavItem icon={<Dumbbell size={20} />} label="Supplement Database" />
        <NavItem icon={<BarChart3 size={20} />} label="PED Database" />
        <NavItem icon={<Settings size={20} />} label="Show Management" />
      </nav>

      <div className="p-4 border-t border-border">
        <NavItem icon={<LogOut size={20} />} label="Logout" />
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
        active
          ? "bg-[#4C8B1B] text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
