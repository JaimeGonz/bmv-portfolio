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
        set((state) => {
          // Busca si ya existe una posición con el mismo ticker y serie
          const existing = state.positions.find((p) => p.ticker === position.ticker && p.serie === position.serie);

          if(existing) {
            // Calcular precio promedio ponderado
            const totalShares = existing.shares + position.shares;
            const avgBuyPrice = (existing.buyPrice * existing.shares + position.buyPrice * position.shares) / totalShares;

            // Actualizar posición existente
            return {
              positions: state.positions.map((p) => {
                return p.id === existing.id ? { ...p, shares: totalShares, buyPrice: avgBuyPrice } : p;
              })
            }
          }

          return { positions: [...state.positions, position] }
        }),

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