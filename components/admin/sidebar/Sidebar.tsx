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

const translations = {
  en: {
    dashboard: "Dashboard",
    athleteManagement: "Athlete Management",
    coachManagement: "Coach Management",
    exerciseDatabase: "Exercise Database",
    nutritionDatabase: "Nutrition Database",
    supplementDatabase: "Supplement Database",
    pedDatabase: "PED Database",
    weeklyCheckIns: "Weekly Check-ins",
    logout: "Logout",
  },
  de: {
    dashboard: "Dashboard",
    athleteManagement: "Athletenverwaltung",
    coachManagement: "Trainerverwaltung",
    exerciseDatabase: "Übungsdatenbank",
    nutritionDatabase: "Ernährungsdatenbank",
    supplementDatabase: "Supplement-Datenbank",
    pedDatabase: "PED-Datenbank",
    weeklyCheckIns: "Wöchentliche Check-ins",
    logout: "Abmelden",
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  // const { loading } = useAppSelector((state) => state.auth);
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
        <div className="relative w-full h-32 md:h-40 lg:h-[220px]">
          <Image
            src="/Evolve_Logo_Transparent.png"
            alt="Coach of Wolves Logo"
            fill
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label={t.dashboard}
          href="/admin"
          active={pathname === "/admin"}
        />

        <NavItem
          icon={<Users size={20} />}
          label={t.athleteManagement}
          href="/admin/athlete-Management"
          active={pathname === "/admin/athlete-Management"}
        />
        <NavItem
          icon={<Users size={20} />}
          label={t.coachManagement}
          href="/admin/coach-Management"
          active={pathname === "/admin/coach-Management"}
        />

        <NavItem
          icon={<Dumbbell size={20} />}
          label={t.exerciseDatabase}
          href="/admin/exercise-Database"
          active={pathname === "/admin/exercise-Database"}
        />

        <NavItem
          icon={<Apple size={20} />}
          label={t.nutritionDatabase}
          href="/admin/nutrition-Database"
          active={pathname === "/admin/nutrition-Database"}
        />

        <NavItem
          icon={<Dumbbell size={20} />}
          label={t.supplementDatabase}
          href="/admin/supplement-Database"
          active={pathname === "/admin/supplement-Database"}
        />

        <NavItem
          icon={<BarChart3 size={20} />}
          label={t.pedDatabase}
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
          label={t.weeklyCheckIns}
          href="/admin/weekly-check-ins"
          active={pathname === "/admin/weekly-check-ins"}
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
