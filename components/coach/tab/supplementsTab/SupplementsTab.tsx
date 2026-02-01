"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import SupplementsList from "./SupplementsList";
import AddSupplimentModal from "./AddSupplimentModal";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAllSupplements,
  createSupplement,
  updateSupplement,
  deleteSupplement,
  clearSupplementSuccess,
  clearSupplementError,
  Supplement,
  CreateSupplementPayload,
} from "@/redux/features/supplement/coachSupplementSlice";
import toast from "react-hot-toast";

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

interface SupplementsPageProps {
  athleteId?: string;
}

export default function SupplementsPage({ athleteId }: SupplementsPageProps) {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.language);
  const { supplements, loading, error, successMessage } = useAppSelector(
    (state) => state.coachSupplement,
  );
  const t = translations[language as keyof typeof translations];

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] =
    useState<Supplement | null>(null);
  const [supplementToDelete, setSupplementToDelete] = useState<string | null>(
    null,
  );

  // Handle toast notifications
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSupplementSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(clearSupplementError());
    }
  }, [successMessage, error, dispatch]);

  // Fetch supplements when athleteId changes
  useEffect(() => {
    if (athleteId) {
      // Use a larger limit to get more items since we are doing local filtering for now
      dispatch(getAllSupplements({ athleteId, limit: 100 }));
    }
  }, [dispatch, athleteId]);

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

  const handleConfirmDelete = async () => {
    if (supplementToDelete && athleteId) {
      await dispatch(
        deleteSupplement({ athleteId, supplementId: supplementToDelete }),
      );
      setIsDeleteModalOpen(false);
      setSupplementToDelete(null);
    }
  };

  const handleSaveSupplement = async (data: CreateSupplementPayload) => {
    if (!athleteId) return;

    if (selectedSupplement) {
      // Edit existing
      await dispatch(
        updateSupplement({
          athleteId,
          supplementId: selectedSupplement._id,
          data,
        }),
      );
      // Refetch after update to ensure list is consistent
      dispatch(getAllSupplements({ athleteId, limit: 100 }));
    } else {
      // Add new
      await dispatch(
        createSupplement({
          athleteId,
          data,
        }),
      );
    }
    setIsFormModalOpen(false);
    setSelectedSupplement(null);
  };

  if (!athleteId) {
    return <div className="p-6 text-white">No Athlete ID provided</div>;
  }

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
        {loading && supplements.length === 0 ? (
          <div className="text-white">Loading...</div>
        ) : (
          <SupplementsList
            supplements={filteredSupplements}
            onEdit={handleEditSupplement}
            onDelete={handleDeleteSupplement}
          />
        )}
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
