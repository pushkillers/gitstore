import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ToastContainer } from "@/components/ui/ToastContainer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitStore - Marketplace de Projetos",
  description: "Anuncie seus projetos e forme equipes de desenvolvimento",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#0d1117] text-[#e6edf3]">
        <Header />
        <main className="min-h-screen">{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}
