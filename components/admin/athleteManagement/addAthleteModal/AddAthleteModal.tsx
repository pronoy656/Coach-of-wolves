/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  createAthlete,
  updateAthlete,
  Athlete as ReduxAthlete,
  AthleteFormData,
} from "@/redux/features/athlete/athleteSlice";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";

interface AthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete?: ReduxAthlete | null;
}

const STATUS_OPTIONS = ["Natural", "Enhanced"];
const PHASE_OPTIONS = [
  "Pre-Prep",
  "Offseason",
  "Peak Week",
  "Prep",
  "Diet-Break",
  "Fat-Reduction Phase",
  "Reverse-Diet-Phase",
];
const CATEGORY_MALE = [
  "Lifestyle",
  "Men's Physique",
  "Classic Physique",
  "212 Bodybuilding",
  "Bodybuilding",
  "Other",
];
const CATEGORY_FEMALE = [
  "Lifestyle",
  "Fitmodel",
  "Bikini",
  "Figure",
  "Wellness",
  "Women's Physique",
  "Women's Bodybuilding",
  "Other",
];
const CHECK_IN_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const translations = {
  en: {
    titleAdd: "Add Athlete",
    titleEdit: "Edit Athlete",
    nameLabel: "Name *",
    namePlaceholder: "Enter name",
    emailLabel: "Email *",
    emailPlaceholder: "Enter email",
    genderLabel: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    weightLabel: "Weight (kg)",
    weightPlaceholder: "Enter weight",
    heightLabel: "Height (cm)",
    heightPlaceholder: "Enter height",
    statusLabel: "Status",
    statusNatural: "Natural",
    statusEnhanced: "Enhanced",
    trainingStepsLabel: "Training Day Steps",
    trainingStepsPlaceholder: "Enter steps",
    restStepsLabel: "Rest Day Steps",
    restStepsPlaceholder: "Enter steps",
    categoryLabel: "Category *",
    categoryPlaceholder: "Select category",
    phaseLabel: "Phase",
    phaseLabels: {
      "Pre-Prep": "Pre-Prep",
      Offseason: "Offseason",
      "Peak Week": "Peak Week",
      Prep: "Prep",
      "Diet-Break": "Diet-Break",
      "Fat-Reduction Phase": "Fat-Reduction Phase",
      "Reverse-Diet-Phase": "Reverse-Diet-Phase",
    } as Record<string, string>,
    ageLabel: "Age",
    agePlaceholder: "Enter age",
    checkinLabel: "Check-in Day",
    checkinDays: {
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday",
      Sunday: "Sunday",
    } as Record<string, string>,
    waterLabel: "Water Quantity (Liters)",
    waterPlaceholder: "Enter daily water intake",
    passwordLabel: "Password *",
    passwordPlaceholder: "Enter password",
    goalLabel: "Goal",
    goalPlaceholder: "Enter goal",
    profileImageLabel: "Profile Image",
    uploadButtonChange: "Change Image",
    uploadButtonSelect: "Select Profile Image",
    uploadHint: "JPG, PNG (Max 5MB)",
    cancel: "Cancel",
    saveCreating: "Creating...",
    saveUpdating: "Updating...",
    saveCreate: "Create Athlete",
    saveUpdate: "Update Athlete",
    errorName: "Name is required",
    errorEmail: "Email is required",
    errorCategory: "Category is required",
    errorPassword: "Password is required for new athletes",
    successCreated: "Athlete created successfully",
    successUpdated: "Athlete updated successfully",
    errorImageType: "Please upload an image file",
    errorImageSize: "Image size should be less than 5MB",
    errorGeneric: "Failed to save athlete. Please try again.",
  },
  de: {
    titleAdd: "Athlet hinzufügen",
    titleEdit: "Athlet bearbeiten",
    nameLabel: "Name *",
    namePlaceholder: "Name eingeben",
    emailLabel: "E-Mail *",
    emailPlaceholder: "E-Mail eingeben",
    genderLabel: "Geschlecht",
    genderMale: "Männlich",
    genderFemale: "Weiblich",
    weightLabel: "Gewicht (kg)",
    weightPlaceholder: "Gewicht eingeben",
    heightLabel: "Größe (cm)",
    heightPlaceholder: "Größe eingeben",
    statusLabel: "Status",
    statusNatural: "Natural",
    statusEnhanced: "Enhanced",
    trainingStepsLabel: "Schritte Trainingstag",
    trainingStepsPlaceholder: "Schritte eingeben",
    restStepsLabel: "Schritte Ruhetag",
    restStepsPlaceholder: "Schritte eingeben",
    categoryLabel: "Kategorie *",
    categoryPlaceholder: "Kategorie auswählen",
    phaseLabel: "Phase",
    phaseLabels: {
      "Pre-Prep": "Pre-Prep",
      Offseason: "Offseason",
      "Peak Week": "Peak Week",
      Prep: "Prep",
      "Diet-Break": "Diet-Break",
      "Fat-Reduction Phase": "Fat-Reduction Phase",
      "Reverse-Diet-Phase": "Reverse-Diet-Phase",
    } as Record<string, string>,
    ageLabel: "Alter",
    agePlaceholder: "Alter eingeben",
    checkinLabel: "Check-in-Tag",
    checkinDays: {
      Monday: "Montag",
      Tuesday: "Dienstag",
      Wednesday: "Mittwoch",
      Thursday: "Donnerstag",
      Friday: "Freitag",
      Saturday: "Samstag",
      Sunday: "Sonntag",
    } as Record<string, string>,
    waterLabel: "Wassermenge (Liter)",
    waterPlaceholder: "Tägliche Wasserzufuhr eingeben",
    passwordLabel: "Passwort *",
    passwordPlaceholder: "Passwort eingeben",
    goalLabel: "Ziel",
    goalPlaceholder: "Ziel eingeben",
    profileImageLabel: "Profilbild",
    uploadButtonChange: "Bild ändern",
    uploadButtonSelect: "Profilbild auswählen",
    uploadHint: "JPG, PNG (Max 5MB)",
    cancel: "Abbrechen",
    saveCreating: "Wird erstellt...",
    saveUpdating: "Wird aktualisiert...",
    saveCreate: "Athlet erstellen",
    saveUpdate: "Athlet aktualisieren",
    errorName: "Name ist erforderlich",
    errorEmail: "E-Mail ist erforderlich",
    errorCategory: "Kategorie ist erforderlich",
    errorPassword: "Passwort ist für neue Athleten erforderlich",
    successCreated: "Athlet erfolgreich erstellt",
    successUpdated: "Athlet erfolgreich aktualisiert",
    errorImageType: "Bitte eine Bilddatei hochladen",
    errorImageSize: "Bildgröße muss unter 5 MB liegen",
    errorGeneric: "Athlet konnte nicht gespeichert werden. Bitte erneut versuchen.",
  },
};

export default function AddAthleteModal({
  isOpen,
  onClose,
  athlete,
}: AthleteModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    gender: string;
    category: string;
    phase: string;
    weight: number;
    height: number;
    status: "Natural" | "Enhanced";
    age: number;
    waterQuantity: number;
    trainingDaySteps: number;
    restDaySteps: number;
    checkInDay: string;
    goal: string;
    password: string;
  }>({
    name: "",
    email: "",
    gender: "Male",
    category: "",
    phase: "Offseason",
    weight: 0,
    height: 0,
    status: "Natural",
    age: 0,
    waterQuantity: 0,
    trainingDaySteps: 0,
    restDaySteps: 0,
    checkInDay: "Monday",
    goal: "",
    password: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (athlete && isOpen) {
      setFormData({
        name: athlete.name,
        email: athlete.email,
        gender: athlete.gender,
        category: athlete.category,
        phase: athlete.phase,
        weight: athlete.weight,
        height: athlete.height,
        status: athlete.status,
        age: athlete.age,
        waterQuantity: athlete.waterQuantity,
        trainingDaySteps: athlete.trainingDaySteps,
        restDaySteps: athlete.restDaySteps,
        checkInDay: athlete.checkInDay,
        goal: athlete.goal,
        password: "",
      });

      if (athlete.image) {
        if (athlete.image.startsWith("http")) {
          setImagePreview(athlete.image);
        } else if (athlete.image.startsWith("/")) {
          setImagePreview(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${
              athlete.image
            }`
          );
        } else {
          setImagePreview(athlete.image);
        }
      } else {
        setImagePreview("");
      }
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        email: "",
        gender: "Male",
        category: "",
        phase: "Offseason",
        weight: 0,
        height: 0,
        status: "Natural",
        age: 0,
        waterQuantity: 0,
        trainingDaySteps: 0,
        restDaySteps: 0,
        checkInDay: "Monday",
        goal: "",
        password: "",
      });
      setImageFile(null);
      setImagePreview("");
    }
  }, [athlete, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "weight" ||
        name === "height" ||
        name === "age" ||
        name === "trainingDaySteps" ||
        name === "restDaySteps" ||
        name === "waterQuantity"
          ? Number(value) || 0
          : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t.errorImageType);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(t.errorImageSize);
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t.errorName);
      return;
    }

    if (!formData.email.trim()) {
      toast.error(t.errorEmail);
      return;
    }

    if (!formData.category) {
      toast.error(t.errorCategory);
      return;
    }

    if (!athlete && !formData.password) {
      toast.error(t.errorPassword);
      return;
    }

    setIsSubmitting(true);

    try {
      const athleteFormData: AthleteFormData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        category: formData.category,
        phase: formData.phase,
        weight: formData.weight,
        height: formData.height,
        status: formData.status,
        age: formData.age,
        waterQuantity: formData.waterQuantity,
        trainingDaySteps: formData.trainingDaySteps,
        restDaySteps: formData.restDaySteps,
        checkInDay: formData.checkInDay,
        goal: formData.goal.trim(),
        image: imageFile || undefined,
      };

      if (!athlete) {
        (athleteFormData as any).password = formData.password;
      }

      if (athlete) {
        await dispatch(
          updateAthlete({
            id: athlete._id,
            data: athleteFormData,
          })
        ).unwrap();
        toast.success(t.successUpdated);
      } else {
        await dispatch(
          createAthlete({
            data: athleteFormData,
          })
        ).unwrap();
        toast.success(t.successCreated);
      }

      onClose();
    } catch (error: any) {
      console.error("Failed to save athlete:", error);
      toast.error(error.message || t.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryOptions = () => {
    return formData.gender === "Male" ? CATEGORY_MALE : CATEGORY_FEMALE;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#08081A] border border-[#303245] max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#303245] backdrop-blur-sm sticky top-0 bg-[#08081A]">
          <h2 className="text-2xl font-bold text-white">
            {athlete ? t.titleEdit : t.titleAdd}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-emerald-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Name, Email, Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.namePlaceholder}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.emailPlaceholder}
                required
                disabled={isSubmitting || !!athlete} // Disable email editing for existing athletes
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.genderLabel}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="Male">{t.genderMale}</option>
                <option value="Female">{t.genderFemale}</option>
              </select>
            </div>
          </div>

          {/* Row 2: Weight, Height, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.weightLabel}
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder={t.weightPlaceholder}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.heightLabel}
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder={t.heightPlaceholder}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.statusLabel}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === "Natural" ? t.statusNatural : t.statusEnhanced}
                </option>
              ))}
              </select>
            </div>
          </div>

          {/* Row 3: Training Steps, Rest Steps, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.trainingStepsLabel}
              </label>
              <input
                type="number"
                name="trainingDaySteps"
                value={formData.trainingDaySteps}
                onChange={handleChange}
                placeholder={t.trainingStepsPlaceholder}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.restStepsLabel}
              </label>
              <input
                type="number"
                name="restDaySteps"
                value={formData.restDaySteps}
                onChange={handleChange}
                placeholder={t.restStepsPlaceholder}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.categoryLabel}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">{t.categoryPlaceholder}</option>
                {getCategoryOptions().map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Phase, Age, Check-in Day */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.phaseLabel}
              </label>
              <select
                name="phase"
                value={formData.phase}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer disabled:opacity-50"
            >
              {PHASE_OPTIONS.map((phase) => (
                <option key={phase} value={phase}>
                  {t.phaseLabels[phase] ?? phase}
                </option>
              ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.ageLabel}
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder={t.agePlaceholder}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.checkinLabel}
              </label>
              <select
                name="checkInDay"
                value={formData.checkInDay}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer disabled:opacity-50"
            >
              {CHECK_IN_DAYS.map((day) => (
                <option key={day} value={day}>
                  {t.checkinDays[day] ?? day}
                </option>
              ))}
              </select>
            </div>
          </div>

          {/* Row 5: Water Quantity */}
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-2">
              {t.waterLabel}
            </label>
            <input
              type="number"
              name="waterQuantity"
              value={formData.waterQuantity}
              onChange={handleChange}
              placeholder={t.waterPlaceholder}
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Password (only for new athletes) */}
          {!athlete && (
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.passwordLabel}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t.passwordPlaceholder}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors disabled:opacity-50"
              />
            </div>
          )}

          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-2">
              {t.goalLabel}
            </label>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder={t.goalPlaceholder}
              rows={3}
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors resize-none disabled:opacity-50"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-3">
              {t.profileImageLabel}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isSubmitting}
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div
                className={`w-full px-6 py-8 bg-linear-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/40 rounded-lg hover:border-emerald-400/60 transition-colors flex flex-col items-center justify-center gap-3 group ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <Upload className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-white font-semibold">
                  {imagePreview
                    ? t.uploadButtonChange
                    : t.uploadButtonSelect}
                </span>
                <span className="text-slate-400 text-sm">
                  {t.uploadHint}
                </span>
              </div>
            </label>

            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Profile Preview"
                  className="w-full h-48 object-cover rounded-lg border border-emerald-500/40"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  className="absolute top-2 right-2 p-1 bg-rose-500/80 hover:bg-rose-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white font-semibold hover:border-emerald-400 hover:bg-slate-800/70 transition-colors disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-lg text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {athlete ? t.saveUpdating : t.saveCreating}
                </>
              ) : athlete ? (
                t.saveUpdate
              ) : (
                t.saveCreate
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
