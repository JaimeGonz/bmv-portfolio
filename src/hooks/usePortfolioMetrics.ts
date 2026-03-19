import type { PortfolioMetrics, Position } from "@/types";
import { useMemo } from "react";

export function usePortfolioMetrics(positions: Position[]): PortfolioMetrics {
    return useMemo(() => {
        const totalValue = positions.reduce((sum, p) => sum + p.currentPrice * p.shares, 0);
        const totalCost = positions.reduce((sum, p) => sum + p.buyPrice * p.shares, 0);
        const totalGain = totalValue - totalCost;
        const returnPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
        
        return {
            totalValue,
            totalGain,
            returnPct,
            totalPositions: positions.length,
            vsIndex: 2.1
        }
    }, [positions])
} 