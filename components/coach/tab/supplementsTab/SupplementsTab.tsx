"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import SupplementsList from "./SupplementsList";
import AddSupplimentModal from "./AddSupplimentModal";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  note: string;
}

export default function SupplementsPage() {
  const [supplements, setSupplements] = useState<Supplement[]>([
    {
      id: "1",
      name: "Zinc",
      dosage: "30g",
      frequency: "2x Daily",
      purpose: "Muscle Growth",
      note: "Added",
    },
    {
      id: "2",
      name: "Multivitamin",
      dosage: "30g",
      frequency: "2x Daily",
      purpose: "Muscle Growth",
      note: "Added",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] =
    useState<Supplement | null>(null);
  const [supplementToDelete, setSupplementToDelete] = useState<string | null>(
    null
  );

  const filteredSupplements = supplements.filter((supplement) =>
    supplement.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSupplement = () => {
    setSelectedSupplement(null);
    setIsFormModalOpen(true);
  };

  const handleEditSupplement = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setIsFormModalOpen(true);
  };

  const handleDeleteSupplement = (id: string) => {
    setSupplementToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (supplementToDelete) {
      setSupplements(supplements.filter((s) => s.id !== supplementToDelete));
      setIsDeleteModalOpen(false);
      setSupplementToDelete(null);
    }
  };

  const handleSaveSupplement = (data: Omit<Supplement, "id">) => {
    if (selectedSupplement) {
      // Edit existing
      setSupplements(
        supplements.map((s) =>
          s.id === selectedSupplement.id ? { ...data, id: s.id } : s
        )
      );
    } else {
      // Add new
      const newSupplement: Supplement = {
        ...data,
        id: Date.now().toString(),
      };
      setSupplements([...supplements, newSupplement]);
    }
    setIsFormModalOpen(false);
    setSelectedSupplement(null);
  };

  return (
    <main className="min-h-screen bg-[#03030b] p-6">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Supplements</h1>
          <button
            onClick={handleAddSupplement}
            className="flex items-center gap-2 px-4 py-2 bg-transparent text-emerald-400 rounded-lg hover:bg-emerald-400/10 transition-colors font-medium border border-emerald-400/50 hover:border-emerald-400"
          >
            <Plus className="w-5 h-5" />
            Add Supplement
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#08081A]  border border-[#303245] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
        </div>

        {/* Supplements List */}
        <SupplementsList
          supplements={filteredSupplements}
          onEdit={handleEditSupplement}
          onDelete={handleDeleteSupplement}
        />
      </div>

      {/* Modals */}
      <AddSupplimentModal
        isOpen={isFormModalOpen}
        supplement={selectedSupplement}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSupplement(null);
        }}
        onSave={handleSaveSupplement}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Supplement"
        message="Are you sure you want to delete this supplement? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSupplementToDelete(null);
        }}
      />
    </main>
  );
}
