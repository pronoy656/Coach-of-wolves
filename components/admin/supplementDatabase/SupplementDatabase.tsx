/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import {
  clearSupplementError,
  clearSupplementSuccess,
  createSupplement,
  CreateSupplementPayload,
  deleteSupplement,
  getAllSupplements,
  Supplement as ReduxSupplement,
  updateSupplement,
} from "@/redux/features/supplement/supplementSlice";
import toast from "react-hot-toast";
import { Edit2, Trash2, Search } from "lucide-react";
import SupplementModal from "./supplementModal/SupplementModal";
import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";

interface ComponentSupplement {
  id?: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  purpose: string;
  brand: string;
  comment: string;
}

const ITEMS_PER_PAGE = 8;

const translations = {
  en: {
    title: "Supplements",
    addButton: "+ Add Supplement",
    loadingButton: "Loading...",
    searchPlaceholder: "Search Here...",
    emptyState: "No supplements found",
    table: {
      name: "Name",
      dosage: "Dosage",
      time: "Time",
      frequency: "Frequency",
      purpose: "Purpose",
      brand: "Brand",
      comment: "Comment",
      action: "Action",
    } as Record<string, string>,
    deleteTitle: "Delete Supplement",
    deleteMessage:
      "Are you sure you want to delete this supplement? This action cannot be undone.",
    toastSaveError: "Failed to save supplement",
    toastDeleteSuccess: "Supplement deleted successfully",
    toastDeleteError: "Failed to delete supplement",
    pagination: (start: number, end: number, total: number) =>
      `Showing ${start} to ${end} of ${total} supplements`,
  },
  de: {
    title: "Supplements",
    addButton: "+ Supplement hinzufügen",
    loadingButton: "Laden...",
    searchPlaceholder: "Hier suchen...",
    emptyState: "Keine Supplements gefunden",
    table: {
      name: "Name",
      dosage: "Dosierung",
      time: "Zeitpunkt",
      frequency: "Häufigkeit",
      purpose: "Zweck",
      brand: "Marke",
      comment: "Kommentar",
      action: "Aktion",
    } as Record<string, string>,
    deleteTitle: "Supplement löschen",
    deleteMessage:
      "Möchtest du dieses Supplement wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
    toastSaveError: "Supplement konnte nicht gespeichert werden",
    toastDeleteSuccess: "Supplement erfolgreich gelöscht",
    toastDeleteError: "Supplement konnte nicht gelöscht werden",
    pagination: (start: number, end: number, total: number) =>
      `Zeige ${start} bis ${end} von ${total} Supplements`,
  },
};

export default function SupplementDatabase() {
  const dispatch = useDispatch<AppDispatch>();
  const { supplements, loading, error, successMessage, total } = useAppSelector(
    (state) => state.supplement
  );
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      getAllSupplements({
        search: searchTerm || undefined, // optional param
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearSupplementError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSupplementSuccess());
    }
  }, [error, successMessage, dispatch]);

  const handleSave = async (data: ComponentSupplement) => {
    try {
      const backendPayload: CreateSupplementPayload = {
        name: data.name,
        brand: data.brand,
        dosage: data.dosage,
        frequency: data.frequency,
        time: data.time,
        purpose: data.purpose,
        note: data.comment,
      };

      if (editingId) {
        await dispatch(
          updateSupplement({ id: editingId, data: backendPayload })
        ).unwrap();
      } else {
        await dispatch(createSupplement(backendPayload)).unwrap();
      }

      setIsModalOpen(false);
      setEditingId(null);

      dispatch(
        getAllSupplements({
          search: searchTerm || undefined,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        })
      );
    } catch (error: any) {
      toast.error(error.message || t.toastSaveError);
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteSupplement(deleteId)).unwrap();
        toast.success(t.toastDeleteSuccess);

        // If deleting last item on page, go to previous page if needed
        if (supplements.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          // Refetch current page
          dispatch(
            getAllSupplements({
              search: searchTerm || undefined,
              page: currentPage,
              limit: ITEMS_PER_PAGE,
            })
          );
        }
      } catch (error: any) {
        toast.error(error.message || t.toastDeleteError);
      }
    }
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const convertToComponentSupplement = (
    reduxSupplement: ReduxSupplement
  ): ComponentSupplement => {
    return {
      id: reduxSupplement._id,
      name: reduxSupplement.name,
      brand: reduxSupplement.brand || "",
      dosage: reduxSupplement.dosage,
      time: reduxSupplement.time,
      frequency: reduxSupplement.frequency,
      purpose: reduxSupplement.purpose,
      comment: reduxSupplement.note || "",
    };
  };

  const editingSupplement = editingId
    ? supplements.find((s) => s._id === editingId)
    : null;

  // Calculate total pages from backend `total`
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Use supplements directly — already paginated by backend
  const displayedSupplements = supplements;

  // Calculate showing range
  const startIndex = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, total);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{t.title}</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
            disabled={loading}
            className="px-6 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500/10 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.loadingButton : t.addButton}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
          />
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
        </div>

        {/* Supplements Table */}
        <div className="border border-[#303245] rounded-lg overflow-hidden bg-[#08081A] mt-10">
          {loading && supplements.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9E4A]"></div>
            </div>
          ) : displayedSupplements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t.emptyState}
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border border-[#24273f] bg-[#020231]">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {t.table.name}
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {t.table.dosage}
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {t.table.time}
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {t.table.frequency}
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {t.table.purpose}
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {t.table.brand}
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {t.table.comment}
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {t.table.action}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSupplements.map((supplement, index) => {
                    const componentSupplement =
                      convertToComponentSupplement(supplement);
                    return (
                      <tr
                        key={supplement._id}
                        className={`border-b bg-[#212133] border-[#303245] hover:bg-[#212133] transition-colors ${
                          index % 2 === 0 ? "bg-background/50" : "bg-background"
                        }`}
                      >
                        <td className="py-3 px-4 text-primary font-medium">
                          {componentSupplement.name}
                        </td>
                        <td className="py-3 px-4 text-primary font-medium">
                          {componentSupplement.dosage}
                        </td>
                        <td className="py-3 px-4 text-primary font-medium">
                          {componentSupplement.time}
                        </td>
                        <td className="py-3 px-4 text-primary font-medium">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              componentSupplement.frequency === "Once daily"
                                ? "bg-blue-500/20 text-blue-400"
                                : componentSupplement.frequency === "2x Daily"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {componentSupplement.frequency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-primary font-medium">
                          {componentSupplement.purpose}
                        </td>
                        <td className="py-3 px-4 text-primary font-medium">
                          {componentSupplement.brand}
                        </td>
                        <td className="py-3 px-4 text-primary font-medium">
                          {componentSupplement.comment}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(supplement._id)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                              disabled={loading}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(supplement._id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between bg-card border-t border-[#303245] px-4 py-4">
                <div className="text-sm text-muted-foreground">
                  {t.pagination(startIndex, endIndex, total)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="p-2 border border-[#4A9E4A] rounded-lg hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages || 1, p + 1))
                    }
                    disabled={
                      currentPage === totalPages || totalPages === 0 || loading
                    }
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
          initialData={
            editingSupplement
              ? convertToComponentSupplement(editingSupplement)
              : undefined
          }
        />
      )}

      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          title={t.deleteTitle}
          message={t.deleteMessage}
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
