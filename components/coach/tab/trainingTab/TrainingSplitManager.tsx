"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchTrainingSplits,
    addTrainingSplit,
    updateTrainingSplit,
    deleteTrainingSplit,
    clearMessages
} from "@/redux/features/trainingSplit/trainingSplitSlice";
import AddTrainingSplitModal from "./AddTrainingSplitModal";
import TrainingSplitPreview from "./TrainingSplitPreview";
// import DeleteModal from "@/components/exerciseDatabase/deleteModal/DeleteModal";
import { Plus, Loader2, Users, Dumbbell } from "lucide-react";
import toast from "react-hot-toast";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";

interface TrainingSplitManagerProps {
    athleteId: string;
    athleteName?: string;
}

export default function TrainingSplitManager({
    athleteId,
    athleteName = "Athlete"
}: TrainingSplitManagerProps) {
    const dispatch = useAppDispatch();
    const { splits, loading, error, successMessage } = useAppSelector(
        (state) => state.trainingSplit
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSplit, setEditingSplit] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        splitId: string;
        splitName: string;
    }>({
        isOpen: false,
        splitId: "",
        splitName: "",
    });

    // Fetch splits for this athlete
    useEffect(() => {
        if (athleteId) {
            dispatch(fetchTrainingSplits(athleteId));
        }
    }, [dispatch, athleteId]);

    // Handle messages
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearMessages());
        }
        if (error) {
            toast.error(error);
            dispatch(clearMessages());
        }
    }, [error, successMessage, dispatch]);

    const handleAddSplit = () => {
        setEditingSplit(null);
        setIsModalOpen(true);
    };

    const handleEditSplit = (split: any) => {
        setEditingSplit(split);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (splitId: string) => {
        const split = splits.find(s => s._id === splitId);
        setDeleteModal({
            isOpen: true,
            splitId,
            splitName: `${split?.splite.length || 0}-day split`
        });
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteTrainingSplit({
                athleteId,
                splitId: deleteModal.splitId
            })).unwrap();
            toast.success("Training split deleted successfully");
            setDeleteModal({ isOpen: false, splitId: "", splitName: "" });
        } catch (error: any) {
            toast.error(error.message || "Failed to delete training split");
        }
    };

    const handleSaveSplit = async (splitData: { splite: any[] }) => {
        try {
            if (editingSplit) {
                // Update existing split
                await dispatch(updateTrainingSplit({
                    athleteId,
                    splitId: editingSplit._id,
                    data: splitData
                })).unwrap();
                toast.success("Training split updated successfully");
            } else {
                // Add new split
                await dispatch(addTrainingSplit({
                    athleteId,
                    data: splitData
                })).unwrap();
                toast.success("Training split created successfully");
            }
            setIsModalOpen(false);
            setEditingSplit(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to save training split");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-2xl font-bold">Training Splits</h2>
                    </div>
                    <p className="text-gray-400">
                        {athleteName}'s workout schedules
                    </p>
                </div>
                <button
                    onClick={handleAddSplit}
                    disabled={loading}
                    className="px-6 py-2 border border-green-500 hover:border-green-600 hover:from-green-400 hover:to-green-500 text-green-500 text-base rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Split
                </button>
            </div>

            {/* Loading State */}
            {loading && splits.length === 0 && (
                <div className="flex items-center justify-center py-12 border border-[#303245] rounded-lg bg-[#08081A]">
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                        <p className="text-gray-400">Loading training splits...</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && splits.length === 0 && (
                <div className="text-center py-12 border border-[#303245] rounded-lg bg-[#08081A]">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Dumbbell className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Training Splits Yet</h3>
                    <p className="text-gray-400 mb-6">Create a training split schedule to get started.</p>
                    <button
                        onClick={handleAddSplit}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-full font-medium transition-colors"
                    >
                        Create Your First Split
                    </button>
                </div>
            )}

            {/* Splits Grid */}
            {splits.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {splits.map((split) => (
                        <TrainingSplitPreview
                            key={split._id}
                            split={split}
                            onEdit={() => handleEditSplit(split)}
                            onDelete={() => handleDeleteClick(split._id)}
                            loading={loading}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <AddTrainingSplitModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSave={handleSaveSplit}
                existingSplit={editingSplit}
                loading={loading}
            />

            <DeleteModal
                isOpen={deleteModal.isOpen}
                title="Delete Training Split"
                message={`Are you sure you want to delete this training split? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, splitId: "", splitName: "" })}
            />
        </div>
    );
}