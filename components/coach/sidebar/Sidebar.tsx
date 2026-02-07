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
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeToken } from "@/redux/features/auth/authSlice";

const translations = {
  en: {
    dashboard: "Dashboard",
    athletes: "Athletes",
    exerciseDatabase: "Exercise Database",
    nutritionDatabase: "Nutrition Database",
    supplementDatabase: "Supplement Database",
    pedDatabase: "PED Database",
    weeklyCheckIns: "Weekly check-ins",
    showManagement: "Show Management",
    logout: "Logout",
  },
  de: {
    dashboard: "Dashboard",
    athletes: "Athleten",
    exerciseDatabase: "Übungsdatenbank",
    nutritionDatabase: "Ernährungsdatenbank",
    supplementDatabase: "Supplement-Datenbank",
    pedDatabase: "PED-Datenbank",
    weeklyCheckIns: "Wöchentliche Check-ins",
    showManagement: "Show-Verwaltung",
    logout: "Abmelden",
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];
  const router = useRouter();
  const handleLogout = async () => {
    dispatch(removeToken());
    router.push("/");
  };

  return (
    <aside className="w-60 bg-[#101021] border-r border-[#2F312F] flex flex-col">
      {/* Logo */}
      <div className="px-2 pt-6 pb-4">
        {/* Image height increase */}
        <div className="relative w-full h-32 md:h-40 lg:h-[320px]">
          <Image
            src="/Evolve_Logo_Transparent.png"
            alt="Coach of Wolves Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label={t.dashboard}
          href="/coach"
          active={pathname === "/coach"}
        />

        <NavItem
          icon={<Users size={20} />}
          label={t.athletes}
          href="/coach/athletes"
          active={pathname === "/coach/athletes"}
        />

        <NavItem
          icon={<Dumbbell size={20} />}
          label={t.exerciseDatabase}
          href="/coach/exercise-Database"
          active={pathname === "/coach/exercise-Database"}
        />

        <NavItem
          icon={<Apple size={20} />}
          label={t.nutritionDatabase}
          href="/coach/nutrition-Database"
          active={pathname === "/coach/nutrition-Database"}
        />

        <NavItem
          icon={<Dumbbell size={20} />}
          label={t.supplementDatabase}
          href="/coach/supplement-Database"
          active={pathname === "/coach/supplement-Database"}
        />

        <NavItem
          icon={<BarChart3 size={20} />}
          label={t.pedDatabase}
          href="/coach/ped-Database"
          active={pathname === "/coach/ped-Database"}
        />
        <NavItem
          icon={<BarChart3 size={20} />}
          label={t.weeklyCheckIns}
          href="/coach/weekly-check-ins"
          active={pathname === "/coach/weekly-check-ins"}
        />

        <NavItem
          icon={<Settings size={20} />}
          label={t.showManagement}
          href="/coach/show-Management"
          active={pathname === "/coach/show-Management"}
        />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#2F312F]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition border border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500 group"
        >
          <LogOut
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-medium">{t.logout}</span>
        </button>
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
