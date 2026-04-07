"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT_NAME, type Toast } from "@/lib/utils/toast";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  info:    Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: "border-[#3fb950]/30 bg-[#161b22] text-[#3fb950]",
  error:   "border-[#f85149]/30 bg-[#161b22] text-[#f85149]",
  info:    "border-[#388bfd]/30 bg-[#161b22] text-[#388bfd]",
  warning: "border-[#d29922]/30 bg-[#161b22] text-[#d29922]",
};

const MSG_STYLES = {
  success: "text-[#e6edf3]",
  error:   "text-[#e6edf3]",
  info:    "text-[#e6edf3]",
  warning: "text-[#e6edf3]",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const toast = (e as CustomEvent<Toast>).detail;
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration ?? 3500);
    };
    window.addEventListener(TOAST_EVENT_NAME, handler);
    return () => window.removeEventListener(TOAST_EVENT_NAME, handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={[
              "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-sm",
              "animate-in slide-in-from-right-5 fade-in duration-200",
              STYLES[toast.type],
            ].join(" ")}
            style={{ minWidth: 260, maxWidth: 380 }}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <p className={`flex-1 text-sm font-medium ${MSG_STYLES[toast.type]}`}>{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="flex-shrink-0 opacity-50 transition-opacity hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
