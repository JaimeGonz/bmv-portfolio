import { MetricCard } from "@/components/dashboard/MetriCard";
import { PositionsTable } from "@/components/dashboard/PositionsTable";
import { Topbar } from "@/components/layout/Topbar";
import { AddPositionModal } from "@/components/portfolio/AddPositionModal";
import { mockPositions } from "@/data/mockPositions";
import { usePortfolioMetrics } from "@/hooks/usePortfolioMetrics";
import { usePortfolioPrices } from "@/hooks/usePortfolioPrices";
import { useState } from "react";

const formatMXN = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { positions, loading, error } = usePortfolioPrices(mockPositions);
  const metrics = usePortfolioMetrics(positions);

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-y-auto">
      <Topbar
        title="Dashboard"
        subtitle={`Actualizado: ${new Date().toLocaleTimeString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`}
        onAddPosition={() => setModalOpen(true)}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
          {error} - mostrando preciosa de compra como referencia.
        </div>
      )}

      <div
        className={`grid  grid-cols-4 gap-3 mb-6 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
      >
        <MetricCard
          label="Valor total"
          value={loading ? "Cargando..." : formatMXN(metrics.totalValue)}
          change={`${formatMXN(metrics.totalGain)} ganancia total`}
        />
        <MetricCard
          label="Ganancia / Pérdida"
          value={
            loading
              ? "..."
              : `${metrics.returnPct >= 0 ? "+" : ""}${metrics.returnPct.toFixed(1)}%`
          }
          change={formatMXN(metrics.totalGain)}
          positive={metrics.totalGain >= 0}
        />
        <MetricCard
          label="Posiciones"
          value={String(metrics.totalPositions)}
          change="3 tipos de activo"
          neutral
        />
        <MetricCard
          label="vs IPC (benchmark)"
          value={`+${metrics.vsIndex}%`}
          change="Superando al índice"
          positive
        />
      </div>
      <PositionsTable positions={positions} loading={loading} />

      <AddPositionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
