import { useState, useEffect, useMemo } from "react";
import { Clock, Dumbbell, TrendingUp, Loader2, Calendar, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTrainingHistory } from "@/redux/features/trainingHistory/trainingHistorySlice";
import { TrainingHistoryItem, PushSet } from "@/redux/features/trainingHistory/trainingHistoryTypes";
import toast from "react-hot-toast";

interface TrainingHistoryProps {
    athleteId?: string;
}

const TrainingHistory = ({ athleteId }: TrainingHistoryProps) => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector((state) => state.trainingHistory);

    const { histories, pr } = data;
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

    // Group workouts by month
    const workoutsByMonth = useMemo(() => {
        const grouped: Record<string, TrainingHistoryItem[]> = {};
        if (!histories || histories.length === 0) return grouped;

        histories.forEach((history: TrainingHistoryItem) => {
            const date = new Date(history.createdAt);
            const monthYear = date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            });

            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }
            grouped[monthYear].push(history);
        });

        return grouped;
    }, [histories]);

    const months = useMemo(() => Object.keys(workoutsByMonth), [workoutsByMonth]);

    const selectedWorkouts = selectedMonth ? workoutsByMonth[selectedMonth] : [];

    // Set default selected month and workout
    useEffect(() => {
        if (months.length > 0 && !selectedMonth) {
            setSelectedMonth(months[0]);
        }
    }, [months, selectedMonth]);

    useEffect(() => {
        if (selectedWorkouts.length > 0) {
            setSelectedWorkoutId(selectedWorkouts[0]._id);
        } else {
            setSelectedWorkoutId(null);
        }
    }, [selectedWorkouts]);

    // Fetch training history on component mount or athleteId change
    useEffect(() => {
        if (athleteId) {
            dispatch(fetchTrainingHistory(athleteId));
        } else {
            dispatch(fetchTrainingHistory());
        }
    }, [dispatch, athleteId]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Set default selected month
    useEffect(() => {
        if (months.length > 0 && !selectedMonth) {
            setSelectedMonth(months[0]);
        }
    }, [months, selectedMonth]);

    // Format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    // Group sets by exercise name for detailed view
    const groupSetsByExercise = (pushData: PushSet[]) => {
        const grouped: Record<string, PushSet[]> = {};
        pushData.forEach((set) => {
            if (!grouped[set.exerciseName]) {
                grouped[set.exerciseName] = [];
            }
            grouped[set.exerciseName].push(set);
        });
        return grouped;
    };

    const activeWorkout = useMemo(() => {
        return selectedWorkouts.find(w => w._id === selectedWorkoutId) || selectedWorkouts[0];
    }, [selectedWorkouts, selectedWorkoutId]);

    // Calculate total weight based on actual reps (the 'set' field in backend)
    const calculateTotalWeight = (pushData: PushSet[]) => {
        return pushData.reduce((acc, s) => acc + (s.weight * (Number(s.set) || 0)), 0);
    };

    if (loading && histories.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                    <p className="text-gray-400">Loading training history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with PR Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Training History</h2>
                    <p className="text-gray-400 mt-1">Track athlete training history and personal records</p>
                </div>

                {pr?.volumePR && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/40 rounded-lg">
                        <Award className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Volume PR Achieved!</span>
                    </div>
                )}
            </div>

            {/* Month Selector */}
            {months.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {months.map((month: string) => (
                        <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${selectedMonth === month
                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                : "bg-[#08081A] border-[#303245] text-gray-400 hover:bg-[#303245]"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {month}
                                <span className="ml-2 px-2 py-0.5 text-xs bg-[#1a1a2e] rounded-full">
                                    {workoutsByMonth[month].length}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {histories.length === 0 && !loading && (
                <div className="text-center py-12 border border-[#303245] rounded-lg bg-[#08081A]">
                    <Dumbbell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Training History</h3>
                    <p className="text-gray-500">There is no recorded training history for this athlete yet.</p>
                </div>
            )}

            {/* Training History Grid */}
            {selectedWorkouts.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Month Summary Card / Recent Workouts */}
                    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-emerald-500/30 rounded-lg h-fit">
                        <div className="p-6 space-y-4">
                            <div className="pb-4 border-b border-[#2a2a2a]">
                                <h3 className="text-xl font-bold mb-1">{selectedMonth}</h3>
                                <p className="text-gray-400">
                                    {selectedWorkouts.length} Workout{selectedWorkouts.length !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {/* Recent Workout Previews for this month */}
                            <div className="space-y-6">
                                {selectedWorkouts.map((workout: TrainingHistoryItem) => {
                                    const groupedExercises = groupSetsByExercise(workout.pushData);
                                    const exerciseNames = Object.keys(groupedExercises);
                                    const computedTotalWeight = calculateTotalWeight(workout.pushData);
                                    const isActive = selectedWorkoutId === workout._id;

                                    return (
                                        <div
                                            key={workout._id}
                                            onClick={() => setSelectedWorkoutId(workout._id)}
                                            className={`pb-4 border-b border-[#2a2a2a] last:border-0 last:pb-0 cursor-pointer transition-all hover:bg-white/5 group relative ${isActive ? 'bg-emerald-500/5' : ''}`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-[-24px] top-0 bottom-4 w-1 bg-emerald-500 rounded-r-full" />
                                            )}
                                            <h4 className={`font-semibold mb-2 transition-colors ${isActive ? 'text-emerald-400' : 'text-emerald-300 group-hover:text-emerald-400'}`}>
                                                {workout.trainingName}
                                            </h4>
                                            <p className="text-sm text-gray-400 mb-3">{formatDate(workout.createdAt)}</p>

                                            <div className="space-y-2">
                                                {exerciseNames.slice(0, 2).map((exName) => {
                                                    const sets = groupedExercises[exName];
                                                    const bestSet = [...sets].sort((a, b) => (b.oneRM || 0) - (a.oneRM || 0))[0];
                                                    return (
                                                        <div key={exName} className="text-sm">
                                                            <p className="text-gray-400">
                                                                {sets.length} × {exName}
                                                            </p>
                                                            <p className="text-white text-[10px] mt-0.5 opacity-70">
                                                                Best: {bestSet.weight}kg × {bestSet.set}
                                                                {bestSet.oneRM ? ` (1RM: ${bestSet.oneRM.toFixed(1)}kg)` : ''}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>
                                                        {workout.time.hour}h {workout.time.minite}m
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Dumbbell className="w-3.5 h-3.5" />
                                                    <span>{(workout.totalWeight || computedTotalWeight).toLocaleString()} kg</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Detailed View of Latest/Selected Workout */}
                    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] rounded-lg">
                        <div className="p-6 space-y-6">
                            {activeWorkout && (
                                <>
                                    <div className="pb-4 border-b border-[#2a2a2a]">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold">{activeWorkout.trainingName}</h3>
                                            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded">
                                                {formatDate(activeWorkout.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            {activeWorkout.note || "No notes for this session."}
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        {Object.entries(groupSetsByExercise(activeWorkout.pushData)).map(
                                            ([exerciseName, sets], index) => {
                                                const bestSet = [...sets].sort((a, b) => (b.oneRM || 0) - (a.oneRM || 0))[0];
                                                return (
                                                    <div key={index} className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-semibold text-white">{exerciseName}</h4>
                                                            <div className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                                                                Best 1RM: {bestSet.oneRM ? bestSet.oneRM.toFixed(1) : 'N/A'}kg
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-2">
                                                            {sets.map((set, setIdx) => (
                                                                <div
                                                                    key={setIdx}
                                                                    className="flex items-center justify-between bg-[#08081A] px-4 py-3 rounded-lg border border-[#2d2d45]"
                                                                >
                                                                    <div className="flex items-center gap-6">

                                                                        <div className="flex items-center gap-4">
                                                                            <span className="text-sm font-medium text-blue-400">Set: {set.set}</span>
                                                                            <span className="text-sm font-medium text-gray-200">
                                                                                Weight: {set.weight} kg
                                                                            </span>
                                                                            <span className="text-gray-500">×</span>
                                                                            <div className="flex items-center gap-4">

                                                                                <span className="text-sm font-medium text-gray-200  -mt-1">
                                                                                    Reps: {set.repRange}
                                                                                </span>
                                                                                <span className="text-gray-500">×</span>
                                                                                <span className="text-sm font-medium text-gray-200">
                                                                                    RIR: {set.rir}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">

                                                                        <span className="text-xs font-semibold text-blue-400">
                                                                            1RM: {set.oneRM}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>

                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingHistory;