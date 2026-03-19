import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  neutral?: boolean;
}

export function MetricCard({
  label,
  value,
  change,
  positive,
  neutral,
}: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <p
        className={cn(
          "text-2xl font-medium",
          positive && "text-green-700",
          !positive && !neutral && "text-red-700",
          neutral && "text-gray-900",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "text-xs mt-1",
          positive && "text-green-600",
          !positive && !neutral && "text-red-600",
          neutral && "text-gray-500",
        )}
      >
        {change}
      </p>
    </div>
  );
}
