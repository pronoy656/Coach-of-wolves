/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Users,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Zap,
  UserCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getDashboardData,
  clearDashboardError,
} from "@/redux/features/admin/dashboard/dashboardSlice";
import toast from "react-hot-toast";

const translations = {
  en: {
    loading: "Loading dashboard data...",
    totalAthletes: "Total Athletes",
    totalAthletesChange: "All Athletes",
    totalAthletesTooltip: "Total number of athletes registered",
    totalCoaches: "Total Coaches",
    totalCoachesChange: "All Coaches",
    totalCoachesTooltip: "Total number of coaches",
    naturalAthletes: "Natural Athletes",
    naturalAthletesChange: (enhanced: number) => `Enhanced: ${enhanced}`,
    naturalAthletesTooltip: "Natural vs Enhanced athletes",
    totalUsers: "Total Users",
    totalUsersChange: (active: number, inactive: number) =>
      `Active: ${active}, Inactive: ${inactive}`,
    totalUsersTooltip: "Overall user count",
    dailyTrackingToday: "Daily Tracking Today",
    dailyTrackingChange: "Tracked Today",
    dailyTrackingTooltip: "Daily tracking completed today",
    checkinsThisWeek: "Check-Ins This Week",
    checkinsThisWeekChange: "Checked In This Week",
    checkinsThisWeekTooltip: "Check-ins completed this week",
    enhancedAthletes: "Enhanced Athletes",
    enhancedAthletesChange: "Enhanced Athletes",
    enhancedAthletesTooltip: "Enhanced athletes count",
    activeUsers: "Active Users",
    activeUsersChange: (inactive: number) => `Inactive: ${inactive}`,
    activeUsersTooltip: "Active vs Inactive users",
  },
  de: {
    loading: "Dashboard-Daten werden geladen...",
    totalAthletes: "Gesamt Athleten",
    totalAthletesChange: "Alle Athleten",
    totalAthletesTooltip: "Gesamtzahl der registrierten Athleten",
    totalCoaches: "Gesamt Trainer",
    totalCoachesChange: "Alle Trainer",
    totalCoachesTooltip: "Gesamtzahl der Trainer",
    naturalAthletes: "Natürliche Athleten",
    naturalAthletesChange: (enhanced: number) => `Enhanced: ${enhanced}`,
    naturalAthletesTooltip: "Natürliche vs Enhanced Athleten",
    totalUsers: "Gesamt Nutzer",
    totalUsersChange: (active: number, inactive: number) =>
      `Aktiv: ${active}, Inaktiv: ${inactive}`,
    totalUsersTooltip: "Gesamtzahl aller Nutzer",
    dailyTrackingToday: "Heutiges Tracking",
    dailyTrackingChange: "Heute getrackt",
    dailyTrackingTooltip: "Heute abgeschlossenes tägliches Tracking",
    checkinsThisWeek: "Check-Ins diese Woche",
    checkinsThisWeekChange: "Diese Woche eingecheckt",
    checkinsThisWeekTooltip: "Abgeschlossene Check-Ins dieser Woche",
    enhancedAthletes: "Enhanced Athleten",
    enhancedAthletesChange: "Enhanced Athleten",
    enhancedAthletesTooltip: "Anzahl der Enhanced Athleten",
    activeUsers: "Aktive Nutzer",
    activeUsersChange: (inactive: number) => `Inaktiv: ${inactive}`,
    activeUsersTooltip: "Aktive vs inaktive Nutzer",
  },
};

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  tooltip?: string;
}

export default function StatCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );
  const { language } = useSelector((state: RootState) => state.language);
  const t = translations[language as keyof typeof translations];

  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  // Show error toast if any
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-right",
      });
      dispatch(clearDashboardError());
    }
  }, [error, dispatch]);

  const stats: StatCard[] = data
    ? [
        {
          title: t.totalAthletes,
          value: data.totalAthlete,
          change: t.totalAthletesChange,
          icon: Users,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          tooltip: t.totalAthletesTooltip,
        },
        {
          title: t.totalCoaches,
          value: data.totalCoach,
          change: t.totalCoachesChange,
          icon: Users,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          tooltip: t.totalCoachesTooltip,
        },
        {
          title: t.naturalAthletes,
          value: data.totalNaturalAthlete,
          change: t.naturalAthletesChange(data.totalEnhancedAthlete),
          icon: Target,
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
          tooltip: t.naturalAthletesTooltip,
        },
        {
          title: t.totalUsers,
          value: data.totalActiveUser + data.totalInactiveUser,
          change: t.totalUsersChange(
            data.totalActiveUser,
            data.totalInactiveUser
          ),
          icon: UserCheck,
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/20",
          tooltip: t.totalUsersTooltip,
        },

        {
          title: t.dailyTrackingToday,
          value: data.totalDailyTrackingToday,
          change: t.dailyTrackingChange,
          icon: CheckCircle,
          color: "text-orange-400",
          bgColor: "bg-orange-500/20",
          tooltip: t.dailyTrackingTooltip,
        },
        {
          title: t.checkinsThisWeek,
          value: data.totalCheckInThisWeek,
          change: t.checkinsThisWeekChange,
          icon: AlertCircle,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          tooltip: t.checkinsThisWeekTooltip,
        },
        {
          title: t.enhancedAthletes,
          value: data.totalEnhancedAthlete,
          change: t.enhancedAthletesChange,
          icon: Zap,
          color: "text-pink-400",
          bgColor: "bg-pink-500/20",
          tooltip: t.enhancedAthletesTooltip,
        },
        {
          title: t.activeUsers,
          value: data.totalActiveUser,
          change: t.activeUsersChange(data.totalInactiveUser),
          icon: Activity,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
          tooltip: t.activeUsersTooltip,
        },
      ]
    : [
        {
          title: t.totalAthletes,
          value: "0",
          change: t.totalAthletesChange,
          icon: Users,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        },
        {
          title: t.totalCoaches,
          value: "0",
          change: t.totalCoachesChange,
          icon: Users,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
        },
        {
          title: t.naturalAthletes,
          value: "0",
          change: t.naturalAthletesChange(0),
          icon: Target,
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
        },
        {
          title: t.activeUsers,
          value: "0",
          change: t.activeUsersChange(0),
          icon: Activity,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
        },
        {
          title: t.dailyTrackingToday,
          value: "0",
          change: t.dailyTrackingChange,
          icon: CheckCircle,
          color: "text-orange-400",
          bgColor: "bg-orange-500/20",
        },
        {
          title: t.checkinsThisWeek,
          value: "0",
          change: t.checkinsThisWeekChange,
          icon: AlertCircle,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
        },
        {
          title: t.enhancedAthletes,
          value: "0",
          change: t.enhancedAthletesChange,
          icon: Zap,
          color: "text-pink-400",
          bgColor: "bg-pink-500/20",
        },
        {
          title: t.totalUsers,
          value: "0",
          change: t.totalUsersChange(0, 0),
          icon: UserCheck,
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/20",
        },
      ];

  return (
    <div>
      {loading && !data && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-2 text-gray-400">{t.loading}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-[#08081A] border border-[#303245] rounded-lg p-4 hover:border-primary/50 transition-transform hover:scale-[1.02] transition-colors duration-200 cursor-pointer group"
              title={stat.tooltip}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`${stat.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                {loading && (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-primary mb-1">
                  {loading && !data ? (
                    <span className="inline-block w-16 h-7 bg-gray-700 rounded animate-pulse"></span>
                  ) : (
                    stat.value
                  )}
                </p>
                {/* <p className="text-xs text-muted-foreground">
                  {loading && !data ? (
                    <span className="inline-block w-24 h-4 bg-gray-700 rounded animate-pulse"></span>
                  ) : (
                    stat.change
                  )}
                </p> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
