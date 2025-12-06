"use client";

import { ChevronDown, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

interface Athlete {
  id: string;
  name: string;
  category: string;
  phase: string;
  weight: number;
  height: number;
  lastCheckIn: string;
  status: "Natural" | "Enhanced";
}

interface AthletesTableProps {
  athletes: Athlete[];
  statusFilter: "All" | "Natural" | "Enhanced";
  onStatusFilterChange: (status: "All" | "Natural" | "Enhanced") => void;
  onAddAthlete: () => void;
  onEditAthlete: (athlete: Athlete) => void;
  onDeleteAthlete: (id: string) => void;
}

export default function AthletesTable({
  athletes,
  statusFilter,
  onStatusFilterChange,
  onAddAthlete,
  onEditAthlete,
  onDeleteAthlete,
}: AthletesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Athletes</h1>
        <button
          onClick={onAddAthlete}
          className="px-6 py-2 border-2 border-[#4A9E4A] text-primary hover:bg-primary/10 rounded-full font-medium transition-colors"
        >
          + Add Athletes
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Here..."
            className="w-full bg-[#08081A] border border-[#4A9E4A] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="relative">
          <button
            onClick={() =>
              setOpenMenuId(openMenuId === "filter" ? null : "filter")
            }
            className="px-4 py-3 border border-border rounded-lg flex items-center gap-2 hover:bg-secondary/50 transition-colors"
          >
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <ChevronDown className="w-4 h-4" />
          </button>
          {openMenuId === "filter" && (
            <div className="absolute right-0 mt-2 w-40 bg-[#08081A] border border-[#4A9E4A] rounded-lg shadow-lg z-10">
              {["All", "Natural", "Enhanced"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusFilterChange(
                      status as "All" | "Natural" | "Enhanced"
                    );
                    setOpenMenuId(null);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-secondary/50 transition-colors ${
                    statusFilter === status ? "text-primary font-semibold" : ""
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border border-[#4A9E4A] rounded-lg overflow-hidden p-5 bg-[#08081A] mt-10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#303245] bg-[#212133]">
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Category</th>
              <th className="px-6 py-4 text-left font-semibold">Phase</th>
              <th className="px-6 py-4 text-left font-semibold">Weight (kg)</th>
              <th className="px-6 py-4 text-left font-semibold">Height(cm)</th>
              <th className="px-6 py-4 text-left font-semibold">
                Last Check in
              </th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr
                key={athlete.id}
                className="border-b bg-[#212133] border-[#303245] hover:bg-[#212133] transition-colors"
              >
                <td className="px-6 py-4">{athlete.name}</td>
                <td className="px-6 py-4">{athlete.category}</td>
                <td className="px-6 py-4">{athlete.phase}</td>
                <td className="px-6 py-4">{athlete.weight}</td>
                <td className="px-6 py-4">{athlete.height}</td>
                <td className="px-6 py-4">{athlete.lastCheckIn}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      athlete.status === "Natural"
                        ? "bg-green-400 border border-white text-black"
                        : "bg-orange-400 border border-white text-black"
                    }`}
                  >
                    {athlete.status}
                  </span>
                </td>
                <td className="px-6 py-4 relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === athlete.id ? null : athlete.id
                      )
                    }
                    className="p-2 hover:bg-secondary/50 rounded transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openMenuId === athlete.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          onEditAthlete(athlete);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-secondary/50 transition-colors text-left text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDeleteAthlete(athlete.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-secondary/50 transition-colors text-left text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
