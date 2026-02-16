import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserSettings } from "@/modules/settings/domain/types";

type UserSettingsState = {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  setLocale: (locale: string) => void;
  setTheme: (theme: UserSettings["theme"]) => void;
};

const STORAGE_KEY = "user-settings";

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      settings: {},
      setSettings: (settings) => set({ settings }),
      setLocale: (locale) =>
        set((state) => ({
          settings: { ...state.settings, locale },
        })),
      setTheme: (theme) => {
        if (theme === undefined) return;
        set((state) => ({
          settings: { ...state.settings, theme },
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
