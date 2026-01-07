
// "use client";

// import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
// import { Trash2 } from "lucide-react";
// import { useState } from "react";

// interface CheckIn {
//   id: number;
//   athlete: string;
//   week: string;
//   checkInDate: string;
//   coach: string;
//   weightChange: string;
//   status: string;
// }

// interface CheckInTableProps {
//   checkIns: CheckIn[];
//   onDelete: (id: number) => void;
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export default function CheckInTable({
//   checkIns,
//   onDelete,
//   currentPage,
//   totalPages,
//   onPageChange,
// }: CheckInTableProps) {
//   const [deleteModal, setDeleteModal] = useState<{
//     isOpen: boolean;
//     id: number;
//     athlete: string;
//   }>({
//     isOpen: false,
//     id: 0,
//     athlete: "",
//   });

//   const handleDeleteClick = (id: number, athlete: string) => {
//     setDeleteModal({ isOpen: true, id, athlete });
//   };

//   const handleConfirmDelete = () => {
//     onDelete(deleteModal.id);
//     setDeleteModal({ isOpen: false, id: 0, athlete: "" });
//   };

//   const handleCancelDelete = () => {
//     setDeleteModal({ isOpen: false, id: 0, athlete: "" });
//   };

//   const hasData = checkIns.length > 0;

//   return (
//     <>
//       <div className="bg-card border border-[#24273f] rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-[#020231] border-b border-[#24273f]">
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
//                   Athlete
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
//                   Week
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
//                   Check-in Date
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
//                   Coach
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
//                   Weight Change
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {hasData ? (
//                 checkIns.map((checkIn, index) => (
//                   <tr
//                     key={checkIn.id}
//                     className={`border-b border-[#24273f] ${index % 2 === 0 ? "bg-[#020231]/30" : "bg-background"
//                       } hover:bg-secondary/20 transition-colors`}
//                   >
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       {checkIn.athlete}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       {checkIn.week}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       {checkIn.checkInDate}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       {checkIn.coach}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       <span
//                         className={
//                           checkIn.weightChange.startsWith("+")
//                             ? "text-red-400"
//                             : "text-green-400"
//                         }
//                       >
//                         {checkIn.weightChange}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${checkIn.status === "Completed"
//                             ? "bg-green-500/20 text-green-400"
//                             : "bg-yellow-500/20 text-yellow-400"
//                           }`}
//                       >
//                         {checkIn.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <button
//                         onClick={() =>
//                           handleDeleteClick(checkIn.id, checkIn.athlete)
//                         }
//                         className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
//                         title="Delete check-in"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="text-center py-12 text-muted-foreground"
//                   >
//                     No check-ins found matching your filters.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination - Moved OUTSIDE the table, proper placement */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between px-6 py-4 bg-[#020231]/50 border-t border-[#24273f]">
//               <p className="text-sm text-muted-foreground">
//                 Showing {checkIns.length > 0 ? (currentPage - 1) * 10 + 1 : 0}{" "}
//                 to{" "}
//                 {Math.min(
//                   currentPage * 10,
//                   checkIns.length + (currentPage - 1) * 10
//                 )}{" "}
//                 of {checkIns.length + (currentPage - 1) * 10} results
//               </p>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => onPageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 text-sm rounded-lg bg-[#08081A] border border-[#303245] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#303245]/50 transition-colors"
//                 >
//                   Previous
//                 </button>

//                 <span className="px-4 text-sm text-foreground">
//                   Page {currentPage} of {totalPages}
//                 </span>

//                 <button
//                   onClick={() => onPageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 text-sm rounded-lg bg-[#08081A] border border-[#303245] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#303245]/50 transition-colors"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <DeleteModal
//         isOpen={deleteModal.isOpen}
//         title="Delete Check-In"
//         message={`Are you sure you want to delete ${deleteModal.athlete}'s check-in? This action cannot be undone.`}
//         athleteName={deleteModal.athlete}
//         onConfirm={handleConfirmDelete}
//         onCancel={handleCancelDelete}
//       />
//     </>
//   );
// }











"use client";

import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

interface CheckIn {
  id: number;
  athlete: string;
  week: string;
  checkInDate: string;
  coach: string;
  weightChange: string;
  status: string;
  originalData?: {
    athleteName: string;
    weekNumber: number;
  };
}

interface CheckInTableProps {
  checkIns: CheckIn[];
  onDelete: (id: number, athleteName: string, weekNumber: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function CheckInTable({
  checkIns,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: CheckInTableProps) {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: number;
    athlete: string;
    weekNumber: number;
  }>({
    isOpen: false,
    id: 0,
    athlete: "",
    weekNumber: 0,
  });

  const handleDeleteClick = (id: number, athlete: string, weekNumber: number) => {
    setDeleteModal({ isOpen: true, id, athlete, weekNumber });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.athlete && deleteModal.weekNumber) {
      onDelete(deleteModal.id, deleteModal.athlete, deleteModal.weekNumber);
    }
    setDeleteModal({ isOpen: false, id: 0, athlete: "", weekNumber: 0 });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, id: 0, athlete: "", weekNumber: 0 });
  };

  const hasData = checkIns.length > 0;

  // Get week number from "Week X" string
  const getWeekNumber = (weekString: string) => {
    const match = weekString.match(/Week (\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  return (
    <>
      <div className="bg-[#0f0f1e] border border-[#24273f] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#020231] border-b border-[#24273f]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Athlete
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Week
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Check-in Date
                </th>
                <th className="px6 py-4 text-left text-sm font-semibold text-gray-300">
                  Coach
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Weight Change
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                      <span className="text-gray-400">Loading check-ins...</span>
                    </div>
                  </td>
                </tr>
              ) : hasData ? (
                checkIns.map((checkIn, index) => (
                  <tr
                    key={`${checkIn.athlete}-${checkIn.week}-${index}`}
                    className={`border-b border-[#303245] hover:bg-[#1a1a2a] transition-colors ${index % 2 === 0 ? "bg-[#0f0f1e]" : "bg-[#0a0a14]"
                      }`}
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {checkIn.athlete}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {checkIn.week}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {checkIn.checkInDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {checkIn.coach}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={
                          checkIn.weightChange.startsWith("+")
                            ? "text-red-400 font-medium"
                            : "text-emerald-400 font-medium"
                        }
                      >
                        {checkIn.weightChange}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${checkIn.status === "Completed"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                      >
                        {checkIn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() =>
                          handleDeleteClick(
                            checkIn.id,
                            checkIn.athlete,
                            getWeekNumber(checkIn.week)
                          )
                        }
                        disabled={loading}
                        className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete check-in"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400"
                  >
                    No check-ins found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between px-6 py-4 bg-[#020231]/50 border-t border-[#303245]">
              <p className="text-sm text-gray-400">
                Showing {checkIns.length > 0 ? (currentPage - 1) * 10 + 1 : 0}{" "}
                to{" "}
                {Math.min(
                  currentPage * 10,
                  checkIns.length + (currentPage - 1) * 10
                )}{" "}
                of {checkIns.length + (currentPage - 1) * 10} results
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm rounded-lg bg-[#08081A] border border-[#303245] text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#303245]/50 transition-colors"
                >
                  Previous
                </button>

                <span className="px-4 text-sm text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm rounded-lg bg-[#08081A] border border-[#303245] text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#303245]/50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Check-In"
        message={`Are you sure you want to delete ${deleteModal.athlete}'s check-in for Week ${deleteModal.weekNumber}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}