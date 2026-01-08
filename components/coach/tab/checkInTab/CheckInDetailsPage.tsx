/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";

interface CheckIn {
  id: string;
  date: string;
  weight: number;
  averageWeight?: number;
  notes: string;
  status: "Completed" | "In Progress";
  wellBeing: {
    energyLevel: number;
    stressLevel: number;
    moodLevel: number;
    sleepQuality: number;
  };
  nutrition: {
    dietLevel: number;
    digestion: number;
    challengeDiet: string;
  };
  training: {
    feelStrength: number;
    pumps: number;
    trainingCompleted: boolean;
    cardioCompleted: boolean;
    feedbackTraining: string;
  };
  questions: Array<{
    id: string;
    question: string;
    answer: string;
    isMandatory?: boolean;
  }>;
  images?: string[];
  videos?: string[];
}

interface CheckInDetailProps {
  checkIn: CheckIn;
  onUpdate: (checkIn: CheckIn) => void;
  onDelete: () => void;
}

// Move YesNoDisplay component outside the main component
const YesNoDisplay = ({ value }: { value: boolean }) => (
  <div className="flex gap-3">
    <div
      className={`flex-1 px-2 py-2 rounded-lg font-semibold ${value
        ? "bg-green-600/20 text-green-400 border border-green-600/30"
        : "bg-slate-700/50 text-gray-400 border border-slate-600"
        }`}
    >
      {value ? "Yes" : "No"}
    </div>
    <div
      className={`flex-1 px-2 py-2 rounded-lg font-semibold ${!value
        ? "bg-red-600/20 text-red-400 border border-red-600/30"
        : "bg-slate-700/50 text-gray-400 border border-slate-600"
        }`}
    >
      {value ? "No" : "Yes"}
    </div>
  </div>
);

export default function CheckInDetailsPage({
  checkIn,
  onUpdate,
  onDelete,
}: CheckInDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(checkIn);
  const [newQuestionInput, setNewQuestionInput] = useState("");
  const [isNewQuestionMandatory, setIsNewQuestionMandatory] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestionInput.trim()) {
      const newQuestion = {
        id: Date.now().toString(),
        question: newQuestionInput,
        answer: "",
        isMandatory: isNewQuestionMandatory,
      };
      setEditData((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setNewQuestionInput("");
      setIsNewQuestionMandatory(false);
      setShowAddQuestion(false);
    }
  };

  const handleQuestionAnswerChange = (questionId: string, answer: string) => {
    setEditData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, answer } : q
      ),
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setEditData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate a brief delay for the "Complete Check-in" action
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onUpdate(editData);
    setIsSaving(false);
    setIsSaved(true);
    // Wait a moment so the user can see the "Completed" state before closing edit mode
    setTimeout(() => {
      setIsEditing(false);
      setIsSaved(false);
    }, 1500);
  };

  const SliderWithIndicator = ({
    label,
    value,
  }: {
    label: string;
    value: number;
  }) => {
    return (
      <div className="bg-[#0b0b22] rounded-lg p-4 border border-slate-700/30">
        <div className="flex justify-between items-center mb-3">
          <label className="text-gray-300 text-sm font-semibold">{label}</label>
          <div className="flex items-center gap-2">
            <span className="text-green-500 font-medium text-lg">
              {value}/10
            </span>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          readOnly
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-not-allowed opacity-50"
          style={{
            background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${((value - 1) / 9) * 100
              }%, rgb(30, 41, 59) ${((value - 1) / 9) * 100
              }%, rgb(30, 41, 59) 100%)`,
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Edit Button - Now only for editing questions and notes */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
        <h2 className="text-2xl font-bold text-white">Check-In Details</h2>

      </div>

      {/* Well-Being and Nutrition in one row - VIEW ONLY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Well-Being Section - VIEW ONLY */}
        <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Well-Being
          </h3>
          <div className="space-y-4">
            {[
              { label: "Energy Level", value: checkIn.wellBeing.energyLevel },
              { label: "Stress Level", value: checkIn.wellBeing.stressLevel },
              { label: "Mood Level", value: checkIn.wellBeing.moodLevel },
              { label: "Sleep Quality", value: checkIn.wellBeing.sleepQuality },
            ].map(({ label, value }) => (
              <SliderWithIndicator key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        {/* Nutrition Section - VIEW ONLY */}
        <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Nutrition
          </h3>
          <div className="space-y-4 mb-6">
            {[
              { label: "Diet Level", value: checkIn.nutrition.dietLevel },
              { label: "Digestion", value: checkIn.nutrition.digestion },
            ].map(({ label, value }) => (
              <SliderWithIndicator key={label} label={label} value={value} />
            ))}
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Challenge Diet
            </label>
            <div className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 opacity-50">
              {checkIn.nutrition.challengeDiet}
            </div>
          </div>
        </div>
      </div>

      {/* Training Section - VIEW ONLY */}
      <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
          Training
        </h3>

        <div className="space-y-6">
          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Feel Strength", value: checkIn.training.feelStrength },
              { label: "Pumps", value: checkIn.training.pumps },
            ].map(({ label, value }) => (
              <SliderWithIndicator key={label} label={label} value={value} />
            ))}
          </div>

          {/* Yes/No Displays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0B0B22] rounded-lg p-4 border border-slate-700/30">
              <label className="block text-white font-medium mb-4">
                Training Completed?
              </label>
              <YesNoDisplay value={checkIn.training.trainingCompleted} />
            </div>
            <div className="bg-[#0B0B22] rounded-lg p-4 border border-slate-700/30">
              <label className="block text-white font-medium mb-4">
                Cardio Completed?
              </label>
              <YesNoDisplay value={checkIn.training.cardioCompleted} />
            </div>
          </div>

          {/* Feedback Training - VIEW ONLY */}
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Feedback Training
            </label>
            <div className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 opacity-50">
              {checkIn.training.feedbackTraining}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end text-base">
        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${isEditing
            ? "bg-green-500/20 hover:bg-green-700 text-green-500 hover:text-white"
            : "border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 text-base"
            }`}
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? "Save Changes" : "Edit Questions & Notes"}
        </button>
      </div>
      {/* Questions Section - EDITABLE */}
      <div className="bg-[#08081A]  border border-slate-700/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Questions
          </h3>

          {isEditing && (
            <button
              onClick={() => setShowAddQuestion(!showAddQuestion)}
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors bg-emerald-500/10 px-3 py-2 rounded-lg hover:bg-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          )}
        </div>

        {showAddQuestion && isEditing && (
          <div className="mb-6 bg-[#0B0B22] border border-slate-700/30 rounded-lg p-4 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionInput}
                onChange={(e) => setNewQuestionInput(e.target.value)}
                placeholder="Enter question..."
                className="flex-1 bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddQuestion();
                }}
              />
              <button
                onClick={handleAddQuestion}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shrink-0"
              >
                Add
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isNewQuestionMandatory}
                  onChange={(e) => {
                    console.log(e.target.checked);
                    setIsNewQuestionMandatory(e.target.checked);
                  }}
                  className="w-4 h-4 rounded border-slate-600 bg-[#08081A] text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span className="text-sm text-gray-400 group-hover:text-emerald-400 transition-colors">
                  Mandatory Question
                </span>
              </label>
              <span className="text-xs text-slate-500">(Athletes must answer this to complete check-in)</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {editData.questions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No questions added yet
            </p>
          ) : (
            editData.questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-[#0B0B22] rounded-lg p-5 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-white font-semibold">
                      Q{index + 1}. {q.question}{" "}
                      {q.isMandatory && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    {isEditing && (
                      <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={q.isMandatory === true}
                            onChange={(e) => {
                              console.log(e.target.checked);
                              setEditData((prev) => ({
                                ...prev,
                                questions: prev.questions.map((quest) =>
                                  quest.id === q.id
                                    ? { ...quest, isMandatory: e.target.checked }
                                    : quest
                                ),
                              }));
                            }}
                            className="w-4 h-4 rounded border-slate-600 bg-[#08081A] text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 transition-colors cursor-pointer"
                          />
                          <span className={`text-xs transition-colors ${q.isMandatory ? "text-emerald-400" : "text-gray-400 group-hover:text-emerald-400"}`}>
                            Mandatory
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-500 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  value={q.answer}
                  onChange={(e) =>
                    handleQuestionAnswerChange(q.id, e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full bg-[#08081A] border border-slate-600 rounded-lg px-3 py-2 text-gray-300 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                  rows={2}
                  placeholder={
                    isEditing ? "Enter answer..." : "No answer provided"
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Media Section - VIEW ONLY */}
      {(checkIn.images?.length || checkIn.videos?.length) && (
        <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Media
          </h3>

          {checkIn.images && checkIn.images.length > 0 && (
            <div className="mb-8">
              <p className="text-gray-300 text-sm mb-4 font-semibold">Photos</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {checkIn.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden border border-slate-700/50"
                  >
                    <img
                      src={
                        image ||
                        "/placeholder.svg?height=200&width=200&query=workout"
                      }
                      alt={`Workout photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {checkIn.videos && checkIn.videos.length > 0 && (
            <div>
              <p className="text-gray-300 text-sm mb-4 font-semibold">Videos</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checkIn.videos.map((video, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900"
                  >
                    <img
                      src={
                        video ||
                        "/placeholder.svg?height=300&width=500&query=workout-video"
                      }
                      alt={`Workout video ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/80 flex items-center justify-center shadow-lg">
                        <svg
                          className="w-7 h-7 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Check-in Notes - EDITABLE */}
      <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
        <label className="block text-white text-sm font-bold mb-3 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          Coach's Notes
        </label>
        <textarea
          value={editData.notes}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, notes: e.target.value }))
          }
          disabled={!isEditing}
          className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 resize-none disabled:opacity-50 disabled:cursor-not-allowed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          placeholder="Add your notes here..."
          rows={3}
        />
      </div>

      {/* Complete Check-In Button */}
      {isEditing && (
        <button
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={`w-full flex items-center justify-center gap-2 py-3 text-lg rounded-lg transition-colors font-semibold ${isSaved
            ? "bg-green-600 text-white cursor-default"
            : "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
            }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Completing...
            </>
          ) : isSaved ? (
            "Completed"
          ) : (
            "Complete Check-in"
          )}
        </button>
      )}
    </div>
  );
}
