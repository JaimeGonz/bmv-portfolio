import type { Position } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware"

interface PortfolioStore {
    positions: Position[]
    addPosition: (position: Position) => void
    removePosition: (id: string) => void
    updatePosition: (id: string, updates: Partial<Position>) => void
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      positions: [],

      addPosition: (position) =>
        set((state) => ({
          positions: [...state.positions, position],
        })),

      removePosition: (id) =>
        set((state) => ({
          positions: state.positions.filter((p) => p.id !== id),
        })),

      updatePosition: (id, updates) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
    }),
    {
      name: "bmv-portfolio", 
    }
  )
)