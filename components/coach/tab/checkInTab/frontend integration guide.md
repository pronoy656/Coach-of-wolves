Frontend Integration & Comparison System Guide
Multi-Week Check-in Management & Flexible Comparison System
This developer documentation provides clear integration steps, API details, state structures, and UI rendering guidelines for implementing editable questions, multi-week timeline selectors, and dynamic side-by-side comparison tables.

1. New Comparison API Usage
   The backend comparison engine supports fetching a single current week alongside multiple custom historical weeks for comparison.

1.1 Endpoint Structure
Method: GET
Path: /api/v1/checkin/compare/:userId
Query Parameters:
currentWeekId: The MongoDB ObjectID of the active/current week check-in.
compareWeeks: A comma-separated list of historical check-in ObjectIDs to compare against (or a string array).
1.2 Example Query URL
GET /api/v1/checkin/compare/60d21b4667d0d8992b610c85?currentWeekId=60d21b4667d0d8992b610c90&compareWeeks=60d21b4667d0d8992b610c66,60d21b4667d0d8992b610c55
1.3 Expected Response Payload
{
"success": true,
"statusCode": 200,
"message": "Comparison data fetched successfully",
"data": {
"currentWeek": {
"id": "60d21b4667d0d8992b610c90",
"date": "2026-05-10",
"weight": 82,
"averageWeight": 81,
"wellbeing": {
"energyLevel": 5,
"stressLevel": 3,
"sleepQuality": 7
},
"questions": [
{
"question": "How did your recovery feel?",
"answer": "A bit slow in the shoulders.",
"status": true
}
],
"notes": "Solid overall adherence. Energy was decent."
},
"comparisons": [
{
"id": "60d21b4667d0d8992b610c66",
"date": "2026-05-03",
"weight": 84,
"averageWeight": 83,
"wellbeing": {
"energyLevel": 4,
"stressLevel": 4,
"sleepQuality": 6
},
"questions": [
{
"question": "How did your recovery feel?",
"answer": "Felt great, very high energy.",
"status": true
}
],
"notes": "Completed 100% cardio."
}
]
}
} 2. State Management Flow (Zustand/Redux Pattern)
A robust and modular state container should maintain: 1. Active Check-in Selection: The current active week. 2. Comparison List: Array of compared week IDs selected from a checklist. 3. Timeline Filters: Date ranges or week status toggles.

import { create } from 'zustand';

interface CheckInComparisonState {
currentWeekId: string | null;
selectedCompareWeekIds: string[];
comparisonData: any | null;
isLoading: boolean;

setCurrentWeekId: (id: string) => void;
toggleCompareWeek: (id: string) => void;
clearComparisons: () => void;
fetchComparison: (userId: string) => Promise<void>;
}

export const useCheckInComparison = create<CheckInComparisonState>((set, get) => ({
currentWeekId: null,
selectedCompareWeekIds: [],
comparisonData: null,
isLoading: false,

setCurrentWeekId: (id) => set({ currentWeekId: id }),

toggleCompareWeek: (id) => set((state) => {
const list = state.selectedCompareWeekIds;
const exists = list.includes(id);
const updated = exists
? list.filter(wId => wId !== id)
: [...list, id];
return { selectedCompareWeekIds: updated };
}),

clearComparisons: () => set({ selectedCompareWeekIds: [], comparisonData: null }),

fetchComparison: async (userId) => {
const { currentWeekId, selectedCompareWeekIds } = get();
if (!currentWeekId) return;

    set({ isLoading: true });
    try {
      const compareString = selectedCompareWeekIds.join(',');
      const response = await fetch(
        `/api/v1/checkin/compare/${userId}?currentWeekId=${currentWeekId}&compareWeeks=${compareString}`
      );
      const res = await response.json();
      set({ comparisonData: res.data, isLoading: false });
    } catch (err) {
      console.error("Comparison fetch failed:", err);
      set({ isLoading: false });
    }

}
})); 3. Dynamic Comparison Rendering Engine
The side-by-side list uses a map structure to render current data next to prior weeks.

3.1 Metric Rendering Card with Highlight Colors
import React from 'react';

interface MetricDiffProps {
title: string;
currentValue: number;
pastValues: number[];
}

export const MetricComparisonRow: React.FC<MetricDiffProps> = ({ title, currentValue, pastValues }) => {
const getChangeIndicator = (current: number, past: number) => {
const diff = current - past;
if (diff > 0) return <span className="text-emerald-600 font-semibold">↑ +{diff.toFixed(1)}</span>;
if (diff < 0) return <span className="text-rose-600 font-semibold">↓ {diff.toFixed(1)}</span>;
return <span className="text-gray-400 font-medium">=</span>;
};

return (
<div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100 last:border-0 items-center">
<span className="text-gray-700 font-medium col-span-1">{title}</span>
<span className="text-gray-900 font-bold text-center">{currentValue}</span>

      {pastValues.map((past, index) => (
        <div key={index} className="flex justify-center items-center gap-2">
          <span className="text-gray-500 font-medium">{past}</span>
          <span className="text-sm">({getChangeIndicator(currentValue, past)})</span>
        </div>
      ))}
    </div>

);
}; 4. Editable Questions Form UI (Dynamic Builder)
To give coaches full inline editing capabilities over check-in questions, maintain a dynamic question bank with stable index IDs:

import React, { useState } from 'react';

interface QuestionItem {
question: string;
answer: string;
status: boolean;
}

export const EditableQuestionsList: React.FC<{
initialQuestions: QuestionItem[];
onSave: (questions: QuestionItem[]) => void;
}> = ({ initialQuestions, onSave }) => {
const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);

const handleEditQuestion = (index: number, newText: string) => {
const updated = [...questions];
updated[index].question = newText;
setQuestions(updated);
};

const handleDeleteQuestion = (index: number) => {
const updated = questions.filter((\_, idx) => idx !== index);
setQuestions(updated);
};

const handleAddQuestion = () => {
setQuestions([...questions, { question: "New Question", answer: "", status: false }]);
};

return (
<div className="space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
<div className="flex justify-between items-center mb-4">
<h3 className="text-xl font-bold text-gray-900">Dynamic Check-in Questions</h3>
<button 
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-all"
        > + Add Question
</button>
</div>

      <div className="space-y-3">
        {questions.map((q, index) => (
          <div key={index} className="flex gap-3 items-center border border-gray-100 p-3 rounded-xl bg-gray-50">
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleEditQuestion(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
            />

            <button
              onClick={() => handleDeleteQuestion(index)}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              title="Delete Question"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onSave(questions)}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold text-sm transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>

);
}; 5. Multi-Week Filtering System
Dropdown Filter: Renders all historical weeks (grouped by date or index number).
Dynamic Range Filtering: Computes date buckets locally for quick selection.
import React from 'react';

export const MultiWeekSelector: React.FC<{
weeks: Array<{ id: string; date: string; isCompleted: boolean }>;
selectedIds: string[];
onToggle: (id: string) => void;
}> = ({ weeks, selectedIds, onToggle }) => {
return (
<div className="flex flex-col gap-2">
<label className="text-sm font-semibold text-gray-700">Compare Weeks</label>
<div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 border border-gray-100 rounded-xl">
{weeks.map((week) => (
<label
key={week.id}
className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-all ${
              selectedIds.includes(week.id) 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`} >
<input
type="checkbox"
checked={selectedIds.includes(week.id)}
onChange={() => onToggle(week.id)}
className="hidden"
/>
<span>{week.date}</span>
</label>
))}
</div>
</div>
);
};
