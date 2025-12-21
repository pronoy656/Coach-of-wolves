// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { useAppSelector } from "@/redux/hooks";
// import {
//   clearExerciseError,
//   clearExerciseSuccess,
//   createExercise,
//   deleteExercise,
//   getAllExercises,
//   Exercise as ReduxExercise,
//   updateExercise,
//   setSearchQuery,
//   setSelectedMuscleGroup,
//   setSelectedDifficulty,
//   // setSelectedEquipment,
//   resetFilters,
// } from "@/redux/features/exercise/exerciseSlice";
// import toast from "react-hot-toast";
// import { Search, Dumbbell, Edit2, Trash2, Filter, X } from "lucide-react";
// import AddExerciseModal from "./addExerciseModal/AddExerciseModal";
// import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";

// interface ComponentExercise {
//   id?: string;
//   name: string;
//   description: string;
//   category: string;
//   muscleGroup: string;
//   difficulty: string;
//   equipment: string;
//   subcategories: string[];
//   iconName?: string;
//   image?: File | null;
//   video?: File | null;
// }

// const muscleGroups = [
//   "All Muscle Groups",
//   "Chest",
//   "Back",
//   "Legs",
//   "Arms",
//   "Shoulders",
//   "Core",
//   "Neck",
// ];

// const difficultyLevels = [
//   "All Difficulties",
//   "Beginner",
//   "Intermediate",
//   "Advanced",
// ];

// // Get unique equipment from backend data
// const getUniqueEquipment = (exercises: ReduxExercise[]): string[] => {
//   const equipmentSet = new Set<string>();
//   exercises.forEach((exercise) => {
//     if (exercise.equipment) {
//       equipmentSet.add(exercise.equipment);
//     }
//   });
//   return ["All Equipment", ...Array.from(equipmentSet).sort()];
// };

// export default function AdminExerciseDatabase() {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     exercises,
//     loading,
//     error,
//     successMessage,
//     searchQuery,
//     selectedMuscleGroup,
//     selectedDifficulty,
//   } = useAppSelector((state) => state.exercise);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedExercise, setSelectedExercise] =
//     useState<ComponentExercise | null>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedEquipment, setSelectedEquipment] = useState("All Equipment");
//   const [showFilters, setShowFilters] = useState(false);

//   // Get unique equipment options from exercises
//   const equipmentOptions = getUniqueEquipment(exercises);

//   // Load exercises on component mount and when filters change
//   useEffect(() => {
//     const filters = {
//       search: searchQuery,
//       page: 1,
//       limit: 10,
//       musalCategory:
//         selectedMuscleGroup === "All Muscle Groups"
//           ? undefined
//           : selectedMuscleGroup,
//       difficulty:
//         selectedDifficulty === "All Difficulties"
//           ? undefined
//           : selectedDifficulty,
//       equipment:
//         selectedEquipment === "All Equipment" ? undefined : selectedEquipment,
//     };

//     dispatch(getAllExercises(filters));
//   }, [
//     dispatch,
//     searchQuery,
//     selectedMuscleGroup,
//     selectedDifficulty,
//     selectedEquipment,
//   ]);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   useEffect(() => {
//     if (debouncedSearch !== searchQuery) {
//       dispatch(setSearchQuery(debouncedSearch));
//     }
//   }, [debouncedSearch, dispatch, searchQuery]);

//   // Handle errors and success messages
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearExerciseError());
//     }
//     if (successMessage) {
//       toast.success(successMessage);
//       dispatch(clearExerciseSuccess());
//     }
//   }, [error, successMessage, dispatch]);

//   const handleAddExercise = () => {
//     setSelectedExercise(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (exercise: ComponentExercise) => {
//     setSelectedExercise(exercise);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     setExerciseToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (exerciseToDelete) {
//       try {
//         await dispatch(deleteExercise(exerciseToDelete)).unwrap();
//         toast.success("Exercise deleted successfully");
//       } catch (error: any) {
//         toast.error(error.message || "Failed to delete exercise");
//       }
//       setShowDeleteModal(false);
//       setExerciseToDelete(null);
//     }
//   };

//   const handleSaveExercise = async (formData: ComponentExercise) => {
//     try {
//       // Convert component data to backend form data
//       const formDataPayload = {
//         name: formData.name,
//         musal: formData.muscleGroup, // Map muscleGroup to musal
//         difficulty: formData.difficulty || "Intermediate",
//         equipment: formData.equipment || "",
//         description: formData.description || "",
//         subCategory: formData.subcategories || [],
//         image: formData.image || null,
//         vedio: formData.video || null, // Map video to vedio
//       };

//       if (selectedExercise?.id) {
//         // Update existing exercise
//         await dispatch(
//           updateExercise({
//             id: selectedExercise.id,
//             data: formDataPayload,
//           })
//         ).unwrap();
//         toast.success("Exercise updated successfully");
//       } else {
//         // Create new exercise
//         await dispatch(createExercise({ data: formDataPayload })).unwrap();
//         toast.success("Exercise created successfully");
//       }

//       setIsModalOpen(false);
//       setSelectedExercise(null);

//       // Refresh the list
//       const filters = {
//         search: searchQuery,
//         page: 1,
//         limit: 10,
//         musalCategory:
//           selectedMuscleGroup === "All Muscle Groups"
//             ? undefined
//             : selectedMuscleGroup,
//         difficulty:
//           selectedDifficulty === "All Difficulties"
//             ? undefined
//             : selectedDifficulty,
//         equipment:
//           selectedEquipment === "All Equipment" ? undefined : selectedEquipment,
//       };
//       dispatch(getAllExercises(filters));
//     } catch (error: any) {
//       toast.error(error.message || "Failed to save exercise");
//     }
//   };

//   const handleMuscleGroupChange = (group: string) => {
//     dispatch(setSelectedMuscleGroup(group));
//   };

//   const handleDifficultyChange = (difficulty: string) => {
//     dispatch(setSelectedDifficulty(difficulty));
//   };

//   const handleEquipmentChange = (equipment: string) => {
//     setSelectedEquipment(equipment);
//   };

//   const handleResetFilters = () => {
//     setSearchTerm("");
//     setSelectedEquipment("All Equipment");
//     dispatch(resetFilters());
//   };

//   // Check if any filter is active
//   const isFilterActive =
//     searchQuery !== "" ||
//     selectedMuscleGroup !== "All Muscle Groups" ||
//     selectedDifficulty !== "All Difficulties" ||
//     selectedEquipment !== "All Equipment";

//   // Convert backend exercise to component exercise
//   const convertToComponentExercise = useCallback(
//     (reduxExercise: ReduxExercise): ComponentExercise => {
//       return {
//         id: reduxExercise._id,
//         name: reduxExercise.name,
//         description: reduxExercise.description || "",
//         category: reduxExercise.musal, // Use musal as category
//         muscleGroup: reduxExercise.musal, // Map musal to muscleGroup
//         difficulty: reduxExercise.difficulty || "Intermediate",
//         equipment: reduxExercise.equipment || "",
//         subcategories: reduxExercise.subCategory || [],
//         iconName: "dumbbell",
//       };
//     },
//     []
//   );

//   return (
//     <div className="flex h-screen bg-background text-foreground dark">
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <main className="flex-1 overflow-auto">
//           <div className="p-6 space-y-6">
//             {/* Header Section */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h1 className="text-3xl font-bold">Exercise Database</h1>
//                   <p className="text-muted-foreground">
//                     Global exercise library shared across all coaches
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   {isFilterActive && (
//                     <button
//                       onClick={handleResetFilters}
//                       className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
//                     >
//                       <X size={16} />
//                       Clear Filters
//                     </button>
//                   )}
//                   <button
//                     onClick={handleAddExercise}
//                     disabled={loading}
//                     className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? "Loading..." : "+ Add Exercise"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Search and Filter Bar */}
//             <div className="space-y-4">
//               {/* Main Search Bar */}
//               <div className="flex gap-4 items-center">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type="text"
//                     placeholder="Search Exercise..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     disabled={loading}
//                     className="w-full pl-10 bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                 </div>

//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="flex items-center gap-2 px-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-foreground hover:border-[#4A9E4A] transition-colors"
//                 >
//                   <Filter size={20} />
//                   Filters
//                   {isFilterActive && (
//                     <span className="w-2 h-2 bg-red-500 rounded-full"></span>
//                   )}
//                 </button>
//               </div>

//               {/* Filter Panel */}
//               {showFilters && (
//                 <div className="bg-[#08081A] border border-[#303245] rounded-lg p-4 space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Muscle Group Filter */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Muscle Group
//                       </label>
//                       <select
//                         value={selectedMuscleGroup}
//                         onChange={(e) =>
//                           handleMuscleGroupChange(e.target.value)
//                         }
//                         disabled={loading}
//                         className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {muscleGroups.map((group) => (
//                           <option key={group} value={group}>
//                             {group}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Difficulty Filter */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Difficulty
//                       </label>
//                       <select
//                         value={selectedDifficulty}
//                         onChange={(e) => handleDifficultyChange(e.target.value)}
//                         disabled={loading}
//                         className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {difficultyLevels.map((difficulty) => (
//                           <option key={difficulty} value={difficulty}>
//                             {difficulty}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Equipment Filter */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Equipment
//                       </label>
//                       <select
//                         value={selectedEquipment}
//                         onChange={(e) => handleEquipmentChange(e.target.value)}
//                         disabled={loading}
//                         className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {equipmentOptions.map((equip) => (
//                           <option key={equip} value={equip}>
//                             {equip}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Active Filters Display */}
//             {isFilterActive && (
//               <div className="flex flex-wrap gap-2">
//                 {searchQuery && (
//                   <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
//                     Search: {searchQuery}
//                   </span>
//                 )}
//                 {selectedMuscleGroup !== "All Muscle Groups" && (
//                   <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
//                     Muscle: {selectedMuscleGroup}
//                   </span>
//                 )}
//                 {selectedDifficulty !== "All Difficulties" && (
//                   <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
//                     Difficulty: {selectedDifficulty}
//                   </span>
//                 )}
//                 {selectedEquipment !== "All Equipment" && (
//                   <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
//                     Equipment: {selectedEquipment}
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* Loading State */}
//             {loading && exercises.length === 0 ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9E4A]"></div>
//               </div>
//             ) : (
//               <>
//                 {/* Exercise Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {exercises.map((reduxExercise) => {
//                     const exercise = convertToComponentExercise(reduxExercise);
//                     const difficultyColor =
//                       {
//                         Beginner:
//                           "bg-green-500/20 text-green-400 border-green-400/40",
//                         Intermediate:
//                           "bg-yellow-500/20 text-yellow-400 border-yellow-400/40",
//                         Advanced:
//                           "bg-red-500/20 text-red-400 border-red-400/40",
//                       }[exercise.difficulty] ||
//                       "bg-gray-500/20 text-gray-400 border-gray-400/40";

//                     return (
//                       <div
//                         key={exercise.id}
//                         className="bg-[#08081A] from-card to-card/80 border border-[#303245] rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col h-full group"
//                       >
//                         {/* Header with icon and actions */}
//                         <div className="flex items-start justify-between gap-4 mb-4">
//                           <div className="w-14 h-14 rounded-lg bg-linear-to-br from-green-400/30 to-emerald-500/20 flex items-center justify-center shrink-0 border border-green-400/40">
//                             <Dumbbell
//                               className="w-7 h-7 text-green-500"
//                               strokeWidth={1.5}
//                             />
//                           </div>

//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleEdit(exercise)}
//                               disabled={loading}
//                               className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
//                               title="Edit"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(exercise.id!)}
//                               disabled={loading}
//                               className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all duration-200 border border-red-500/20 hover:border-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
//                               title="Delete"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>

//                         {/* Content */}
//                         <div className="flex-1 space-y-3">
//                           <div>
//                             <div className="flex items-center space-x-4">
//                               <h3 className="text-lg font-bold text-foreground line-clamp-2">
//                                 {exercise.name}
//                               </h3>
//                               <span
//                                 className={`text-sm font-medium px-2 py-0.5 rounded-xl border ${difficultyColor}`}
//                               >
//                                 {exercise.difficulty}
//                               </span>
//                             </div>
//                             <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
//                               {exercise.description}
//                             </p>
//                           </div>

//                           {/* Info section */}
//                           <div className="space-y-2 pt-4 border-t border-[#303245]">
//                             <div className="flex justify-between items-center">
//                               <span className="text-xs text-muted-foreground font-medium">
//                                 MUSCLE GROUP
//                               </span>
//                               <span className="text-sm font-semibold text-primary">
//                                 {exercise.muscleGroup}
//                               </span>
//                             </div>

//                             <div className="flex justify-between items-center">
//                               <span className="text-xs text-muted-foreground font-medium">
//                                 EQUIPMENT
//                               </span>
//                               <span className="text-sm font-medium text-foreground">
//                                 {exercise.equipment || "None"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Subcategories */}
//                         {exercise.subcategories.length > 0 && (
//                           <div className="mt-4 pt-4 border-t border-[#303245]">
//                             <div className="flex flex-wrap gap-2">
//                               {exercise.subcategories.map((sub, index) => {
//                                 const isEven = index % 2 === 0;
//                                 return (
//                                   <span
//                                     key={sub}
//                                     className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
//                                       isEven
//                                         ? "bg-linear-to-r from-green-400/20 to-emerald-500/20 text-green-600 dark:text-green-400 border-green-400/40 hover:border-green-400/60"
//                                         : "bg-linear-to-r from-blue-400/20 to-blue-400/20 text-blue-600 dark:text-blue-400 border-blue-400/40 hover:border-blue-400/60"
//                                     }`}
//                                   >
//                                     {sub}
//                                   </span>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {exercises.length === 0 && !loading && (
//                   <div className="text-center py-12">
//                     <p className="text-muted-foreground text-lg">
//                       No exercises found matching your criteria
//                     </p>
//                     {isFilterActive && (
//                       <button
//                         onClick={handleResetFilters}
//                         className="mt-4 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
//                       >
//                         Clear filters to see all exercises
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Modals */}
//       {isModalOpen && (
//         <AddExerciseModal
//           exercise={selectedExercise}
//           onSave={handleSaveExercise}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedExercise(null);
//           }}
//         />
//       )}

//       {showDeleteModal && (
//         <DeleteModal
//           isOpen={showDeleteModal}
//           title="Delete Exercise"
//           message="Are you sure you want to delete this exercise? This action cannot be undone."
//           onConfirm={confirmDelete}
//           onCancel={() => {
//             setShowDeleteModal(false);
//             setExerciseToDelete(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import {
  clearExerciseError,
  clearExerciseSuccess,
  createExercise,
  deleteExercise,
  getAllExercises,
  Exercise as ReduxExercise,
  updateExercise,
  setSearchQuery,
  setSelectedMuscleGroup,
  setSelectedDifficulty,
  setSelectedEquipment,
  resetFilters,
} from "@/redux/features/exercise/exerciseSlice";
import toast from "react-hot-toast";
import { Search, Dumbbell, Edit2, Trash2, X } from "lucide-react";
import AddExerciseModal from "./addExerciseModal/AddExerciseModal";
import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";

interface ComponentExercise {
  id?: string;
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string;
  subcategories: string[];
  iconName?: string;
  image?: File | null;
  video?: File | null;
}

const muscleGroups = [
  "All Muscle Groups",
  "Chest",
  "Back",
  "Legs",
  "Arms",
  "Shoulders",
  "Core",
  "Neck",
];

const difficultyLevels = [
  "All Difficulties",
  "Beginner",
  "Intermediate",
  "Advanced",
];

// Get unique equipment from backend data
const getUniqueEquipment = (exercises: ReduxExercise[]): string[] => {
  const equipmentSet = new Set<string>();
  exercises.forEach((exercise) => {
    if (exercise.equipment) {
      equipmentSet.add(exercise.equipment);
    }
  });
  return ["All Equipment", ...Array.from(equipmentSet).sort()];
};

export default function AdminExerciseDatabase() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    exercises,
    loading,
    error,
    successMessage,
    searchQuery,
    selectedMuscleGroup,
    selectedDifficulty,
  } = useAppSelector((state) => state.exercise);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<ComponentExercise | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("All Equipment");

  // Get unique equipment options from exercises
  const equipmentOptions = getUniqueEquipment(exercises);

  // Load exercises on component mount and when filters change
  useEffect(() => {
    const filters = {
      search: searchQuery,
      page: 1,
      limit: 10,
      musalCategory:
        selectedMuscleGroup === "All Muscle Groups"
          ? undefined
          : selectedMuscleGroup,
      difficulty:
        selectedDifficulty === "All Difficulties"
          ? undefined
          : selectedDifficulty,
      equipment:
        selectedEquipment === "All Equipment" ? undefined : selectedEquipment,
    };

    dispatch(getAllExercises(filters));
  }, [
    dispatch,
    searchQuery,
    selectedMuscleGroup,
    selectedDifficulty,
    selectedEquipment,
  ]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      dispatch(setSearchQuery(debouncedSearch));
    }
  }, [debouncedSearch, dispatch, searchQuery]);

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearExerciseError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearExerciseSuccess());
    }
  }, [error, successMessage, dispatch]);

  const handleAddExercise = () => {
    setSelectedExercise(null);
    setIsModalOpen(true);
  };

  const handleEdit = (exercise: ComponentExercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setExerciseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (exerciseToDelete) {
      try {
        await dispatch(deleteExercise(exerciseToDelete)).unwrap();
        toast.success("Exercise deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete exercise");
      }
      setShowDeleteModal(false);
      setExerciseToDelete(null);
    }
  };

  const handleSaveExercise = async (formData: ComponentExercise) => {
    try {
      // Convert component data to backend form data
      const formDataPayload = {
        name: formData.name,
        musal: formData.muscleGroup, // Map muscleGroup to musal
        difficulty: formData.difficulty || "Intermediate",
        equipment: formData.equipment || "",
        description: formData.description || "",
        subCategory: formData.subcategories || [],
        image: formData.image || null,
        vedio: formData.video || null, // Map video to vedio
      };

      if (selectedExercise?.id) {
        // Update existing exercise
        await dispatch(
          updateExercise({
            id: selectedExercise.id,
            data: formDataPayload,
          })
        ).unwrap();
        toast.success("Exercise updated successfully");
      } else {
        // Create new exercise
        await dispatch(createExercise({ data: formDataPayload })).unwrap();
        toast.success("Exercise created successfully");
      }

      setIsModalOpen(false);
      setSelectedExercise(null);

      // Refresh the list
      const filters = {
        search: searchQuery,
        page: 1,
        limit: 10,
        musalCategory:
          selectedMuscleGroup === "All Muscle Groups"
            ? undefined
            : selectedMuscleGroup,
        difficulty:
          selectedDifficulty === "All Difficulties"
            ? undefined
            : selectedDifficulty,
        equipment:
          selectedEquipment === "All Equipment" ? undefined : selectedEquipment,
      };
      dispatch(getAllExercises(filters));
    } catch (error: any) {
      toast.error(error.message || "Failed to save exercise");
    }
  };

  const handleMuscleGroupChange = (group: string) => {
    dispatch(setSelectedMuscleGroup(group));
  };

  const handleDifficultyChange = (difficulty: string) => {
    dispatch(setSelectedDifficulty(difficulty));
  };

  const handleEquipmentChange = (equipment: string) => {
    setSelectedEquipment(equipment);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedEquipment("All Equipment");
    dispatch(resetFilters());
  };

  // Check if any filter is active
  const isFilterActive =
    searchQuery !== "" ||
    selectedMuscleGroup !== "All Muscle Groups" ||
    selectedDifficulty !== "All Difficulties" ||
    selectedEquipment !== "All Equipment";

  // Convert backend exercise to component exercise
  const convertToComponentExercise = useCallback(
    (reduxExercise: ReduxExercise): ComponentExercise => {
      return {
        id: reduxExercise._id,
        name: reduxExercise.name,
        description: reduxExercise.description || "",
        category: reduxExercise.musal, // Use musal as category
        muscleGroup: reduxExercise.musal, // Map musal to muscleGroup
        difficulty: reduxExercise.difficulty || "Intermediate",
        equipment: reduxExercise.equipment || "",
        subcategories: reduxExercise.subCategory || [],
        iconName: "dumbbell",
      };
    },
    []
  );

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Exercise Database</h1>
                  <p className="text-muted-foreground">
                    Global exercise library shared across all coaches
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddExercise}
                    disabled={loading}
                    className="px-6 py-3 border-2 border-green-500 text-green-500 rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : "+ Add Exercise"}
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar - Always Visible */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              {/* Search Bar */}
              <div className="relative w-full lg:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Exercise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Muscle Group */}
                <div className="w-full sm:w-48">
                  <select
                    value={selectedMuscleGroup}
                    onChange={(e) => handleMuscleGroupChange(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3.5 text-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {muscleGroups.map((group) => (
                      <option
                        key={group}
                        value={group}
                        className="bg-[#08081A]"
                      >
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div className="w-full sm:w-40">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => handleDifficultyChange(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3.5 text-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {difficultyLevels.map((difficulty) => (
                      <option
                        key={difficulty}
                        value={difficulty}
                        className="bg-[#08081A]"
                      >
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipment */}
                <div className="w-full sm:w-40">
                  <select
                    value={selectedEquipment}
                    onChange={(e) => handleEquipmentChange(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3.5 text-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {equipmentOptions.map((equip) => (
                      <option
                        key={equip}
                        value={equip}
                        className="bg-[#08081A]"
                      >
                        {equip}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex items-center justify-between">
              {isFilterActive && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      Search: {searchQuery}
                    </span>
                  )}
                  {selectedMuscleGroup !== "All Muscle Groups" && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Muscle: {selectedMuscleGroup}
                    </span>
                  )}
                  {selectedDifficulty !== "All Difficulties" && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      Difficulty: {selectedDifficulty}
                    </span>
                  )}
                  {selectedEquipment !== "All Equipment" && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      Equipment: {selectedEquipment}
                    </span>
                  )}
                </div>
              )}

              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500 rounded-2xl text-sm text-red-400 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
            {/* Loading State */}
            {loading && exercises.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9E4A]"></div>
              </div>
            ) : (
              <>
                {/* Exercise Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exercises.map((reduxExercise) => {
                    const exercise = convertToComponentExercise(reduxExercise);
                    const difficultyColor =
                      {
                        Beginner:
                          "bg-green-500/20 text-green-400 border-green-400/40",
                        Intermediate:
                          "bg-yellow-500/20 text-yellow-400 border-yellow-400/40",
                        Advanced:
                          "bg-red-500/20 text-red-400 border-red-400/40",
                      }[exercise.difficulty] ||
                      "bg-gray-500/20 text-gray-400 border-gray-400/40";

                    return (
                      <div
                        key={exercise.id}
                        className="bg-[#08081A] from-card to-card/80 border border-[#303245] rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col h-full group"
                      >
                        {/* Header with icon and actions */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="w-14 h-14 rounded-lg bg-linear-to-br from-green-400/30 to-emerald-500/20 flex items-center justify-center shrink-0 border border-green-400/40">
                            <Dumbbell
                              className="w-7 h-7 text-green-500"
                              strokeWidth={1.5}
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(exercise)}
                              disabled={loading}
                              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(exercise.id!)}
                              disabled={loading}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all duration-200 border border-red-500/20 hover:border-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center space-x-4">
                              <h3 className="text-lg font-bold text-foreground line-clamp-2">
                                {exercise.name}
                              </h3>
                              <span
                                className={`text-sm font-medium px-2 py-0.5 rounded-xl border ${difficultyColor}`}
                              >
                                {exercise.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                              {exercise.description}
                            </p>
                          </div>

                          {/* Info section */}
                          <div className="space-y-2 pt-4 border-t border-[#303245]">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground font-medium">
                                MUSCLE GROUP
                              </span>
                              <span className="text-sm font-semibold text-primary">
                                {exercise.muscleGroup}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground font-medium">
                                EQUIPMENT
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {exercise.equipment || "None"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Subcategories */}
                        {exercise.subcategories.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#303245]">
                            <div className="flex flex-wrap gap-2">
                              {exercise.subcategories.map((sub, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                  <span
                                    key={sub}
                                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                                      isEven
                                        ? "bg-linear-to-r from-green-400/20 to-emerald-500/20 text-green-600 dark:text-green-400 border-green-400/40 hover:border-green-400/60"
                                        : "bg-linear-to-r from-blue-400/20 to-blue-400/20 text-blue-600 dark:text-blue-400 border-blue-400/40 hover:border-blue-400/60"
                                    }`}
                                  >
                                    {sub}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {exercises.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No exercises found matching your criteria
                    </p>
                    {isFilterActive && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear filters to see all exercises
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddExerciseModal
          exercise={selectedExercise}
          onSave={handleSaveExercise}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExercise(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          title="Delete Exercise"
          message="Are you sure you want to delete this exercise? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setExerciseToDelete(null);
          }}
        />
      )}
    </div>
  );
}
