"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentWeekId: string;
}

// Sub-component: Metric Rendering Card with Highlight Colors
const MetricComparisonRow: React.FC<{
  title: string;
  currentValue: number;
  pastValues: number[];
}> = ({ title, currentValue, pastValues }) => {
  const getChangeIndicator = (current: number, past: number) => {
    const diff = current - past;
    if (diff > 0) return <span className="text-emerald-500 font-semibold text-xs ml-1">↑ +{diff.toFixed(1)}</span>;
    if (diff < 0) return <span className="text-rose-500 font-semibold text-xs ml-1">↓ {Math.abs(diff).toFixed(1)}</span>;
    return <span className="text-gray-500 font-medium text-xs ml-1">=</span>;
  };

  return (
    <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-700/50 last:border-0 items-center">
      <span className="text-gray-400 font-medium col-span-1 text-sm">{title}</span>
      <span className="text-white font-bold text-center">{currentValue}</span>
      
      {pastValues.map((past, index) => (
        <div key={index} className="flex justify-center items-center">
          <span className="text-gray-300 font-medium">{past}</span>
          {getChangeIndicator(currentValue, past)}
        </div>
      ))}
    </div>
  );
};

// Sub-component: Multi-Week Filtering System
const MultiWeekSelector: React.FC<{
  weeks: Array<{ id: string; date: string; isCompleted: boolean }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
}> = ({ weeks, selectedIds, onToggle }) => {
  return (
    <div className="flex flex-col gap-2 bg-[#0B0B22] p-4 rounded-xl border border-slate-700/50 mb-6">
      <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Compare Historical Weeks</label>
      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar p-2">
        {weeks.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No historical weeks found.</p>
        ) : (
          weeks.map((week) => (
            <label 
              key={week.id} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-all ${
                selectedIds.includes(week.id) 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 font-semibold' 
                  : 'bg-[#08081A] border-slate-700 text-gray-400 hover:bg-slate-800'
              }`}
            >
              <input 
                type="checkbox"
                checked={selectedIds.includes(week.id)}
                onChange={() => onToggle(week.id)}
                className="hidden"
              />
              <span>{week.date || "Unknown Date"}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default function ComparisonModal({
  isOpen,
  onClose,
  userId,
  currentWeekId,
}: ComparisonModalProps) {
  // State from Guide
  const [selectedCompareWeekIds, setSelectedCompareWeekIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch timeline from Redux to populate MultiWeekSelector
  const { timeline } = useAppSelector((state) => state.timeline) || { timeline: [] };
  
  // Format timeline into expected format, filtering out the current week
  const formattedWeeks = timeline
    .filter((t: any) => t._id && t._id !== currentWeekId)
    .map((t: any) => ({
      id: t._id,
      _id: t._id,
      date: new Date(t.checkInDate).toLocaleDateString(),
      isCompleted: true // Fallback as TimelineItem doesn't store checkinCompleted natively
    }));

  const handleToggleWeek = (id: string) => {
    setSelectedCompareWeekIds(prev => {
      const exists = prev.includes(id);
      return exists ? prev.filter(wId => wId !== id) : [...prev, id];
    });
  };

  const fetchComparison = async () => {
    if (!currentWeekId || selectedCompareWeekIds.length === 0) {
      toast.error("Please select at least one week to compare");
      return;
    }

    setIsLoading(true);
    try {
      const compareString = selectedCompareWeekIds.join(',');
      const res = await axiosInstance.get(
        `/check-in/compare/${userId}?currentWeekId=${currentWeekId}&compareWeeks=${compareString}`
      );
      
      if (res.data?.success) {
        setComparisonData(res.data.data);
      } else {
        toast.error("Failed to fetch comparison data");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Comparison fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-[#0d0d24] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              📊
            </span>
            Multi-Week Comparison
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          <MultiWeekSelector 
            weeks={formattedWeeks} 
            selectedIds={selectedCompareWeekIds} 
            onToggle={handleToggleWeek} 
          />

          <div className="flex justify-end mb-6">
            <button
              onClick={fetchComparison}
              disabled={selectedCompareWeekIds.length === 0 || isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Generate Comparison
            </button>
          </div>

          {comparisonData && (
            <div className="bg-[#08081A] border border-slate-700/50 rounded-xl p-6">
              
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-600 mb-4 items-center text-sm font-bold text-gray-400">
                <span className="col-span-1">Metric</span>
                <span className="text-center text-blue-400">Current Week</span>
                {comparisonData.comparisons?.map((comp: any, idx: number) => (
                  <span key={idx} className="text-center">Past: {comp.date}</span>
                ))}
                {/* Pad if fewer than 2 comparisons */}
                {comparisonData.comparisons?.length === 1 && <span className="text-center"></span>}
              </div>

              {/* Data Rows */}
              <div className="space-y-1">
                <MetricComparisonRow 
                  title="Weight (kg)" 
                  currentValue={comparisonData.currentWeek?.weight || 0} 
                  pastValues={comparisonData.comparisons?.map((c: any) => c.weight || 0) || []} 
                />
                <MetricComparisonRow 
                  title="Avg Weight (kg)" 
                  currentValue={comparisonData.currentWeek?.averageWeight || 0} 
                  pastValues={comparisonData.comparisons?.map((c: any) => c.averageWeight || 0) || []} 
                />
                <MetricComparisonRow 
                  title="Energy Level" 
                  currentValue={comparisonData.currentWeek?.wellbeing?.energyLevel || 0} 
                  pastValues={comparisonData.comparisons?.map((c: any) => c.wellbeing?.energyLevel || 0) || []} 
                />
                <MetricComparisonRow 
                  title="Stress Level" 
                  currentValue={comparisonData.currentWeek?.wellbeing?.stressLevel || 0} 
                  pastValues={comparisonData.comparisons?.map((c: any) => c.wellbeing?.stressLevel || 0) || []} 
                />
                <MetricComparisonRow 
                  title="Sleep Quality" 
                  currentValue={comparisonData.currentWeek?.wellbeing?.sleepQuality || 0} 
                  pastValues={comparisonData.comparisons?.map((c: any) => c.wellbeing?.sleepQuality || 0) || []} 
                />
              </div>

              {/* Questions Section */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <h4 className="text-emerald-400 font-bold mb-4 uppercase tracking-widest text-xs">Question Analysis</h4>
                
                <div className="grid grid-cols-1 gap-6">
                  {comparisonData.currentWeek?.questions?.map((q: any, idx: number) => (
                    <div key={idx} className="bg-[#0B0B22] p-4 rounded-xl border border-slate-800">
                      <p className="text-sm text-gray-400 mb-2">Q: {q.question}</p>
                      <div className="space-y-3">
                        <div className="pl-3 border-l-2 border-blue-500">
                          <span className="text-xs text-blue-400 font-semibold block mb-1">Current Answer:</span>
                          <p className="text-white text-sm">"{q.answer || "N/A"}"</p>
                        </div>
                        
                        {comparisonData.comparisons?.map((comp: any, compIdx: number) => {
                          // Try to match the same question from past week
                          const pastQ = comp.questions?.find((past: any) => past.question === q.question);
                          return (
                            <div key={compIdx} className="pl-3 border-l-2 border-slate-600">
                              <span className="text-xs text-slate-500 font-semibold block mb-1">Past ({comp.date}):</span>
                              <p className="text-gray-400 text-sm italic">"{pastQ?.answer || "N/A"}"</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
