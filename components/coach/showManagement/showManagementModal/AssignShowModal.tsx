"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Show } from "@/redux/features/show/showTypes";
import { getAllAthletesByCoach } from "@/redux/features/athlete/athleteSlice";
import { assignShowToAthlete } from "@/redux/features/show/showSlice";
import toast from "react-hot-toast";

interface AssignShowModalProps {
    show: Show;
    onClose: () => void;
}

const translations = {
    en: {
        title: "Assign Show",
        subtitle: (name: string) => `Assign the show "${name}" to athletes.`,
        label: "Assign Athletes",
        placeholder: "Search athlete...",
        noAthletes: "No athletes found",
        cancel: "Cancel",
        assign: "Assign",
        selectAthleteError: "Please select at least one athlete",
    },
    de: {
        title: "Show zuweisen",
        subtitle: (name: string) => `Weisen Sie die Show "${name}" Athleten zu.`,
        label: "Athleten zuweisen",
        placeholder: "Athleten suchen...",
        noAthletes: "Keine Athleten gefunden",
        cancel: "Abbrechen",
        assign: "Zuweisen",
        selectAthleteError: "Bitte wählen Sie mindestens einen Athleten aus",
    },
};

export default function AssignShowModal({ show, onClose }: AssignShowModalProps) {
    const dispatch = useAppDispatch();
    const { athletes, loading: athletesLoading } = useAppSelector((state) => state.athlete);
    const { loading: assignLoading, successMessage, error } = useAppSelector((state) => state.show);
    const { language } = useAppSelector((state) => state.language);
    const t = translations[language as keyof typeof translations] || translations.en;

    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedAthletes, setSelectedAthletes] = useState<{ id: string; name: string }[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(getAllAthletesByCoach());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage && successMessage.includes("assigned")) {
            onClose();
        }
    }, [successMessage, onClose]);

    const filteredAthletes = athletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedAthletes.some((selected) => selected.id === athlete._id)
    );

    const handleAssign = () => {
        if (selectedAthletes.length > 0) {
            dispatch(assignShowToAthlete({ 
                showId: show._id, 
                athleteIds: selectedAthletes.map(a => a.id) 
            }));
        } else {
            toast.error(t.selectAthleteError);
        }
    };

    const toggleAthlete = (athlete: { id: string; name: string }) => {
        setSelectedAthletes(prev => [...prev, athlete]);
        setSearchQuery("");
        setShowDropdown(false);
    };

    const removeAthlete = (id: string) => {
        setSelectedAthletes(prev => prev.filter(a => a.id !== id));
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

                    <h2 className="text-2xl font-bold mb-2 text-white">
                        {t.title}
                    </h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        {t.subtitle(show.name)}
                    </p>

                    <div className="space-y-6">
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-semibold mb-2 text-emerald-300">
                                {t.label}
                            </label>

                            {/* Selected Athletes Tags */}
                            {selectedAthletes.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedAthletes.map((athlete) => (
                                        <div 
                                            key={athlete.id}
                                            className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1 text-emerald-400 text-xs font-medium animate-in zoom-in-50 duration-200"
                                        >
                                            <span>{athlete.name}</span>
                                            <button 
                                                onClick={() => removeAthlete(athlete.id)}
                                                className="hover:text-emerald-300 transition-colors"
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
                                    {athletesLoading ? (
                                        <div className="p-4 flex justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                        </div>
                                    ) : filteredAthletes.length > 0 ? (
                                        filteredAthletes.map((athlete) => (
                                            <button
                                                key={athlete._id}
                                                type="button"
                                                onClick={() => toggleAthlete({ id: athlete._id, name: athlete.name })}
                                                className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 flex items-center gap-3 transition-colors border-b border-[#303245]/50 last:border-0"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-emerald-400">
                                                    <User size={16} />
                                                </div>
                                                <span className="text-white text-sm">{athlete.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            {searchQuery ? t.noAthletes : "Type to search..."}
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
                                disabled={assignLoading || selectedAthletes.length === 0}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {assignLoading ? (
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
