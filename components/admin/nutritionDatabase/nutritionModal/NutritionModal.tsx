// "use client";

// import { Loader, X } from "lucide-react";
// import type React from "react";
// import { useState } from "react";

// interface Nutrition {
//   id: string;
//   name: string;
//   brand?: string;
//   category: string;
//   defaultQuantity: string;
//   calories: number;
//   proteins: number;
//   carbohydrates: number;
//   fats: number;
//   sugar: number;
//   fiber: number;
//   saturatedFats: number;
//   unsaturatedFats: number;
// }

// interface NutritionModalProps {
//   nutrition?: Nutrition;
//   onSave: (nutrition: Nutrition) => void;
//   onClose: () => void;
// }

// const CATEGORIES = [
//   "Protein",
//   "Carbs",
//   "Fats",
//   "Vegetables",
//   "Fruits",
//   "Dairy",
//   "Supplements",
//   "Other",
// ];

// export default function NutritionModal({
//   nutrition,
//   onSave,
//   onClose,
// }: NutritionModalProps) {
//   const [formData, setFormData] = useState<Nutrition>(
//     nutrition || {
//       id: "",
//       name: "",
//       brand: "",
//       category: "",
//       defaultQuantity: "100g",
//       calories: 0,
//       proteins: 0,
//       carbohydrates: 0,
//       fats: 0,
//       sugar: 0,
//       fiber: 0,
//       saturatedFats: 0,
//       unsaturatedFats: 0,
//     }
//   );
//   const [loading, setLoading] = useState(false);
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: [
//         "calories",
//         "proteins",
//         "carbohydrates",
//         "fats",
//         "sugar",
//         "fiber",
//         "saturatedFats",
//         "unsaturatedFats",
//       ].includes(name)
//         ? Number.parseFloat(value) || 0
//         : value,
//     }));
//   };

//   //   const handleSave = () => {
//   //     if (!formData.name || !formData.category) {
//   //       alert("Please fill in all required fields");
//   //       return;
//   //     }
//   //     onSave(formData);
//   //   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     setTimeout(() => {
//       onSave(formData);
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <>
//       <div
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//         onClick={onClose}
//       />
//       <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//         <div className="bg-[#08081A] border border-[#303245] rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold">
//                 {nutrition ? "Edit Nutrition" : "Add Nutrition"}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="p-1 hover:bg-red-500 rounded transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="space-y-6">

//                 {/* Row 1 */}
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">Name</label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Brand (Optional)
//                     </label>
//                     <input
//                       type="text"
//                       name="brand"
//                       value={formData.brand || ""}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold mb-2">Category</label>
//                     <select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleChange}
//                       required
//                       className="w-full bg-input border border-[#303245] rounded px-3 py-2 text-foreground focus:border-[#4A9E4A] focus:ring-2 focus:ring-primary"
//                     >
//                       <option value="">type</option>
//                       {CATEGORIES.map((cat) => (
//                         <option
//                           key={cat}
//                           value={cat}
//                           style={{ backgroundColor: "#1E1F25" }}
//                         >
//                           {cat}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Row 2 */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Default quantity (100g, 1pcs)
//                     </label>
//                     <input
//                       type="text"
//                       name="defaultQuantity"
//                       value={formData.defaultQuantity}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Calories per default quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="calories"
//                       value={formData.calories}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>
//                 </div>

//                 {/* Row 3 */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Proteins per default quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="proteins"
//                       value={formData.proteins}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Carbohydrates per default quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="carbohydrates"
//                       value={formData.carbohydrates}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>
//                 </div>

//                 {/* Row 4 */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Fats per default quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="fats"
//                       value={formData.fats}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Sugar default quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="sugar"
//                       value={formData.sugar}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>
//                 </div>

//                 {/* Row 5 */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Fiber default quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="fiber"
//                       value={formData.fiber}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>
//                   <div />
//                 </div>

//                 {/* Row 6 */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Saturated fats default quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="saturatedFats"
//                       value={formData.saturatedFats}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Unsaturated fats default quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="unsaturatedFats"
//                       value={formData.unsaturatedFats}
//                       onChange={handleChange}
//                       placeholder="Insert a value"
//                       required
//                       className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2"
//                     />
//                   </div>
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   className="mt-9 w-full flex items-center justify-center bg-[#4040D3] hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors gap-2"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader className="w-5 h-5 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Save"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { Loader, X } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";

// Exact backend interface
interface Nutrition {
  _id?: string;
  name: string;
  brand?: string;
  category: string;
  defaultQuantity: string;
  caloriesQuantity: number;
  proteinQuantity: number;
  fatsQuantity: number;
  carbsQuantity: number;
  sugarQuantity: number;
  fiberQuantity: number;
  saturatedFats: number;
  unsaturatedFats: number;
}

interface NutritionModalProps {
  nutrition?: Nutrition | null;
  onSave: (nutrition: Nutrition) => void;
  onClose: () => void;
}

const CATEGORIES = [
  "Protein",
  "Carbs",
  "Fats",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Supplements",
  "Other",
];

export default function NutritionModal({
  nutrition,
  onSave,
  onClose,
}: NutritionModalProps) {
  const [formData, setFormData] = useState<Nutrition>(
    nutrition || {
      name: "",
      brand: "",
      category: "",
      defaultQuantity: "100g",
      caloriesQuantity: 0,
      proteinQuantity: 0,
      fatsQuantity: 0,
      carbsQuantity: 0,
      sugarQuantity: 0,
      fiberQuantity: 0,
      saturatedFats: 0,
      unsaturatedFats: 0,
    }
  );

  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "caloriesQuantity",
        "proteinQuantity",
        "fatsQuantity",
        "carbsQuantity",
        "sugarQuantity",
        "fiberQuantity",
        "saturatedFats",
        "unsaturatedFats",
      ].includes(name)
        ? Number.parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      onSave(formData);
    } catch (error) {
      setLoading(false);
      alert("Failed to save nutrition. Please try again.");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={`bg-[#08081A] border border-[#303245] rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto transition-all duration-300 transform ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
            }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {nutrition ? "Edit Nutrition" : "Add Nutrition"}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-red-500 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 ">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Food Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Insert a food name"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Brand (Optional)
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand || ""}
                      onChange={handleChange}
                      placeholder="Insert a brand name"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-input border border-[#303245] rounded px-3 py-2 text-foreground focus:border-[#4A9E4A] focus:ring-2 focus:ring-primary"
                    >
                      <option
                        value=""
                        style={{ backgroundColor: "#1E1F25", color: "white" }}
                      >
                        Select category
                      </option>
                      {CATEGORIES.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                          style={{ backgroundColor: "#1E1F25" }}
                        >
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Default quantity(100g, 1pcs)
                    </label>
                    <input
                      type="text"
                      name="defaultQuantity"
                      value={formData.defaultQuantity}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Calories per default quantity
                    </label>
                    <input
                      type="number"
                      name="caloriesQuantity"
                      value={formData.caloriesQuantity}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Proteins per default quantity
                    </label>
                    <input
                      type="number"
                      name="proteinQuantity"
                      value={formData.proteinQuantity}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Carbohydrates per default quantity
                    </label>
                    <input
                      type="number"
                      name="carbsQuantity"
                      value={formData.carbsQuantity}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Fats per default quantity
                    </label>
                    <input
                      type="number"
                      name="fatsQuantity"
                      value={formData.fatsQuantity}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Sugar default quantity
                    </label>
                    <input
                      type="number"
                      name="sugarQuantity"
                      value={formData.sugarQuantity}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Fiber default quantity
                    </label>
                    <input
                      type="number"
                      name="fiberQuantity"
                      value={formData.fiberQuantity}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2"></label>
                    <div />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Saturated fats default quantity
                    </label>
                    <input
                      type="number"
                      name="saturatedFats"
                      value={formData.saturatedFats}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Unsaturated fats default quantity
                    </label>
                    <input
                      type="number"
                      name="unsaturatedFats"
                      value={formData.unsaturatedFats}
                      onChange={handleChange}
                      placeholder="Insert a value"
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-9 w-full flex items-center justify-center bg-[#4040D3] hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
