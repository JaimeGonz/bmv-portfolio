import { cn } from "@/lib/utils";
import { BarChart2, Clock, Grid, TrendingUp, User } from "lucide-react";

const navItems = [
  { icon: BarChart2, label: "Dashboard", active: true },
  { icon: Clock, label: "Mi portafolio", active: false },
  { icon: TrendingUp, label: "Mercado", active: false },
  { icon: Grid, label: "Simulador", active: false },
];

export function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-white border-r border-gray-100 flex flex-col px-3 py-6 shrink-0">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <TrendingUp size={14} className="text-white" />
        </div>
        <span className="font-medium text-sm text-gray-900">BMV Portfolio</span>
      </div>

      <p className="text-[11px] text-gray-400 px-3 mb-2 tracking-wide">
        Principal
      </p>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left",
              item.active
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <p className="text-[11px] text-gray-400 px-3 mb-2 tracking-wide">
          Cuenta
        </p>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full">
          <User size={16} />
          Perfil
        </button>
      </div>
    </aside>
  );
}
