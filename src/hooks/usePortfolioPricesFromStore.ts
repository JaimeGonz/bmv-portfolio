import { getQuotes } from "@/services/databursatil";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function usePortfolioPricesFromStore() {
    const positions = usePortfolioStore(state => state.positions);

    const tickers = useMemo(() => 
        [...new Set(positions.map((p) => `${p.ticker}${p.serie}`))].sort(), 
        [positions]
    );

    const { data, isLoading, error } = useQuery({
        queryKey: ["portfolio-prices", tickers],
        queryFn: () => getQuotes(tickers, 'u, c, f'),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: tickers.length > 0, // Solo ejecutar si hay tickers
    })

    const positionsWithPrices = useMemo(() => positions.map((position) => {
        const key = `${position.ticker}${position.serie}`;
        const quote = data?.[key];

        return {
            ...position,
            currentPrice: quote?.bmv?.u ?? quote?.biva?.u ?? position.buyPrice,
            dailyChangePct: quote?.bmv?.c ?? quote?.biva?.c ?? 0,
            lastUpdated: quote?.bmv?.f ?? quote?.biva?.f ?? ""
        }
    }), [positions, data]);

    return {
        positions: positionsWithPrices,
        isLoading,
        error: error ? `Error al cargar precios: ${error.message}` : null,
    }
}