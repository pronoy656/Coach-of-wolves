
export interface ExerciseSet {
    sets: string;
    repRange: string;
    rir: string;
}

export interface BackendExercise {
    exerciseName: string;
    exerciseId?: string;
    excerciseNote?: string;
    exerciseSets?: ExerciseSet[];
    _id?: string;
}

export interface TrainingPlan {
    _id: string;
    userId: string;
    coachId: string;
    traingPlanName: string;
    exerciseId: string;
    dificulty: string;
    comment: string;
    exercise: BackendExercise[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface TrainingPlanFormData {
    traingPlanName: string;
    exerciseId: string;
    dificulty: string;
    comment: string;
    exercise: BackendExercise[];
}

export interface TrainingPlanState {
    plans: TrainingPlan[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    searchTerm: string;
}
