/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Users, Activity, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getCoachDashboardData,
  clearCoachDashboardError,
} from "@/redux/features/coachDashboard/coachDashBoardSlice";
import toast from "react-hot-toast";

const translations = {
  en: {
    loading: "Loading dashboard data...",
    totalAthletes: "Total Athletes",
    activeAthletes: "Active Athletes",
    dailyTracking: "Daily Tracking",
    pendingCheckIn: "Pending Check-In",
    completeCheckIn: "Complete Check-In",
    descTotal: "Total athletes assigned to you",
    descActive: "Currently active athletes",
    descDaily: (submitted: number, total: number) =>
      `${submitted} of ${total} submitted today`,
    descPending: "Waiting for athlete response",
    descComplete: "Successfully completed",
    dynamicTotal: (count: number) => `${count} total athletes`,
    dynamicActive: (count: number) => `${count} currently active`,
    dynamicPending: (count: number) => `${count} waiting for response`,
    dynamicComplete: (count: number) => `${count} successfully completed`,
  },
  de: {
    loading: "Dashboard-Daten werden geladen...",
    totalAthletes: "Gesamt Athleten",
    activeAthletes: "Aktive Athleten",
    dailyTracking: "Tägliches Tracking",
    pendingCheckIn: "Ausstehende Check-Ins",
    completeCheckIn: "Abgeschlossene Check-Ins",
    descTotal: "Gesamtanzahl der Ihnen zugewiesenen Athleten",
    descActive: "Derzeit aktive Athleten",
    descDaily: (submitted: number, total: number) =>
      `${submitted} von ${total} heute eingereicht`,
    descPending: "Warten auf Rückmeldung des Athleten",
    descComplete: "Erfolgreich abgeschlossen",
    dynamicTotal: (count: number) => `${count} Athleten insgesamt`,
    dynamicActive: (count: number) => `${count} aktuell aktiv`,
    dynamicPending: (count: number) => `${count} warten auf Antwort`,
    dynamicComplete: (count: number) => `${count} erfolgreich abgeschlossen`,
  },
};

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
}

export default function StatsCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.coachDashboard,
  );
  const { language } = useSelector((state: RootState) => state.language);
  const t = translations[language as keyof typeof translations];

  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(getCoachDashboardData());
  }, [dispatch]);

  // Show error toast if any
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-right",
      });
      dispatch(clearCoachDashboardError());
    }
  }, [error, dispatch]);

  // Calculate daily tracking percentage. Don't remove this function. It's calculating the percentage for daily tracking card.
  const calculateDailyTrackingPercentage = (): string => {
    if (!data || data.totalAthletes === 0) return "0%";
    const percentage =
      (data.dailyTracking.submittedToday / data.totalAthletes) * 100;
    return `${Math.round(percentage)}%`;
  };

  // Format the cards based on API data
  const cards: StatCard[] = data
    ? [
        {
          label: t.totalAthletes,
          value: data.totalAthletes,
          icon: Users,
          color: "text-[#8CCA4D]",
          description: t.descTotal,
        },
        {
          label: t.activeAthletes,
          value: data.totalActiveUsers,
          icon: Activity,
          color: "text-[#8CCA4D]",
          description: t.descActive,
        },
        {
          label: t.dailyTracking,
          value: calculateDailyTrackingPercentage(),
          icon: TrendingUp,
          color: "text-[#8CCA4D]",
          description: t.descDaily(
            data.dailyTracking.submittedToday,
            data.totalAthletes,
          ),
        },
        {
          label: t.pendingCheckIn,
          value: data.checkins.pending,
          icon: Clock,
          color: "text-[#FF6B6B]",
          description: t.descPending,
        },
        {
          label: t.completeCheckIn,
          value: data.checkins.completed,
          icon: CheckCircle,
          color: "text-[#8CCA4D]",
          description: t.descComplete,
        },
      ]
    : [
        // Fallback data while loading or if no data
        {
          label: t.totalAthletes,
          value: "0",
          icon: Users,
          color: "text-[#8CCA4D]",
        },
        {
          label: t.activeAthletes,
          value: "0",
          icon: Activity,
          color: "text-[#8CCA4D]",
        },
        {
          label: t.dailyTracking,
          value: "0",
          icon: TrendingUp,
          color: "text-[#8CCA4D]",
        },
        {
          label: t.pendingCheckIn,
          value: "0",
          icon: Clock,
          color: "text-[#FF6B6B]",
        },
        {
          label: t.completeCheckIn,
          value: "0",
          icon: CheckCircle,
          color: "text-[#8CCA4D]",
        },
      ];

  // Add dynamic description to cards if data exists with translation
  if (data) {
    cards.forEach((card, index) => {
      switch (index) {
        case 0: // Total Athletes
          card.description = t.dynamicTotal(data.totalAthletes);
          break;
        case 1: // Active Athletes
          card.description = t.dynamicActive(data.totalActiveUsers);
          break;
        case 2: // Daily Tracking
          card.description = t.descDaily(
            data.dailyTracking.submittedToday,
            data.totalAthletes,
          );
          break;
        case 3: // Pending Check-In
          card.description = t.dynamicPending(data.checkins.pending);
          break;
        case 4: // Complete Check-In
          card.description = t.dynamicComplete(data.checkins.completed);
          break;
      }
    });
  }

  return (
    <div className="space-y-4 p-7">
      {/* Loading State */}
      {loading && !data && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#4A9E4A]"></div>
          <p className="mt-2 text-gray-400 text-sm">{t.loading}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-[#08081A] border border-[#4A9E4A] rounded-lg p-4 hover:border-[#8CCA4D] hover:shadow-lg hover:shadow-[#4A9E4A]/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#4D6D32] rounded-lg">
                {loading && !data ? (
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <card.icon size={24} className={card.color} />
                )}
              </div>
            </div>
            <p className="text-base text-muted-foreground mb-1">{card.label}</p>
            <p className="text-2xl text-[#8CCA4D] font-bold">
              {loading && !data ? (
                <span className="inline-block w-12 h-7 bg-gray-700 rounded animate-pulse"></span>
              ) : (
                card.value
              )}
            </p>
            {card.description && !loading && (
              <p className="text-xs text-gray-400 mt-2">{card.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
