import { useState, useEffect } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
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
    loading: "Loading...",
    pageOf: (current: number, total: number) => `Page ${current} of ${total}`,
    noAthleteId: "No Athlete ID provided",
  },
  de: {
    title: "Nahrungsergänzungsmittel",
    addNew: "Hinzufügen",
    searchPlaceholder: "Nahrungsergänzungsmittel suchen...",
    deleteTitle: "Ergänzungsmittel löschen",
    deleteMessage:
      "Bist du sicher, dass du dieses Ergänzungsmittel löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
    pagination: (start: number, end: number, total: number) =>
      `Zeige ${start} bis ${end} von ${total} Ergänzungsmitteln`,
    previous: "Zurück",
    next: "Weiter",
    loading: "Wird geladen...",
    pageOf: (current: number, total: number) => `Seite ${current} von ${total}`,
    noAthleteId: "Keine Athleten-ID angegeben",
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
    return <div className="p-6 text-white">{t.noAthleteId}</div>;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">{t.title}</h1>
          <button
            onClick={handleAddSupplement}
            className="group flex items-center gap-2 bg-transparent border-2 border-emerald-500 text-emerald-500 text-sm font-bold hover:bg-emerald-500/10 rounded-full px-6 h-10 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>{t.addNew}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Supplements List */}
        {!isDataForCurrentAthlete || (loading && supplements.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-16 border border-[#2d2d45] rounded-xl bg-gradient-to-br from-[#141424] to-[#0f0f1e]">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
            <span className="text-sm text-gray-400 font-medium">{t.loading}</span>
          </div>
        ) : (
          <>
            <SupplementsList
              supplements={filteredSupplements}
              onEdit={handleEditSupplement}
              onDelete={handleDeleteSupplement}
            />
            
            {/* Pagination Controls */}
            {total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] rounded-xl px-6 py-4 mt-6">
                <div className="text-sm text-gray-400 font-medium">
                  {t.pagination(startIndex, endIndex, total)}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 border border-[#2d2d45] rounded-lg hover:border-emerald-500/50 hover:bg-emerald-500/10 text-sm font-medium text-gray-300 hover:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {t.previous}
                  </button>
                  <div className="text-sm text-gray-400 px-2 font-medium">
                    {t.pageOf(currentPage, totalPages || 1)}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0 || loading}
                    className="px-4 py-2 border border-[#2d2d45] rounded-lg hover:border-emerald-500/50 hover:bg-emerald-500/10 text-sm font-medium text-gray-300 hover:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
