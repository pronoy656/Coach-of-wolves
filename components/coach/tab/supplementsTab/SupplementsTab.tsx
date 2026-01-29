"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import SupplementsList from "./SupplementsList";
import AddSupplimentModal from "./AddSupplimentModal";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";
import { useAppSelector } from "@/redux/hooks";

const translations = {
  en: {
    title: "Supplements",
    addNew: "Add New",
    searchPlaceholder: "Search supplements...",
    deleteTitle: "Delete Supplement",
    deleteMessage:
      "Are you sure you want to delete this supplement? This action cannot be undone.",
  },
  de: {
    title: "Nahrungsergänzungsmittel",
    addNew: "Hinzufügen",
    searchPlaceholder: "Nahrungsergänzungsmittel suchen...",
    deleteTitle: "Ergänzungsmittel löschen",
    deleteMessage:
      "Sind Sie sicher, dass Sie dieses Ergänzungsmittel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  },
};

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  note: string;
}

export default function SupplementsPage() {
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

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
    null,
  );

  const filteredSupplements = supplements.filter((supplement) =>
    supplement.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
          s.id === selectedSupplement.id ? { ...data, id: s.id } : s,
        ),
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
          <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          <button
            onClick={handleAddSupplement}
            className="flex items-center gap-2 px-4 py-2 bg-[#2E3042] text-white rounded-lg hover:bg-[#393B52] transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t.addNew}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#303245]"
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
      {isFormModalOpen && (
        <AddSupplimentModal
          isOpen={isFormModalOpen}
          supplement={selectedSupplement}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedSupplement(null);
          }}
          onSave={handleSaveSupplement}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          title={t.deleteTitle}
          message={t.deleteMessage}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSupplementToDelete(null);
          }}
        />
      )}
    </main>
  );
}
