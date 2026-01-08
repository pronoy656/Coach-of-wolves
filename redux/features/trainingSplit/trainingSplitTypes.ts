// redux/features/trainingSplit/trainingSplitTypes.ts

export interface SplitDay {
    day: string;
    exerciseName: string;
}

export interface TrainingSplit {
    _id: string;
    userId: string;
    coachId: string;
    splite: SplitDay[]; // Note: Backend uses "splite" (typo) not "split"
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface TrainingSplitFormData {
    splite: SplitDay[];
}

export interface TrainingSplitState {
    splits: TrainingSplit[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    currentAthleteId: string | null;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: any;
}