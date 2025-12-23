"use client";

import { Bell, Upload, X } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [profileImage, setProfileImage] = useState<string>(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, you would save to your backend here
    if (previewImage) {
      setProfileImage(previewImage);
    }

    // Show success message
    alert("Profile updated successfully!");

    // Close modal and reset preview
    handleModalClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <header className="bg-[#101021] border border-[#2F312F] backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition relative">
              <Bell size={20} className="text-primary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              <div className="relative">
                <Image
                  src={profileImage}
                  alt="User"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute inset-0 rounded-full border-2 border-transparent hover:border-white/30 transition-all"></div>
              </div>
              <div>
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
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
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={handleModalClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
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
                    <Image
                      src={previewImage || profileImage}
                      alt="Profile Preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-[#4A9E4A] hover:bg-[#3d8b3d] p-2 rounded-full transition-colors"
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
                />
                <p className="text-xs text-gray-400 text-center">
                  Click the upload icon to change profile picture
                </p>
              </div>
            </div>

            {/* Name Field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#0a0a14] border border-[#2F312F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9E4A] transition-colors"
                placeholder="Enter your name"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleModalClose}
                className="flex-1 px-4 py-3 bg-[#0a0a14] border border-[#2F312F] text-white rounded-lg font-medium hover:bg-[#12121d] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-[#4A9E4A] hover:bg-[#3d8b3d] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Save Changes
              </button>
            </div>
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
