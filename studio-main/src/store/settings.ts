"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Settings } from "@/lib/types";

type SettingsState = Settings & {
  setTheme: (theme: Settings["theme"]) => void;
  setUnits: (units: Settings["units"]) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      units: "grams",
      setTheme: (theme) => set({ theme }),
      setUnits: (units) => set({ units }),
    }),
    {
      name: "nutrisnap-settings-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
