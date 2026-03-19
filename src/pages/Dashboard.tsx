import { Topbar } from "@/components/layout/Topbar";

export function Dashboard() {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <Topbar
        title="Dashboard"
        subtitle={`Actualizado: ${new Date().toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`}
      />
      <p className="text-sm text-gray-400">Contenido próximamente...</p>
    </div>
  );
}
