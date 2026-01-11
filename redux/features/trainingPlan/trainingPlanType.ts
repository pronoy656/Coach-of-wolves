// redux/features/trainingPlan/trainingPlanType.ts

export interface SetDetail {
    sets: string;
    reps: string;
    rir: string;
}

export interface BackendExercise {
    exerciseName: string;
    sets: string;
    repRange: string;
    rir: string;
    setDetails?: SetDetail[];
    excerciseNote: string;
    _id?: string;
}

export interface TrainingPlan {
    _id: string;
    userId: string;
    coachId: string;
    traingPlanName: string; // Backend typo: traingPlanName
    exercise: BackendExercise[];
    dificulty: string; // Backend typo: dificulty
    comment: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface TrainingPlanFormData {
    traingPlanName: string;
    exercise: BackendExercise[];
    dificulty: string;
    comment: string;
}

export interface TrainingPlanState {
    plans: TrainingPlan[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    searchTerm: string;
}
