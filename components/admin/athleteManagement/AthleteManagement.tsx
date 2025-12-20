"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search, Edit2, Trash2 } from "lucide-react";
import AddAthleteModal from "./addAthleteModal/AddAthleteModal";
import Image from "next/image";

interface Athlete {
  id: string;
  name: string;
  category: string;
  phase: string;
  weight: number;
  height: number;
  status: "Natural" | "Enhanced";
  lastCheckIn: string;
  gender: string;
  email: string;
  age: number;
  trainingDaySteps: number;
  restDaySteps: number;
  checkInDay: string;
  waterQuantity: number;
  goal: string;
  image?: string;
}

const SAMPLE_ATHLETES: Athlete[] = [
  {
    id: "1",
    name: "Jhon",
    category: "Lifestyle",
    phase: "Prep",
    weight: 85,
    height: 180,
    status: "Natural",
    lastCheckIn: "10/10/2025",
    gender: "Male",
    email: "jhon@example.com",
    age: 28,
    trainingDaySteps: 8000,
    restDaySteps: 6000,
    checkInDay: "Monday",
    waterQuantity: 2000,
    goal: "Build muscle and strength",
    image: "/avater-1.jpg",
  },
  {
    id: "2",
    name: "Alex",
    category: "Bikini",
    phase: "Offseason",
    weight: 75,
    height: 180,
    status: "Enhanced",
    lastCheckIn: "10/10/2025",
    gender: "Female",
    email: "alex@example.com",
    age: 26,
    trainingDaySteps: 7500,
    restDaySteps: 5500,
    checkInDay: "Tuesday",
    waterQuantity: 1800,
    goal: "Increase muscle mass",
    image: "/avater-1.jpg",
  },
  {
    id: "3",
    name: "Doe",
    category: "Men's Physique",
    phase: "Peak Week",
    weight: 65,
    height: 180,
    status: "Natural",
    lastCheckIn: "10/10/2025",
    gender: "Male",
    email: "doe@example.com",
    age: 30,
    trainingDaySteps: 9000,
    restDaySteps: 7000,
    checkInDay: "Wednesday",
    waterQuantity: 2200,
    goal: "Peak for competition",
    image: "/avater-1.jpg",
  },
  {
    id: "4",
    name: "Jack",
    category: "Classic Physique",
    phase: "Diet Break",
    weight: 80,
    height: 180,
    status: "Enhanced",
    lastCheckIn: "10/10/2025",
    gender: "Male",
    email: "jack@example.com",
    age: 32,
    trainingDaySteps: 8500,
    restDaySteps: 6500,
    checkInDay: "Thursday",
    waterQuantity: 2100,
    goal: "Maintain muscle during break",
    image: "/avater-1.jpg",
  },
  {
    id: "5",

    name: "Ariyan",
    category: "Bodybuilding",
    phase: "Offseason",
    weight: 90,
    height: 180,
    status: "Natural",
    lastCheckIn: "10/10/2025",
    gender: "Male",
    email: "ariyan@example.com",
    age: 29,
    trainingDaySteps: 10000,
    restDaySteps: 8000,
    checkInDay: "Friday",
    waterQuantity: 2500,
    goal: "Build massive size",
    image: "/avater-1.jpg",
  },
];

const STATUS_OPTIONS = ["Natural", "Enhanced"];
const PHASE_OPTIONS = [
  "Pre-Prep",
  "Offseason",
  "Peak Week",
  "Prep",
  "Diet-Break",
  "Fat-Reduction Phase",
  "Reverse-Diet-Phase",
];
const CATEGORY_MALE = [
  "Lifestyle",
  "Men's Physique",
  "Classic Physique",
  "212 Bodybuilding",
  "Bodybuilding",
  "Other",
];
const CATEGORY_FEMALE = [
  "Lifestyle",
  "Fitmodel",
  "Bikini",
  "Figure",
  "Wellness",
  "Women's Physique",
  "Women's Bodybuilding",
  "Other",
];

export default function AthleteManagement() {
  const [athletes, setAthletes] = useState<Athlete[]>(SAMPLE_ATHLETES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [phaseFilter, setPhaseFilter] = useState("All Phases");
  const [categoryFilter, setCategoryFilter] = useState("Category");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      const matchesSearch =
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" || athlete.status === statusFilter;
      const matchesPhase =
        phaseFilter === "All Phases" || athlete.phase === phaseFilter;
      const matchesCategory =
        categoryFilter === "Category" || athlete.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPhase && matchesCategory;
    });
  }, [athletes, searchTerm, statusFilter, phaseFilter, categoryFilter]);

  const handleAddAthlete = () => {
    setSelectedAthlete(null);
    setIsModalOpen(true);
  };

  const handleEditAthlete = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setIsModalOpen(true);
  };

  const handleSaveAthlete = (
    athleteData: Omit<Athlete, "id" | "lastCheckIn"> & {
      id?: string;
      lastCheckIn?: string;
    }
  ) => {
    if (selectedAthlete) {
      setAthletes(
        athletes.map((a) =>
          a.id === selectedAthlete.id
            ? { ...athleteData, id: a.id, lastCheckIn: a.lastCheckIn }
            : a
        )
      );
    } else {
      const newAthlete: Athlete = {
        ...athleteData,
        id: Date.now().toString(),
        lastCheckIn: new Date().toLocaleDateString(),
      };
      setAthletes([...athletes, newAthlete]);
    }
    setIsModalOpen(false);
    setSelectedAthlete(null);
  };

  const handleDeleteAthlete = (id: string) => {
    setAthletes(athletes.filter((a) => a.id !== id));
  };

  const getStatusColor = (status: string) => {
    return status === "Natural"
      ? "bg-green-500/20 text-green-400"
      : "bg-orange-500/20 text-amber-400";
  };

  return (
    <main className="h-screen bg-black p-6 flex flex-col overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Athletes Management
          </h1>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground" />
            <input
              type="text"
              placeholder="Search Here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-10 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-[#4A9E4A] transition-colors appearance-none cursor-pointer"
            >
              <option>All Status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500/50 pointer-events-none" />
          </div>

          {/* Phase Filter */}
          <div className="relative">
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-[#4A9E4A] transition-colors appearance-none cursor-pointer"
            >
              <option>All Phases</option>
              {PHASE_OPTIONS.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500/50 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-[#4A9E4A] transition-colors appearance-none cursor-pointer"
            >
              <option value="Category">Category</option>
              <optgroup label="Male Categories">
                {CATEGORY_MALE.map((cat) => (
                  <option key={`male-${cat}`} value={cat}>
                    {cat}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Female Categories">
                {CATEGORY_FEMALE.map((cat) => (
                  <option key={`female-${cat}`} value={cat}>
                    {cat}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500/50 pointer-events-none" />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddAthlete}
            className="px-6 py-2 border-2 border-[#4A9E4A] text-primary hover:bg-primary/10 rounded-full font-medium transition-colors"
          >
            + Add Athletes
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-[#24273f] bg-slate-800/30 flex-1 overflow-hidden flex flex-col">
          <div className="overflow-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
            <table className="w-full whitespace-nowrap">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-[#24273f] bg-[#020231]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Profile
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Phase
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Weight (kg)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Height (cm)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Last Check-in
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Water (L)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAthletes.map((athlete, index) => (
                  <tr
                    key={athlete.id}
                    className={`border-b bg-[#212133] border-[#303245] hover:bg-[#1b1b2b] transition-colors ${
                      index % 2 === 0 ? "bg-[#212133]/50" : "bg-background"
                    }`}
                  >
                    <td className="px-6 py-4">
                      {athlete.image ? (
                        <Image
                          src={athlete.image || "/placeholder.svg"}
                          alt={athlete.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                          {athlete.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {athlete.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {athlete.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{athlete.gender}</td>
                    <td className="px-6 py-4 text-white">{athlete.age}</td>
                    <td className="px-6 py-4 text-green-500">
                      {athlete.category}
                    </td>
                    <td className="px-6 py-4 text-white">{athlete.phase}</td>
                    <td className="px-6 py-4 text-white">{athlete.weight}</td>
                    <td className="px-6 py-4 text-white">{athlete.height}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                          athlete.status
                        )}`}
                      >
                        {athlete.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {athlete.lastCheckIn}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {athlete.waterQuantity}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditAthlete(athlete)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAthlete(athlete.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredAthletes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">
              No athletes found matching your filters
            </p>
          </div>
        )}
      </div>
      {/* Modal */}
      <AddAthleteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAthlete(null);
        }}
        onSave={handleSaveAthlete}
        athlete={selectedAthlete}
      />
    </main>
  );
}
