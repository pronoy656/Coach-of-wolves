// redux/features/trainingHistory/trainingHistoryTypes.ts

export interface PushSet {
    weight: number;
    repRange: string;
    rir: string;
    set: number;
    exerciseName: string;
    oneRM?: number;
}

export interface TrainingTime {
    hour: string;
    minite: string;
}

export interface TrainingHistoryItem {
    _id: string;
    userId: string;
    trainingName: string;
    time: TrainingTime;
    pushData: PushSet[];
    note: string;
    createdAt: string;
    updatedAt: string;
    totalWeight?: number;
    __v?: number;
}

export interface TrainingHistoryData {
    histories: TrainingHistoryItem[];
    pr?: {
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
    data: TrainingHistoryItem[] | TrainingHistoryData;
}