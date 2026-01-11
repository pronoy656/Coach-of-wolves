// redux/features/trainingHistory/trainingHistoryTypes.ts

export interface ExerciseSet {
    weight: number;
    reps: number;
    rpe?: number;
}

export interface Exercise {
    name: string;
    sets: ExerciseSet[];
    bestSet?: {
        weight: number;
        reps: number;
        rpe?: number;
    };
}

export interface Workout {
    _id?: string;
    id: string;
    month: string;
    workoutCount: number;
    workoutType: string;
    date: string;
    notes?: string;
    duration: string;
    totalVolume: number;
    prCount: number;
    exercises: Exercise[];
}

export interface TrainingHistoryData {
    histories: Workout[];
    pr: {
        volumePR: boolean;
    };
}

export interface TrainingHistoryState {
    data: TrainingHistoryData;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: TrainingHistoryData;
}