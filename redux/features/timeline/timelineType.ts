export interface DailyMetric {
    avgWeight: number;
    avgProtein: number;
    avgFats: number;
    avgCarbs: number;
    avgCalories: number;
    avgActivityStep: number;
    avgCardioPerMin: number;
}

export interface TimelineAverages {
    trainingDay: DailyMetric | null;
    restDay: DailyMetric | null;
}

export interface TimelineItem {
    _id?: string;
    userId: string;
    phase: string;
    checkInDate: string;
    nextCheckInDate: string;
    averages: TimelineAverages;
}

export interface TimelineState {
    timeline: TimelineItem[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}
