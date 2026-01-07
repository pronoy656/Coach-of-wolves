// "use client";

// import { useState, useMemo } from "react";
// import WeeklyStatCard from "./weeklyStatCard/WeeklyStatCard";
// import WeekCalender from "./weekCalender/WeekCalender";
// import CheckInTable from "./checkInTable/CheckInTable";

// export default function WeeklyCheckIns() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
//   const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const [checkIns, setCheckIns] = useState([
//     {
//       id: 1,
//       athlete: "Jhon",
//       week: "Week 2",
//       checkInDate: "1/07/2025",
//       coach: "Smith Jhon",
//       weightChange: "-0.8(kg)",
//       status: "Completed",
//     },
//     {
//       id: 2,
//       athlete: "Mike Chen",
//       week: "Week 4",
//       checkInDate: "1/07/2025",
//       coach: "Jack",
//       weightChange: "-0.8(kg)",
//       status: "Pending",
//     },
//     {
//       id: 3,
//       athlete: "Sarah Johnson",
//       week: "Week 1",
//       checkInDate: "1/07/2025",
//       coach: "Smith Jhon",
//       weightChange: "+0.5(kg)",
//       status: "Completed",
//     },
//     {
//       id: 4,
//       athlete: "Alex Rodriguez",
//       week: "Week 3",
//       checkInDate: "1/07/2025",
//       coach: "Jack",
//       weightChange: "-0.3(kg)",
//       status: "Pending",
//     },
//     {
//       id: 5,
//       athlete: "Emma Davis",
//       week: "Week 2",
//       checkInDate: "1/07/2025",
//       coach: "Smith Jhon",
//       weightChange: "-0.2(kg)",
//       status: "Completed",
//     },
//     {
//       id: 6,
//       athlete: "David Wilson",
//       week: "Week 1",
//       checkInDate: "1/07/2025",
//       coach: "Jack",
//       weightChange: "-0.5(kg)",
//       status: "Completed",
//     },
//     {
//       id: 7,
//       athlete: "Lisa Anderson",
//       week: "Week 4",
//       checkInDate: "1/07/2025",
//       coach: "Smith Jhon",
//       weightChange: "+0.2(kg)",
//       status: "Pending",
//     },
//     {
//       id: 8,
//       athlete: "Tom Brown",
//       week: "Week 3",
//       checkInDate: "1/07/2025",
//       coach: "Jack",
//       weightChange: "-0.1(kg)",
//       status: "Completed",
//     },
//     {
//       id: 9,
//       athlete: "Jessica Lee",
//       week: "Week 2",
//       checkInDate: "1/07/2025",
//       coach: "Smith Jhon",
//       weightChange: "-0.4(kg)",
//       status: "Pending",
//     },
//     {
//       id: 10,
//       athlete: "Chris Martin",
//       week: "Week 1",
//       checkInDate: "1/07/2025",
//       coach: "Jack",
//       weightChange: "+0.1(kg)",
//       status: "Completed",
//     },
//     {
//       id: 11,
//       athlete: "Rachel Green",
//       week: "Week 4",
//       checkInDate: "1/07/2025",
//       coach: "Smith Jhon",
//       weightChange: "-0.6(kg)",
//       status: "Completed",
//     },
//     {
//       id: 12,
//       athlete: "Mark Taylor",
//       week: "Week 3",
//       checkInDate: "1/07/2025",
//       coach: "Jack",
//       weightChange: "-0.7(kg)",
//       status: "Pending",
//     },
//   ]);

//   const completedCount = checkIns.filter(
//     (c) => c.status === "Completed"
//   ).length;
//   const pendingCount = checkIns.filter((c) => c.status === "Pending").length;
//   const completionRate =
//     checkIns.length > 0
//       ? Math.round((completedCount / checkIns.length) * 100)
//       : 0;

//   const filteredCheckIns = useMemo(() => {
//     return checkIns.filter((checkIn) => {
//       const matchesSearch =
//         searchTerm === "" ||
//         checkIn.athlete.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         checkIn.coach.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesStatus =
//         selectedStatus.length === 0 || selectedStatus.includes(checkIn.status);

//       const matchesWeek = checkIn.week === selectedWeek;

//       return matchesSearch && matchesStatus && matchesWeek;
//     });
//   }, [searchTerm, selectedStatus, selectedWeek, checkIns]);

//   const totalPages = Math.ceil(filteredCheckIns.length / itemsPerPage);
//   const paginatedCheckIns = filteredCheckIns.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleDeleteCheckIn = (id: number) => {
//     setCheckIns((prev) => prev.filter((c) => c.id !== id));
//   };

//   const toggleStatusFilter = (status: string) => {
//     setSelectedStatus((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//   };

//   const handleWeekChange = (week: string) => {
//     setSelectedWeek(week);
//     setCurrentPage(1);
//   };

//   const handleStatusChange = (status: string) => {
//     toggleStatusFilter(status);
//     setCurrentPage(1);
//   };

//   const handleSearchChange = (term: string) => {
//     setSearchTerm(term);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="flex h-screen bg-background text-foreground">
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <main className="flex-1 overflow-auto">
//           <div className="p-6 space-y-6">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">Weekly Check-Ins</h1>
//               <p className="text-muted-foreground">
//                 Monitor all athlete check-ins and progress
//               </p>
//             </div>

//             {/* Stats Cards Component */}
//             <WeeklyStatCard
//               completedCount={completedCount}
//               pendingCount={pendingCount}
//               completionRate={completionRate}
//             />

//             {/* Filters */}
//             <div className="flex flex-col gap-4">
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   placeholder="Search athlete or coach..."
//                   value={searchTerm}
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   className="flex-1 px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                 />

//                 <select
//                   value={selectedStatus.join(",")}
//                   onChange={(e) => {
//                     if (e.target.value === "") {
//                       setSelectedStatus([]);
//                       setCurrentPage(1);
//                     } else {
//                       setSelectedStatus(
//                         e.target.value.split(",").filter(Boolean)
//                       );
//                       setCurrentPage(1);
//                     }
//                   }}
//                   className="px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Completed">Completed</option>
//                   <option value="Pending">Pending</option>
//                 </select>

//                 <WeekCalender
//                   selectedWeek={selectedWeek}
//                   onWeekChange={handleWeekChange}
//                 />
//               </div>
//             </div>

//             {/* Table Component */}
//             <CheckInTable
//               checkIns={paginatedCheckIns}
//               onDelete={handleDeleteCheckIn}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={setCurrentPage}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }












// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { WeeklyCheckin } from "@/redux/features/weeklyCheckin/weeklyCheckinTypes";
// import {
//   fetchWeeklyCheckins,
//   deleteWeeklyCheckin,
//   clearMessages,
// } from "@/redux/features/weeklyCheckin/weeklyCheckinSlice";
// import WeeklyStatCard from "./weeklyStatCard/WeeklyStatCard";
// import WeekCalender from "./weekCalender/WeekCalender";
// import CheckInTable from "./checkInTable/CheckInTable";
// import toast from "react-hot-toast";
// import { Loader2 } from "lucide-react";

// export default function WeeklyCheckIns() {
//   const dispatch = useAppDispatch();
//   const { checkins, loading, error, successMessage, stats } = useAppSelector(
//     (state) => state.weeklyCheckin
//   );

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState<string[]>(["Pending", "Completed"]);
//   const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Fetch checkins on component mount
//   useEffect(() => {
//     dispatch(fetchWeeklyCheckins());
//   }, [dispatch]);

//   // Handle success/error messages
//   useEffect(() => {
//     if (successMessage) {
//       toast.success(successMessage);
//       dispatch(clearMessages());
//     }
//     if (error) {
//       toast.error(error);
//       dispatch(clearMessages());
//     }
//   }, [error, successMessage, dispatch]);

//   // Filter and transform data
//   const filteredCheckIns = useMemo(() => {
//     const weekNumber = parseInt(selectedWeek.replace("Week ", ""));

//     return checkins.filter((checkIn) => {
//       const matchesSearch =
//         searchTerm === "" ||
//         checkIn.athleteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         checkIn.coachName.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesStatus =
//         selectedStatus.length === 0 ||
//         selectedStatus.includes(checkIn.checkinCompleted);

//       const matchesWeek = checkIn.weekNumber === weekNumber;

//       return matchesSearch && matchesStatus && matchesWeek;
//     });
//   }, [searchTerm, selectedStatus, selectedWeek, checkins]);

//   // Transform data for table
//   const tableData = useMemo(() => {
//     return filteredCheckIns.map((checkIn, index) => ({
//       id: index + 1,
//       athlete: checkIn.athleteName,
//       week: `Week ${checkIn.weekNumber}`,
//       checkInDate: formatDate(checkIn.nextCheckInDate),
//       coach: checkIn.coachName,
//       weightChange: `${checkIn.weight > 0 ? '+' : ''}${checkIn.weight.toFixed(1)}(kg)`,
//       status: checkIn.checkinCompleted,
//       originalData: checkIn, // Keep original for operations
//     }));
//   }, [filteredCheckIns]);

//   const totalPages = Math.ceil(tableData.length / itemsPerPage);
//   const paginatedCheckIns = tableData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'numeric',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Handle delete
//   const handleDeleteCheckIn = async (id: number, athleteName: string, weekNumber: number) => {
//     try {
//       await dispatch(deleteWeeklyCheckin({ athleteName, weekNumber })).unwrap();
//       toast.success("Check-in deleted successfully");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to delete check-in");
//     }
//   };

//   // Filter handlers
//   const toggleStatusFilter = (status: string) => {
//     setSelectedStatus((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//     setCurrentPage(1);
//   };

//   const handleWeekChange = (week: string) => {
//     setSelectedWeek(week);
//     setCurrentPage(1);
//   };

//   const handleSearchChange = (term: string) => {
//     setSearchTerm(term);
//     setCurrentPage(1);
//   };

//   const handleStatusChange = (status: string) => {
//     toggleStatusFilter(status);
//   };

//   return (
//     <div className="flex h-screen bg-black text-white">
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <main className="flex-1 overflow-auto">
//           <div className="p-6 space-y-6">
//             {/* Loading overlay */}
//             {loading && (
//               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                 <div className="bg-[#1a1a2e] p-6 rounded-lg flex flex-col items-center">
//                   <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
//                   <span className="text-gray-300">Loading check-ins...</span>
//                 </div>
//               </div>
//             )}

//             <div>
//               <h1 className="text-3xl font-bold mb-2">Weekly Check-Ins</h1>
//               <p className="text-gray-400">
//                 Monitor all athlete check-ins and progress
//               </p>
//             </div>

//             {/* Stats Cards Component */}
//             <WeeklyStatCard
//               completedCount={stats.completedCount}
//               pendingCount={stats.pendingCount}
//               completionRate={stats.completionRate}
//             />

//             {/* Filters */}
//             <div className="flex flex-col gap-4">
//               <div className="flex gap-3 flex-wrap">
//                 <input
//                   type="text"
//                   placeholder="Search athlete or coach..."
//                   value={searchTerm}
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   className="flex-1 min-w-[200px] px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
//                   disabled={loading}
//                 />

//                 {/* Status Filter Buttons */}
//                 <div className="flex gap-2">
//                   {["Pending", "Completed"].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => handleStatusChange(status)}
//                       className={`px-4 py-2 rounded-lg border transition-colors ${selectedStatus.includes(status)
//                           ? status === "Completed"
//                             ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
//                             : "bg-amber-500/20 border-amber-500 text-amber-400"
//                           : "bg-[#08081A] border-[#303245] text-gray-400 hover:bg-[#303245]"
//                         }`}
//                       disabled={loading}
//                     >
//                       {status}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setSelectedStatus(["Pending", "Completed"])}
//                     className="px-4 py-2 rounded-lg bg-[#08081A] border border-[#303245] text-gray-400 hover:bg-[#303245] transition-colors"
//                     disabled={loading}
//                   >
//                     All Status
//                   </button>
//                 </div>

//                 {/* Week Calendar */}
//                 <WeekCalender
//                   selectedWeek={selectedWeek}
//                   onWeekChange={handleWeekChange}
//                 />
//               </div>

//               {/* Active filters info */}
//               <div className="text-sm text-gray-400">
//                 Showing {filteredCheckIns.length} check-ins for {selectedWeek}
//                 {selectedStatus.length === 1 && ` (${selectedStatus[0]} only)`}
//                 {searchTerm && ` matching "${searchTerm}"`}
//               </div>
//             </div>

//             {/* Table Component */}
//             <CheckInTable
//               checkIns={paginatedCheckIns}
//               onDelete={handleDeleteCheckIn}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={setCurrentPage}
//               loading={loading}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { WeeklyCheckin } from "@/redux/features/weeklyCheckin/weeklyCheckinTypes";
import {
  fetchWeeklyCheckins,
  deleteWeeklyCheckin,
  clearMessages,
} from "@/redux/features/weeklyCheckin/weeklyCheckinSlice";
import WeeklyStatCard from "./weeklyStatCard/WeeklyStatCard";
import WeekCalender from "./weekCalender/WeekCalender";
import CheckInTable from "./checkInTable/CheckInTable";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function WeeklyCheckIns() {
  const dispatch = useAppDispatch();
  const { checkins, loading, error, successMessage, stats } = useAppSelector(
    (state) => state.weeklyCheckin
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Format date function - MOVED BEFORE useMemo
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Fetch checkins on component mount
  useEffect(() => {
    dispatch(fetchWeeklyCheckins());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  // Filter and transform data
  const filteredCheckIns = useMemo(() => {
    const weekNumber = parseInt(selectedWeek.replace("Week ", ""));

    return checkins.filter((checkIn) => {
      const matchesSearch =
        searchTerm === "" ||
        checkIn.athleteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkIn.coachName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" ||
        checkIn.checkinCompleted === selectedStatus;

      const matchesWeek = checkIn.weekNumber === weekNumber;

      return matchesSearch && matchesStatus && matchesWeek;
    });
  }, [searchTerm, selectedStatus, selectedWeek, checkins]);

  // Transform data for table - NOW formatDate IS AVAILABLE
  const tableData = useMemo(() => {
    return filteredCheckIns.map((checkIn, index) => ({
      id: index + 1,
      athlete: checkIn.athleteName,
      week: `Week ${checkIn.weekNumber}`,
      checkInDate: formatDate(checkIn.nextCheckInDate),
      coach: checkIn.coachName,
      weightChange: `${checkIn.weight > 0 ? '+' : ''}${checkIn.weight.toFixed(1)}(kg)`,
      status: checkIn.checkinCompleted,
      originalData: checkIn, // Keep original for operations
    }));
  }, [filteredCheckIns]); // formatDate is stable, no need to include in dependencies

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedCheckIns = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle delete
  const handleDeleteCheckIn = async (id: number, athleteName: string, weekNumber: number) => {
    try {
      await dispatch(deleteWeeklyCheckin({ athleteName, weekNumber })).unwrap();
      toast.success("Check-in deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete check-in");
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleWeekChange = (week: string) => {
    setSelectedWeek(week);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };



  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Loading overlay */}
            {loading && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#1a1a2e] p-6 rounded-lg flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                  <span className="text-gray-300">Loading check-ins...</span>
                </div>
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold mb-2">Weekly Check-Ins</h1>
              <p className="text-gray-400">
                Monitor all athlete check-ins and progress
              </p>
            </div>

            {/* Stats Cards Component */}
            <WeeklyStatCard
              completedCount={stats.completedCount}
              pendingCount={stats.pendingCount}
              completionRate={stats.completionRate}
            />

            {/* Filters */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Search athlete or coach..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  disabled={loading}
                />

                {/* Status Filter Dropdown */}
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  disabled={loading}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>

                {/* Week Calendar */}
                <WeekCalender
                  selectedWeek={selectedWeek}
                  onWeekChange={handleWeekChange}
                />
              </div>

              {/* Active filters info */}
              <div className="text-sm text-gray-400">
                Showing {filteredCheckIns.length} check-ins for {selectedWeek}
                {selectedStatus !== "All" && ` (${selectedStatus} only)`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
            </div>

            {/* Table Component */}
            <CheckInTable
              checkIns={paginatedCheckIns}
              onDelete={handleDeleteCheckIn}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}