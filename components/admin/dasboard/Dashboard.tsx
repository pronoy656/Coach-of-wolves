// import React from "react";

// export default function Dashboard() {
//   return <div>Dashboard</div>;
// }

"use client";

import QuickAlerts from "./quickAlerts/QuickAlerts";
import RecentAthlete from "./recentAthlete/RecentAthlete";
import StatCard from "./statCard/StatCard";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            </div>

            {/* Stats Cards Component */}
            <StatCard />

            {/* Quick Admin Alerts Component */}
            <QuickAlerts />

            {/* Recent Athletes Component */}
            <RecentAthlete />
          </div>
        </main>
      </div>
    </div>
  );
}
