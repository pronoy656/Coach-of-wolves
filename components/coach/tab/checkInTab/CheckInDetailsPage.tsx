"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

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
  questions: Array<{ id: string; question: string; answer: string }>;
  images?: string[];
  videos?: string[];
}

interface CheckInDetailProps {
  checkIn: CheckIn;
  onUpdate: (checkIn: CheckIn) => void;
  onDelete: () => void;
}

export default function CheckInDetailsPage({
  checkIn,
  onUpdate,
  onDelete,
}: CheckInDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(checkIn);
  const [newQuestionInput, setNewQuestionInput] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const handleSliderChange = (field: string, value: number) => {
    const [section, key] = field.split(".");
    setEditData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleAddQuestion = () => {
    if (newQuestionInput.trim()) {
      const newQuestion = {
        id: Date.now().toString(),
        question: newQuestionInput,
        answer: "",
      };
      setEditData((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setNewQuestionInput("");
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

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const YesNoButton = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <div className="flex gap-3">
      <button
        onClick={() => onChange(true)}
        className={`flex-1 px-2 py-2 rounded-lg font-semibold transition-all duration-200 ${
          value
            ? "bg-green-600 text-white"
            : "bg-slate-700 text-gray-200 hover:bg-slate-600"
        }`}
      >
        Yes
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex-1 px-2 py-2 rounded-lg font-semibold transition-all duration-200 ${
          !value
            ? "bg-red-600 text-white"
            : "bg-slate-700 text-gray-200 hover:bg-slate-600"
        }`}
      >
        No
      </button>
    </div>
  );

  const SliderWithIndicator = ({
    label,
    field,
    value,
  }: {
    label: string;
    field: string;
    value: number;
  }) => {
    const [section, key] = field.split(".");
    const prevValue = checkIn[section as keyof typeof checkIn][key as any];
    const isIncreased = value > prevValue;
    const isDecreased = value < prevValue;

    return (
      <div className="bg-[#0b0b22] rounded-lg p-4 border border-slate-700/30">
        <div className="flex justify-between items-center mb-3">
          <label className="text-gray-300 text-sm font-semibold">{label}</label>
          <div className="flex items-center gap-2">
            <span className="text-green-500 font-medium text-lg">
              {value}/10
            </span>
            {isEditing && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                  isIncreased
                    ? "bg-green-500/20 text-emerald-400"
                    : isDecreased
                    ? "bg-red-500/20 text-red-400"
                    : "opacity-0"
                }`}
              >
                {isIncreased ? "↑" : isDecreased ? "↓" : ""}
              </span>
            )}
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(e) =>
            handleSliderChange(field, Number.parseInt(e.target.value))
          }
          disabled={!isEditing}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isEditing
              ? `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${
                  ((value - 1) / 9) * 100
                }%, rgb(30, 41, 59) ${
                  ((value - 1) / 9) * 100
                }%, rgb(30, 41, 59) 100%)`
              : `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${
                  ((value - 1) / 9) * 100
                }%, rgb(30, 41, 59) ${
                  ((value - 1) / 9) * 100
                }%, rgb(30, 41, 59) 100%)`,
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
        <h2 className="text-2xl font-bold text-white">Check-In Details</h2>
        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            isEditing
              ? "bg-green-500/20 hover:bg-green-700 text-green-500 hover:text-white"
              : "border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? "Save Changes" : "Edit"}
        </button>
      </div>

      {/* Well-Being and Nutrition in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Well-Being Section */}
        <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Well-Being
          </h3>
          <div className="space-y-4">
            {[
              { label: "Energy Level", field: "wellBeing.energyLevel" },
              { label: "Stress Level", field: "wellBeing.stressLevel" },
              { label: "Mood Level", field: "wellBeing.moodLevel" },
              { label: "Sleep Quality", field: "wellBeing.sleepQuality" },
            ].map(({ label, field }) => {
              const [section, key] = field.split(".");
              const val =
                editData[section as keyof typeof editData][key as any];
              return (
                <SliderWithIndicator
                  key={field}
                  label={label}
                  field={field}
                  value={val}
                />
              );
            })}
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Nutrition
          </h3>
          <div className="space-y-4 mb-6">
            {[
              { label: "Diet Level", field: "nutrition.dietLevel" },
              { label: "Digestion", field: "nutrition.digestion" },
            ].map(({ label, field }) => {
              const [section, key] = field.split(".");
              const val =
                editData[section as keyof typeof editData][key as any];
              return (
                <SliderWithIndicator
                  key={field}
                  label={label}
                  field={field}
                  value={val}
                />
              );
            })}
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Challenge Diet
            </label>
            <input
              type="text"
              value={editData.nutrition.challengeDiet}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  nutrition: {
                    ...prev.nutrition,
                    challengeDiet: e.target.value,
                  },
                }))
              }
              disabled={!isEditing}
              className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
              placeholder="Type..."
            />
          </div>
        </div>
      </div>

      {/* Training Section */}
      <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
          Training
        </h3>

        <div className="space-y-6">
          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Feel Strength", field: "training.feelStrength" },
              { label: "Pumps", field: "training.pumps" },
            ].map(({ label, field }) => {
              const [section, key] = field.split(".");
              const val =
                editData[section as keyof typeof editData][key as any];
              return (
                <SliderWithIndicator
                  key={field}
                  label={label}
                  field={field}
                  value={val}
                />
              );
            })}
          </div>

          {/* Yes/No Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0B0B22] rounded-lg p-4 border border-slate-700/30">
              <label className="block text-white font-medium mb-4">
                Training Completed?
              </label>
              <YesNoButton
                value={editData.training.trainingCompleted}
                onChange={(val) =>
                  setEditData((prev) => ({
                    ...prev,
                    training: { ...prev.training, trainingCompleted: val },
                  }))
                }
              />
            </div>
            <div className="bg-[#0B0B22] rounded-lg p-4 border border-slate-700/30">
              <label className="block text-white font-medium mb-4">
                Cardio Completed?
              </label>
              <YesNoButton
                value={editData.training.cardioCompleted}
                onChange={(val) =>
                  setEditData((prev) => ({
                    ...prev,
                    training: { ...prev.training, cardioCompleted: val },
                  }))
                }
              />
            </div>
          </div>

          {/* Feedback Training */}
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Feedback Training
            </label>
            <input
              type="text"
              value={editData.training.feedbackTraining}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  training: {
                    ...prev.training,
                    feedbackTraining: e.target.value,
                  },
                }))
              }
              disabled={!isEditing}
              className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
              placeholder="Type..."
            />
          </div>
        </div>
      </div>

      {/* Questions Section */}
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
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newQuestionInput}
              onChange={(e) => setNewQuestionInput(e.target.value)}
              placeholder="Enter question..."
              className="flex-1 bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
            />
            <button
              onClick={handleAddQuestion}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Add
            </button>
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
                  <p className="text-white font-semibold">
                    Q{index + 1}. {q.question}
                  </p>
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

      {/* Media Section */}
      {(editData.images?.length || editData.videos?.length) && (
        <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Media
          </h3>

          {editData.images && editData.images.length > 0 && (
            <div className="mb-8">
              <p className="text-gray-300 text-sm mb-4 font-semibold">Photos</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {editData.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
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

          {editData.videos && editData.videos.length > 0 && (
            <div>
              <p className="text-gray-300 text-sm mb-4 font-semibold">Videos</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editData.videos.map((video, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all bg-slate-900 group"
                  >
                    <img
                      src={
                        video ||
                        "/placeholder.svg?height=300&width=500&query=workout-video"
                      }
                      alt={`Workout video ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/80 group-hover:bg-emerald-600 flex items-center justify-center transition-colors shadow-lg">
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

      {/* Check-in Notes */}
      <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
        <label className="block text-white text-sm font-bold mb-3 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          Check-in Notes
        </label>
        <textarea
          value={editData.notes}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, notes: e.target.value }))
          }
          disabled={!isEditing}
          className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 resize-none disabled:opacity-50 disabled:cursor-not-allowed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          placeholder="Add notes..."
          rows={3}
        />
      </div>

      {/* Complete Check-In Button */}
      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg rounded-lg transition-colors font-semibold">
        Save Check-In template
      </button>
    </div>
  );
}
