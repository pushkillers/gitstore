/**
 * Sistema de toast notifications global
 * Usa um evento customizado para comunicar com o ToastContainer
 */

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const TOAST_EVENT = "gitstore.toast";

export function showToast(message: string, type: ToastType = "info", duration = 3500) {
  if (typeof window === "undefined") return;
  const id = Math.random().toString(36).slice(2);
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, { detail: { id, message, type, duration } })
  );
}

export const toast = {
  success: (msg: string, d?: number) => showToast(msg, "success", d),
  error:   (msg: string, d?: number) => showToast(msg, "error", d),
  info:    (msg: string, d?: number) => showToast(msg, "info", d),
  warning: (msg: string, d?: number) => showToast(msg, "warning", d),
};

export const TOAST_EVENT_NAME = TOAST_EVENT;
