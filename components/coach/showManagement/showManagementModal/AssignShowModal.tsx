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
        subtitle: (name: string) => `Assign the show "${name}" to an athlete.`,
        label: "Assign Athlete",
        placeholder: "Search athlete...",
        noAthletes: "No athletes found",
        cancel: "Cancel",
        assign: "Assign",
        selectAthleteError: "Please select an athlete",
    },
    de: {
        title: "Show zuweisen",
        subtitle: (name: string) => `Weisen Sie die Show "${name}" einem Athleten zu.`,
        label: "Athlet zuweisen",
        placeholder: "Athleten suchen...",
        noAthletes: "Keine Athleten gefunden",
        cancel: "Abbrechen",
        assign: "Zuweisen",
        selectAthleteError: "Bitte wählen Sie einen Athleten aus",
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
    const [selectedAthlete, setSelectedAthlete] = useState<{ id: string; name: string } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(getAllAthletesByCoach());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage && successMessage.includes("assigned")) {
            // We only want to close if it's an assignment success
            // though clearMessages is usually called in the parent or by another effect.
            // But here we rely on the thunk's success.
            onClose();
        }
    }, [successMessage, onClose]);

    const filteredAthletes = athletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssign = () => {
        if (selectedAthlete) {
            dispatch(assignShowToAthlete({ showId: show._id, athleteId: selectedAthlete.id }));
        } else {
            toast.error(t.selectAthleteError);
        }
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
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t.placeholder}
                                    value={selectedAthlete ? selectedAthlete.name : searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (selectedAthlete) setSelectedAthlete(null);
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
                                                onClick={() => {
                                                    setSelectedAthlete({ id: athlete._id, name: athlete.name });
                                                    setSearchQuery("");
                                                    setShowDropdown(false);
                                                }}
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
                                            {t.noAthletes}
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
                                disabled={assignLoading || !selectedAthlete}
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
