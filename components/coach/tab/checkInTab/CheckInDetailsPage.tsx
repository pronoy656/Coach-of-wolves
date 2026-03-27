/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axiosInstance from "@/lib/axiosInstance";
import { getFullImageUrl } from "@/lib/utils";
import { updateWeeklyCheckin, updateCheckinStatus } from "@/redux/features/weeklyCheckin/weeklyCheckinSlice";
import { WeeklyCheckin, QuestionAndAnswer } from "@/redux/features/weeklyCheckin/weeklyCheckinTypes";
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

export default function CheckInDetailsPage({
  checkIn,
  onUpdate,
  onDelete,
}: CheckInDetailProps) {
  const dispatch = useAppDispatch();
  const { timeline } = useAppSelector((state) => state.timeline) || { timeline: [] };
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<WeeklyCheckin>(checkIn);
  const [newQuestionInput, setNewQuestionInput] = useState("");
  const [isNewQuestionStatus, setIsNewQuestionStatus] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [pastCheckIn, setPastCheckIn] = useState<WeeklyCheckin | null>(null);
  const [loadingPastCheckIn, setLoadingPastCheckIn] = useState(false);

  useEffect(() => {
    setEditData(checkIn);
  }, [checkIn]);

  useEffect(() => {
    if (checkIn && timeline && timeline.length > 0) {
      setLoadingPastCheckIn(true);
      const sorted = [...timeline].sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
      
      const currentIndex = sorted.findIndex(t => {
        // Find the matching timeline entry for this checkIn based on date
        return new Date(t.checkInDate).getTime() <= new Date(checkIn.createdAt).getTime();
      });

      // The previous week is the next item in the sorted list (since it's descending)
      const pastIndex = currentIndex >= 0 ? currentIndex + 1 : 1;
      
      if (pastIndex < sorted.length) {
        const pastDate = sorted[pastIndex].checkInDate;
        axiosInstance.get(`/check-in/${checkIn.userId}?date=${pastDate}`)
          .then(res => {
            const data = res.data?.data?.[0] || res.data?.data;
            setPastCheckIn(data || null);
          })
          .catch(err => {
            console.error("Failed to fetch past check-in", err);
            setPastCheckIn(null);
          })
          .finally(() => setLoadingPastCheckIn(false));
      } else {
        setPastCheckIn(null);
        setLoadingPastCheckIn(false);
      }
    } else {
      setPastCheckIn(null);
      setLoadingPastCheckIn(false);
    }
  }, [checkIn, timeline]);

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

  const handleUpdateQuestionsAndNotes = async () => {
    setIsSaving(true);
    try {
      const updatePayload = {
        questionAndAnswer: editData.questionAndAnswer.map(q => ({
          question: q.question,
          answer: q.answer,
          status: q.status
        })),
        coachNote: editData.coachNote
      };
      await dispatch(updateWeeklyCheckin({ id: checkIn._id, data: updatePayload })).unwrap();
      toast.success("question updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err || "Failed to update check-in");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteCheckIn = async () => {
    if (!checkIn.userId) return;
    setIsSaving(true);
    try {
      await dispatch(updateCheckinStatus(checkIn.userId)).unwrap();
      toast.success("check in completed");
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsEditing(false);
      }, 1500);
    } catch (err: any) {
      toast.error(err || "Failed to update status");
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
              { label: "Digestion", value: checkIn.nutrition.digestionLevel },
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
              {checkIn.trainingFeedback}
            </div>
          </div>
        </div>
      </div>
      {!isEditing && (
        <div className="flex justify-end text-base">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 text-base"
          >
            <Edit2 className="w-4 h-4" />
            Edit question and notes
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

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdateQuestionsAndNotes}
              className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all bg-green-500/20 hover:bg-green-700 text-green-500 hover:text-white border border-green-500/30"
            >
              <Edit2 className="w-4 h-4" />
              Update check-in question and notes
            </button>
          </div>
        )}
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
                      className="aspect-square rounded-lg overflow-hidden border border-slate-700/50"
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
        
        {loadingPastCheckIn ? (
          <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
        ) : pastCheckIn ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Divider in desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-700/50 -translate-x-1/2"></div>
            
            {/* Left Side - Past Week */}
            <div className="space-y-4 pr-0 md:pr-4">
              <h4 className="text-gray-400 font-semibold mb-4 text-center">
                Past Week {pastCheckIn.weekNumber ? `(Week ${pastCheckIn.weekNumber})` : ""}
              </h4>
              <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800">
                 <span className="text-gray-400 text-sm">Weight</span>
                 <span className="text-white font-bold">{pastCheckIn.currentWeight || "N/A"} kg</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800">
                 <span className="text-gray-400 text-sm">Average Weight</span>
                 <span className="text-white font-bold">{pastCheckIn.averageWeight || "N/A"} kg</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800">
                 <span className="text-gray-400 text-sm">Sleep Quality</span>
                 <span className="text-white font-bold">{pastCheckIn.wellBeing?.sleepQuality || "0"}/10</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800">
                 <span className="text-gray-400 text-sm">Energy Level</span>
                 <span className="text-white font-bold">{pastCheckIn.wellBeing?.energyLevel || "0"}/10</span>
              </div>
              {/* Media Comparison */}
              {pastCheckIn.image && pastCheckIn.image.length > 0 ? (
                 <div className="grid grid-cols-2 gap-2 mt-4">
                   {pastCheckIn.image.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-700/50">
                        <img src={img ? getFullImageUrl(img) : "/placeholder.svg?height=200&width=200"} alt="Past week media" className="w-full h-full object-cover" />
                      </div>
                   ))}
                 </div>
              ) : (
                <div className="p-4 bg-[#0B0B22] rounded-lg text-center text-gray-500 text-sm border border-slate-800 mt-4">No images</div>
              )}
            </div>

            {/* Right Side - Present Week */}
            <div className="space-y-4 pl-0 md:pl-4">
              <h4 className="text-emerald-400 font-semibold mb-4 text-center">
                Present Week {checkIn.weekNumber ? `(Week ${checkIn.weekNumber})` : ""}
              </h4>
              <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800">
                 <span className="text-gray-400 text-sm">Weight</span>
                 <span className="text-emerald-500 font-bold">{checkIn.currentWeight || "N/A"} kg</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800">
                 <span className="text-gray-400 text-sm">Average Weight</span>
                 <span className="text-emerald-500 font-bold">{checkIn.averageWeight || "N/A"} kg</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800">
                 <span className="text-gray-400 text-sm">Sleep Quality</span>
                 <span className="text-emerald-500 font-bold">{checkIn.wellBeing?.sleepQuality || "0"}/10</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B0B22] p-3 rounded-lg border border-slate-800">
                 <span className="text-gray-400 text-sm">Energy Level</span>
                 <span className="text-emerald-500 font-bold">{checkIn.wellBeing?.energyLevel || "0"}/10</span>
              </div>
              {/* Media Comparison */}
              {checkIn.image && checkIn.image.length > 0 ? (
                 <div className="grid grid-cols-2 gap-2 mt-4">
                   {checkIn.image.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-700/50">
                        <img src={img ? getFullImageUrl(img) : "/placeholder.svg?height=200&width=200"} alt="Present week media" className="w-full h-full object-cover" />
                      </div>
                   ))}
                 </div>
              ) : (
                <div className="p-4 bg-[#0B0B22] rounded-lg text-center text-gray-500 text-sm border border-slate-800 mt-4">No images</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-[#0B0B22] rounded-lg border border-slate-700/50 text-gray-500">
            No past check-in available for comparison.
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
    </div>
  );
}
