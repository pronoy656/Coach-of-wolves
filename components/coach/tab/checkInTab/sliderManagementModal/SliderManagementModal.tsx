"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Edit2, Loader2, Save, SlidersHorizontal } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

interface DynamicSlider {
  _id: string;
  title: string;
  inputType: string;
  min: number;
  max: number;
  order: number;
  isActive: boolean;
}

interface SliderManagementModalProps {
  athleteId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SliderManagementModal({ athleteId, isOpen, onClose }: SliderManagementModalProps) {
  const [sliders, setSliders] = useState<DynamicSlider[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New slider state
  const [newTitle, setNewTitle] = useState("");
  const [newMin, setNewMin] = useState(0);
  const [newMax, setNewMax] = useState(10);
  const [isAdding, setIsAdding] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMin, setEditMin] = useState(0);
  const [editMax, setEditMax] = useState(10);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && athleteId) {
      fetchSliders();
    }
  }, [isOpen, athleteId]);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/check-in/sliders/${athleteId}`);
      if (res.data?.success) {
        setSliders(res.data.data || []);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch sliders");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlider = async () => {
    if (!newTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    setIsAdding(true);
    try {
      const payload = {
        title: newTitle.trim(),
        inputType: "range",
        min: newMin,
        max: newMax,
        order: sliders.length + 1,
        isActive: true
      };
      await axiosInstance.post(`/check-in/sliders/${athleteId}`, payload);
      toast.success("Slider added successfully");
      setNewTitle("");
      setNewMin(0);
      setNewMax(10);
      fetchSliders();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add slider");
    } finally {
      setIsAdding(false);
    }
  };

  const startEdit = (slider: DynamicSlider) => {
    setEditingId(slider._id);
    setEditTitle(slider.title);
    setEditMin(slider.min);
    setEditMax(slider.max);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateSlider = async (id: string) => {
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    setIsUpdating(true);
    try {
      const payload = {
        title: editTitle.trim(),
        min: editMin,
        max: editMax,
      };
      await axiosInstance.patch(`/check-in/sliders/${athleteId}/${id}`, payload);
      toast.success("Slider updated successfully");
      setEditingId(null);
      fetchSliders();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update slider");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSlider = async (id: string) => {
    if (!confirm("Are you sure you want to remove this slider?")) return;
    try {
      await axiosInstance.delete(`/check-in/sliders/${athleteId}/${id}`);
      toast.success("Slider removed successfully");
      fetchSliders();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove slider");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0d0d24] border border-violet-500/30 rounded-2xl shadow-2xl shadow-violet-900/20 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            Manage Dynamic Sliders
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Add New Slider Form */}
          <div className="bg-[#13132B] rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Add New Slider</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Slider Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Nutrition Adherence"
                  className="w-full bg-[#0a0a1a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Min</label>
                <input
                  type="number"
                  value={newMin}
                  onChange={(e) => setNewMin(Number(e.target.value))}
                  className="w-full bg-[#0a0a1a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Max</label>
                <input
                  type="number"
                  value={newMax}
                  onChange={(e) => setNewMax(Number(e.target.value))}
                  className="w-full bg-[#0a0a1a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={handleAddSlider}
                  disabled={isAdding || !newTitle.trim()}
                  className="w-full flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Existing Sliders */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Active Sliders</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              </div>
            ) : sliders.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-700 rounded-xl">
                <p className="text-slate-500">No custom sliders active.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sliders.map(slider => (
                  <div key={slider._id} className="bg-[#13132B] rounded-xl p-4 border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {editingId === slider._id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                         <div className="md:col-span-6">
                           <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-[#0a0a1a] border border-violet-500/50 rounded-lg px-3 py-1.5 text-sm text-white outline-none" />
                         </div>
                         <div className="md:col-span-3 flex items-center gap-2">
                           <span className="text-xs text-gray-500">Min</span>
                           <input type="number" value={editMin} onChange={e => setEditMin(Number(e.target.value))} className="w-16 bg-[#0a0a1a] border border-violet-500/50 rounded-lg px-2 py-1.5 text-sm text-white outline-none" />
                         </div>
                         <div className="md:col-span-3 flex items-center gap-2">
                           <span className="text-xs text-gray-500">Max</span>
                           <input type="number" value={editMax} onChange={e => setEditMax(Number(e.target.value))} className="w-16 bg-[#0a0a1a] border border-violet-500/50 rounded-lg px-2 py-1.5 text-sm text-white outline-none" />
                         </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="font-bold text-white mb-1">{slider.title}</p>
                        <p className="text-xs text-gray-500">Range: {slider.min} - {slider.max}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {editingId === slider._id ? (
                        <>
                          <button onClick={() => handleUpdateSlider(slider._id)} disabled={isUpdating} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30">
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                          <button onClick={cancelEdit} className="p-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(slider)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteSlider(slider._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
