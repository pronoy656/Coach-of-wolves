// import { Clock, Dumbbell, TrendingUp } from "lucide-react";
// import React from "react";

// const TrainingHistory = () => {
//     return (
//         <div>
//             {/* Training History Section */}
//             <div className="space-y-4">
//                 <h2 className="text-3xl font-bold">Training History</h2>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {/* History Card 1 */}
//                     <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-emerald-500/30 shadow-lg rounded-lg">
//                         <div className="p-6 space-y-4">
//                             <div className="pb-4 border-b border-[#2a2a2a]">
//                                 <h3 className="text-xl font-bold mb-2">November</h3>
//                                 <p className="text-gray-400">9 Workouts</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold mb-2">Pull Fullbody</h4>
//                                 <p className="text-sm text-gray-400 mb-3">
//                                     Tuesday, 18 November 2025 at 16:52
//                                 </p>
//                                 <div className="space-y-3">
//                                     <div className="text-sm">
//                                         <p className="text-gray-400">
//                                             Sets / Bestes Set → Best Set
//                                         </p>
//                                         <p className="text-white mt-1">
//                                             2 × Seated Row (Machine) → Best: 68 kg × 8 @ 10 [F]
//                                         </p>
//                                     </div>
//                                     <div className="text-sm">
//                                         <p className="text-white">
//                                             2 × Wide Row Machine → Best: 65 kg × 7 @ 10 [F]
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#2a2a2a] text-sm">
//                                     <div className="flex items-center gap-2">
//                                         <Clock className="w-4 h-4 text-gray-400" />
//                                         <span>1 h 31 m</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <Dumbbell className="w-4 h-4 text-gray-400" />
//                                         <span>5000(kg)</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <TrendingUp className="w-4 h-4 text-emerald-500" />
//                                         <span className="text-emerald-500">0 PRs</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* History Card 2 */}
//                     <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] shadow-lg rounded-lg">
//                         <div className="p-6 space-y-4">
//                             <div className="pb-4 border-b border-[#2a2a2a]">
//                                 <h3 className="text-xl font-bold mb-2">
//                                     Tuesday, 18 November 2025 at 16:52
//                                 </h3>
//                                 <p className="text-gray-400">
//                                     Warm up the rotator cuffs and hips
//                                 </p>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <div className="flex items-center justify-between mb-2">
//                                         <h4 className="font-semibold">Seated Row (Machine)</h4>
//                                         <span className="text-sm text-gray-400">1 Rm</span>
//                                     </div>
//                                     <div className="space-y-1 text-sm">
//                                         <div className="flex justify-between">
//                                             <span className="text-gray-400">36 kg x 6</span>
//                                             <span>42</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="text-gray-400">50 kg x 6</span>
//                                             <span>51</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="flex items-center justify-between mb-2">
//                                         <h4 className="font-semibold">Wide Row (Machine)</h4>
//                                         <span className="text-sm text-gray-400">1 Rm</span>
//                                     </div>
//                                     <div className="space-y-1 text-sm">
//                                         <div className="flex justify-between">
//                                             <span className="text-gray-400">20 kg x 6</span>
//                                             <span>23</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="text-gray-400">40 kg x 2</span>
//                                             <span>41</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TrainingHistory;




import { useState, useEffect } from "react";
import { Clock, Dumbbell, TrendingUp, Loader2, Calendar, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTrainingHistory } from "@/redux/features/trainingHistory/trainingHistorySlice";
import { Workout, Exercise } from "@/redux/features/trainingHistory/trainingHistoryTypes"; // Import types
import toast from "react-hot-toast";

const TrainingHistory = () => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector((state) => state.trainingHistory);

    const { histories, pr } = data;
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    // Fetch training history on component mount
    useEffect(() => {
        dispatch(fetchTrainingHistory());
    }, [dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Group workouts by month
    const groupWorkoutsByMonth = () => {
        const grouped: Record<string, Workout[]> = {};

        histories.forEach((workout: Workout) => {
            const date = new Date(workout.date);
            const monthYear = date.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });

            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }
            grouped[monthYear].push(workout);
        });

        return grouped;
    };

    const workoutsByMonth = groupWorkoutsByMonth();
    const months = Object.keys(workoutsByMonth);

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
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    // Format month for display
    const formatMonth = (monthYear: string) => {
        const [month, year] = monthYear.split(' ');
        return `${month} ${year}`;
    };

    // Get selected month workouts
    const selectedWorkouts = selectedMonth ? workoutsByMonth[selectedMonth] : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                    <p className="text-gray-400">Loading training history...</p>
                </div>
            </div>
        );
    }

    // Calculate total sets for a workout
    const calculateTotalSets = (exercises: Exercise[]): number => {
        return exercises.reduce((total: number, ex: Exercise) => {
            return total + (ex.sets?.length || 0);
        }, 0);
    };

    return (
        <div className="space-y-6">
            {/* Header with PR Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Training History</h2>
                    <p className="text-gray-400 mt-1">Track athlete training history and personal records</p>
                </div>

                {pr.volumePR && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/40 rounded-lg">
                        <Award className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Volume PR Achieved!</span>
                    </div>
                )}
            </div>

            {/* Month Selector */}
            {months.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
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
                                {formatMonth(month)}
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

                </div>
            )}

            {/* Training History Grid */}
            {selectedWorkouts.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Month Summary Card */}
                    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-emerald-500/30 rounded-lg">
                        <div className="p-6 space-y-4">
                            <div className="pb-4 border-b border-[#2a2a2a]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{formatMonth(selectedMonth!)}</h3>
                                        <p className="text-gray-400">{selectedWorkouts.length} Workout{selectedWorkouts.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    {pr.volumePR && (
                                        <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                                            <span className="text-emerald-400 text-sm font-medium">PR</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Workout Preview */}
                            {selectedWorkouts.slice(0, 2).map((workout: Workout, index: number) => (
                                <div key={index} className="pb-4 border-b border-[#2a2a2a] last:border-0 last:pb-0">
                                    <h4 className="font-semibold mb-2 text-emerald-300">{workout.workoutType}</h4>
                                    <p className="text-sm text-gray-400 mb-3">
                                        {formatDate(workout.date)}
                                    </p>

                                    {workout.exercises && workout.exercises.length > 0 && (
                                        <div className="space-y-3">
                                            {workout.exercises.slice(0, 2).map((exercise: Exercise, exIndex: number) => (
                                                <div key={exIndex} className="text-sm">
                                                    <p className="text-gray-400 mb-1">
                                                        {exercise.sets?.length || 0} × {exercise.name}
                                                    </p>
                                                    {exercise.bestSet && (
                                                        <p className="text-white mt-1">
                                                            Best: {exercise.bestSet.weight} kg × {exercise.bestSet.reps}
                                                            {exercise.bestSet.rpe && ` @ ${exercise.bestSet.rpe}`}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mt-4 pt-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{workout.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Dumbbell className="w-4 h-4 text-gray-400" />
                                            <span>{workout.totalVolume.toLocaleString()}(kg)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            <span className="text-emerald-500">{workout.prCount} PRs</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Workout View */}
                    {selectedWorkouts[0] && (
                        <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] rounded-lg">
                            <div className="p-6 space-y-4">
                                <div className="pb-4 border-b border-[#2a2a2a]">
                                    <h3 className="text-xl font-bold mb-2">
                                        {formatDate(selectedWorkouts[0].date)}
                                    </h3>
                                    <p className="text-gray-400">
                                        {selectedWorkouts[0].notes || "No notes provided"}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {selectedWorkouts[0].exercises && selectedWorkouts[0].exercises.length > 0 ? (
                                        selectedWorkouts[0].exercises.map((exercise: Exercise, index: number) => (
                                            <div key={index} className="pb-4 border-b border-[#2a2a2a] last:border-0 last:pb-0">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-lg">{exercise.name}</h4>
                                                    {exercise.bestSet && (
                                                        <span className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                                                            Best: {exercise.bestSet.weight}kg × {exercise.bestSet.reps}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    {exercise.sets && exercise.sets.length > 0 ? (
                                                        exercise.sets.map((set: any, setIndex: number) => (
                                                            <div key={setIndex} className="flex justify-between items-center bg-[#0f0f1e] px-4 py-3 rounded-lg border border-[#2a2a2a]">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-gray-400">Set {setIndex + 1}</span>
                                                                    <span className="text-white font-medium">
                                                                        {set.weight} kg × {set.reps} reps
                                                                    </span>
                                                                </div>
                                                                {set.rpe && (
                                                                    <span className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded text-sm">
                                                                        RPE: {set.rpe}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-400 text-sm">No sets recorded</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400">No exercises recorded for this workout</p>
                                        </div>
                                    )}
                                </div>

                                {/* Workout Stats */}
                                <div className="pt-4 border-t border-[#2a2a2a]">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-emerald-400">{selectedWorkouts[0].exercises?.length || 0}</div>
                                            <div className="text-sm text-gray-400">Exercises</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-400">
                                                {selectedWorkouts[0].exercises ? calculateTotalSets(selectedWorkouts[0].exercises) : 0}
                                            </div>
                                            <div className="text-sm text-gray-400">Total Sets</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-amber-400">{selectedWorkouts[0].prCount}</div>
                                            <div className="text-sm text-gray-400">PRs</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Month Navigation */}
            {months.length > 1 && (
                <div className="flex justify-center gap-4 pt-6">
                    <button
                        onClick={() => {
                            const currentIndex = months.indexOf(selectedMonth!);
                            if (currentIndex > 0) {
                                setSelectedMonth(months[currentIndex - 1]);
                            }
                        }}
                        disabled={months.indexOf(selectedMonth!) === 0}
                        className="px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-gray-400 hover:text-white hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous Month
                    </button>
                    <button
                        onClick={() => {
                            const currentIndex = months.indexOf(selectedMonth!);
                            if (currentIndex < months.length - 1) {
                                setSelectedMonth(months[currentIndex + 1]);
                            }
                        }}
                        disabled={months.indexOf(selectedMonth!) === months.length - 1}
                        className="px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-gray-400 hover:text-white hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next Month
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrainingHistory;