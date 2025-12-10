// app/coach/(coach)/details/[id]/page.tsx

import CoachDashboard from "@/components/coach/coachDashboard/CoachDashboard";
import { notFound } from "next/navigation";

export default async function AthleteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // Promise!
}) {
  const { id } = await params;

  if (!id || id.trim() === "") {
    notFound();
  }

  const athleteId = id.trim();

  return (
    <div className="min-h-screen text-white">
      <p className="text-gray-300">
        <code className="mx-3 px-4 rounded-lg font-mono text-[#8CCA4D] text-2xl">
          <CoachDashboard athleteId={athleteId} />
          {/* {athleteId} */}
        </code>
      </p>
    </div>
  );
}
