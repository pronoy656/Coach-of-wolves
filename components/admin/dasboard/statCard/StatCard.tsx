"use client";

import {
  Users,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

export default function StatCard() {
  const stats = [
    {
      title: "Total Athletes",
      value: "450",
      change: "+12 This Week",
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Total Coaches",
      value: "20",
      change: "Active",
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Natural Athletes",
      value: "147",
      change: "Enhanced: 70",
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Active Users",
      value: "300",
      change: "Inactive: 14",
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Daily Tracking Today",
      value: "60%",
      change: "247 / 250 Completed",
      icon: CheckCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    {
      title: "Check-Ins This Week",
      value: "60%",
      change: "60   Pending",
      icon: AlertCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    {
      title: "Peak Week  Athletes",
      value: "10",
      change: "Active Competition Prep",
      icon: Zap,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-[#08081A] border border-[#303245] rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-primary mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
