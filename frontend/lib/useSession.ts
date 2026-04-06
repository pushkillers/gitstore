"use client";

import { useEffect, useState, useCallback } from "react";
import { getUser, getToken, restoreSession, AUTH_EVENT_NAME, type User } from "./auth";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => setUser(getUser()), []);

  useEffect(() => {
    // Lê do localStorage imediatamente (sem esperar o backend)
    const local = getUser();
    setUser(local);
    setHydrated(true);

    // Se não tem user mas tem token, busca do backend
    if (!local && getToken()) {
      restoreSession().then((u) => { if (u) setUser(u); });
    }

    window.addEventListener(AUTH_EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return { user, hydrated, isLoggedIn: !!user };
}
