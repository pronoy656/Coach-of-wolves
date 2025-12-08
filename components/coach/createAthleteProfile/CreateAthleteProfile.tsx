"use client";

import { useState } from "react";
import { Edit2, Trash2, Search } from "lucide-react";
import CreateProfileModal from "./createProfileModal/CreateProfileModal";
import DeleteModal from "../exerciseDatabase/deleteModal/DeleteModal";

interface Profile {
  id: string;
  name: string;
  email: string;
  gender: string;
  age: string;
  role: string;
}

const initialProfiles: Profile[] = [
  {
    id: "1",
    name: "Jhon",
    email: "jhon@457gmail.com",
    gender: "Male",
    age: "23 Years",
    role: "12",
  },
  {
    id: "2",
    name: "Alex",
    email: "alex@457gmail.com",
    gender: "Female",
    age: "23 Years",
    role: "45",
  },
  {
    id: "3",
    name: "Sarah",
    email: "sarah@457gmail.com",
    gender: "Female",
    age: "25 Years",
    role: "30",
  },
  {
    id: "4",
    name: "Mike",
    email: "mike@457gmail.com",
    gender: "Male",
    age: "24 Years",
    role: "28",
  },
  {
    id: "5",
    name: "Emma",
    email: "emma@457gmail.com",
    gender: "Female",
    age: "26 Years",
    role: "35",
  },
  {
    id: "6",
    name: "David",
    email: "david@457gmail.com",
    gender: "Male",
    age: "22 Years",
    role: "15",
  },
  {
    id: "7",
    name: "Lisa",
    email: "lisa@457gmail.com",
    gender: "Female",
    age: "24 Years",
    role: "40",
  },
  {
    id: "8",
    name: "James",
    email: "james@457gmail.com",
    gender: "Male",
    age: "27 Years",
    role: "50",
  },
  {
    id: "9",
    name: "Anna",
    email: "anna@457gmail.com",
    gender: "Female",
    age: "23 Years",
    role: "25",
  },
  {
    id: "10",
    name: "Robert",
    email: "robert@457gmail.com",
    gender: "Male",
    age: "25 Years",
    role: "38",
  },
  {
    id: "11",
    name: "Jessica",
    email: "jessica@457gmail.com",
    gender: "Female",
    age: "24 Years",
    role: "42",
  },
  {
    id: "12",
    name: "Chris",
    email: "chris@457gmail.com",
    gender: "Male",
    age: "26 Years",
    role: "48",
  },
];

export default function CreateAthleteProfile() {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex);

  const handleAddProfile = () => {
    setEditingProfile(null);
    setShowModal(true);
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setShowModal(true);
  };

  const handleDeleteClick = (profile: Profile) => {
    setProfileToDelete(profile);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (profileToDelete) {
      setProfiles(profiles.filter((p) => p.id !== profileToDelete.id));
      setShowDeleteModal(false);
      setProfileToDelete(null);
      if (paginatedProfiles.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSaveProfile = (profileData: Omit<Profile, "id">) => {
    if (editingProfile) {
      setProfiles(
        profiles.map((p) =>
          p.id === editingProfile.id
            ? { ...profileData, id: editingProfile.id }
            : p
        )
      );
    } else {
      const newProfile: Profile = {
        ...profileData,
        id: Date.now().toString(),
      };
      setProfiles([...profiles, newProfile]);
    }
    setShowModal(false);
    setEditingProfile(null);
  };

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Create Profile</h1>
              <button
                onClick={handleAddProfile}
                className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                + Add athlete Profile
              </button>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Here..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
              />
            </div>

            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Age
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Role
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProfiles.map((profile) => (
                    <tr
                      key={profile.id}
                      className="border-b border-border hover:bg-card/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-foreground">
                        {profile.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {profile.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {profile.gender}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {profile.age}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {profile.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(profile)}
                            className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedProfiles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No profiles found</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-5">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <CreateProfileModal
          profile={editingProfile}
          onSave={handleSaveProfile}
          onCancel={() => {
            setShowModal(false);
            setEditingProfile(null);
          }}
        />
      )}

      {showDeleteModal && profileToDelete && (
        <DeleteModal
          title="Delete Profile"
          message={`Are you sure you want to delete the profile for ${profileToDelete.name}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setProfileToDelete(null);
          }}
        />
      )}
    </div>
  );
}
