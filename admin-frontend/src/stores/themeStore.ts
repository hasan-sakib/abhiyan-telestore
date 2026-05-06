import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const applyToDocument = (theme: Theme) => {
  const el = document.documentElement;
  if (theme === "dark") el.classList.add("dark");
  else el.classList.remove("dark");
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => {
        applyToDocument(theme);
        set({ theme });
      },
      toggle: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        applyToDocument(next);
        set({ theme: next });
      },
    }),
    {
      name: "telestore-admin-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyToDocument(state.theme);
        else applyToDocument("dark");
      },
    },
  ),
);

if (typeof document !== "undefined") {
  try {
    const raw = localStorage.getItem("telestore-admin-theme");
    const parsed = raw ? (JSON.parse(raw)?.state?.theme as Theme | undefined) : undefined;
    applyToDocument(parsed === "light" ? "light" : "dark");
  } catch {
    applyToDocument("dark");
  }
}
