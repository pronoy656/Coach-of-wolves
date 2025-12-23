"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getRecentAthletes } from "@/redux/features/athlete/athleteSlice";
import { getImageUrl } from "@/utils/imageUtils";
import { CalendarDays, Mail } from "lucide-react";

interface Athlete {
  _id: string;
  name: string;
  email: string;
  category: string;
  image?: string;
  isActive: "Active" | "Inactive";
  createdAt: string;
}

export default function RecentAthlete() {
  const dispatch = useDispatch<AppDispatch>();

  // Get athletes from Redux store
  const { athletes, loading } = useSelector(
    (state: { athlete: { athletes: Athlete[]; loading: boolean } }) =>
      state.athlete
  );

  useEffect(() => {
    // Fetch athletes when component mounts
    dispatch(getRecentAthletes());
  }, [dispatch]);

  // Filter athletes created within the last 4 days (max 10)
  const recentAthletes = useMemo(() => {
    if (!athletes || athletes.length === 0) return [];

    const now = new Date();
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000); // 4 days in milliseconds

    return athletes
      .filter((athlete: Athlete) => {
        const createdAt = new Date(athlete.createdAt);
        return createdAt >= fourDaysAgo;
      })
      .slice(0, 10) // Max 10 cards
      .map((athlete: Athlete) => {
        // Calculate days ago
        const createdAt = new Date(athlete.createdAt);
        const diffInMs = now.getTime() - createdAt.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        let addedDateText = "";
        if (diffInDays === 0) {
          addedDateText = "Added Today";
        } else if (diffInDays === 1) {
          addedDateText = "Added 1 Day Ago";
        } else {
          addedDateText = `Added ${diffInDays} Days Ago`;
        }

        // Get status color
        const statusColor =
          athlete.isActive === "Active"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400";

        // Get initials from name
        const initials = athlete.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        // Generate background color based on name (consistent)
        const colors = [
          "bg-blue-500",
          "bg-green-500",
          "bg-purple-500",
          "bg-orange-500",
          "bg-pink-500",
          "bg-teal-500",
          "bg-yellow-500",
          "bg-indigo-500",
          "bg-red-500",
          "bg-cyan-500",
        ];

        const nameHash = athlete.name
          .split("")
          .reduce((acc: number, char: string) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
          }, 0);
        const bgColor = colors[Math.abs(nameHash) % colors.length];

        return {
          id: athlete._id,
          name: athlete.name,
          addedDate: addedDateText,
          status: athlete.isActive,
          statusColor,
          initials,
          bgColor,
          image: athlete.image,
          email: athlete.email,
          category: athlete.category,
          daysSinceAdded: diffInDays,
        };
      });
  }, [athletes]);

  if (loading && recentAthletes.length === 0) {
    return (
      <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Athletes</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A9E4A]"></div>
        </div>
      </div>
    );
  }

  if (recentAthletes.length === 0 && !loading) {
    return (
      <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Athletes</h2>
        <div className="text-center py-8">
          <p className="text-slate-400 mb-2">No recent athletes</p>
          <p className="text-sm text-slate-500">
            Athletes added within the last 4 days will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Recent Athletes</h2>
        <div className="text-sm text-slate-400">
          {recentAthletes.length} of {Math.min(athletes.length, 10)} showing
          <div className="text-xs text-slate-500 mt-1">(Last 4 days only)</div>
        </div>
      </div>

      <div className="grid gap-4">
        {recentAthletes.map((athlete) => (
          <div
            key={athlete.id}
            className="group relative bg-linear-to-br from-[#111129]/80 to-[#151533]/60 backdrop-blur-sm border border-[#303245] rounded-2xl p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            {/* Main Content Container */}
            <div className="flex items-center justify-between">
              {/* Profile Section */}
              <div className="flex items-start gap-4">
                {/* Avatar with Status */}
                <div className="relative">
                  {athlete.image ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg">
                      <img
                        src={getImageUrl(athlete.image)}
                        alt={athlete.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${athlete.bgColor}`}
                    >
                      <span className="text-xl">{athlete.initials}</span>
                    </div>
                  )}
                  {/* Status Indicator Dot */}
                  <div
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-3 border-[#08081A] shadow-lg ${
                      athlete.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 rounded-full ${
                        athlete.status === "Active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } animate-ping opacity-75`}
                    ></div>
                  </div>
                </div>

                {/* Name & Contact Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-2 group-hover:text-primary transition-colors">
                    {athlete.name}
                  </h3>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{athlete.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <CalendarDays className="w-4 h-4 shrink-0" />
                      <span>{athlete.addedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Category Badge */}
              {/* <div className="">
                <div
                  className={`px-4 py-1 rounded-xl border text-sm whitespace-nowrap ${getCategoryColor(
                    athlete.category
                  )}`}
                >
                  {athlete.category}
                </div>
              </div> */}

              {/* Status Badge */}
              <div>
                <div className="min-w-[100px] flex justify-center">
                  <div
                    className={`px-4 py-1 rounded-xl border text-sm ${athlete.statusColor} shadow-lg`}
                  >
                    {athlete.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div className="mt-6 pt-4 border-t border-[#303245]/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Inactive</span>
            </div>
          </div>
          <div className="text-slate-500">Updates automatically</div>
        </div>
      </div>
    </div>
  );
}
