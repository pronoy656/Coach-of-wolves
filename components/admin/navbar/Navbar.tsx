"use client";

import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-[#101021] border border-[#2F312F] backdrop-blur px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition relative">
            <Bell size={20} className="text-primary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-sm">Jhon Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
