// import Navbar from "@/components/admin/navbar/Navbar";
// import Sidebar from "@/components/admin/sidebar/Sidebar";

import Navbar from "@/components/coach/navbar/Navbar";
import Sidebar from "@/components/coach/sidebar/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⚠️ DO NOT wrap with <html> or <body>

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
}
