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

  // Format the stats based on API data
  const stats: StatCard[] = data
    ? [
        {
          title: "Total Athletes",
          value: data.totalAthlete,
          change: `All Athletes`,
          icon: Users,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          tooltip: "Total number of athletes registered",
        },
        {
          title: "Total Coaches",
          value: data.totalCoach,
          change: "All Coaches",
          icon: Users,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          tooltip: "Total number of coaches",
        },
        {
          title: "Natural Athletes",
          value: data.totalNaturalAthlete,
          change: `Enhanced: ${data.totalEnhancedAthlete}`,
          icon: Target,
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
          tooltip: "Natural vs Enhanced athletes",
        },
        {
          title: "Total Users",
          value: data.totalActiveUser + data.totalInactiveUser,
          change: `Active: ${data.totalActiveUser}, Inactive: ${data.totalInactiveUser}`,
          icon: UserCheck,
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/20",
          tooltip: "Overall user count",
        },

        {
          title: "Daily Tracking Today",
          value: data.totalDailyTrackingToday,
          change: "Tracked Today",
          icon: CheckCircle,
          color: "text-orange-400",
          bgColor: "bg-orange-500/20",
          tooltip: "Daily tracking completed today",
        },
        {
          title: "Check-Ins This Week",
          value: data.totalCheckInThisWeek,
          change: "Checked In This Week",
          icon: AlertCircle,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          tooltip: "Check-ins completed this week",
        },
        {
          title: "Enhanced Athletes",
          value: data.totalEnhancedAthlete,
          change: "Enhanced Athletes",
          icon: Zap,
          color: "text-pink-400",
          bgColor: "bg-pink-500/20",
          tooltip: "Enhanced athletes count",
        },
        {
          title: "Active Users",
          value: data.totalActiveUser,
          change: `Inactive: ${data.totalInactiveUser}`,
          icon: Activity,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
          tooltip: "Active vs Inactive users",
        },
      ]
    : [
        // Fallback data while loading or if no data
        {
          title: "Total Athletes",
          value: "0",
          change: "All Athletes",
          icon: Users,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        },
        {
          title: "Total Coaches",
          value: "0",
          change: "All Coaches",
          icon: Users,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
        },
        {
          title: "Natural Athletes",
          value: "0",
          change: "Enhanced: 0",
          icon: Target,
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
        },
        {
          title: "Active Users",
          value: "0",
          change: "Inactive: 0",
          icon: Activity,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
        },
        {
          title: "Daily Tracking Today",
          value: "0",
          change: "Tracked Today",
          icon: CheckCircle,
          color: "text-orange-400",
          bgColor: "bg-orange-500/20",
        },
        {
          title: "Check-Ins This Week",
          value: "0",
          change: "Checked In This Week",
          icon: AlertCircle,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
        },
        {
          title: "Enhanced Athletes",
          value: "0",
          change: "Enhanced Athletes",
          icon: Zap,
          color: "text-pink-400",
          bgColor: "bg-pink-500/20",
        },
        {
          title: "Total Users",
          value: "0",
          change: "Active: 0, Inactive: 0",
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
          <p className="mt-2 text-gray-400">Loading dashboard data...</p>
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
