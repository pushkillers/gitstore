import { useEffect, useState, useCallback } from "react";

export interface ProfileData {
  avatar: string; avatarZoom: number; name: string; username: string;
  email: string; bio: string; location: string; website: string;
  company: string; twitter: string; linkedin: string; github: string;
  availability: string; experience: string;
}

export const PROFILE_KEY = "gitstore.settings.profile";

export const profileDefaults: ProfileData = {
  avatar: "", avatarZoom: 100, name: "", username: "", email: "",
  bio: "", location: "", website: "", company: "",
  twitter: "", linkedin: "", github: "",
  availability: "Disponível para projetos", experience: "Júnior",
};

const CHANNEL = "gitstore.profile.update";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(profileDefaults);
  const [hydrated, setHydrated] = useState(false);

  const read = useCallback((): ProfileData => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return { ...profileDefaults, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return profileDefaults;
  }, []);

  useEffect(() => {
    setProfile(read());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => { if (e.key === PROFILE_KEY) setProfile(read()); };
    const onCustom = () => setProfile(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANNEL, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANNEL, onCustom);
    };
  }, [read]);

  return { profile, hydrated };
}

export function notifyProfileUpdate() {
  window.dispatchEvent(new Event(CHANNEL));
}
