import type { Position } from "@/types";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Sector,
  type PieSectorDataItem,
} from "recharts";

const TYPE_COLORS: Record<string, string> = {
  stock: "#3b82f6",
  etf: "#10b981",
  reit: "#f59e0b",
  other: "#6b7280",
};

const TYPE_LABELS: Record<string, string> = {
  stock: "Acción",
  etf: "ETF",
  reit: "FIBRA",
  other: "Otro",
};

interface DonutEntry {
  name: string;
  value: number;
  color: string;
  pct: number;
}

interface PortfolioDonutProps {
  positions: Position[];
}

function formatMXN(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

// Tooltip personalizado
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DonutEntry }>;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
      <p className="text-xs font-medium text-gray-900">{entry.name}</p>
      <p className="text-sm font-medium mt-0.5" style={{ color: entry.color }}>
        {formatMXN(entry.value)}
      </p>
      <p className="text-xs text-gray-400">{entry.pct.toFixed(1)}%</p>
    </div>
  );
}

export function PortfolioDonut({ positions }: PortfolioDonutProps) {
  const data = useMemo<DonutEntry[]>(() => {
    const totalValue = positions.reduce(
      (sum, p) => sum + p.currentPrice * p.shares,
      0,
    );

    // Agrupar por tipo y sumar valor
    const grouped = positions.reduce<Record<string, number>>((acc, p) => {
      const value = p.currentPrice * p.shares;
      acc[p.type] = (acc[p.type] ?? 0) + value;
      return acc;
    }, {});

    return Object.entries(grouped).map(([type, value]) => ({
      name: TYPE_LABELS[type] || type,
      value,
      color: TYPE_COLORS[type] || TYPE_COLORS["other"],
      pct: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));
  }, [positions]);

  const totalValue = useMemo(
    () => positions.reduce((sum, p) => sum + p.currentPrice * p.shares, 0),
    [positions],
  );

  if (positions.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-center h-50">
        <p className="text-xs text-gray-400">Sin posiciones</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-900 mb-4">Distribución</h2>

      <div className="flex items-center gap-6">
        {/* Gráfica */}
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                fill="#8884d8"
                shape={(props: PieSectorDataItem) => {
                  const {
                    cx,
                    cy,
                    innerRadius,
                    outerRadius,
                    startAngle,
                    endAngle,
                    payload,
                  } = props;
                  return (
                    <Sector
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      fill={payload.color}
                    />
                  );
                }}
              >
                <Tooltip content={<CustomTooltip />} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-600 w-14">{entry.name}</span>
              <span className="text-xs font-medium text-gray-900">
                {entry.pct.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-400">
                {formatMXN(entry.value)}
              </span>
            </div>
          ))}

          {/* Total al final de la leyenda */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
            <div className="w-2.5 h-2.5 shrink-0" />
            <span className="text-xs text-gray-400 w-14">Total</span>
            <span className="text-xs font-medium text-gray-900">
              {formatMXN(totalValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
