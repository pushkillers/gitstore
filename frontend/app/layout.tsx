import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ToastContainer } from "@/components/ui/ToastContainer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitStore - Marketplace de Projetos",
  description: "Anuncie seus projetos e forme equipes de desenvolvimento",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="antialiased bg-[#0d1117] text-[#e6edf3] overflow-x-hidden">
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pt-16">{children}</main>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
