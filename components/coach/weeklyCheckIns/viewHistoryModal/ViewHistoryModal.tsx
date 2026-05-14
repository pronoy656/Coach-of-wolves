import { X, Loader2 } from "lucide-react";

interface CheckInHistory {
  checkInDate: string;
  weightChange: string;
}

interface ViewHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteName: string;
  history: CheckInHistory[];
  loading: boolean;
}

export default function ViewHistoryModal({
  isOpen,
  onClose,
  athleteName,
  history,
  loading,
}: ViewHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0f0f1e] border border-[#24273f] rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#24273f]">
          <h2 className="text-xl font-bold text-white">
            {athleteName}&apos;s History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
              <span className="text-gray-400">Loading history...</span>
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-3">
              {history.map((entry, idx) => (
                <div
                  key={idx}
                  className="bg-[#1a1a2e] rounded-lg p-4 border border-[#24273f] flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Date</span>
                    <span className="text-white font-medium">
                      {entry.checkInDate}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-400">Status / Note</span>
                    <span
                      className={`font-medium ${
                        entry.weightChange.includes("+") || entry.weightChange.toLowerCase().includes("missed")
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {entry.weightChange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No check-in history found.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#24273f] flex justify-end gap-3 bg-[#0a0a14]">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-medium border border-[#303245] text-gray-300 hover:bg-[#303245]/50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
