"use client";

import { useState, useMemo } from "react";
import WeeklyStatCard from "./weeklyStatCard/WeeklyStatCard";
import WeekCalender from "./weekCalender/WeekCalender";
import CheckInTable from "./checkInTable/CheckInTable";

export default function WeeklyCheckIns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [checkIns, setCheckIns] = useState([
    {
      id: 1,
      athlete: "Jhon",
      week: "Week 2",
      checkInDate: "1/07/2025",
      coach: "Smith Jhon",
      weightChange: "-0.8(kg)",
      status: "Completed",
    },
    {
      id: 2,
      athlete: "Mike Chen",
      week: "Week 4",
      checkInDate: "1/07/2025",
      coach: "Jack",
      weightChange: "-0.8(kg)",
      status: "Pending",
    },
    {
      id: 3,
      athlete: "Sarah Johnson",
      week: "Week 1",
      checkInDate: "1/07/2025",
      coach: "Smith Jhon",
      weightChange: "+0.5(kg)",
      status: "Completed",
    },
    {
      id: 4,
      athlete: "Alex Rodriguez",
      week: "Week 3",
      checkInDate: "1/07/2025",
      coach: "Jack",
      weightChange: "-0.3(kg)",
      status: "Pending",
    },
    {
      id: 5,
      athlete: "Emma Davis",
      week: "Week 2",
      checkInDate: "1/07/2025",
      coach: "Smith Jhon",
      weightChange: "-0.2(kg)",
      status: "Completed",
    },
    {
      id: 6,
      athlete: "David Wilson",
      week: "Week 1",
      checkInDate: "1/07/2025",
      coach: "Jack",
      weightChange: "-0.5(kg)",
      status: "Completed",
    },
    {
      id: 7,
      athlete: "Lisa Anderson",
      week: "Week 4",
      checkInDate: "1/07/2025",
      coach: "Smith Jhon",
      weightChange: "+0.2(kg)",
      status: "Pending",
    },
    {
      id: 8,
      athlete: "Tom Brown",
      week: "Week 3",
      checkInDate: "1/07/2025",
      coach: "Jack",
      weightChange: "-0.1(kg)",
      status: "Completed",
    },
    {
      id: 9,
      athlete: "Jessica Lee",
      week: "Week 2",
      checkInDate: "1/07/2025",
      coach: "Smith Jhon",
      weightChange: "-0.4(kg)",
      status: "Pending",
    },
    {
      id: 10,
      athlete: "Chris Martin",
      week: "Week 1",
      checkInDate: "1/07/2025",
      coach: "Jack",
      weightChange: "+0.1(kg)",
      status: "Completed",
    },
    {
      id: 11,
      athlete: "Rachel Green",
      week: "Week 4",
      checkInDate: "1/07/2025",
      coach: "Smith Jhon",
      weightChange: "-0.6(kg)",
      status: "Completed",
    },
    {
      id: 12,
      athlete: "Mark Taylor",
      week: "Week 3",
      checkInDate: "1/07/2025",
      coach: "Jack",
      weightChange: "-0.7(kg)",
      status: "Pending",
    },
  ]);

  const completedCount = checkIns.filter(
    (c) => c.status === "Completed"
  ).length;
  const pendingCount = checkIns.filter((c) => c.status === "Pending").length;
  const completionRate =
    checkIns.length > 0
      ? Math.round((completedCount / checkIns.length) * 100)
      : 0;

  const filteredCheckIns = useMemo(() => {
    return checkIns.filter((checkIn) => {
      const matchesSearch =
        searchTerm === "" ||
        checkIn.athlete.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkIn.coach.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus.length === 0 || selectedStatus.includes(checkIn.status);

      const matchesWeek = checkIn.week === selectedWeek;

      return matchesSearch && matchesStatus && matchesWeek;
    });
  }, [searchTerm, selectedStatus, selectedWeek, checkIns]);

  const totalPages = Math.ceil(filteredCheckIns.length / itemsPerPage);
  const paginatedCheckIns = filteredCheckIns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteCheckIn = (id: number) => {
    setCheckIns((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleWeekChange = (week: string) => {
    setSelectedWeek(week);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    toggleStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Weekly Check-Ins</h1>
              <p className="text-muted-foreground">
                Monitor all athlete check-ins and progress
              </p>
            </div>

            {/* Stats Cards Component */}
            <WeeklyStatCard
              completedCount={completedCount}
              pendingCount={pendingCount}
              completionRate={completionRate}
            />

            {/* Filters */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search athlete or coach..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <select
                  value={selectedStatus.join(",")}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setSelectedStatus([]);
                      setCurrentPage(1);
                    } else {
                      setSelectedStatus(
                        e.target.value.split(",").filter(Boolean)
                      );
                      setCurrentPage(1);
                    }
                  }}
                  className="px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
                <WeekCalender
                  selectedWeek={selectedWeek}
                  onWeekChange={handleWeekChange}
                />
              </div>
            </div>

            {/* Table Component */}
            <CheckInTable
              checkIns={paginatedCheckIns}
              onDelete={handleDeleteCheckIn}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
