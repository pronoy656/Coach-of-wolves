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
  clearSupplements,
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
    pagination: (start: number, end: number, total: number) =>
      `Showing ${start} to ${end} of ${total} supplements`,
    previous: "Previous",
    next: "Next",
  },
  de: {
    title: "Nahrungsergänzungsmittel",
    addNew: "Hinzufügen",
    searchPlaceholder: "Nahrungsergänzungsmittel suchen...",
    deleteTitle: "Ergänzungsmittel löschen",
    deleteMessage:
      "Sind Sie sicher, dass Sie dieses Ergänzungsmittel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    pagination: (start: number, end: number, total: number) =>
      `Zeige ${start} bis ${end} von ${total} Supplements`,
    previous: "Zurück",
    next: "Weiter",
  },
};

interface SupplementsPageProps {
  athleteId?: string;
}

export default function SupplementsPage({ athleteId }: SupplementsPageProps) {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.language);
  const { supplements, loading, error, successMessage, currentAthleteId, total, page: currentPageFromStore } =
    useAppSelector((state) => state.coachSupplement);
  const t = translations[language as keyof typeof translations];

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] =
    useState<Supplement | null>(null);
  const [supplementToDelete, setSupplementToDelete] = useState<string | null>(
    null,
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

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

  // Fetch supplements when athleteId, page, or debounced search changes
  useEffect(() => {
    if (athleteId && searchQuery === debouncedSearch) {
      dispatch(
        getAllSupplements({
          athleteId,
          page: currentPage,
          limit: 12,
          search: debouncedSearch || undefined,
        }),
      );
    }
  }, [dispatch, athleteId, currentPage, debouncedSearch, searchQuery]);

  const isDataForCurrentAthlete = currentAthleteId === athleteId;

  // We rely on backend filtering and pagination
  const filteredSupplements = isDataForCurrentAthlete ? supplements : [];

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
      
      // If deleting last item on page, go to previous page if needed
      if (supplements.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Refetch current page
        dispatch(
          getAllSupplements({
            athleteId,
            page: currentPage,
            limit: 12,
            search: debouncedSearch || undefined,
          }),
        );
      }

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
    } else {
      // Add new
      await dispatch(
        createSupplement({
          athleteId,
          data,
        }),
      );
    }
    
    // Refetch after update or create to ensure list is consistent
    dispatch(
      getAllSupplements({
        athleteId,
        limit: 12,
        page: currentPage,
        search: debouncedSearch || undefined,
      })
    );

    setIsFormModalOpen(false);
    setSelectedSupplement(null);
  };

  const totalPages = Math.ceil(total / 12);
  const startIndex = total === 0 ? 0 : (currentPage - 1) * 12 + 1;
  const endIndex = Math.min(currentPage * 12, total);

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
        {!isDataForCurrentAthlete || (loading && supplements.length === 0) ? (
          <div className="text-white">Loading...</div>
        ) : (
          <>
            <SupplementsList
              supplements={filteredSupplements}
              onEdit={handleEditSupplement}
              onDelete={handleDeleteSupplement}
            />
            
            {/* Pagination Controls */}
            {total > 0 && (
              <div className="flex items-center justify-between bg-[#08081A] border border-[#303245] rounded-lg mt-6 px-4 py-4">
                <div className="text-sm text-gray-400">
                  {t.pagination(startIndex, endIndex, total)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="p-2 border border-[#303245] rounded-lg hover:bg-[#1a1b2b] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t.previous}
                  </button>
                  <div className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0 || loading}
                    className="p-2 border border-[#303245] rounded-lg hover:bg-[#1a1b2b] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t.next}
                  </button>
                </div>
              </div>
            )}
          </>
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
