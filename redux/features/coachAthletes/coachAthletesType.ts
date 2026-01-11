export interface Athlete {
    _id: string; // Backend uses _id
    name: string;
    coachId: string;
    role: "ATHLETE";
    email: string;
    password?: string;
    gender: string;
    category: string;
    phase: string;
    weight: number;
    height: number;
    image?: string;
    notifiedThisWeek?: boolean;
    age: number;
    waterQuantity: number;
    status: string;
    trainingDaySteps: number;
    restDaySteps: number;
    checkInDay: string;
    goal: string;
    verified?: boolean;
    isActive: "Active" | "In-Active";
    lastActive?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CoachAthletesState {
    athletes: Athlete[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}
