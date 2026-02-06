"use client";

import { useAppSelector } from "@/redux/hooks";

interface ShowStatsProps {
  upcomingCount: number;
  peakWeekCount: number;
  completedCount: number;
}

const translations = {
  en: {
    upcomingShows: "Upcoming Shows",
    next60Days: "Next 60 days",
    peakWeekActive: "Peak Week Active",
    daysFromShow: "7 days from show",
    completedShows: "Completed Shows",
    allTime: "All time",
  },
  de: {
    upcomingShows: "Anstehende Shows",
    next60Days: "Nächste 60 Tage",
    peakWeekActive: "Peak Week aktiv",
    daysFromShow: "7 Tage bis zur Show",
    completedShows: "Abgeschlossene Shows",
    allTime: "Gesamtzeit",
  },
};

export default function ShowManagementStatCard({
  upcomingCount,
  peakWeekCount,
  completedCount,
}: ShowStatsProps) {
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6 hover:border-[#4A9E4A] transition">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">{t.upcomingShows}</p>
          <span className="text-2xl">⭐</span>
        </div>
        <p className="text-3xl font-bold mb-2">{upcomingCount}</p>
        <p className="text-sm text-muted-foreground">{t.next60Days}</p>
      </div>

      <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6 hover:border-[#4A9E4A] transition">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">{t.peakWeekActive}</p>
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-3xl font-bold mb-2">{peakWeekCount}</p>
        <p className="text-sm text-muted-foreground">{t.daysFromShow}</p>
      </div>

      <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6 hover:border-[#4A9E4A] transition">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">{t.completedShows}</p>
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-3xl font-bold mb-2">{completedCount}</p>
        <p className="text-sm text-muted-foreground">{t.allTime}</p>
      </div>
    </div>
  );
}
