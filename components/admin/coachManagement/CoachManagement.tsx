"use client";

import { useState } from "react";

import { Edit2, Trash2 } from "lucide-react";
import AddCoachModal from "./addCoachModal/AddCoachModal";
import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
import Image from "next/image";

interface Coach {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  image?: string;
}

export default function CoachManagement() {
  const [coaches, setCoaches] = useState<Coach[]>([
    {
      id: "1",
      name: "Sarah Jahan",
      email: "sarah@45gmail.com",
      status: "Active",
      image: "/avater-1.jpg",
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria@45gmail.com",
      status: "Inactive",
      image: "/avater-1.jpg",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id?: string;
  }>({ show: false });

  const handleAddCoach = () => {
    setEditingCoach(null);
    setIsModalOpen(true);
  };

  const handleEditCoach = (coach: Coach) => {
    setEditingCoach(coach);
    setIsModalOpen(true);
  };

  const handleDeleteCoach = (id: string) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.id) {
      setCoaches(coaches.filter((c) => c.id !== deleteConfirm.id));
      setDeleteConfirm({ show: false });
    }
  };

  const handleSaveCoach = (data: Omit<Coach, "id">) => {
    if (editingCoach) {
      setCoaches(
        coaches.map((c) =>
          c.id === editingCoach.id ? { ...data, id: c.id } : c
        )
      );
    } else {
      setCoaches([...coaches, { ...data, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Coach Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage all Coaches in the platform
                </p>
              </div>
              <button
                onClick={handleAddCoach}
                className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
              >
                + Add Coach
              </button>
            </div>

            {/* Coach Cards Grid */}
            <div className="grid grid-cols-3 gap-6">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  className="bg-[#08081A] border border-[#303245]  rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={coach.image || "/placeholder.svg"}
                          alt={coach.name}
                          width={200}
                          height={200}
                          className="w-full h-full rounded-full object-cover border-2 border-primary"
                        />
                      </div>
                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            coach.status === "Active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-orange-500/20 text-orange-400"
                          }`}
                        >
                          {coach.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCoach(coach)}
                        className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCoach(coach.id)}
                        className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {coach.name}
                  </h3>
                  <p className="text-muted-foreground">{coach.email}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddCoachModal
          coach={editingCoach}
          onSave={handleSaveCoach}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {deleteConfirm.show && (
        <DeleteModal
          title="Delete Coach"
          message="Are you sure you want to delete this coach? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm({ show: false })}
        />
      )}
    </div>
  );
}
