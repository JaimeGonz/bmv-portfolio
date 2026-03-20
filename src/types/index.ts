export type AssetType = "stock" | "etf" | "reit" | "other"
export type Exchange = "BMV" | "BIVA"
export type Status = "ACTIVA" | "SUSPENDIDA"

export interface Dividend {
    pago: number
    tipo: string
    divisa?: string
    fechaexcupon: string
}

export interface EmissoraInfo {
    razon_social: string
    isin: string | null
    bolsa: Exchange
    tipo_valor_descripcion: string
    tipo_valor_id: string
    estatus: Status
    acciones_en_circulacion: number | null
    rango_historicos: string | null
    rango_financieros: string | null
    dividendos: {
        reciente?: Record<string, Dividend>
        historico?: Record<string, Dividend>
    } | null
}

export interface EmissorasResponse {
    [ticker: string]: {
        [serie: string]: EmissoraInfo
    }
}

export interface Position {
    id: string
    ticker: string
    serie: string
    name: string
    type: AssetType
    exchange: Exchange
    shares: number
    buyPrice: number
    currentPrice: number
    dailyChangePct: number
    lastUpdated: string
}

export interface PortfolioMetrics {
    totalValue: number
    totalGain: number
    returnPct: number
    totalPositions: number
    vsIndex: number
}

export function getAssetType(tipoValorId: string): AssetType {
  if (tipoValorId === "CF") return "reit"      // FIBRAs
  if (tipoValorId === "1B") return "etf"        // ETFs / TRACs
  if (tipoValorId === "1" || tipoValorId === "1E") return "stock"  // Acciones nacionales y extranjeras
  return "other"
}