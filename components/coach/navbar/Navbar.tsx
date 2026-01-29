/* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bell, Upload, X } from "lucide-react";
import { useState, useRef, ChangeEvent, useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getCoachProfile,
  updateCoachProfile,
  clearCoachProfileError,
} from "@/redux/features/coachProfile/coachProfileSlice";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { setLanguage } from "@/redux/features/language/languageSlice";

const translations = {
  en: {
    dashboard: "Coach Dashboard",
    coach: "Coach",
    editProfile: "Edit Profile",
    profilePicture: "Profile Picture",
    displayName: "Display Name",
    enterName: "Enter your name",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    noChanges: "No changes to save",
    updating: "Updating profile...",
    updated: "Profile updated successfully!",
    failed: "Failed to update profile",
    imgUpload: "Click the upload icon to change profile picture (Max 5MB)",
  },
  de: {
    dashboard: "Coach-Dashboard",
    coach: "Trainer",
    editProfile: "Profil bearbeiten",
    profilePicture: "Profilbild",
    displayName: "Anzeigename",
    enterName: "Geben Sie Ihren Namen ein",
    saveChanges: "Änderungen speichern",
    cancel: "Abbrechen",
    noChanges: "Keine Änderungen zu speichern",
    updating: "Profil wird aktualisiert...",
    updated: "Profil erfolgreich aktualisiert!",
    failed: "Profil-Update fehlgeschlagen",
    imgUpload:
      "Klicken Sie auf das Upload-Symbol, um das Profilbild zu ändern (Max. 5MB)",
  },
};

export default function Header() {
  const { profile, loading, error, updateLoading, updateError } = useSelector(
    (state: RootState) => state.coachProfile,
  );
  const { language } = useSelector((state: RootState) => state.language);
  const t = translations[language as keyof typeof translations];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  // Fetch coach profile on component mount

  useEffect(() => {
    dispatch(getCoachProfile());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-right",
      });
      dispatch(clearCoachProfileError());
    }

    if (updateError) {
      toast.error(updateError, {
        duration: 4000,
        position: "top-right",
      });
      dispatch(clearCoachProfileError());
    }
  }, [error, updateError, dispatch]);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
    setSelectedFile(null);
    // Reset to original profile data
    if (profile) {
      setTempName(profile.name);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    // Append name if changed
    if (tempName !== profile?.name) formData.append("name", tempName);

    // Append image if selected
    if (selectedFile) formData.append("image", selectedFile);

    // No changes check
    if ([...formData.keys()].length === 0) {
      toast.success("No changes to save", {
        duration: 2000,
        position: "top-right",
      });
      return;
    }

    const toastId = toast.loading("Updating profile...", {
      position: "top-right",
    });

    try {
      // ✅ Send FormData to backend
      await dispatch(updateCoachProfile(formData)).unwrap();

      toast.success(t.updated, {
        id: toastId,
        duration: 3000,
      });

      dispatch(getCoachProfile());
      handleModalClose();
    } catch (err) {
      toast.error(t.failed, { id: toastId, duration: 4000 });
      console.error(err);
    }
  };

  const handleLanguageChange = (newLanguage: "en" | "de") => {
    dispatch(setLanguage(newLanguage));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Get display image (preview or profile image)
  const displayImage = previewImage || profile?.image || "/default-avatar.png";
  const displayName = profile?.name || "Loading...";

  return (
    <>
      <header className="bg-[#101021] border border-[#2F312F] backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">{t.dashboard}</h1>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center p-1 bg-[#1A1A2E]/80 border border-white/5 rounded-xl shadow-inner-lg backdrop-blur-md mr-3 relative group">
              {/* Sliding Background Indicator */}
              <div
                className={`absolute h-[calc(100%-8px)] rounded-lg bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 ease-out z-0 ${
                  language === "en"
                    ? "w-[38px] left-[4px]"
                    : "w-[38px] left-[42px]"
                }`}
              />

              <button
                onClick={() => handleLanguageChange("en")}
                className={`relative z-10 w-[38px] py-1.5 text-[11px] font-black tracking-wider transition-colors duration-300 ${
                  language === "en"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                EN
              </button>

              <button
                onClick={() => handleLanguageChange("de")}
                className={`relative z-10 w-[38px] py-1.5 text-[11px] font-black tracking-wider transition-colors duration-300 ${
                  language === "de"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                DE
              </button>
            </div>

            <button className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition relative">
              <Bell size={20} className="text-primary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              {/* {console.log(`${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}`)} */}

              <div className="relative">
                {loading && !profile ? (
                  <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
                ) : (
                  <>
                    <img
                      src={`${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}/${profile?.image}`}
                      alt={profile?.name || "Coach"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent hover:border-white/30 transition-all"></div>
                  </>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {loading && !profile ? (
                    <span className="inline-block w-20 h-4 bg-gray-700 rounded animate-pulse"></span>
                  ) : (
                    displayName
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{t.coach}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && handleModalClose()}
        >
          <div
            className="bg-[#101021] border border-[#2F312F] rounded-xl p-6 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{t.editProfile}</h2>
              <button
                onClick={handleModalClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                disabled={updateLoading}
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Profile Picture Section */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3">
                Profile Picture
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#2F312F]">
                    {loading && !profile ? (
                      <div className="w-full h-full bg-gray-700 animate-pulse"></div>
                    ) : (
                      <img
                        src={`${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}/${profile?.image}`}
                        alt="Profile Preview"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-[#4A9E4A] hover:bg-[#3d8b3d] p-2 rounded-full transition-colors"
                    disabled={updateLoading}
                  >
                    <Upload size={16} className="text-white" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={updateLoading}
                />
                <p className="text-xs text-gray-400 text-center">
                  Click the upload icon to change profile picture (Max 5MB)
                </p>
                {selectedFile && (
                  <p className="text-xs text-green-400">
                    Selected: {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            {/* Name Field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.displayName}
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-[#0a0a14] border border-[#2F312F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9E4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={t.enterName}
                disabled={updateLoading || loading}
              />
              {tempName !== profile?.name && (
                <p className="text-xs text-yellow-400 mt-1">
                  Name changed from `{profile?.name}` to `{tempName}`
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleModalClose}
                className="flex-1 px-4 py-3 bg-[#0a0a14] border border-[#2F312F] text-white rounded-lg font-medium hover:bg-[#12121d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updateLoading}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={
                  updateLoading || (tempName === profile?.name && !selectedFile)
                }
                className="flex-1 px-4 py-3 bg-[#4A9E4A] hover:bg-[#3d8b3d] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t.saveChanges}...
                  </>
                ) : (
                  t.saveChanges
                )}
              </button>
            </div>

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === "development" && profile && (
              <div className="mt-6 p-3 bg-gray-800/50 rounded text-xs">
                <p className="text-yellow-400 mb-2">Debug Info:</p>
                <p>Profile ID: {profile._id}</p>
                <p>Current Image: {profile.image}</p>
                <p>Update Loading: {updateLoading.toString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
