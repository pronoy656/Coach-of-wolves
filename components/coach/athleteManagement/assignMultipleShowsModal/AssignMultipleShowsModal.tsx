"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2, Trophy } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Athlete } from "@/redux/features/coachAthletes/coachAthletesType";
import { fetchShows, assignShowToAthlete, clearMessages } from "@/redux/features/show/showSlice";
import toast from "react-hot-toast";

interface AssignMultipleShowsModalProps {
    athlete: Athlete;
    onClose: () => void;
}

const translations = {
    en: {
        title: "Assign Shows",
        subtitle: (name: string) => `Assign competitions to "${name}".`,
        label: "Select Shows",
        placeholder: "Search shows...",
        noShows: "No shows found",
        cancel: "Cancel",
        assign: "Assign",
        selectShowError: "Please select at least one show",
        success: "Shows successfully assigned!",
    },
    de: {
        title: "Shows zuweisen",
        subtitle: (name: string) => `Wettkämpfe an "${name}" zuweisen.`,
        label: "Shows auswählen",
        placeholder: "Shows suchen...",
        noShows: "Keine Shows gefunden",
        cancel: "Abbrechen",
        assign: "Zuweisen",
        selectShowError: "Bitte wählen Sie mindestens eine Show aus",
        success: "Shows erfolgreich zugewiesen!",
    },
};

export default function AssignMultipleShowsModal({ athlete, onClose }: AssignMultipleShowsModalProps) {
    const dispatch = useAppDispatch();
    const { shows, loading: showsLoading, successMessage, error } = useAppSelector((state) => state.show);
    const { language } = useAppSelector((state) => state.language);
    const t = translations[language as keyof typeof translations] || translations.en;

    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedShows, setSelectedShows] = useState<{ id: string; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchShows());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage && successMessage.includes("assigned")) {
            // We don't want to close immediately if we are looping
            if (!isSubmitting) {
                toast.success(t.success);
                dispatch(clearMessages());
                onClose();
            }
        }
        if (error) {
            toast.error(error);
            dispatch(clearMessages());
            setIsSubmitting(false);
        }
    }, [successMessage, error, onClose, isSubmitting, dispatch, t.success]);

    const filteredShows = shows.filter((show) =>
        show.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedShows.some((selected) => selected.id === show._id)
    );

    const handleAssign = async () => {
        if (selectedShows.length === 0) {
            toast.error(t.selectShowError);
            return;
        }

        setIsSubmitting(true);
        try {
            // Call API for each selected show
            const promises = selectedShows.map(show => 
                dispatch(assignShowToAthlete({ 
                    showId: show.id, 
                    userIds: [athlete._id] 
                })).unwrap()
            );

            await Promise.all(promises);
            toast.success(t.success);
            onClose();
        } catch (err: any) {
            toast.error(err || "Failed to assign some shows");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleShow = (show: { id: string; name: string }) => {
        setSelectedShows(prev => [...prev, show]);
        setSearchQuery("");
        setShowDropdown(false);
    };

    const removeShow = (id: string) => {
        setSelectedShows(prev => prev.filter(s => s.id !== id));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
                <div className="bg-[#08081A] border border-[#303245] rounded-xl p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
                        <Trophy size={28} className="text-amber-400" />
                        {t.title}
                    </h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        {t.subtitle(athlete.name)}
                    </p>

                    <div className="space-y-6">
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-semibold mb-2 text-emerald-300">
                                {t.label}
                            </label>

                            {/* Selected Shows Tags */}
                            {selectedShows.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedShows.map((show) => (
                                        <div 
                                            key={show.id}
                                            className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 text-amber-500 text-xs font-medium animate-in zoom-in-50 duration-200"
                                        >
                                            <span>{show.name}</span>
                                            <button 
                                                onClick={() => removeShow(show.id)}
                                                className="hover:text-amber-400 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t.placeholder}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    className="w-full bg-slate-800/50 border border-emerald-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            </div>

                            {showDropdown && (
                                <div className="absolute z-50 mt-1 w-full bg-[#111125] border border-[#303245] rounded-lg shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden scrollbar-none animate-in slide-in-from-top-2 duration-150">
                                    {showsLoading ? (
                                        <div className="p-4 flex justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                        </div>
                                    ) : filteredShows.length > 0 ? (
                                        filteredShows.map((show) => (
                                            <button
                                                key={show._id}
                                                type="button"
                                                onClick={() => toggleShow({ id: show._id, name: show.name })}
                                                className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 flex items-center gap-3 transition-colors border-b border-[#303245]/50 last:border-0"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-amber-500">
                                                    <Trophy size={16} />
                                                </div>
                                                <span className="text-white text-sm">{show.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            {searchQuery ? t.noShows : "Type to search..."}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white font-semibold hover:border-emerald-400 hover:bg-slate-800/70 transition-colors"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={isSubmitting || selectedShows.length === 0}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    t.assign
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
