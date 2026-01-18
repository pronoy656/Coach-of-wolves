// "use client";

// import type React from "react";

// import { useState, useEffect } from "react";
// import { Loader, X } from "lucide-react";

// interface SupplementModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: {
//     name: string;
//     dosage: string;
//     time: string;
//     purpose: string;
//     brand: string;
//     comment: string;
//   }) => void;
//   initialData?: {
//     name: string;
//     dosage: string;
//     time: string;
//     purpose: string;
//     brand: string;
//     comment: string;
//   };
// }

// export default function SupplementModal({
//   isOpen,
//   onClose,
//   onSave,
//   initialData,
// }: SupplementModalProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     dosage: "",
//     time: "",
//     purpose: "",
//     brand: "",
//     comment: "",
//   });

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     } else {
//       setFormData({
//         name: "",
//         dosage: "",
//         time: "",
//         purpose: "",
//         brand: "",
//         comment: "",
//       });
//     }
//   }, [initialData, isOpen]);

//   const [loading, setLoading] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     setTimeout(() => {
//       onSave(formData);
//       setLoading(false);
//     }, 2000); // 2 seconds loading
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-[#08081A] border border-[#303245] rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold">
//             {initialData ? "Edit Supplement" : "Add Supplement"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-muted-foreground hover:text-foreground"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Row 1: Name, Dosage, Time */}
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Supplements Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Insert a value"
//                 className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Dosage</label>
//               <input
//                 type="text"
//                 name="dosage"
//                 value={formData.dosage}
//                 onChange={handleChange}
//                 placeholder="Insert a value"
//                 className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Time</label>
//               <input
//                 type="text"
//                 name="time"
//                 value={formData.time}
//                 onChange={handleChange}
//                 placeholder="Insert a value"
//                 className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
//               />
//             </div>
//           </div>

//           {/* Row 2: Purpose, Brand, Comment */}
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Purpose</label>
//               <input
//                 type="text"
//                 name="purpose"
//                 value={formData.purpose}
//                 onChange={handleChange}
//                 placeholder="Insert a value"
//                 className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Brand</label>
//               <input
//                 type="text"
//                 name="brand"
//                 value={formData.brand}
//                 onChange={handleChange}
//                 placeholder="Insert a value"
//                 className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Comment</label>
//               <input
//                 type="text"
//                 name="comment"
//                 value={formData.comment}
//                 onChange={handleChange}
//                 placeholder="Insert a value"
//                 className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
//               />
//             </div>
//           </div>

//           {/* Save Button */}
//           <div className="flex justify-center items-center pt-4">
//             <button
//               type="submit"
//               className="w-full px-6 py-3 bg-[#4040D3] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
//             >
//               {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Loader, X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

const frequencyOptions = [
  "Once daily",
  "2x Daily",
  "3x Daily",
  "4x Daily",
  "As needed",
  "Weekly",
  "Every other day",
  "Before meals",
  "After meals",
  "With meals",
];

const translations = {
  en: {
    titleAdd: "Add Supplement",
    titleEdit: "Edit Supplement",
    nameLabel: "Supplements Name *",
    dosageLabel: "Dosage *",
    timeLabel: "Time *",
    purposeLabel: "Purpose *",
    brandLabel: "Brand",
    frequencyLabel: "Frequency *",
    commentLabel: "Comment",
    placeholderValue: "Insert a value",
    frequencyPlaceholder: "Select Frequency",
    frequencyOptions: {
      "Once daily": "Once daily",
      "2x Daily": "2x Daily",
      "3x Daily": "3x Daily",
      "4x Daily": "4x Daily",
      "As needed": "As needed",
      Weekly: "Weekly",
      "Every other day": "Every other day",
      "Before meals": "Before meals",
      "After meals": "After meals",
      "With meals": "With meals",
    } as Record<string, string>,
    alertRequired: "Please fill in all required fields",
    alertSaveFailed: "Failed to save supplement. Please try again.",
    saveButton: "Save",
    saveButtonLoading: "Saving...",
  },
  de: {
    titleAdd: "Supplement hinzufügen",
    titleEdit: "Supplement bearbeiten",
    nameLabel: "Supplementname *",
    dosageLabel: "Dosierung *",
    timeLabel: "Zeitpunkt *",
    purposeLabel: "Zweck *",
    brandLabel: "Marke",
    frequencyLabel: "Häufigkeit *",
    commentLabel: "Kommentar",
    placeholderValue: "Wert eingeben",
    frequencyPlaceholder: "Häufigkeit auswählen",
    frequencyOptions: {
      "Once daily": "Einmal täglich",
      "2x Daily": "Zweimal täglich",
      "3x Daily": "Dreimal täglich",
      "4x Daily": "Viermal täglich",
      "As needed": "Nach Bedarf",
      Weekly: "Wöchentlich",
      "Every other day": "Jeden zweiten Tag",
      "Before meals": "Vor den Mahlzeiten",
      "After meals": "Nach den Mahlzeiten",
      "With meals": "Zu den Mahlzeiten",
    } as Record<string, string>,
    alertRequired: "Bitte fülle alle Pflichtfelder aus",
    alertSaveFailed: "Speichern fehlgeschlagen. Bitte versuche es erneut.",
    saveButton: "Speichern",
    saveButtonLoading: "Speichern...",
  },
};

interface SupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    dosage: string;
    time: string;
    frequency: string;
    purpose: string;
    brand: string;
    comment: string;
  }) => void;
  initialData?: {
    name: string;
    dosage: string;
    time: string;
    frequency: string;
    purpose: string;
    brand: string;
    comment: string;
  };
}

export default function SupplementModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: SupplementModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    time: "",
    frequency: "",
    purpose: "",
    brand: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        dosage: "",
        time: "",
        frequency: "",
        purpose: "",
        brand: "",
        comment: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.dosage ||
      !formData.time ||
      !formData.frequency ||
      !formData.purpose
    ) {
      alert(t.alertRequired);
      return;
    }

    setLoading(true);
    try {
      onSave(formData);
    } catch (error) {
      alert(t.alertSaveFailed);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#08081A] border border-[#303245] rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {initialData ? t.titleEdit : t.titleAdd}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name, Dosage, Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.dosageLabel}
              </label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.timeLabel}
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 2: Purpose, Brand, Frequency */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.purposeLabel}
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.brandLabel}
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.frequencyLabel}
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              >
                <option value="" className="bg-[#08081A] text-foreground">
                  {t.frequencyPlaceholder}
                </option>
                {frequencyOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="bg-[#08081A] text-foreground"
                  >
                    {t.frequencyOptions[option] ?? option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Comment (Full width textarea) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.commentLabel}
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder={t.placeholderValue}
              rows={3}
              className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] resize-none"
              disabled={loading}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center items-center pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#4040D3] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  {t.saveButtonLoading}
                </>
              ) : (
                t.saveButton
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
