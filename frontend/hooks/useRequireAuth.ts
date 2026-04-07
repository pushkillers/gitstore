"use client";

import { useEffect } from "react";
import { useSession } from "./useSession";

export function useRequireAuth() {
  const { user, hydrated } = useSession();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
    }
  }, [user, hydrated]);

  return { user, hydrated };
}
