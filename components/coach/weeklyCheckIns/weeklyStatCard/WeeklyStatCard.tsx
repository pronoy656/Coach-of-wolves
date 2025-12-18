import { CheckCircle, Clock } from "lucide-react";

const icons = {
  CheckCircle,
  Clock,
};

interface CheckInStatsProps {
  completedCount: number;
  pendingCount: number;
  completionRate: number;
}

export default function WeeklyStatCard({
  completedCount,
  pendingCount,
  completionRate,
}: CheckInStatsProps) {
  const statCards = [
    {
      title: "Completed This Week",
      count: completedCount,
      icon: "CheckCircle" as const,
      color: "text-green-400",
      bgColor: "bg-green-400/20",
      getSubtext: () => `${completionRate}% completion rate`,
    },
    {
      title: "Pending",
      count: pendingCount,
      icon: "Clock" as const,
      color: "text-red-500",
      bgColor: "bg-red-500/20",
      getSubtext: () => {
        const percentage = Math.round(
          (pendingCount / (completedCount + pendingCount || 1)) * 100
        );
        return `${percentage}% pending`;
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statCards.map((card) => {
        const Icon = icons[card.icon];

        return (
          <div
            key={card.title}
            className="bg-[#08081A] border border-[#303245] rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{card.title}</h3>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${card.bgColor}`}
              >
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>

            <div className="text-4xl font-bold mb-2">{card.count}</div>

            <p className="text-sm text-muted-foreground">{card.getSubtext()}</p>
          </div>
        );
      })}
    </div>
  );
}
