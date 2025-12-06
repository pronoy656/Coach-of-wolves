import { Users, Activity, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function StatsCard() {
  const cards = [
    {
      label: "Total Athletes",
      value: "102",
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Active Athletes",
      value: "102",
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Daily Tracking",
      value: "10%",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Pending Check-In",
      value: "0",
      icon: Clock,
      color: "text-primary",
    },
    {
      label: "Complete Check-In",
      value: "50",
      icon: CheckCircle,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 p-7">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-[#08081A] border border-[#4A9E4A] rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#4D6D32] rounded-lg">
              <card.icon size={24} className={card.color} />
            </div>
          </div>
          <p className="text-xl text-muted-foreground mb-1">{card.label}</p>
          <p className="text-xl text-[#8CCA4D] font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
