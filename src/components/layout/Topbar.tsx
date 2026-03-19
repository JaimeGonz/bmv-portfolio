import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface TopbarProps {
  title: string;
  subtitle: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-lg font-medium text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="text-xs">
          Exportar CSV
        </Button>
        <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
          <Plus size={14} className="mr-1" />
          Agregar posición
        </Button>
      </div>
    </div>
  );
}
