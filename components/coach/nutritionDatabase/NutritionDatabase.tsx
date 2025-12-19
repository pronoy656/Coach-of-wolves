/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import NutritionCard from "./nutritionCard/NutritionCard";
// import NutritionModal from "./nutritionModal/NutritionModal";
// import DeleteModal from "../exerciseDatabase/deleteModal/DeleteModal";

// interface Nutrition {
//   id: string;
//   name: string;
//   brand?: string;
//   category: string;
//   defaultQuantity: string;
//   calories: number;
//   proteins: number;
//   carbohydrates: number;
//   fats: number;
//   sugar: number;
//   fiber: number;
//   saturatedFats: number;
//   unsaturatedFats: number;
// }

// export default function NutritionDatabase() {
//   const [nutritions, setNutritions] = useState<Nutrition[]>([
//     {
//       id: "1",
//       name: "Banana",
//       category: "Fruits",
//       defaultQuantity: "100g",
//       calories: 105,
//       proteins: 1,
//       carbohydrates: 27,
//       fats: 0,
//       sugar: 14,
//       fiber: 3,
//       saturatedFats: 0,
//       unsaturatedFats: 0,
//     },
//     {
//       id: "2",
//       name: "Chicken breast",
//       category: "Protein",
//       defaultQuantity: "100g",
//       calories: 330,
//       proteins: 62,
//       carbohydrates: 0,
//       fats: 7,
//       sugar: 0,
//       fiber: 0,
//       saturatedFats: 2,
//       unsaturatedFats: 2,
//     },
//     {
//       id: "3",
//       name: "Milk Shake",
//       category: "Protein",
//       defaultQuantity: "100g",
//       calories: 330,
//       proteins: 62,
//       carbohydrates: 0,
//       fats: 7,
//       sugar: 0,
//       fiber: 0,
//       saturatedFats: 2,
//       unsaturatedFats: 2,
//     },
//     {
//       id: "4",
//       name: "Oatmeal",
//       category: "Carbohydrate",
//       defaultQuantity: "100g",
//       calories: 389,
//       proteins: 17,
//       carbohydrates: 66,
//       fats: 7,
//       sugar: 1,
//       fiber: 11,
//       saturatedFats: 1,
//       unsaturatedFats: 5,
//     },
//   ]);

//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   const [nutritionToDelete, setNutritionToDelete] = useState<string | null>(
//     null
//   );

//   const [deleteConfirm, setDeleteConfirm] = useState<{
//     show: boolean;
//   }>({ show: false });

//   const handleAddNutrition = () => {
//     setEditingId(null);
//     setShowModal(true);
//   };

//   const handleEditNutrition = (id: string) => {
//     setEditingId(id);
//     setShowModal(true);
//   };

//   const handleDeleteNutrition = (id: string) => {
//     setNutritionToDelete(id);
//     setDeleteConfirm({ show: true });
//   };

//   const handleConfirmDelete = () => {
//     if (!nutritionToDelete) return;

//     setNutritions((prev) => prev.filter((n) => n.id !== nutritionToDelete));

//     setNutritionToDelete(null);
//     setDeleteConfirm({ show: false });
//   };

//   const handleSaveNutrition = (nutrition: Nutrition) => {
//     if (editingId) {
//       setNutritions(
//         nutritions.map((n) => (n.id === editingId ? nutrition : n))
//       );
//     } else {
//       setNutritions([
//         ...nutritions,
//         { ...nutrition, id: Date.now().toString() },
//       ]);
//     }
//     setShowModal(false);
//     setEditingId(null);
//   };

//   const editingNutrition = editingId
//     ? nutritions.find((n) => n.id === editingId)
//     : null;

//   return (
//     <div className="flex h-screen bg-background text-foreground dark">
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <main className="flex-1 overflow-auto">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-8">
//               <h1 className="text-3xl font-bold">Nutrition Database</h1>
//               <button
//                 onClick={handleAddNutrition}
//                 className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
//               >
//                 + Add Nutrition
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               {nutritions.map((nutrition) => (
//                 <NutritionCard
//                   key={nutrition.id}
//                   nutrition={nutrition}
//                   onEdit={() => handleEditNutrition(nutrition.id)}
//                   onDelete={() => handleDeleteNutrition(nutrition.id)}
//                 />
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>

//       {showModal && (
//         <NutritionModal
//           nutrition={editingNutrition || undefined}
//           onSave={handleSaveNutrition}
//           onClose={() => {
//             setShowModal(false);
//             setEditingId(null);
//           }}
//         />
//       )}

//       {
//         <DeleteModal
//           isOpen={deleteConfirm.show}
//           title="Delete Nutrition"
//           message="Are you sure you want to delete this nutrition? This action cannot be undone."
//           onConfirm={handleConfirmDelete}
//           onCancel={() => {
//             setNutritionToDelete(null);
//             setDeleteConfirm({ show: false });
//           }}
//         />
//       }
//     </div>
//   );
// }

// components/nutrition/NutritionDatabase.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import { AppDispatch, RootState } from "@/store/store";
// // import {
// //   getAllNutritions,
// //   createNutrition,
// //   updateNutrition,
// //   deleteNutrition,
// //   type Nutrition,
// //   type CreateNutritionPayload,
// //   clearNutritionError,
// //   clearNutritionSuccess,
// // } from "@/store/nutritionSlice";
// import NutritionCard from "./nutritionCard/NutritionCard";
// import NutritionModal from "./nutritionModal/NutritionModal";
// import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
// import { AppDispatch } from "@/redux/store";
// import { useAppSelector } from "@/redux/hooks";
// import {
//   clearNutritionError,
//   clearNutritionSuccess,
//   createNutrition,
//   CreateNutritionPayload,
//   deleteNutrition,
//   getAllNutritions,
//   Nutrition,
//   updateNutrition,
// } from "@/redux/features/nutrition/nutritionSlice";
// import toast from "react-hot-toast";
// // import { toast } from "react-hot-toast";

// export default function NutritionDatabase() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { nutritions, loading, error, successMessage } = useAppSelector(
//     (state) => state.nutrition
//   );

//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   useEffect(() => {
//     dispatch(getAllNutritions());
//   }, [dispatch]);

//   // Handle errors and success messages
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearNutritionError());
//     }
//     if (successMessage) {
//       toast.success(successMessage);
//       dispatch(clearNutritionSuccess());
//     }
//   }, [error, successMessage, dispatch]);

//   const handleAddNutrition = () => {
//     setEditingId(null);
//     setShowModal(true);
//   };

//   const handleEditNutrition = (id: string) => {
//     setEditingId(id);
//     setShowModal(true);
//   };

//   const handleDeleteNutrition = (id: string) => {
//     setDeletingId(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (deletingId) {
//       try {
//         await dispatch(deleteNutrition(deletingId)).unwrap();
//         toast.success("Nutrition item deleted successfully");
//       } catch (error) {
//         toast.error("Failed to delete nutrition item");
//       }
//     }
//     setShowDeleteModal(false);
//     setDeletingId(null);
//   };

//   const handleSaveNutrition = async (nutritionData: Nutrition) => {
//     try {
//       const backendPayload: CreateNutritionPayload = {
//         name: nutritionData.name,
//         brand: nutritionData.brand || "",
//         category: nutritionData.category,
//         defaultQuantity: nutritionData.defaultQuantity,
//         calories: nutritionData.calories,
//         proteinQuantity: nutritionData.proteins,
//         fatsQuantity: nutritionData.fats,
//         carbsQuantity: nutritionData.carbohydrates,
//         sugarQuantity: nutritionData.sugar,
//         fiberQuantity: nutritionData.fiber,
//         saturatedFats: nutritionData.saturatedFats,
//         unsaturatedFats: nutritionData.unsaturatedFats,
//       };

//       if (editingId) {
//         await dispatch(
//           updateNutrition({
//             id: editingId,
//             data: backendPayload,
//           })
//         ).unwrap();
//         toast.success("Nutrition item updated successfully");
//       } else {
//         await dispatch(createNutrition(backendPayload)).unwrap();
//         toast.success("Nutrition item created successfully");
//       }

//       setShowModal(false);
//       setEditingId(null);
//     } catch (error) {
//       // Error is already handled by the toast in useEffect
//     }
//   };

//   const editingNutrition = editingId
//     ? nutritions.find((n) => n._id === editingId || n.id === editingId)
//     : null;

//   return (
//     <div className="flex h-screen bg-background text-foreground dark">
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <main className="flex-1 overflow-auto">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-8">
//               <h1 className="text-3xl font-bold">Nutrition Database</h1>
//               <button
//                 onClick={handleAddNutrition}
//                 disabled={loading}
//                 className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Loading..." : "+ Add Nutrition"}
//               </button>
//             </div>

//             {loading && nutritions.length === 0 ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9E4A]"></div>
//               </div>
//             ) : nutritions.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-muted-foreground">
//                   No nutrition items found.
//                 </p>
//                 <button
//                   onClick={handleAddNutrition}
//                   className="mt-4 px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
//                 >
//                   + Add Your First Nutrition
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-6">
//                 {nutritions.map((nutrition) => (
//                   <NutritionCard
//                     key={
//                       nutrition._id || nutrition.id || Math.random().toString()
//                     } // Fallback
//                     nutrition={{
//                       id: nutrition._id || nutrition.id || "", // Provide default empty string
//                       name: nutrition.name,
//                       brand: nutrition.brand,
//                       category: nutrition.category,
//                       defaultQuantity: nutrition.defaultQuantity,
//                       calories: nutrition.calories,
//                       proteins: nutrition.proteins,
//                       carbohydrates: nutrition.carbohydrates,
//                       fats: nutrition.fats,
//                       sugar: nutrition.sugar,
//                       fiber: nutrition.fiber,
//                       saturatedFats: nutrition.saturatedFats,
//                       unsaturatedFats: nutrition.unsaturatedFats,
//                     }}
//                     onEdit={() =>
//                       handleEditNutrition(nutrition._id || nutrition.id || "")
//                     }
//                     onDelete={() =>
//                       handleDeleteNutrition(nutrition._id || nutrition.id || "")
//                     }
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {showModal && (
//         <NutritionModal
//           nutrition={editingNutrition || undefined}
//           onSave={handleSaveNutrition}
//           onClose={() => {
//             setShowModal(false);
//             setEditingId(null);
//           }}
//         />
//       )}

//       {showDeleteModal && (
//         <DeleteModal
//           isOpen={showDeleteModal}
//           title="Delete Nutrition"
//           message="Are you sure you want to delete this nutrition? This action cannot be undone."
//           onConfirm={confirmDelete}
//           onCancel={() => {
//             setShowDeleteModal(false);
//             setDeletingId(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { useAppSelector } from "@/redux/hooks";
// import {
//   clearNutritionError,
//   clearNutritionSuccess,
//   createNutrition,
//   CreateNutritionPayload,
//   deleteNutrition,
//   getAllNutritions,
//   Nutrition as ReduxNutrition,
//   updateNutrition,
// } from "@/redux/features/nutrition/nutritionSlice";
// import toast from "react-hot-toast";
// import NutritionCard from "./nutritionCard/NutritionCard";
// import NutritionModal from "./nutritionModal/NutritionModal";
// import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";

// // Frontend component interface (different from backend)
// interface ComponentNutrition {
//   id: string;
//   name: string;
//   brand?: string;
//   category: string;
//   defaultQuantity: string;
//   calories: number;
//   proteins: number;
//   carbohydrates: number;
//   fats: number;
//   sugar: number;
//   fiber: number;
//   saturatedFats: number;
//   unsaturatedFats: number;
// }

// export default function NutritionDatabase() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { nutritions, loading, error, successMessage } = useAppSelector(
//     (state) => state.nutrition
//   );

//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   useEffect(() => {
//     dispatch(getAllNutritions());
//   }, [dispatch]);

//   // Handle errors and success messages
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearNutritionError());
//     }
//     if (successMessage) {
//       toast.success(successMessage);
//       dispatch(clearNutritionSuccess());
//     }
//   }, [error, successMessage, dispatch]);

//   const handleAddNutrition = () => {
//     setEditingId(null);
//     setShowModal(true);
//   };

//   const handleEditNutrition = (id: string) => {
//     setEditingId(id);
//     setShowModal(true);
//   };

//   const handleDeleteNutrition = (id: string) => {
//     setDeletingId(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (deletingId) {
//       try {
//         await dispatch(deleteNutrition(deletingId)).unwrap();
//         toast.success("Nutrition item deleted successfully");
//       } catch (error: any) {
//         toast.error(error.message || "Failed to delete nutrition item");
//       }
//     }
//     setShowDeleteModal(false);
//     setDeletingId(null);
//   };

//   const handleSaveNutrition = async (nutritionData: ComponentNutrition) => {
//     try {
//       // Convert frontend names to backend names
//       const backendPayload: CreateNutritionPayload = {
//         name: nutritionData.name,
//         brand: nutritionData.brand || "",
//         category: nutritionData.category,
//         defaultQuantity: nutritionData.defaultQuantity,
//         caloriesQuantity: nutritionData.calories,          // Frontend: calories -> Backend: caloriesQuantity
//         proteinQuantity: nutritionData.proteins,          // Frontend: proteins -> Backend: proteinQuantity
//         fatsQuantity: nutritionData.fats,                 // Frontend: fats -> Backend: fatsQuantity
//         carbsQuantity: nutritionData.carbohydrates,       // Frontend: carbohydrates -> Backend: carbsQuantity
//         sugarQuantity: nutritionData.sugar,               // Frontend: sugar -> Backend: sugarQuantity
//         fiberQuantity: nutritionData.fiber,               // Frontend: fiber -> Backend: fiberQuantity
//         saturatedFats: nutritionData.saturatedFats,
//         unsaturatedFats: nutritionData.unsaturatedFats,
//       };

//       if (editingId) {
//         await dispatch(
//           updateNutrition({
//             id: editingId,
//             data: backendPayload,
//           })
//         ).unwrap();
//         toast.success("Nutrition item updated successfully");
//       } else {
//         await dispatch(createNutrition(backendPayload)).unwrap();
//         toast.success("Nutrition item created successfully");
//       }

//       setShowModal(false);
//       setEditingId(null);
//       // Refresh the list
//       dispatch(getAllNutritions());
//     } catch (error: any) {
//       toast.error(error.message || "Failed to save nutrition item");
//     }
//   };

//   // Convert Backend Nutrition to Frontend Component Nutrition
//   const convertToComponentNutrition = (reduxNutrition: ReduxNutrition): ComponentNutrition => {
//     return {
//       id: reduxNutrition._id || reduxNutrition.id || '',
//       name: reduxNutrition.name || '',
//       brand: reduxNutrition.brand,
//       category: reduxNutrition.category || '',
//       defaultQuantity: reduxNutrition.defaultQuantity || '',
//       calories: reduxNutrition.caloriesQuantity || 0,          // Backend: caloriesQuantity -> Frontend: calories
//       proteins: reduxNutrition.proteinQuantity || 0,           // Backend: proteinQuantity -> Frontend: proteins
//       carbohydrates: reduxNutrition.carbsQuantity || 0,        // Backend: carbsQuantity -> Frontend: carbohydrates
//       fats: reduxNutrition.fatsQuantity || 0,                  // Backend: fatsQuantity -> Frontend: fats
//       sugar: reduxNutrition.sugarQuantity || 0,                // Backend: sugarQuantity -> Frontend: sugar
//       fiber: reduxNutrition.fiberQuantity || 0,                // Backend: fiberQuantity -> Frontend: fiber
//       saturatedFats: reduxNutrition.saturatedFats || 0,
//       unsaturatedFats: reduxNutrition.unsaturatedFats || 0,
//     };
//   };

//   // Ensure nutritions is always an array
//   const nutritionsArray = Array.isArray(nutritions) ? nutritions : [];

//   const editingNutrition = editingId
//     ? nutritionsArray.find((n) => n._id === editingId || n.id === editingId)
//     : null;

//   return (
//     <div className="flex h-screen bg-background text-foreground dark">
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <main className="flex-1 overflow-auto">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-8">
//               <h1 className="text-3xl font-bold">Nutrition Database</h1>
//               <button
//                 onClick={handleAddNutrition}
//                 disabled={loading}
//                 className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Loading..." : "+ Add Nutrition"}
//               </button>
//             </div>

//             {loading && nutritionsArray.length === 0 ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9E4A]"></div>
//               </div>
//             ) : nutritionsArray.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-muted-foreground">
//                   No nutrition items found.
//                 </p>
//                 <button
//                   onClick={handleAddNutrition}
//                   className="mt-4 px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
//                 >
//                   + Add Your First Nutrition
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-6">
//                 {nutritionsArray.map((nutrition) => {
//                   const componentNutrition = convertToComponentNutrition(nutrition);
//                   const nutritionKey = componentNutrition.id ||
//                     `nutrition-${nutrition._id || nutrition.name || ''}`;

//                   return (
//                     <NutritionCard
//                       key={nutritionKey}
//                       nutrition={componentNutrition}
//                       onEdit={() => handleEditNutrition(componentNutrition.id)}
//                       onDelete={() => handleDeleteNutrition(componentNutrition.id)}
//                     />
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {showModal && (
//         <NutritionModal
//           nutrition={
//             editingNutrition
//               ? convertToComponentNutrition(editingNutrition)
//               : undefined
//           }
//           onSave={handleSaveNutrition}
//           onClose={() => {
//             setShowModal(false);
//             setEditingId(null);
//           }}
//         />
//       )}

//       {showDeleteModal && (
//         <DeleteModal
//           isOpen={showDeleteModal}
//           title="Delete Nutrition"
//           message="Are you sure you want to delete this nutrition? This action cannot be undone."
//           onConfirm={confirmDelete}
//           onCancel={() => {
//             setShowDeleteModal(false);
//             setDeletingId(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import {
  clearNutritionError,
  clearNutritionSuccess,
  createNutrition,
  CreateNutritionPayload,
  deleteNutrition,
  getAllNutritions,
  Nutrition,
  updateNutrition,
} from "@/redux/features/nutrition/nutritionSlice";
import toast from "react-hot-toast";
import NutritionCard from "./nutritionCard/NutritionCard";
import NutritionModal from "./nutritionModal/NutritionModal";
import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";

export default function NutritionDatabase() {
  const dispatch = useDispatch<AppDispatch>();
  const { nutritions, loading, error, successMessage } = useAppSelector(
    (state) => state.nutrition
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load nutritions on component mount
  useEffect(() => {
    dispatch(getAllNutritions({ search: searchQuery }));
  }, [dispatch, searchQuery]);

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearNutritionError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearNutritionSuccess());
    }
  }, [error, successMessage, dispatch]);

  const handleAddNutrition = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditNutrition = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleDeleteNutrition = (id: string) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await dispatch(deleteNutrition(deletingId)).unwrap();
        toast.success("Nutrition item deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete nutrition item");
      }
    }
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  const handleSaveNutrition = async (nutritionData: any) => {
    try {
      // Direct backend payload - no conversion needed
      const backendPayload: CreateNutritionPayload = {
        name: nutritionData.name,
        brand: nutritionData.brand || "",
        category: nutritionData.category,
        defaultQuantity: nutritionData.defaultQuantity,
        caloriesQuantity:
          nutritionData.caloriesQuantity || nutritionData.calories || 0,
        proteinQuantity:
          nutritionData.proteinQuantity || nutritionData.proteins || 0,
        fatsQuantity: nutritionData.fatsQuantity || nutritionData.fats || 0,
        carbsQuantity:
          nutritionData.carbsQuantity || nutritionData.carbohydrates || 0,
        sugarQuantity: nutritionData.sugarQuantity || nutritionData.sugar || 0,
        fiberQuantity: nutritionData.fiberQuantity || nutritionData.fiber || 0,
        saturatedFats: nutritionData.saturatedFats || 0,
        unsaturatedFats: nutritionData.unsaturatedFats || 0,
      };

      if (editingId) {
        await dispatch(
          updateNutrition({
            id: editingId,
            data: backendPayload,
          })
        ).unwrap();
        toast.success("Nutrition item updated successfully");
      } else {
        await dispatch(createNutrition(backendPayload)).unwrap();
        toast.success("Nutrition item created successfully");
      }

      setShowModal(false);
      setEditingId(null);
      // Refresh the list
      dispatch(getAllNutritions({ search: searchQuery }));
    } catch (error: any) {
      toast.error(error.message || "Failed to save nutrition item");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(value.length > 0);
  };

  // Find the nutrition being edited
  const editingNutrition = editingId
    ? nutritions.find((n) => n._id === editingId)
    : null;

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Nutrition Database</h1>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search nutrition items..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="px-4 py-2 bg-input border border-[#303245] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                />
                <button
                  onClick={handleAddNutrition}
                  disabled={loading}
                  className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Loading..." : "+ Add Nutrition"}
                </button>
              </div>
            </div>

            {loading && nutritions.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9E4A]"></div>
              </div>
            ) : nutritions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isSearching
                    ? "No nutrition items found for your search."
                    : "No nutrition items found."}
                </p>
                <button
                  onClick={handleAddNutrition}
                  className="mt-4 px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
                >
                  + Add Your First Nutrition
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {nutritions.map((nutrition) => (
                  <NutritionCard
                    key={nutrition._id}
                    nutrition={nutrition}
                    onEdit={() => handleEditNutrition(nutrition._id)}
                    onDelete={() => handleDeleteNutrition(nutrition._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <NutritionModal
          nutrition={editingNutrition}
          onSave={handleSaveNutrition}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          title="Delete Nutrition"
          message="Are you sure you want to delete this nutrition? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingId(null);
          }}
        />
      )}
    </div>
  );
}
