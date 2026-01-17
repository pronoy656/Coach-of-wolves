/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Search, Edit2, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import {
  getAllAthletes,
  deleteAthlete,
  Athlete as ReduxAthlete,
  clearAthleteError,
  clearAthleteSuccess,
  setSearchQuery as setReduxSearchQuery,
  setSelectedStatus as setReduxSelectedStatus,
  setSelectedCategory as setReduxSelectedCategory,
  setSelectedPhase as setReduxSelectedPhase,
  setSelectedGender as setReduxSelectedGender,
} from "@/redux/features/athlete/athleteSlice";
import toast from "react-hot-toast";
import AddAthleteModal from "./addAthleteModal/AddAthleteModal";

import Image from "next/image";
import { getFullImageUrl } from "@/lib/utils";

const translations = {
  en: {
    deleteTitle: "Delete Athlete",
    deleteMessage:
      "Are you sure you want to delete this athlete? This action cannot be undone.",
    cancel: "Cancel",
    delete: "Delete",
    title: "Athletes Management",
    subtitleTotal: "Total Athletes",
    subtitleShowing: "Showing",
    searchPlaceholder: "Search by name, category, or email...",
    statusAll: "All Status",
    statusNatural: "Natural",
    statusEnhanced: "Enhanced",
    phaseAll: "All Phases",
    categoryPlaceholder: "Category",
    genderAll: "All Genders",
    genderMale: "Male",
    genderFemale: "Female",
    addButtonLoading: "Loading...",
    addButton: "+ Add Athlete",
    thProfile: "Profile",
    thName: "Name",
    thGender: "Gender",
    thAge: "Age",
    thCategory: "Category",
    thPhase: "Phase",
    thWeight: "Weight (kg)",
    thHeight: "Height (cm)",
    thStatus: "Status",
    thLastCheckin: "Last Check-in",
    thWater: "Water (L)",
    thAction: "Action",
    emptyState: "No athletes found matching your filters",
    emptyAddFirst: "+ Add Your First Athlete",
    statusNaturalBadge: "Natural",
    statusEnhancedBadge: "Enhanced",
    editTitle: "Edit",
    deleteTitleAction: "Delete",
    phases: {
      "All Phases": "All Phases",
      "Pre-Prep": "Pre-Prep",
      Offseason: "Offseason",
      "Peak Week": "Peak Week",
      Prep: "Prep",
      "Diet-Break": "Diet-Break",
      "Fat-Reduction Phase": "Fat-Reduction Phase",
      "Reverse-Diet-Phase": "Reverse-Diet-Phase",
    } as Record<string, string>,
    categoryLabels: {
      Lifestyle: "Lifestyle",
      Fitmodel: "Fitmodel",
      Bikini: "Bikini",
      Figure: "Figure",
      Wellness: "Wellness",
      "Women's Physique": "Women's Physique",
      "Women's Bodybuilding": "Women's Bodybuilding",
      "Men's Physique": "Men's Physique",
      "Classic Physique": "Classic Physique",
      "212 Bodybuilding": "212 Bodybuilding",
      Bodybuilding: "Bodybuilding",
      Other: "Other",
    } as Record<string, string>,
  },
  de: {
    deleteTitle: "Athlet löschen",
    deleteMessage:
      "Möchten Sie diesen Athleten wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
    cancel: "Abbrechen",
    delete: "Löschen",
    title: "Athletenverwaltung",
    subtitleTotal: "Gesamt Athleten",
    subtitleShowing: "Angezeigt",
    searchPlaceholder: "Suche nach Name, Kategorie oder E-Mail...",
    statusAll: "Alle Status",
    statusNatural: "Natural",
    statusEnhanced: "Enhanced",
    phaseAll: "Alle Phasen",
    categoryPlaceholder: "Kategorie",
    genderAll: "Alle Geschlechter",
    genderMale: "Männlich",
    genderFemale: "Weiblich",
    addButtonLoading: "Laden...",
    addButton: "+ Athlet hinzufügen",
    thProfile: "Profil",
    thName: "Name",
    thGender: "Geschlecht",
    thAge: "Alter",
    thCategory: "Kategorie",
    thPhase: "Phase",
    thWeight: "Gewicht (kg)",
    thHeight: "Größe (cm)",
    thStatus: "Status",
    thLastCheckin: "Letzter Check-in",
    thWater: "Wasser (L)",
    thAction: "Aktion",
    emptyState: "Keine Athleten entsprechen deinen Filtern",
    emptyAddFirst: "+ Ersten Athleten hinzufügen",
    statusNaturalBadge: "Natural",
    statusEnhancedBadge: "Enhanced",
    editTitle: "Bearbeiten",
    deleteTitleAction: "Löschen",
    phases: {
      "All Phases": "Alle Phasen",
      "Pre-Prep": "Pre-Prep",
      Offseason: "Offseason",
      "Peak Week": "Peak Week",
      Prep: "Prep",
      "Diet-Break": "Diet-Break",
      "Fat-Reduction Phase": "Fat-Reduction Phase",
      "Reverse-Diet-Phase": "Reverse-Diet-Phase",
    } as Record<string, string>,
    categoryLabels: {
      Lifestyle: "Lifestyle",
      Fitmodel: "Fitmodel",
      Bikini: "Bikini",
      Figure: "Figur",
      Wellness: "Wellness",
      "Women's Physique": "Women's Physique",
      "Women's Bodybuilding": "Women's Bodybuilding",
      "Men's Physique": "Men's Physique",
      "Classic Physique": "Classic Physique",
      "212 Bodybuilding": "212 Bodybuilding",
      Bodybuilding: "Bodybuilding",
      Other: "Andere",
    } as Record<string, string>,
  },
};

const STATUS_OPTIONS = ["ALL_STATUS", "Natural", "Enhanced"];
const PHASE_OPTIONS = [
  "ALL_PHASES",
  "Pre-Prep",
  "Offseason",
  "Peak Week",
  "Prep",
  "Diet-Break",
  "Fat-Reduction Phase",
  "Reverse-Diet-Phase",
];
const GENDER_OPTIONS = ["ALL_GENDERS", "Male", "Female"];

export default function AthleteManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    athletes,
    loading,
    error,
    successMessage,
    searchQuery: reduxSearchQuery,
    selectedStatus: reduxSelectedStatus,
    selectedCategory: reduxSelectedCategory,
    selectedPhase: reduxSelectedPhase,
    selectedGender: reduxSelectedGender,
  } = useAppSelector((state) => state.athlete);
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];
  const dateLocale = language === "de" ? "de-DE" : "en-US";

  const [searchTerm, setSearchTerm] = useState(reduxSearchQuery);
  const [statusFilter, setStatusFilter] = useState(
    reduxSelectedStatus || "ALL_STATUS"
  );
  const [phaseFilter, setPhaseFilter] = useState(
    reduxSelectedPhase || "ALL_PHASES"
  );
  const [categoryFilter, setCategoryFilter] = useState(
    reduxSelectedCategory || "CATEGORY_ALL"
  );
  const [genderFilter, setGenderFilter] = useState(
    reduxSelectedGender || "ALL_GENDERS"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<ReduxAthlete | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  // Load athletes on component mount
  useEffect(() => {
    dispatch(getAllAthletes({}));
  }, [dispatch]);

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAthleteError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAthleteSuccess());
    }
  }, [error, successMessage, dispatch]);

  // Update Redux state when local filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setReduxSearchQuery(searchTerm));
      dispatch(setReduxSelectedStatus(statusFilter));
      dispatch(setReduxSelectedCategory(categoryFilter));
      dispatch(setReduxSelectedPhase(phaseFilter));
      dispatch(setReduxSelectedGender(genderFilter));

      // Fetch athletes with updated filters
      dispatch(
        getAllAthletes({
          search: searchTerm !== "" ? searchTerm : undefined,
          status: statusFilter !== "ALL_STATUS" ? statusFilter : undefined,
          category:
            categoryFilter !== "CATEGORY_ALL" ? categoryFilter : undefined,
          phase: phaseFilter !== "ALL_PHASES" ? phaseFilter : undefined,
          gender: genderFilter !== "ALL_GENDERS" ? genderFilter : undefined,
        })
      );
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    statusFilter,
    categoryFilter,
    phaseFilter,
    genderFilter,
    dispatch,
  ]);

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      const matchesSearch =
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL_STATUS" || athlete.status === statusFilter;

      const matchesPhase =
        phaseFilter === "ALL_PHASES" || athlete.phase === phaseFilter;

      const matchesCategory =
        categoryFilter === "CATEGORY_ALL" ||
        athlete.category === categoryFilter;

      const matchesGender =
        genderFilter === "ALL_GENDERS" || athlete.gender === genderFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPhase &&
        matchesCategory &&
        matchesGender
      );
    });
  }, [
    athletes,
    searchTerm,
    statusFilter,
    categoryFilter,
    phaseFilter,
    genderFilter,
  ]);

  const handleAddAthlete = () => {
    setSelectedAthlete(null);
    setIsModalOpen(true);
  };

  const handleEditAthlete = (athlete: ReduxAthlete) => {
    setSelectedAthlete(athlete);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteConfirm = async () => {
    if (showDeleteConfirm) {
      try {
        await dispatch(deleteAthlete(showDeleteConfirm)).unwrap();
        toast.success("Athlete deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete athlete");
      }
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    return status === "Natural"
      ? "bg-green-500/20 text-green-400"
      : "bg-orange-500/20 text-amber-400";
  };

  const allCategories = useMemo(() => {
    const categories = new Set<string>(["CATEGORY_ALL"]);
    athletes.forEach((athlete) => {
      if (athlete.category) {
        categories.add(athlete.category);
      }
    });
    return Array.from(categories);
  }, [athletes]);

  return (
    <main className="h-screen bg-black p-6 flex flex-col overflow-hidden">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {t.deleteTitle}
            </h3>
            <p className="text-slate-300 mb-6">{t.deleteMessage}</p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white font-semibold hover:bg-slate-800/70 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">
            {t.subtitleTotal}: {athletes.length} | {t.subtitleShowing}:{" "}
            {filteredAthletes.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-10 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              disabled={loading}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-[#4A9E4A] transition-colors appearance-none cursor-pointer"
              disabled={loading}
            >
              <option value="ALL_STATUS">{t.statusAll}</option>
              {STATUS_OPTIONS.filter((s) => s !== "ALL_STATUS").map(
                (status) => (
                  <option key={status} value={status}>
                    {status === "Natural" ? t.statusNatural : t.statusEnhanced}
                  </option>
                )
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500/50 pointer-events-none" />
          </div>

          {/* Phase Filter */}
          <div className="relative">
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-[#4A9E4A] transition-colors appearance-none cursor-pointer"
              disabled={loading}
            >
              <option value="ALL_PHASES">{t.phaseAll}</option>
              {PHASE_OPTIONS.filter((p) => p !== "ALL_PHASES").map((phase) => (
                <option key={phase} value={phase}>
                  {t.phases[phase] ?? phase}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500/50 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-[#4A9E4A] transition-colors appearance-none cursor-pointer"
              disabled={loading}
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "CATEGORY_ALL"
                    ? t.categoryPlaceholder
                    : t.categoryLabels[cat] ?? cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500/50 pointer-events-none" />
          </div>

          {/* Gender Filter */}
          <div className="relative">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-[#4A9E4A] transition-colors appearance-none cursor-pointer"
              disabled={loading}
            >
              {GENDER_OPTIONS.map((gender) => (
                <option key={gender} value={gender}>
                  {gender === "ALL_GENDERS"
                    ? t.genderAll
                    : gender === "Male"
                    ? t.genderMale
                    : t.genderFemale}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500/50 pointer-events-none" />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddAthlete}
            disabled={loading}
            className="px-6 py-3 border-2 border-green-500 text-green-500 rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.addButtonLoading : t.addButton}
          </button>
        </div>

        {loading && athletes.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9E4A]"></div>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-[#24273f] bg-slate-800/30 flex-1 overflow-hidden flex flex-col">
              <div className="overflow-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-none  scrollbar-track-transparent">
                <table className="w-full whitespace-nowrap">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b border-[#24273f] bg-[#020231]">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thProfile}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thName}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thGender}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thAge}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thCategory}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thPhase}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thWeight}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thHeight}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thStatus}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thLastCheckin}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thWater}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        {t.thAction}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAthletes.map((athlete, index) => (
                      <tr
                        key={athlete._id}
                        className={`border-b bg-[#212133] border-[#303245] hover:bg-[#1b1b2b] transition-colors ${
                          index % 2 === 0 ? "bg-[#212133]/50" : "bg-background"
                        }`}
                      >
                        <td className="px-6 py-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden relative">
                            <Image
                              src={getFullImageUrl(athlete.image)}
                              alt={athlete.name}
                              width={40}
                              height={40}
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">
                            {athlete.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {athlete.email}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-white">
                          {athlete.gender === "Male"
                            ? t.genderMale
                            : athlete.gender === "Female"
                            ? t.genderFemale
                            : athlete.gender}
                        </td>
                        <td className="px-6 py-3 text-white">{athlete.age}</td>
                        <td className="px-6 py-3 text-green-500">
                          {t.categoryLabels[athlete.category] ??
                            athlete.category}
                        </td>
                        <td className="px-6 py-3 text-white">
                          {t.phases[athlete.phase] ?? athlete.phase}
                        </td>
                        <td className="px-6 py-3 text-white">
                          {athlete.weight}
                        </td>
                        <td className="px-6 py-3 text-white">
                          {athlete.height}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3.5 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                              athlete.status
                            )}`}
                          >
                            {athlete.status === "Natural"
                              ? t.statusNaturalBadge
                              : t.statusEnhancedBadge}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-white">
                          {new Date(athlete.updatedAt).toLocaleDateString(
                            dateLocale,
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 text-white">
                          <p> {athlete.waterQuantity} L</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditAthlete(athlete)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                              title={t.editTitle}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(athlete._id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                              title={t.deleteTitleAction}
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

            {/* Empty State */}
            {filteredAthletes.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-slate-400">{t.emptyState}</p>
                <button
                  onClick={handleAddAthlete}
                  className="mt-4 px-6 py-2 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-full hover:bg-[#4A9E4A]/10 transition-colors font-medium"
                >
                  {t.emptyAddFirst}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AddAthleteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAthlete(null);
        }}
        athlete={selectedAthlete}
      />
    </main>
  );
}
