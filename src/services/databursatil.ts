import axios from "axios"

const BASE_URL = "https://api.databursatil.com/v2"
const TOKEN = import.meta.env.VITE_DATABURSATIL_TOKEN

const api = axios.create({baseURL: BASE_URL})

// API RESPONSE TYPES
export interface QuoteData {
  u?: number   // último precio
  p?: number   // precio promedio ponderado
  a?: number   // precio anterior
  x?: number   // máximo
  n?: number   // mínimo
  c?: number   // cambio %
  m?: number   // cambio en pesos
  v?: number   // volumen
  o?: number   // número de operaciones
  i?: number   // importe acumulado
  f?: string   // fecha
}

export interface QuoteResponse {
    [tickerSerie: string] : {
        bmv?: QuoteData
        biva?: QuoteData
    }
}

export interface HistoricalEntry { 
    precio: number
    importe: number
}

export interface HistoricalResponse {
    [date: string]: HistoricalEntry
}

export interface IntradayResponse {
    [tickerSerie: string]: {
        [datetime: string]: number
    }
}

export interface TopItem {
  e: string    // emisora con serie
  u: number    // último precio
  c: number    // cambio % o acciones negociadas
  f: string    // fecha
}

export interface TopResponse {
  SUBEN?: TopItem[]
  BAJAN?: TopItem[]
  VOLUMEN?: TopItem[]
  IMPORTE?: TopItem[]
  OPERACIONES?: TopItem[]
}

// API FUNCTIONS

/** 
 * Obtiene precios actuales de una o varias emisoras.
 * Max 50 emisoras por llamada.
 */

export async function getQuotes(tickers: string[], concepts="u,p,a,c,m"): Promise<QuoteResponse> {
    const { data } = await api.get<QuoteResponse>("/cotizaciones", {
        params: {
            token: TOKEN,
            emisora_serie: tickers.join(","),
            concepto: concepts,
            bolsa: "BMV,BIVA"
        },
    })
    return data
}

/**
 * Obtiene el ultimo precio de una sola emisora.
 * Usa BMV primero, si no hay datos, intenta con BIVA.
 */

export async function getCurrentPrice(ticker: string): Promise<number | null> {
    try {
        const data = await getQuotes([ticker], "u");
        const entry = data[ticker];
        if (!entry) return null;
        return entry.bmv?.u ?? entry.biva?.u ?? null;
    } catch {
        return null;
    }
}

/**
 * Obtiene precios al cierre historicos de una emisora.
 * Solo una emisora por llamada.
*/

export async function getHistoricalPrices(ticker: string, startDate: string, endDate: string): Promise<HistoricalResponse> {
    const { data } = await api.get<HistoricalResponse>("/historicos", {
        params: {
            token: TOKEN,
            emisora_serie: ticker,
            inicio: startDate,
            final: endDate,
        },
    })
    return data
}

/**
 * Obtiene cotizaciones intradia de hasta 10 emisoras.
 * interval: "1m", "5m", "1h"
 */

export async function getIntradayPrices(tickers: string[], interval: '1m' | '5m' | '1h', startDate: string, endDate: string): Promise<IntradayResponse> {
    const { data } = await api.get<IntradayResponse>("/intradia", {
        params: {
            token: TOKEN,
            emisora_serie: tickers.slice(0, 10).join(","),
            bolsa: "BMV",
            intervalo: interval,
            inicio: startDate,
            final: endDate,
        },
    })
    return data
}

/**
 * Obtiene emisoras que más subieron/bajaron del día
*/

export async function getTopMovers(date: string, quantity: number): Promise<TopResponse> {
    const { data } = await api.get<TopResponse>("/top", {
        params: {
            token: TOKEN,
            variables: "suben,bajan",
            bolsa: "BMV",
            cantidad: quantity,
            mercado: 'local',
            inicio: date,
            final: date,
        },
    })
    return data
}

/**
 * Busca emisoras por letra o nombre
 * Mercado: "local" o "global"
 */

export async function searchEmissoras(options?: {letra?: string, mercado?: "local" | "global"}): Promise<Record<string, unknown>> {
    const { data } = await api.get("/emisoras", {
        params: {
            token: TOKEN,
            ...(options?.letra && { letra: options.letra }),
            mercado: options?.mercado ?? "local"
        },
    })
    return data
}