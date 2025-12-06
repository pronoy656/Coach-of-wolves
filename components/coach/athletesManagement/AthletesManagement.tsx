"use client";

import { useState } from "react";
import AthletesTable from "./athletesTable/AthletesTable";
import AthletesModal from "./athletesModal/AthletesModal";

interface Athlete {
  id: string;
  name: string;
  category: string;
  phase: string;
  weight: number;
  height: number;
  lastCheckIn: string;
  status: "Natural" | "Enhanced";
  restDaySteps: number;
  trainingDaySteps: number;
  birthday: string;
  assignedCardio: number;
  goal: string;
}

export default function AthletesManagement() {
  const [athletes, setAthletes] = useState<Athlete[]>([
    {
      id: "1",
      name: "Ethan Morales",
      category: "Bodybuilding",
      phase: "Prep",
      weight: 92,
      height: 178,
      lastCheckIn: "2025-01-10",
      status: "Enhanced",
      restDaySteps: 4500,
      trainingDaySteps: 7800,
      birthday: "1988-11-12",
      assignedCardio: 40,
      goal: "Win regional show",
    },
    {
      id: "2",
      name: "Lucas Bennett",
      category: "Men's Physique",
      phase: "Off-Season",
      weight: 84,
      height: 182,
      lastCheckIn: "2025-01-08",
      status: "Natural",
      restDaySteps: 7000,
      trainingDaySteps: 10000,
      birthday: "1994-06-22",
      assignedCardio: 20,
      goal: "Increase muscle fullness",
    },
    {
      id: "3",
      name: "Aiden Park",
      category: "Classic Physique",
      phase: "Prep",
      weight: 89,
      height: 177,
      lastCheckIn: "2025-01-12",
      status: "Enhanced",
      restDaySteps: 5500,
      trainingDaySteps: 9200,
      birthday: "1991-03-10",
      assignedCardio: 35,
      goal: "Improve conditioning",
    },
    {
      id: "4",
      name: "Noah Fernández",
      category: "Lifestyle",
      phase: "Recomp",
      weight: 72,
      height: 170,
      lastCheckIn: "2025-01-09",
      status: "Natural",
      restDaySteps: 8000,
      trainingDaySteps: 11000,
      birthday: "1998-09-18",
      assignedCardio: 15,
      goal: "Lose fat while keeping muscle",
    },
    {
      id: "5",
      name: "Kai Yamada",
      category: "Powerbuilding",
      phase: "Strength Block",
      weight: 95,
      height: 183,
      lastCheckIn: "2025-01-11",
      status: "Enhanced",
      restDaySteps: 4000,
      trainingDaySteps: 6500,
      birthday: "1987-02-28",
      assignedCardio: 10,
      goal: "Increase squat and deadlift strength",
    },
    {
      id: "6",
      name: "Oliver Grant",
      category: "Lifestyle",
      phase: "Fat Loss",
      weight: 78,
      height: 176,
      lastCheckIn: "2025-01-06",
      status: "Natural",
      restDaySteps: 6500,
      trainingDaySteps: 9300,
      birthday: "1995-07-12",
      assignedCardio: 30,
      goal: "Drop 8kg before summer",
    },
    {
      id: "7",
      name: "Rafael Costa",
      category: "Bodybuilding",
      phase: "Off-Season",
      weight: 102,
      height: 186,
      lastCheckIn: "2025-01-07",
      status: "Enhanced",
      restDaySteps: 5000,
      trainingDaySteps: 8200,
      birthday: "1989-10-26",
      assignedCardio: 15,
      goal: "Add 4kg lean mass",
    },
    {
      id: "8",
      name: "Ivan Petrov",
      category: "Classic Physique",
      phase: "Prep",
      weight: 88,
      height: 179,
      lastCheckIn: "2025-01-05",
      status: "Enhanced",
      restDaySteps: 5200,
      trainingDaySteps: 8800,
      birthday: "1990-12-03",
      assignedCardio: 45,
      goal: "Bring tighter midsection",
    },
    {
      id: "9",
      name: "Samuel Hart",
      category: "Lifestyle",
      phase: "Recomp",
      weight: 82,
      height: 181,
      lastCheckIn: "2025-01-09",
      status: "Natural",
      restDaySteps: 9000,
      trainingDaySteps: 12000,
      birthday: "1996-08-14",
      assignedCardio: 20,
      goal: "Improve energy & daily performance",
    },
    {
      id: "10",
      name: "Dmitri Volkov",
      category: "Bodybuilding",
      phase: "Peak Week",
      weight: 98,
      height: 185,
      lastCheckIn: "2025-01-12",
      status: "Enhanced",
      restDaySteps: 4800,
      trainingDaySteps: 7500,
      birthday: "1985-01-30",
      assignedCardio: 25,
      goal: "Perfect stage-ready condition",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Natural" | "Enhanced"
  >("All");

  const handleAddAthlete = () => {
    setSelectedAthlete(null);
    setIsModalOpen(true);
  };

  const handleEditAthlete = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setIsModalOpen(true);
  };

  const handleDeleteAthlete = (id: string) => {
    setAthletes(athletes.filter((a) => a.id !== id));
  };

  const handleSaveAthlete = (athleteData: Omit<Athlete, "id">) => {
    if (selectedAthlete) {
      setAthletes(
        athletes.map((a) =>
          a.id === selectedAthlete.id ? { ...a, ...athleteData } : a
        )
      );
    } else {
      const newAthlete: Athlete = {
        ...athleteData,
        id: Date.now().toString(),
      };
      setAthletes([...athletes, newAthlete]);
    }
    setIsModalOpen(false);
  };

  const filteredAthletes =
    statusFilter === "All"
      ? athletes
      : athletes.filter((a) => a.status === statusFilter);

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <AthletesTable
              athletes={filteredAthletes}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onAddAthlete={handleAddAthlete}
              onEditAthlete={handleEditAthlete}
              onDeleteAthlete={handleDeleteAthlete}
            />
          </div>
        </main>
      </div>

      <AthletesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAthlete}
        athlete={selectedAthlete}
      />
    </div>
  );
}
