"use client";

import { useState } from "react";

import { Edit2, Trash2, Search } from "lucide-react";
import SupplementModal from "./supplementModal/SupplementModal";
import DeleteModal from "../exerciseDatabase/deleteModal/DeleteModal";

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  time: string;
  purpose: string;
  brand: string;
  comment: string;
}

const ITEMS_PER_PAGE = 8;

export default function SupplementDatabase() {
  const [supplements, setSupplements] = useState<Supplement[]>([
    {
      id: "1",
      name: "Whey Protein",
      dosage: "30g",
      time: "Morning",
      purpose: "Muscle Growth",
      brand: "Gold Standard",
      comment: "With milk",
    },
    {
      id: "2",
      name: "Creatine Monohydrate",
      dosage: "5g",
      time: "Post Workout",
      purpose: "Strength & Power",
      brand: "MuscleTech",
      comment: "With glucose",
    },
    {
      id: "3",
      name: "Whey Isolate",
      dosage: "25g",
      time: "Evening",
      purpose: "Recovery",
      brand: "ON",
      comment: "With water",
    },
    {
      id: "4",
      name: "BCAA Complex",
      dosage: "10g",
      time: "Before Workout",
      purpose: "Endurance",
      brand: "Optimum",
      comment: "Lemon flavor",
    },
    {
      id: "5",
      name: "Vitamin D3",
      dosage: "2000 IU",
      time: "Morning",
      purpose: "Bone Health",
      brand: "Nature Made",
      comment: "With breakfast",
    },
    {
      id: "6",
      name: "Zinc",
      dosage: "30mg",
      time: "Morning",
      purpose: "Immune Support",
      brand: "Nutricost",
      comment: "With food",
    },
    {
      id: "7",
      name: "Omega-3",
      dosage: "2g",
      time: "Morning",
      purpose: "Heart Health",
      brand: "Nature's Bounty",
      comment: "Fish oil",
    },
    {
      id: "8",
      name: "Magnesium",
      dosage: "400mg",
      time: "Evening",
      purpose: "Sleep & Recovery",
      brand: "Calm",
      comment: "Before bed",
    },
    {
      id: "9",
      name: "B12 Complex",
      dosage: "1000mcg",
      time: "Morning",
      purpose: "Energy Boost",
      brand: "Methyl",
      comment: "Sublingual",
    },
    {
      id: "10",
      name: "Multivitamin",
      dosage: "1 tablet",
      time: "Morning",
      purpose: "General Health",
      brand: "Centrum",
      comment: "With breakfast",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredSupplements = supplements.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSupplements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSupplements = filteredSupplements.slice(startIndex, endIndex);

  const handleSave = (data: Omit<Supplement, "id">) => {
    if (editingId) {
      setSupplements(
        supplements.map((s) =>
          s.id === editingId ? { ...data, id: editingId } : s
        )
      );
      setEditingId(null);
    } else {
      setSupplements([...supplements, { ...data, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setSupplements(supplements.filter((s) => s.id !== deleteId));
      setDeleteModalOpen(false);
      setDeleteId(null);
      setCurrentPage(1);
    }
  };

  const editingSuplement = editingId
    ? supplements.find((s) => s.id === editingId)
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Supplements</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-2 border-2 border-[#4A9E4A] text-primary hover:bg-primary/10 rounded-full font-medium transition-colors"
          >
            + Add Supplement
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Here..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
          />
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
        </div>

        {/* Supplements Table */}
        <div className="border border-[#303245] rounded-lg overflow-hidden bg-[#08081A] mt-10">
          {filteredSupplements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No supplements found
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border border-[#24273f] bg-[#020231]">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Dosage
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Purpose
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Brand
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Comment
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSupplements.map((supplement, index) => (
                    <tr
                      key={supplement.id}
                      className={`border-b bg-[#212133] border-[#303245] hover:bg-[#212133] transition-colors ${
                        index % 2 === 0 ? "bg-background/50" : "bg-background"
                      }`}
                    >
                      <td className="py-3 px-4 text-primary font-medium">
                        {supplement.name}
                      </td>
                      <td className="py-3 px-4 text-primary font-medium">
                        {supplement.dosage}
                      </td>
                      <td className="py-3 px-4 text-primary font-medium">
                        {supplement.time}
                      </td>
                      <td className="py-3 px-4 text-primary font-medium">
                        {supplement.purpose}
                      </td>
                      <td className="py-3 px-4 text-primary font-medium">
                        {supplement.brand}
                      </td>
                      <td className="py-3 px-4 text-primary font-medium">
                        {supplement.comment}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(supplement.id)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(supplement.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between bg-card border-t border-[#303245] px-4 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {paginatedSupplements.length > 0 ? startIndex + 1 : 0}{" "}
                  to {Math.min(endIndex, filteredSupplements.length)} of{" "}
                  {filteredSupplements.length} supplements
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-[#4A9E4A] rounded-lg hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-[#4A9E4A] rounded-lg hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SupplementModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingId(null);
          }}
          onSave={handleSave}
          initialData={editingSuplement || undefined}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteModal
          title="Delete Supplement"
          message="Are you sure you want to delete this supplement? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setDeleteId(null);
          }}
        />
      )}
    </div>
  );
}
