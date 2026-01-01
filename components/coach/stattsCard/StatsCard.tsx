/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Users, Activity, TrendingUp, Clock, CheckCircle } from "lucide-react";

// export default function StatsCard() {
//   const cards = [
//     {
//       label: "Total Athletes",
//       value: "102",
//       icon: Users,
//       color: "text-primary",
//     },
//     {
//       label: "Active Athletes",
//       value: "102",
//       icon: Activity,
//       color: "text-primary",
//     },
//     {
//       label: "Daily Tracking",
//       value: "10%",
//       icon: TrendingUp,
//       color: "text-primary",
//     },
//     {
//       label: "Pending Check-In",
//       value: "0",
//       icon: Clock,
//       color: "text-primary",
//     },
//     {
//       label: "Complete Check-In",
//       value: "50",
//       icon: CheckCircle,
//       color: "text-primary",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-5 gap-4 p-7">
//       {cards.map((card, i) => (
//         <div
//           key={i}
//           className="bg-[#08081A] border border-[#4A9E4A] rounded-lg p-4"
//         >
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 bg-[#4D6D32] rounded-lg">
//               <card.icon size={24} className={card.color} />
//             </div>
//           </div>
//           <p className="text-xl text-muted-foreground mb-1">{card.label}</p>
//           <p className="text-xl text-[#8CCA4D] font-bold">{card.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

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
    (state: RootState) => state.coachDashboard
  );

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
          label: "Total Athletes",
          value: data.totalAthletes,
          icon: Users,
          color: "text-[#8CCA4D]",
          description: "Total athletes assigned to you",
        },
        {
          label: "Active Athletes",
          value: data.totalActiveUsers,
          icon: Activity,
          color: "text-[#8CCA4D]",
          description: "Currently active athletes",
        },
        {
          label: "Daily Tracking",
          value: calculateDailyTrackingPercentage(),
          icon: TrendingUp,
          color: "text-[#8CCA4D]",
          description: `${data.dailyTracking.submittedToday} of ${data.totalAthletes} submitted today`,
        },
        {
          label: "Pending Check-In",
          value: data.checkins.pending,
          icon: Clock,
          color: "text-[#FF6B6B]",
          description: "Waiting for athlete response",
        },
        {
          label: "Complete Check-In",
          value: data.checkins.completed,
          icon: CheckCircle,
          color: "text-[#8CCA4D]",
          description: "Successfully completed",
        },
      ]
    : [
        // Fallback data while loading or if no data
        {
          label: "Total Athletes",
          value: "0",
          icon: Users,
          color: "text-[#8CCA4D]",
        },
        {
          label: "Active Athletes",
          value: "0",
          icon: Activity,
          color: "text-[#8CCA4D]",
        },
        {
          label: "Daily Tracking",
          value: "0",
          icon: TrendingUp,
          color: "text-[#8CCA4D]",
        },
        {
          label: "Pending Check-In",
          value: "0",
          icon: Clock,
          color: "text-[#FF6B6B]",
        },
        {
          label: "Complete Check-In",
          value: "0",
          icon: CheckCircle,
          color: "text-[#8CCA4D]",
        },
      ];

  // Add description to cards if data exists
  if (data) {
    cards.forEach((card, index) => {
      switch (index) {
        case 0: // Total Athletes
          card.description = `${data.totalAthletes} total athletes`;
          break;
        case 1: // Active Athletes
          card.description = `${data.totalActiveUsers} currently active`;
          break;
        case 2: // Daily Tracking
          card.description = `${data.dailyTracking.submittedToday} of ${data.totalAthletes} submitted today`;
          break;
        case 3: // Pending Check-In
          card.description = `${data.checkins.pending} waiting for response`;
          break;
        case 4: // Complete Check-In
          card.description = `${data.checkins.completed} successfully completed`;
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
          <p className="mt-2 text-gray-400 text-sm">
            Loading dashboard data...
          </p>
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

      {/* Refresh Button */}
      {/* <div className="flex justify-end">
        <button
          onClick={() => dispatch(getCoachDashboardData())}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A9E4A] hover:bg-[#3c7913] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Data
            </>
          )}
        </button>
      </div> */}
    </div>
  );
}
