// app/training/history/page.tsx
"use client";

// import TrainingHistory from "@/components/trainingHistory/trainingHistory";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchTrainingHistory } from "@/redux/features/trainingHistory/trainingHistorySlice";
import TrainingHistory from "@/components/coach/tab/trainingTab/TrainingHistory";

export default function TrainingHistoryPage() {
    const dispatch = useAppDispatch();

    // Optional: Fetch on page load if not done in component
    useEffect(() => {
        dispatch(fetchTrainingHistory());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <TrainingHistory />
        </div>
    );
}