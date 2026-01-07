// redux/features/weeklyCheckin/weeklyCheckinTypes.ts

export interface WeeklyCheckin {
    athleteName: string;
    coachName: string;
    weekNumber: number;
    weight: number;
    nextCheckInDate: string;
    checkinCompleted: "Pending" | "Completed";
    _id?: string; // Optional if backend provides
}

export interface WeeklyCheckinState {
    checkins: WeeklyCheckin[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    stats: {
        completedCount: number;
        pendingCount: number;
        completionRate: number;
    };
}

export interface WeeklyStats {
    completedCount: number;
    pendingCount: number;
    completionRate: number;
}