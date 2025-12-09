"use client";

export default function RecentAthlete() {
  const athletes = [
    {
      id: 1,
      name: "Sarah Jahan",
      addedDate: "Added 1 Day Ago",
      status: "Active",
      statusColor: "bg-green-500/20 text-green-400",
      initials: "SJ",
      bgColor: "bg-orange-500",
    },
    {
      id: 2,
      name: "Mike Chen",
      addedDate: "Added 4 Day's Ago",
      status: "Inactive",
      statusColor: "bg-red-500/20 text-red-400",
      initials: "MC",
      bgColor: "bg-green-500",
    },
  ];

  return (
    <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Recent Athletes</h2>
      <div className="space-y-4">
        {athletes.map((athlete) => (
          <div
            key={athlete.id}
            className="flex items-center justify-between p-4 bg-[#111129] border border-[#303245] rounded-lg hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full ${athlete.bgColor} flex items-center justify-center text-white font-bold`}
              >
                {athlete.initials}
              </div>
              <div>
                <p className="text-white font-semibold">{athlete.name}</p>
                <p className="text-sm text-muted-foreground">
                  {athlete.addedDate}
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full font-semibold text-sm ${athlete.statusColor}`}
            >
              {athlete.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
