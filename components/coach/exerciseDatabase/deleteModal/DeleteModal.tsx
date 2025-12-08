// "use client";

// import { AlertCircle } from "lucide-react";

// interface DeleteConfirmationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
// }

// export default function DeleteModal({
//   isOpen,
//   onClose,
//   onConfirm,
// }: DeleteConfirmationModalProps) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-[#08081A] border border-[#303245] rounded-lg max-w-sm w-full mx-4 p-6">
//         <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/30 mx-auto mb-4">
//           <AlertCircle className="w-6 h-6 text-red-500" />
//         </div>

//         <h3 className="text-lg font-bold text-center mb-2">Delete Exercise</h3>
//         <p className="text-muted-foreground text-center mb-6">
//           Are you sure you want to delete this exercise? This action cannot be
//           undone.
//         </p>

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2 border  border-[#303245] rounded-lg hover:bg-secondary transition-colors font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-600/80 text-white rounded-lg transition-colors font-medium"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { AlertCircle } from "lucide-react";

interface DeleteConfirmationModalProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onCancel}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#08081A] border border-[#303245] rounded-lg max-w-sm w-full mx-4 p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/30 mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>

          <h3 className="text-lg font-bold text-center mb-2">{title}</h3>
          <p className="text-muted-foreground text-center mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border  border-[#303245] rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-600/80 text-white rounded-lg transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
