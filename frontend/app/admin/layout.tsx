import type { Metadata } from "next";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "GitStore Admin",
  robots: "noindex, nofollow",
};

// Layout isolado — sem Header público, sem indexação
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#010409] text-[#e6edf3]">
      {children}
      <ToastContainer />
    </div>
  );
}
