import { useQuery } from "@tanstack/react-query";
import { getQuotes } from "@/services/databursatil";
import type { Position } from "@/types";



export function usePortfolioPrices(initialPositions: Position[]) {
    const tickers = initialPositions.map(p => `${p.ticker}${p.serie}`);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["portfolio-prices", tickers],
        queryFn: () => getQuotes(tickers, 'u, c, f'),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const positions = initialPositions.map((position => {
        const key = `${position.ticker}${position.serie}`;
        const quote = data?.[key];

        return {
            ...position,
            currentPrice: quote?.BMV?.u ?? quote?.BIVA?.u ?? position.buyPrice,
            dailyChangePct: quote?.BMV?.c ?? quote?.BIVA?.c ?? 0,
            lastUpdated: quote?.BMV?.f ?? quote?.BIVA?.f ?? ""
        }
    }))

    return { positions, loading: isLoading, error: isError ? "No se pudieron cargar los precios" : null };
}