// redux/features/weeklyCheckin/weeklyCheckinTypes.ts

export interface QuestionAndAnswer {
    question: string;
    answer: string;
    status: boolean;
    _id: string;
}

// Coach-created slider stored as a dynamic key inside wellBeing
export interface CoachSlider {
    key: string;   // camelCase field name sent to backend
    title: string; // human-readable display title
    value: number; // 0-10, default 0
}

export interface WellBeing {
    energyLevel: number;
    stressLevel: number;
    moodLevel: number;
    sleepQuality: number;
    hungerLevel: number;
    _id: string;
    // Any additional fields added by coaches are stored here
    [key: string]: number | string | undefined;
}

export interface Nutrition {
    dietLevel: number;
    digestionLevel: number;
    challengeDiet: string;
    _id: string;
}

export interface Training {
    feelStrength: number;
    pumps: number;
    cardioCompleted: boolean;
    trainingCompleted: boolean;
    _id: string;
}

export interface SliderAnswer {
    _id?: string;
    sliderId?: string;
    title: string;
    value: string | number;
}

export interface WeeklyCheckin {
    _id: string;
    userId: string;
    coachId?: string;
    currentWeight: number;
    averageWeight: number;
    questionAndAnswer: QuestionAndAnswer[];
    wellBeing: WellBeing;
    sliderAnswers?: SliderAnswer[];
    nutrition?: Nutrition;
    training?: Training;
    trainingFeedback?: string;
    athleteNote: string;
    coachNote: string;
    image: string[];
    media: string[];
    video?: string[];
    checkinCompleted: string; // "Completed" or "2026-01-09T10:30:00Z"
    createdAt: string;
    updatedAt: string;
    __v?: number;
    dailyNote?: string;
    athleteName?: string;
    coachName?: string;
    weekNumber?: number;
    nextCheckInDate?: string;
    weight?: number; // weight change
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
    oldCheckin: WeeklyCheckin | null;
}