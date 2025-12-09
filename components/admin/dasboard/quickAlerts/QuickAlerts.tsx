"use client";

import { AlertCircle, AlertTriangle } from "lucide-react";

export default function QuickAlerts() {
  const alerts = [
    {
      id: 1,
      title: "High-Risk Health Metrics",
      description: "3 Athletes with elevated blood pressure readings",
      icon: AlertTriangle,
      count: "3",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      id: 2,
      title: "Missed Daily Tracking",
      description: "32 athletes haven't logged today's data",
      icon: AlertCircle,
      count: "32",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
    },
  ];

  return (
    <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Quick Admin Alerts</h2>
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
                  <p className="text-white font-semibold">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
              </div>
              <div className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full font-semibold text-sm">
                {alert.count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
