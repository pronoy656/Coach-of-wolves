/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { AlertCircle, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getAlertData,
  clearAlertError,
} from "@/redux/features/admin/dashboard/alertSlice";
import toast from "react-hot-toast";

interface AlertItem {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  count: number;
  bgColor: string;
  iconColor: string;
}

export default function QuickAlerts() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.alert
  );

  // Fetch alert data on component mount
  useEffect(() => {
    dispatch(getAlertData());
  }, [dispatch]);

  // Show error toast if any
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-right",
      });
      dispatch(clearAlertError());
    }
  }, [error, dispatch]);

  // Format the alerts based on API data
  const alerts: AlertItem[] = data
    ? [
        {
          id: 1,
          title: "High-Risk Health Metrics",
          description: `${data.elevatedBpAthlete} Athletes with elevated blood pressure readings`,
          icon: AlertTriangle,
          count: data.elevatedBpAthlete,
          bgColor:
            data.elevatedBpAthlete > 0 ? "bg-red-500/20" : "bg-green-500/20",
          iconColor:
            data.elevatedBpAthlete > 0 ? "text-red-400" : "text-green-400",
        },
        {
          id: 2,
          title: "Missed Daily Tracking",
          description: `${data.totalMissedDailyTracking} Athletes haven't logged today's data`,
          icon: AlertCircle,
          count: data.totalMissedDailyTracking,
          bgColor:
            data.totalMissedDailyTracking > 0
              ? "bg-orange-500/20"
              : "bg-green-500/20",
          iconColor:
            data.totalMissedDailyTracking > 0
              ? "text-orange-400"
              : "text-green-400",
        },
      ]
    : [
        // Fallback data while loading or if no data
        {
          id: 1,
          title: "High-Risk Health Metrics",
          description: "Athletes with elevated blood pressure readings",
          icon: AlertTriangle,
          count: 0,
          bgColor: "bg-green-500/20",
          iconColor: "text-green-400",
        },
        {
          id: 2,
          title: "Missed Daily Tracking",
          description: "Athletes haven't logged today's data",
          icon: AlertCircle,
          count: 0,
          bgColor: "bg-green-500/20",
          iconColor: "text-green-400",
        },
      ];

  return (
    <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Quick Admin Alerts</h2>
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 bg-[#111129] border border-[#303245] rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`${alert.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${alert.iconColor}`} />
                </div>
                <div>
                  <p className="text-white text-xl font-semibold">
                    {alert.title}
                  </p>
                  <p className="text-gray-500">{alert.description}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full font-semibold text-sm ${
                  alert.count > 0
                    ? "bg-red-500/20 text-red-400"
                    : "bg-teal-500/20 text-teal-400"
                }`}
              >
                {loading ? (
                  <span className="inline-block w-8 h-4 bg-gray-700 rounded animate-pulse"></span>
                ) : (
                  alert.count
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
