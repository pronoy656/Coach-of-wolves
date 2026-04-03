/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, Loader2, X, SlidersHorizontal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFullImageUrl } from "@/lib/utils";
import { updateWeeklyCheckin, fetchOldCheckinData } from "@/redux/features/weeklyCheckin/weeklyCheckinSlice";
import { WeeklyCheckin, QuestionAndAnswer, CoachSlider } from "@/redux/features/weeklyCheckin/weeklyCheckinTypes";
import toast from "react-hot-toast";

interface CheckInDetailProps {
  checkIn: WeeklyCheckin;
  onUpdate?: (checkIn: WeeklyCheckin) => void;
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

// Standard wellBeing keys filled by the athlete – anything else is a coach slider
const STANDARD_WELLBEING_KEYS = new Set(["energyLevel", "stressLevel", "moodLevel", "sleepQuality", "hungerLevel", "_id"]);

/** "My Custom Metric" → "myCustomMetric" */
function toCamelCase(str: string) {
  return str
    .trim()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
}

/** "myCustomMetric" → "My Custom Metric" */
function fromCamelCase(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

export default function CheckInDetailsPage({
  checkIn,
  onUpdate,
  onDelete,
}: CheckInDetailProps) {
  const dispatch = useAppDispatch();
  const { oldCheckin, loading: loadingOldData } = useAppSelector((state) => state.weeklyCheckin);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<WeeklyCheckin>(checkIn);
  const [newQuestionInput, setNewQuestionInput] = useState("");
  const [isNewQuestionStatus, setIsNewQuestionStatus] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Coach sliders – stored locally; derived from extra wellBeing keys
  const [coachSliders, setCoachSliders] = useState<CoachSlider[]>(() => {
    const wb = checkIn.wellBeing || {};
    return Object.entries(wb)
      .filter(([k]) => !STANDARD_WELLBEING_KEYS.has(k))
      .map(([k, v]) => ({ key: k, title: fromCamelCase(k), value: Number(v) || 0 }));
  });

  // Modal state for adding a slider
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [newSliderTitle, setNewSliderTitle] = useState("");
  const modalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditData(checkIn);
    const wb = checkIn.wellBeing || {};
    setCoachSliders(
      Object.entries(wb)
        .filter(([k]) => !STANDARD_WELLBEING_KEYS.has(k))
        .map(([k, v]) => ({ key: k, title: fromCamelCase(k), value: Number(v) || 0 }))
    );
  }, [checkIn]);

  useEffect(() => {
    if (checkIn && checkIn.userId) {
      dispatch(fetchOldCheckinData(checkIn.userId));
    }
  }, [checkIn?.userId, dispatch]);

  // Focus modal input when it opens
  useEffect(() => {
    if (showSliderModal) {
      setTimeout(() => modalInputRef.current?.focus(), 50);
    }
  }, [showSliderModal]);

  // ── Question handlers ────────────────────────────────────────────────────────
  const handleAddQuestion = () => {
    if (newQuestionInput.trim()) {
      const newQuestion: QuestionAndAnswer = {
        _id: Date.now().toString(),
        question: newQuestionInput,
        answer: "",
        status: isNewQuestionStatus,
      };
      setEditData((prev) => ({
        ...prev,
        questionAndAnswer: [...prev.questionAndAnswer, newQuestion],
      }));
      setNewQuestionInput("");
      setIsNewQuestionStatus(false);
      setShowAddQuestion(false);
    }
  };

  const handleQuestionChange = (questionId: string, value: string, field: "question" | "answer") => {
    setEditData((prev) => ({
      ...prev,
      questionAndAnswer: prev.questionAndAnswer.map((q) =>
        q._id === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setEditData((prev) => ({
      ...prev,
      questionAndAnswer: prev.questionAndAnswer.filter((q) => q._id !== questionId),
    }));
  };

  // ── Slider handlers ──────────────────────────────────────────────────────────
  const handleOpenSliderModal = () => {
    setNewSliderTitle("");
    setShowSliderModal(true);
  };

  const handleAddSlider = () => {
    const title = newSliderTitle.trim();
    if (!title) return;
    const key = toCamelCase(title);
    if (coachSliders.some((s) => s.key === key)) {
      toast.error("A slider with this title already exists.");
      return;
    }
    setCoachSliders((prev) => [...prev, { key, title, value: 0 }]);
    setShowSliderModal(false);
    setNewSliderTitle("");
  };

  const handleDeleteSlider = (key: string) => {
    setCoachSliders((prev) => prev.filter((s) => s.key !== key));
  };

  const handleSliderValueChange = (key: string, value: number) => {
    setCoachSliders((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  /** Merge coach sliders into wellBeing for the PATCH payload */
  const buildWellBeingPayload = () => {
    const base = {
      energyLevel: editData.wellBeing?.energyLevel,
      stressLevel: editData.wellBeing?.stressLevel,
      moodLevel: editData.wellBeing?.moodLevel,
      sleepQuality: editData.wellBeing?.sleepQuality,
      hungerLevel: editData.wellBeing?.hungerLevel,
    };
    const extras: Record<string, number> = {};
    coachSliders.forEach((s) => { extras[s.key] = s.value; });
    return { ...base, ...extras };
  };

  // ── Save / Complete ───────────────────────────────────────────────────────────
  const handleUpdateQuestionsAndNotes = async () => {
    setIsSaving(true);
    try {
      const updatePayload = {
        questionAndAnswer: editData.questionAndAnswer.map(q => ({
          question: q.question,
          answer: q.answer,
          status: q.status,
        })),
        coachNote: editData.coachNote,
        wellBeing: buildWellBeingPayload(),
      };
      await dispatch(updateWeeklyCheckin({ id: checkIn._id, data: updatePayload })).unwrap();
      toast.success("Check-in updated successfully");
      setIsEditing(false);
      setShowAddQuestion(false);
    } catch (err: any) {
      toast.error(err || "Failed to update check-in");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteCheckIn = async () => {
    if (!checkIn._id) return;
    setIsSaving(true);
    try {
      const completePayload = {
        questionAndAnswer: editData.questionAndAnswer.map(q => ({
          question: q.question,
          answer: q.answer,
          status: q.status,
        })),
        coachNote: editData.coachNote,
        wellBeing: buildWellBeingPayload(),
        checkinCompleted: "Completed",
      };
      await dispatch(updateWeeklyCheckin({ id: checkIn._id, data: completePayload })).unwrap();
      toast.success("Check-in completed successfully!");
      setIsSaved(true);
      setIsEditing(false);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err: any) {
      toast.error(err || "Failed to complete check-in");
    } finally {
      setIsSaving(false);
    }
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

      {/* ── Add Slider Modal ─────────────────────────────────────────────────── */}
      {showSliderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSliderModal(false)}
          />
          {/* Modal card */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-[#0d0d24] border border-violet-500/30 rounded-2xl p-6 shadow-2xl shadow-violet-900/20">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Add Slider</h3>
              </div>
              <button
                onClick={() => setShowSliderModal(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-5">
              Enter a title for the new slider. It will appear in the
              <span className="text-violet-400 font-semibold"> New Slider</span> section
              inside Well-Being and will default to <span className="text-white font-semibold">0</span>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Slider Title
                </label>
                <input
                  ref={modalInputRef}
                  type="text"
                  value={newSliderTitle}
                  onChange={(e) => setNewSliderTitle(e.target.value)}
                  placeholder="e.g. Nutrition Plan Adherence"
                  className="w-full bg-slate-900 border border-slate-700 text-gray-200 rounded-lg px-4 py-3 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-slate-600"
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddSlider(); }}
                />
                {newSliderTitle.trim() && (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Backend key: <code className="text-violet-400">{toCamelCase(newSliderTitle)}</code>
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowSliderModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-gray-400 hover:bg-slate-800 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSlider}
                  disabled={!newSliderTitle.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add Slider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Check-In Details Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
        <h2 className="text-2xl font-bold text-white">Check-In Details</h2>
        <button
          onClick={handleOpenSliderModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-violet-500/10 border border-violet-500/30 text-violet-400 hover:bg-violet-500/20 hover:border-violet-400/50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Add Slider
        </button>
      </div>

      {/* Well-Being Card */}
      <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
          Well-Being
        </h3>

        {/* Standard sliders filled by athlete */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Energy Level", value: checkIn.wellBeing?.energyLevel || 0 },
            { label: "Stress Level", value: checkIn.wellBeing?.stressLevel || 0 },
            { label: "Mood Level", value: checkIn.wellBeing?.moodLevel || 0 },
            { label: "Sleep Quality", value: checkIn.wellBeing?.sleepQuality || 0 },
            { label: "Hunger Level", value: checkIn.wellBeing?.hungerLevel || 0 },
          ].map(({ label, value }) => (
            <SliderWithIndicator key={label} label={label} value={value} />
          ))}
        </div>

        {/* New Slider subsection — coach-added sliders */}
        {coachSliders.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-700/40">
            <p className="text-[10px] text-violet-400/80 font-bold uppercase tracking-widest mb-4">
              New Slider
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coachSliders.map((slider) => (
                <div
                  key={slider.key}
                  className="bg-[#0b0b22] rounded-lg p-4 border border-violet-700/25 hover:border-violet-600/40 transition-colors"
                >
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-300 text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block"></span>
                      {slider.title}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-violet-400 font-medium text-lg">{slider.value}/10</span>
                      <button
                        onClick={() => handleDeleteSlider(slider.key)}
                        className="text-red-500/70 hover:text-red-400 transition-colors"
                        title="Remove slider"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={slider.value}
                    onChange={(e) => handleSliderValueChange(slider.key, Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(139,92,246) 0%, rgb(139,92,246) ${(slider.value / 10) * 100}%, rgb(30,41,59) ${(slider.value / 10) * 100}%, rgb(30,41,59) 100%)`,
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-600">0</span>
                    <span className="text-xs text-slate-600">10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nutrition Card - Only show if data exists */}
      {checkIn.nutrition && (
        <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Nutrition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { label: "Diet Level", value: checkIn.nutrition?.dietLevel || 0 },
              { label: "Digestion", value: checkIn.nutrition?.digestionLevel || 0 },
            ].map(({ label, value }) => (
              <SliderWithIndicator key={label} label={label} value={value} />
            ))}
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Challenge Diet
            </label>
            <div className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 opacity-50">
              {checkIn.nutrition?.challengeDiet || "N/A"}
            </div>
          </div>
        </div>
      )}

      {/* Training Section - VIEW ONLY - Only show if data exists */}
      {checkIn.training && (
        <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            Training
          </h3>

          <div className="space-y-6">
            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Feel Strength", value: checkIn.training?.feelStrength || 0 },
                { label: "Pumps", value: checkIn.training?.pumps || 0 },
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
                <YesNoDisplay value={!!checkIn.training?.trainingCompleted} />
              </div>
              <div className="bg-[#0B0B22] rounded-lg p-4 border border-slate-700/30">
                <label className="block text-white font-medium mb-4">
                  Cardio Completed?
                </label>
                <YesNoDisplay value={!!checkIn.training?.cardioCompleted} />
              </div>
            </div>

            {/* Feedback Training - VIEW ONLY */}
            {checkIn.trainingFeedback && (
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Feedback Training
                </label>
                <div className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 opacity-50">
                  {checkIn.trainingFeedback}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!isEditing ? (
        <div className="flex justify-end text-base">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 text-base"
          >
            <Edit2 className="w-4 h-4" />
            Edit questions &amp; notes
          </button>
        </div>
      ) : (
        <div className="flex justify-end gap-3 text-base">
          <button
            onClick={() => {
              setEditData(checkIn);
              setIsEditing(false);
              setShowAddQuestion(false);
              setNewSliderTitle("");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all border-2 border-slate-600 text-gray-400 hover:bg-slate-700/30 text-base"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      )}
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
                  checked={isNewQuestionStatus}
                  onChange={(e) => {
                    setIsNewQuestionStatus(e.target.checked);
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
          {editData.questionAndAnswer.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No questions added yet
            </p>
          ) : (
            editData.questionAndAnswer.map((q, index) => (
              <div
                key={q._id}
                className="bg-[#0B0B22] rounded-lg p-5 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-white font-semibold">
                      Q{index + 1}. {q.question}{" "}
                      {q.status && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    {isEditing && (
                      <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={q.status === true}
                            onChange={(e) => {
                              setEditData((prev) => ({
                                ...prev,
                                questionAndAnswer: prev.questionAndAnswer.map((quest) =>
                                  quest._id === q._id
                                    ? { ...quest, status: e.target.checked }
                                    : quest
                                ),
                              }));
                            }}
                            className="w-4 h-4 rounded border-slate-600 bg-[#08081A] text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 transition-colors cursor-pointer"
                          />
                          <span className={`text-xs transition-colors ${q.status ? "text-emerald-400" : "text-gray-400 group-hover:text-emerald-400"}`}>
                            Mandatory
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      className="text-red-500 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  value={q.answer}
                  onChange={(e) =>
                    handleQuestionChange(q._id, e.target.value, "answer")
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
      <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
          Media
        </h3>

        {checkIn.image?.length || checkIn.media?.length || checkIn.video?.length ? (
          <>
            {checkIn.image && checkIn.image.length > 0 ? (
              <div className="mb-8">
                <p className="text-gray-300 text-sm mb-4 font-semibold">Photos</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {checkIn.image.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer group"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={
                          img ? getFullImageUrl(img) :
                            "/placeholder.svg?height=200&width=200&query=workout"
                        }
                        alt={`Workout photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8 bg-[#0b0b22]/30 border border-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-500 text-sm italic">No imagesuploaded</p>
              </div>
            )}

            {(checkIn.video || checkIn.media) && (
              <div>
                <p className="text-gray-300 text-sm mb-4 font-semibold">Videos & Media</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...(checkIn.video || []), ...(checkIn.media || [])].map((vid, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900"
                    >
                      <div className="w-full h-full flex items-center justify-center bg-black/20">
                        <video src={vid ? getFullImageUrl(vid) : ""} controls className="w-full h-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-800 rounded-xl bg-[#0b0b22]/50">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium tracking-tight">No imagesuploaded</p>
            <p className="text-slate-500 text-sm">Athletes haven't provided any photos or videos yet.</p>
          </div>
        )}
      </div>

      {/* Comparison Section */}
      <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
          Comparison Check-In
        </h3>

        {loadingOldData ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
        ) : oldCheckin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Vertical Divider for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800/50 -translate-x-1/2"></div>

            {/* Left Side - Old Data */}
            <div className="space-y-6 pr-0 md:pr-6">
              <h4 className="text-gray-400 font-bold mb-4 text-center uppercase tracking-widest text-xs">
                Old Check-in {oldCheckin.createdAt ? `(${new Date(oldCheckin.createdAt).toLocaleDateString()})` : ""}
              </h4>

              <div className="space-y-3">
                <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Metrics</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800/50">
                    <span className="text-gray-400 text-xs">Weight</span>
                    <span className="text-white font-bold text-sm">{oldCheckin.currentWeight || "N/A"} kg</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800/50">
                    <span className="text-gray-400 text-xs">Avg Weight</span>
                    <span className="text-white font-bold text-sm">{oldCheckin.averageWeight || "N/A"} kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Well-Being</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Energy</p>
                    <p className="text-white font-bold text-sm">{oldCheckin.wellBeing?.energyLevel || "0"}/10</p>
                  </div>
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Stress</p>
                    <p className="text-white font-bold text-sm">{oldCheckin.wellBeing?.stressLevel || "0"}/10</p>
                  </div>
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Mood</p>
                    <p className="text-white font-bold text-sm">{oldCheckin.wellBeing?.moodLevel || "0"}/10</p>
                  </div>
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Sleep</p>
                    <p className="text-white font-bold text-sm">{oldCheckin.wellBeing?.sleepQuality || "0"}/10</p>
                  </div>
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Hunger</p>
                    <p className="text-white font-bold text-sm">{oldCheckin.wellBeing?.hungerLevel || "0"}/10</p>
                  </div>
                </div>
              </div>

              {/* Nutrition - Only if exists */}
              {oldCheckin.nutrition && (
                <div className="space-y-3">
                  <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Nutrition</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Diet</p>
                      <p className="text-white font-bold text-sm">{oldCheckin.nutrition?.dietLevel || "0"}/10</p>
                    </div>
                    <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Digestion</p>
                      <p className="text-white font-bold text-sm">{oldCheckin.nutrition?.digestionLevel || "0"}/10</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Training - Only if exists */}
              {oldCheckin.training && (
                <div className="space-y-3">
                  <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Training</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Strength</p>
                      <p className="text-white font-bold text-sm">{oldCheckin.training?.feelStrength || "0"}/10</p>
                    </div>
                    <div className="bg-[#0B0B22] p-2 rounded-lg border border-slate-800/50 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Pumps</p>
                      <p className="text-white font-bold text-sm">{oldCheckin.training?.pumps || "0"}/10</p>
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${oldCheckin.training?.trainingCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      <p className="text-[10px] opacity-70 mb-1">Training</p>
                      <p className="font-bold text-xs">{oldCheckin.training?.trainingCompleted ? 'Completed' : 'Missed'}</p>
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${oldCheckin.training?.cardioCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      <p className="text-[10px] opacity-70 mb-1">Cardio</p>
                      <p className="font-bold text-xs">{oldCheckin.training?.cardioCompleted ? 'Completed' : 'Missed'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Questions</p>
                <div className="space-y-2">
                  {oldCheckin.questionAndAnswer?.map((qa, idx) => (
                    <div key={idx} className="bg-[#0B0B22] p-3 rounded-lg border border-slate-800/50">
                      <p className="text-[10px] text-gray-500 mb-1 line-clamp-1">{qa.question}</p>
                      <p className="text-white text-xs italic">"{qa.answer || "No answer"}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media */}
              {oldCheckin.image && oldCheckin.image.length > 0 && (
                <div className="space-y-3">
                  <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Images</p>
                  <div className="grid grid-cols-2 gap-2">
                    {oldCheckin.image.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square rounded-lg overflow-hidden border border-slate-800 cursor-pointer hover:border-emerald-500/50 transition-all group"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img src={img ? getFullImageUrl(img) : "/placeholder.svg"} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt="Old check-in" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Present Data */}
            <div className="space-y-6 pl-0 md:pl-6">
              <h4 className="text-emerald-500 font-bold mb-4 text-center uppercase tracking-widest text-xs">
                Present Check-in (Current)
              </h4>

              <div className="space-y-3">
                <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Metrics</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-emerald-500/10">
                    <span className="text-gray-400 text-xs">Weight</span>
                    <span className="text-emerald-500 font-bold text-sm">{checkIn.currentWeight || "N/A"} kg</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-emerald-500/10">
                    <span className="text-gray-400 text-xs">Avg Weight</span>
                    <span className="text-emerald-500 font-bold text-sm">{checkIn.averageWeight || "N/A"} kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Well-Being</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Energy</p>
                    <p className="text-emerald-500 font-bold text-sm">{checkIn.wellBeing?.energyLevel || "0"}/10</p>
                  </div>
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Stress</p>
                    <p className="text-emerald-500 font-bold text-sm">{checkIn.wellBeing?.stressLevel || "0"}/10</p>
                  </div>
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Mood</p>
                    <p className="text-emerald-500 font-bold text-sm">{checkIn.wellBeing?.moodLevel || "0"}/10</p>
                  </div>
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Sleep</p>
                    <p className="text-emerald-500 font-bold text-sm">{checkIn.wellBeing?.sleepQuality || "0"}/10</p>
                  </div>
                  <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Hunger</p>
                    <p className="text-emerald-500 font-bold text-sm">{checkIn.wellBeing?.hungerLevel || "0"}/10</p>
                  </div>
                </div>
              </div>

              {/* Nutrition - Only if exists */}
              {checkIn.nutrition && (
                <div className="space-y-3">
                  <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Nutrition</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Diet</p>
                      <p className="text-emerald-500 font-bold text-sm">{checkIn.nutrition?.dietLevel || "0"}/10</p>
                    </div>
                    <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Digestion</p>
                      <p className="text-emerald-500 font-bold text-sm">{checkIn.nutrition?.digestionLevel || "0"}/10</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Training - Only if exists */}
              {checkIn.training && (
                <div className="space-y-3">
                  <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Training</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Strength</p>
                      <p className="text-emerald-500 font-bold text-sm">{checkIn.training?.feelStrength || "0"}/10</p>
                    </div>
                    <div className="bg-[#0B0B22] p-2 rounded-lg border border-emerald-500/10 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Pumps</p>
                      <p className="text-emerald-500 font-bold text-sm">{checkIn.training?.pumps || "0"}/10</p>
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${checkIn.training?.trainingCompleted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      <p className="text-[10px] opacity-70 mb-1">Training</p>
                      <p className="font-bold text-xs">{checkIn.training?.trainingCompleted ? 'Completed' : 'Missed'}</p>
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${checkIn.training?.cardioCompleted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      <p className="text-[10px] opacity-70 mb-1">Cardio</p>
                      <p className="font-bold text-xs">{checkIn.training?.cardioCompleted ? 'Completed' : 'Missed'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Questions</p>
                <div className="space-y-2">
                  {checkIn.questionAndAnswer?.map((qa, idx) => (
                    <div key={idx} className="bg-[#0B0B22] p-3 rounded-lg border border-emerald-500/10">
                      <p className="text-[10px] text-gray-500 mb-1 line-clamp-1">{qa.question}</p>
                      <p className="text-emerald-400 text-xs italic">"{qa.answer || "No answer"}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media */}
              {checkIn.image && checkIn.image.length > 0 && (
                <div className="space-y-3">
                  <p className="text-emerald-500/50 text-[10px] font-bold uppercase tracking-wider">Images</p>
                  <div className="grid grid-cols-2 gap-2">
                    {checkIn.image.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square rounded-lg overflow-hidden border border-emerald-500/20 cursor-pointer hover:border-emerald-500/50 transition-all group"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img src={img ? getFullImageUrl(img) : "/placeholder.svg"} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt="Present check-in" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#0B0B22] rounded-lg border border-slate-700/50 text-gray-500">
            No old check-in data available for comparison.
          </div>
        )}
      </div>

      {/* Check-in Notes - EDITABLE */}
      <div className="bg-[#08081A] border border-slate-700/40 rounded-xl p-6">
        <label className="block text-white text-sm font-bold mb-3 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          Coach's Notes
        </label>
        <textarea
          value={editData.coachNote}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, coachNote: e.target.value }))
          }
          disabled={!isEditing}
          className="w-full bg-slate-900 border border-slate-700 text-gray-300 rounded-lg px-3 py-2 resize-none disabled:opacity-50 disabled:cursor-not-allowed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          placeholder="Add your notes here..."
          rows={3}
        />
      </div>

      {/* Complete check-in Button */}
      {checkIn.checkinCompleted !== "Completed" && (
        <button
          onClick={handleCompleteCheckIn}
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
            "Complete check-in"
          )}
        </button>
      )}

      {/* Enlarged Image Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X size={28} />
          </button>
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={getFullImageUrl(selectedImage)} 
              alt="Enlarged workout" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
