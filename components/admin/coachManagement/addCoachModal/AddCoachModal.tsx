"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Loader, X } from "lucide-react";
import { getFullImageUrl } from "@/lib/utils";
import Image from "next/image";

interface CoachModalProps {
  coach?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
  onSave: (data: {
    name: string;
    email: string;
    image?: File | string;
  }) => void;
  onClose: () => void;
  loading?: boolean;
}

export default function AddCoachModal({
  coach,
  onSave,
  onClose,
  loading = false,
}: CoachModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: null as File | null,
  });

  const [fileName, setFileName] = useState("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [imgSrc, setImgSrc] = useState(previewImage);

  /* Animation State */
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setImgSrc(previewImage);
  }, [previewImage]);

  useEffect(() => {
    if (!isInitialized && coach) {
      setFormData({
        name: coach.name,
        email: coach.email,
        image: null,
      });

      if (coach.image) {
        const fullImageUrl = getFullImageUrl(coach.image);
        setPreviewImage(fullImageUrl);
        setFileName("Current Image");
      }

      setIsInitialized(true);
    } else if (!isInitialized && !coach) {
      setFormData({
        name: "",
        email: "",
        image: null,
      });
      setPreviewImage("");
      setFileName("");
      setIsInitialized(true);
    }
  }, [coach, isInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const saveData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      image: formData.image || undefined,
    };

    onSave(saveData);
  };

  const handleClose = () => {
    setIsInitialized(false);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
        onClick={handleClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className={`bg-[#08081A] border border-[#303245] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-none transition-all duration-300 transform ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
            }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-[#303245] sticky top-0 bg-card/95 backdrop-blur-sm">
            <h2 className="text-xl font-bold">
              {coach ? "Edit Coach" : "Add Coach"}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              disabled={loading}
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter coach name"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter coach email"
                className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium items-center gap-2 mb-4">
                <span>Upload Image</span>
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </label>

              {previewImage && (
                <div className="mb-4">
                  {/* <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full rounded-lg object-cover border border-[#303245]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div> */}
                  <div className="relative w-32 h-32 mx-auto">
                    <Image
                      src={imgSrc || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="rounded-lg object-cover border border-[#303245]"
                      sizes="128px"
                      onError={() => setImgSrc("/placeholder.svg")}
                    />
                  </div>
                </div>
              )}

              <label className="block w-full cursor-pointer">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${loading
                    ? "border-gray-600 bg-gray-600/20 cursor-not-allowed"
                    : "border-[#4A9E4A] bg-[#4A9E4A]/20 hover:bg-primary/20"
                    }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading}
                  />
                  <svg
                    className={`w-8 h-8 mx-auto mb-2 ${loading ? "text-gray-500" : "text-primary"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p
                    className={`font-medium mb-1 ${loading ? "text-gray-500" : "text-primary"
                      }`}
                  >
                    {fileName || "Select File"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click to upload an image (JPG, PNG, etc.)
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4040D3] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {coach ? "Updating..." : "Creating..."}
                </>
              ) : (
                <span>{coach ? "Update Coach" : "Create Coach"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
