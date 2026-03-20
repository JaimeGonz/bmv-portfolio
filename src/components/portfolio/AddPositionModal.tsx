import { getCurrentPrice, searchEmissoras } from "@/services/databursatil";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { getAssetType, type EmissoraInfo, type Position } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchResult {
  ticker: string;
  serie: string;
  info: EmissoraInfo;
}

interface AddPositionModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddPositionModal({ open, onClose }: AddPositionModalProps) {
  const addPosition = usePortfolioStore((state) => state.addPosition);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [shares, setShares] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    try {
      setSearching(true);
      setError(null);

      // Busca en ambos mercados en paralelo
      const [localResult, globalResult] = await Promise.allSettled([
        searchEmissoras({ letra: query.toUpperCase(), mercado: "local" }),
        searchEmissoras({ letra: query.toUpperCase(), mercado: "global" }),
      ]);

      // Toma solo las que tuvieron éxito
      const combined = {
        ...(localResult.status === "fulfilled" ? localResult.value : {}),
        ...(globalResult.status === "fulfilled" ? globalResult.value : {}),
      };

      // Mapear resultados a SearchResult
      const flat: SearchResult[] = [];
      for (const [ticker, series] of Object.entries(combined)) {
        for (const [serie, info] of Object.entries(
          series as Record<string, EmissoraInfo>,
        )) {
          if ((info as EmissoraInfo).estatus === "ACTIVA") {
            flat.push({ ticker, serie, info: info as EmissoraInfo });
          }
        }
      }
      setResults(flat.slice(0, 10)); // Limitar a 10 resultados
    } catch {
      setError("Error al buscar emisoras. Intenta de nuevo.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSelect(result: SearchResult) {
    setSelected(result);
    setResults([]);
    setQuery(`${result.ticker}${result.serie}`);

    // Load current price
    try {
      setLoadingPrice(true);
      const price = await getCurrentPrice(`${result.ticker}${result.serie}`);
      if (price) setBuyPrice(String(price));
    } catch {
      // No hacer nada, el usuario puede ingresar el precio manualmente
    } finally {
      setLoadingPrice(false);
    }
  }

  function handleClose() {
    setQuery("");
    setResults([]);
    setSelected(null);
    setShares("");
    setBuyPrice("");
    setError(null);
    onClose();
  }

  function handleAdd() {
    if (!selected || !shares || !buyPrice) return;

    const newPosition: Position = {
      id: uuidv4(),
      ticker: selected.ticker,
      serie: selected.serie,
      name: selected.info.razon_social,
      type: getAssetType(selected.info.tipo_valor_id),
      exchange: selected.info.bolsa,
      shares: Number(shares),
      buyPrice: Number(buyPrice),
      currentPrice: Number(buyPrice),
      dailyChangePct: 0,
      lastUpdated: "",
    };

    addPosition(newPosition);
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium">
            Agregar posición
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* Searcher */}
          <div>
            <Label className="text-xs text-gray-500 mb-1.5 block">
              Buscar emisora
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ej. AMXB, WALMEX, FEMSA..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearch}
                disabled={searching}
              >
                <Search size={14} />
              </Button>
            </div>
            {/* Resultados */}
            {results.length > 0 && (
              <div className="mt-1 border border-gray-100 rounded-lg overflow-hidden">
                {results.map((result) => (
                  <button
                    key={`${result.ticker}${result.serie}`}
                    onClick={() => handleSelect(result)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium text-gray-900">
                      {result.ticker}
                      {result.serie}
                    </span>
                    <span className="text-gray-400 text-xs ml-2 truncate max-w-62.5 block">
                      {result.info.razon_social}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Campos de la posicion */}
          {selected && (
            <>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-900">
                  {selected.ticker}
                  {selected.serie}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selected.info.razon_social}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1.5 block">
                    Numero de acciones
                  </Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="text-sm"
                    min="1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1.5 block">
                    Precio de compra (MXN)
                  </Label>
                  <Input
                    type="number"
                    placeholder={loadingPrice ? "Cargando precio..." : "0.00"}
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </>
          )}

          {/* Total informativo */}
          {selected && shares && buyPrice && (
            <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-xs text-blue-600">Total de la compra</span>
              <span className="text-sm font-medium text-blue-700">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 2,
                }).format(Number(shares) * Number(buyPrice))}
              </span>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!selected || !shares || !buyPrice}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Agregar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
