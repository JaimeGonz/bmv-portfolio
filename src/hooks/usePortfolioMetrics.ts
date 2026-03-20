import type { PortfolioMetrics, Position } from "@/types";
import { useMemo } from "react";

export function usePortfolioMetrics(positions: Position[]): PortfolioMetrics {
    return useMemo(() => {
        const totalValue = positions.reduce((sum, p) => sum + p.currentPrice * p.shares, 0);
        const totalCost = positions.reduce((sum, p) => sum + p.buyPrice * p.shares, 0);
        const totalGain = totalValue - totalCost;
        const returnPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

        const bestPosition = positions.reduce<Position | null>((best, p) => {
            if(!best) return p;
            return p.dailyChangePct > best.dailyChangePct ? p : best;
        }, null);
        
        return {
            totalValue,
            totalGain,
            returnPct,
            totalPositions: positions.length,
            bestToday: bestPosition
        }
    }, [positions])
} 