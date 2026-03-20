import type { Position } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// Tipos de badge por tipo de activo
const typeBadgeClass: Record<string, string> = {
  stock: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  etf: "bg-green-50 text-green-700 hover:bg-green-50",
  reit: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  other: "bg-gray-50 text-gray-700 hover:bg-gray-50",
};

const typeLabel: Record<string, string> = {
  stock: "Acción",
  etf: "ETF",
  reit: "FIBRA",
  other: "Otro",
};

// Format numbers as MXN currency
function formatMXN(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value);
}

// Format percentage with 2 decimals
function formatPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

// Calculate gain/loss of a position
function calcGain(position: Position): number {
  return (position.currentPrice - position.buyPrice) * position.shares;
}

function calcGainPct(position: Position): number {
  if (position.buyPrice === 0) return 0; // Avoid division by zero
  return (
    ((position.currentPrice - position.buyPrice) / position.buyPrice) * 100
  );
}

interface PositionsTableProps {
  positions: Position[];
  loading?: boolean;
}

export function PositionsTable({
  positions,
  loading = false,
}: PositionsTableProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900">Posiciones</h2>
        {loading && (
          <span className="text-xs text-gray-400 animate-pulse">
            Cargando precios...
          </span>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-gray-100">
            <TableHead className="text-xs text-gray-400 font-normal">
              Emisora
            </TableHead>
            <TableHead className="text-xs text-gray-400 font-normal">
              Tipo
            </TableHead>
            <TableHead className="text-xs text-gray-400 font-normal text-right">
              Titulos
            </TableHead>
            <TableHead className="text-xs text-gray-400 font-normal text-right">
              Precio compra
            </TableHead>
            <TableHead className="text-xs text-gray-400 font-normal text-right">
              Precio actual
            </TableHead>
            <TableHead className="text-xs text-gray-400 font-normal text-right">
              Valor
            </TableHead>
            <TableHead className="text-xs text-gray-400 font-normal text-right">
              G/P
            </TableHead>
            <TableHead className="text-xs text-gray-400 font-normal text-right">
              Día
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => {
            const gain = calcGain(position);
            const gainPct = calcGainPct(position);
            const isPositive = gain >= 0;
            const isDayPositive = position.dailyChangePct >= 0;

            return (
              <TableRow key={position.id} className="border-gray-100">
                <TableCell>
                  <div className="font-medium text-sm text-gray-900">
                    {position.ticker}
                    {position.serie}
                  </div>
                  <div className="text-xs text-gray-400 truncate max-w-75">
                    {position.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={typeBadgeClass[position.type]}>
                    {typeLabel[position.type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-gray-700">
                  {position.shares.toLocaleString("es-MX")}
                </TableCell>
                <TableCell className="text-right text-sm text-gray-700">
                  {formatMXN(position.buyPrice)}
                </TableCell>
                <TableCell className="text-right text-sm text-gray-700">
                  {position.currentPrice > 0
                    ? formatMXN(position.currentPrice)
                    : "—"}
                </TableCell>
                <TableCell className="text-right text-sm text-gray-700">
                  {position.currentPrice > 0
                    ? formatMXN(position.currentPrice * position.shares)
                    : "—"}
                </TableCell>
                <TableCell className="text-right text-sm">
                  <div
                    className={isPositive ? "text-green-700" : "text-red-700"}
                  >
                    {formatMXN(gain)}
                  </div>
                  <div
                    className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatPct(gainPct)}
                  </div>
                </TableCell>
                <TableCell
                  className={`text-right text-sm font-medium ${isDayPositive ? "text-green-700" : "text-red-700"}`}
                >
                  {formatPct(position.dailyChangePct)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
