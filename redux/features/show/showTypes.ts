// redux/features/show/showTypes.ts

export interface Show {
    _id: string;
    id: string;
    name: string;
    division: string;
    date: string;
    location: string;
    countdown: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ShowFormData {
    name: string;
    division: string;
    date: string;
    location: string;
}

export interface ShowState {
    shows: Show[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: any;
}