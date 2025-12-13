"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import ShowManagementStatCard from "./showManagementStatCard/ShowManagementStatCard";
import ShowManagementModal from "./showManagementModal/ShowManagementModal";
import DeleteModal from "../exerciseDatabase/deleteModal/DeleteModal";

interface Show {
  id: string;
  showName: string;
  division: string;
  date: string;
  location: string;
  countdown: string;
}

export default function ShowManagement() {
  const [shows, setShows] = useState<Show[]>([
    {
      id: "1",
      showName: "National Cup",
      division: "Bodybuilding",
      date: "1/11/2024",
      location: "Olympia Hall, Germany",
      countdown: "8 Days",
    },
    {
      id: "2",
      showName: "National Cup",
      division: "Lifestyle",
      date: "1/11/2024",
      location: "Olympia Hall, Germany",
      countdown: "8 Days",
    },
    {
      id: "3",
      showName: "Pro Show",
      division: "Classic Physique",
      date: "15/11/2024",
      location: "Munich Hall, Germany",
      countdown: "15 Days",
    },
    {
      id: "4",
      showName: "Regional Show",
      division: "Bikini",
      date: "22/11/2024",
      location: "Berlin Arena, Germany",
      countdown: "22 Days",
    },
    {
      id: "5",
      showName: "Amateur Show",
      division: "Men's Physique",
      date: "5/12/2024",
      location: "Frankfurt Hall, Germany",
      countdown: "35 Days",
    },
    {
      id: "6",
      showName: "Elite Championship",
      division: "Bodybuilding",
      date: "10/12/2024",
      location: "Cologne Stadium, Germany",
      countdown: "40 Days",
    },
    {
      id: "7",
      showName: "Youth Cup",
      division: "Fitness",
      date: "18/12/2024",
      location: "Hamburg Hall, Germany",
      countdown: "48 Days",
    },
    {
      id: "8",
      showName: "Winter Show",
      division: "Wellness",
      date: "28/12/2024",
      location: "Stuttgart Arena, Germany",
      countdown: "58 Days",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [deleteConfirmShow, setDeleteConfirmShow] = useState<Show | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean }>({
    show: false,
  });

  const handleAddShow = () => {
    setEditingShow(null);
    setIsModalOpen(true);
  };

  const handleEditShow = (show: Show) => {
    setEditingShow(show);
    setIsModalOpen(true);
  };

  const handleDeleteShow = (show: Show) => {
    setDeleteConfirmShow(show);
    setDeleteConfirm({ show: true });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmShow) {
      setShows(shows.filter((s) => s.id !== deleteConfirmShow.id));
      setDeleteConfirmShow(null);
    }
  };

  const handleSaveShow = (formData: Omit<Show, "id">) => {
    if (editingShow) {
      // Edit existing
      setShows(
        shows.map((s) =>
          s.id === editingShow.id ? { ...formData, id: s.id } : s
        )
      );
    } else {
      // Add new
      const newShow: Show = {
        ...formData,
        id: Date.now().toString(),
      };
      setShows([...shows, newShow]);
    }
    setIsModalOpen(false);
    setEditingShow(null);
  };

  const upcomingCount = shows.filter(
    (s) => Number.parseInt(s.countdown.split(" ")[0]) > 7
  ).length;
  const peakWeekCount = shows.filter(
    (s) => Number.parseInt(s.countdown.split(" ")[0]) <= 7
  ).length;
  const completedCount = shows.length > 8 ? 156 : 0;

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Show Management</h1>
                <p className="text-muted-foreground">
                  Manage competition schedules and peak week triggers
                </p>
              </div>
              <button
                onClick={handleAddShow}
                className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors font-medium"
              >
                + Add Show
              </button>
            </div>

            {/* Stats Cards */}
            <ShowManagementStatCard
              upcomingCount={upcomingCount}
              peakWeekCount={peakWeekCount}
              completedCount={completedCount}
            />

            {/* Table */}
            <div className="bg-card border border-[#24273f] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="border border-[#24273f] bg-[#020231]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Show Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Division
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Countdown
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((show, index) => (
                    <tr
                      key={show.id}
                      className="border-b bg-[#212133] border-[#303245] hover:bg-[#212133] transition-colors"
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? "transparent"
                            : "rgba(42, 49, 66, 0.3)",
                      }}
                    >
                      <td className="px-6 py-4 text-foreground">
                        {show.showName}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {show.division}
                      </td>
                      <td className="px-6 py-4 text-foreground">{show.date}</td>
                      <td className="px-6 py-4 text-foreground">
                        {show.location}
                      </td>
                      <td className="px-6 py-4 text-primary font-medium">
                        {show.countdown}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEditShow(show)}
                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteShow(show)}
                            className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ShowManagementModal
          show={editingShow}
          onSave={handleSaveShow}
          onClose={() => {
            setIsModalOpen(false);
            setEditingShow(null);
          }}
        />
      )}

      {deleteConfirmShow && (
        <DeleteModal
          isOpen={deleteConfirm.show}
          title="Delete Show"
          message={`Are you sure you want to delete "${deleteConfirmShow.showName}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmShow(null)}
        />
      )}
    </div>
  );
}
