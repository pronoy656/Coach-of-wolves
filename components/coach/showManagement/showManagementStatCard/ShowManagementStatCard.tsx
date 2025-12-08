// import React from 'react'

// export default function ShowManagementStatCard() {
//   return (
//     <div>showManagementStatCard</div>
//   )
// }

"use client";

interface ShowStatsProps {
  upcomingCount: number;
  peakWeekCount: number;
  completedCount: number;
}

export default function ShowManagementStatCard({
  upcomingCount,
  peakWeekCount,
  completedCount,
}: ShowStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">Upcoming Shows</p>
          <span className="text-2xl">⭐</span>
        </div>
        <p className="text-3xl font-bold mb-2">{upcomingCount}</p>
        <p className="text-sm text-muted-foreground">Next 60 days</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">Peak Week Active</p>
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-3xl font-bold mb-2">{peakWeekCount}</p>
        <p className="text-sm text-muted-foreground">7 days from show</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">Completed Shows</p>
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-3xl font-bold mb-2">{completedCount}</p>
        <p className="text-sm text-muted-foreground">All time</p>
      </div>
    </div>
  );
}
