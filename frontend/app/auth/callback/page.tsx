"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function CallbackContent() {
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    const data  = params.get("data");   // base64url com dados do usuário
    const error = params.get("error");

    if (error || !token) {
      window.location.href = "/login?error=" + (error ?? "unknown");
      return;
    }

    try {
      // Decodifica os dados do usuário enviados pelo backend
      const user = data
        ? JSON.parse(atob(data.replace(/-/g, "+").replace(/_/g, "/")))
        : null;

      localStorage.setItem("gitstore.token", token);

      if (user) {
        localStorage.setItem("gitstore.user", JSON.stringify(user));
        localStorage.setItem("gitstore.settings.profile", JSON.stringify(user));
      }

      window.dispatchEvent(new Event("gitstore.auth.change"));
      window.dispatchEvent(new Event("gitstore.profile.update"));
      window.location.href = "/perfil";
    } catch {
      window.location.href = "/login?error=parse_failed";
    }
  }, [params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#58a6ff]" />
        <p className="text-sm text-[#7d8590]">Finalizando login com Google...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return <Suspense><CallbackContent /></Suspense>;
}
