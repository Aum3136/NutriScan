"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Scan } from "@/lib/types";

type HistoryState = {
  scans: Scan[];
  addScan: (scan: Scan) => void;
  clearHistory: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      scans: [],
      addScan: (scan) =>
        set((state) => ({ scans: [scan, ...state.scans] })),
      clearHistory: () => set({ scans: [] }),
    }),
    {
      name: "nutrisnap-history-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
