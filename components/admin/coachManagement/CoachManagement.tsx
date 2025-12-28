// "use client";

// import { useState, useEffect } from "react";
// import { Edit2, Trash2 } from "lucide-react";
// import AddCoachModal from "./addCoachModal/AddCoachModal";
// import Image from "next/image";
// import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import {
//   getAllCoaches,
//   createCoach,
//   updateCoach,
//   deleteCoach,
//   clearCoachError,
//   clearCoachSuccess,
//   Coach,
// } from "@/redux/features/coach/coachSlice";

// export default function CoachManagement() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { coaches, loading, error, successMessage } = useSelector(
//     (state: RootState) => state.coach
//   );

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<{
//     show: boolean;
//     id?: string;
//   }>({ show: false });

//   // Fetch coaches on component mount
//   useEffect(() => {
//     dispatch(getAllCoaches());
//   }, [dispatch]);

//   // Clear messages after 3 seconds
//   useEffect(() => {
//     if (error || successMessage) {
//       const timer = setTimeout(() => {
//         if (error) dispatch(clearCoachError());
//         if (successMessage) dispatch(clearCoachSuccess());
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, successMessage, dispatch]);

//   const handleAddCoach = () => {
//     setEditingCoach(null);
//     setIsModalOpen(true);
//   };

//   const handleEditCoach = (coach: Coach) => {
//     setEditingCoach(coach);
//     setIsModalOpen(true);
//   };

//   const handleDeleteCoach = (id: string) => {
//     setDeleteConfirm({ show: true, id });
//   };

//   const handleConfirmDelete = async () => {
//     if (deleteConfirm.id) {
//       try {
//         await dispatch(deleteCoach(deleteConfirm.id)).unwrap();
//         setDeleteConfirm({ show: false });
//       } catch (err) {
//         console.error("Failed to delete coach:", err);
//       }
//     }
//   };

//   const handleSaveCoach = async (data: {
//     name: string;
//     email: string;
//     image?: File | string;
//   }) => {
//     try {
//       if (editingCoach) {
//         // Update existing coach
//         await dispatch(
//           updateCoach({
//             id: editingCoach._id,
//             data,
//           })
//         ).unwrap();
//       } else {
//         // Create new coach
//         await dispatch(createCoach(data)).unwrap();
//       }
//       setIsModalOpen(false);
//       setEditingCoach(null);
//     } catch (err) {
//       console.error("Failed to save coach:", err);
//       // Error is already handled in the slice
//     }
//   };

//   // Helper function to get status display
//   const getStatusDisplay = (isActive: string) => {
//     return isActive === "Active" ? "Active" : "In-Active";
//   };

//   const getStatusColor = (isActive: string) => {
//     return isActive === "Active"
//       ? "bg-green-500/20 text-green-400"
//       : "bg-orange-500/20 text-orange-400";
//   };

//   return (
//     <div className="flex h-screen bg-background text-foreground dark">
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <main className="flex-1 overflow-auto">
//           <div className="p-6 space-y-6">
//             {/* Error and Success Messages */}
//             {error && (
//               <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
//                 {error}
//               </div>
//             )}
//             {successMessage && (
//               <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500 rounded-lg text-emerald-300">
//                 {successMessage}
//               </div>
//             )}

//             {/* Header Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-4xl font-bold text-white">
//                   Coach Management
//                 </h1>
//                 <p className="text-muted-foreground mt-2">
//                   Manage all Coaches in the platform
//                 </p>
//               </div>
//               <button
//                 onClick={handleAddCoach}
//                 className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium disabled:opacity-50"
//                 disabled={loading}
//               >
//                 {loading ? "Loading..." : "+ Add Coach"}
//               </button>
//             </div>

//             {/* Loading State */}
//             {loading && coaches.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
//                 <p className="mt-4 text-gray-400">Loading coaches...</p>
//               </div>
//             )}

//             {/* Coach Cards Grid */}
//             {!loading && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {coaches.map((coach) => (
//                   <div
//                     key={coach._id}
//                     className="bg-[#08081A] border border-[#303245] rounded-lg p-6 hover:border-primary/50 transition-colors"
//                   >
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center gap-4">
//                         <div className="relative w-16 h-16">
//                           <Image
//                             src={coach.image || "/placeholder.svg"}
//                             alt={coach.name}
//                             width={200}
//                             height={200}
//                             className="w-full h-full rounded-full object-cover border-2 border-primary"
//                             unoptimized
//                           />
//                         </div>
//                         <div>
//                           <span
//                             className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
//                               coach.isActive
//                             )}`}
//                           >
//                             {getStatusDisplay(coach.isActive)}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleEditCoach(coach)}
//                           className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
//                           disabled={loading}
//                         >
//                           <Edit2 size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteCoach(coach._id)}
//                           className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
//                           disabled={loading}
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-2">
//                       {coach.name}
//                     </h3>
//                     <p className="text-muted-foreground mb-1">{coach.email}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Role: {coach.role}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-2">
//                       Last Active:{" "}
//                       {new Date(coach.lastActive).toLocaleDateString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Empty State */}
//             {!loading && coaches.length === 0 && (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg">No coaches found.</p>
//                 <button
//                   onClick={handleAddCoach}
//                   className="mt-4 px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
//                 >
//                   Add Your First Coach
//                 </button>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Modals */}
//       {isModalOpen && (
//         <AddCoachModal
//           coach={editingCoach}
//           onSave={handleSaveCoach}
//           onClose={() => {
//             setIsModalOpen(false);
//             setEditingCoach(null);
//           }}
//           loading={loading}
//         />
//       )}

//       <DeleteModal
//         isOpen={deleteConfirm.show}
//         title="Delete Coach"
//         message="Are you sure you want to delete this coach? This action cannot be undone."
//         onConfirm={handleConfirmDelete}
//         onCancel={() => setDeleteConfirm({ show: false })}
//         // loading={loading}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import AddCoachModal from "./addCoachModal/AddCoachModal";
import Image from "next/image";
import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getAllCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
  clearCoachError,
  clearCoachSuccess,
  Coach,
} from "@/redux/features/coach/coachSlice";
// import { getFullImageUrl } from "@/utils/imageUrl";
import toast from "react-hot-toast";
import { getFullImageUrl } from "@/lib/utils";

export default function CoachManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { coaches, loading, error, successMessage } = useSelector(
    (state: RootState) => state.coach
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id?: string;
  }>({ show: false });

  useEffect(() => {
    dispatch(getAllCoaches());
  }, [dispatch]);

  // Show toast notifications for errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-right",
      });
      dispatch(clearCoachError());
    }

    if (successMessage) {
      toast.success(successMessage, {
        duration: 3000,
        position: "top-right",
      });
      dispatch(clearCoachSuccess());
    }
  }, [error, successMessage, dispatch]);

  const handleAddCoach = () => {
    setEditingCoach(null);
    setIsModalOpen(true);
  };

  const handleEditCoach = (coach: Coach) => {
    setEditingCoach(coach);
    setIsModalOpen(true);
  };

  const handleDeleteCoach = (id: string) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm.id) {
      const toastId = toast.loading("Deleting coach...", {
        position: "top-right",
      });

      try {
        await dispatch(deleteCoach(deleteConfirm.id)).unwrap();
        toast.success("Coach deleted successfully!", {
          id: toastId,
          duration: 3000,
        });
        setDeleteConfirm({ show: false });
      } catch (err) {
        console.error("Failed to delete coach:", err);
        toast.error("Failed to delete coach", {
          id: toastId,
          duration: 4000,
        });
      }
    }
  };

  const handleSaveCoach = async (data: {
    name: string;
    email: string;
    image?: File | string;
  }) => {
    const isEditing = !!editingCoach;
    const toastId = toast.loading(
      isEditing ? "Updating coach..." : "Creating coach...",
      {
        position: "top-right",
      }
    );

    try {
      if (editingCoach) {
        await dispatch(
          updateCoach({
            id: editingCoach._id,
            data,
          })
        ).unwrap();
        toast.success("Coach updated successfully!", {
          id: toastId,
          duration: 3000,
        });
      } else {
        await dispatch(createCoach(data)).unwrap();
        toast.success("Coach created successfully!", {
          id: toastId,
          duration: 3000,
        });
      }
      setIsModalOpen(false);
      setEditingCoach(null);
    } catch (err) {
      console.error("Failed to save coach:", err);
      toast.error(
        isEditing ? "Failed to update coach" : "Failed to create coach",
        {
          id: toastId,
          duration: 4000,
        }
      );
    }
  };

  const getStatusDisplay = (isActive: string) => {
    return isActive === "Active" ? "Active" : "In-Active";
  };

  const getStatusColor = (isActive: string) => {
    return isActive === "Active"
      ? "bg-green-500/20 text-green-400"
      : "bg-orange-500/20 text-orange-400";
  };

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Coach Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage all Coaches in the platform
                </p>
              </div>
              <button
                onClick={handleAddCoach}
                className="px-6 py-3 border-2 border-green-500 text-green-500 rounded-3xl hover:bg-green-500/10 transition-colors font-medium disabled:opacity-50"
                disabled={loading}
              >
                + Add Coach
              </button>
            </div>

            {loading && coaches.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                <p className="mt-4 text-gray-400">Loading coaches...</p>
              </div>
            )}

            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map((coach) => {
                  const imageUrl = getFullImageUrl(coach.image);
                  return (
                    <div
                      key={coach._id}
                      className="bg-[#08081A] border border-[#303245] rounded-lg p-6 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16">
                            <Image
                              src={imageUrl}
                              alt={coach.name}
                              width={200}
                              height={200}
                              className="w-full h-full rounded-full object-cover border-2 border-primary"
                              unoptimized
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                coach.isActive
                              )}`}
                            >
                              {getStatusDisplay(coach.isActive)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCoach(coach)}
                            className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                            disabled={loading}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCoach(coach._id)}
                            className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                            disabled={loading}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {coach.name}
                      </h3>
                      <p className="text-muted-foreground mb-1">
                        {coach.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Role: {coach.role}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last Active:{" "}
                        {new Date(coach.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && coaches.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No coaches found.</p>
                <button
                  onClick={handleAddCoach}
                  className="mt-4 px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
                >
                  Add Your First Coach
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <AddCoachModal
          coach={editingCoach}
          onSave={handleSaveCoach}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCoach(null);
          }}
          loading={loading}
        />
      )}

      <DeleteModal
        isOpen={deleteConfirm.show}
        title="Delete Coach"
        message="Are you sure you want to delete this coach? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ show: false })}
      // loading={loading}
      />
    </div>
  );
}
