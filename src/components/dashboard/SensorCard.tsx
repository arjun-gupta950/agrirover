import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  className?: string;
}

const statusStyles = {
  normal: "border-l-success bg-success/5",
  warning: "border-l-warning bg-warning/5",
  critical: "border-l-destructive bg-destructive/5",
};

const statusDotStyles = {
  normal: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
};

export default function SensorCard({ label, value, unit, icon: Icon, status, className }: SensorCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border border-l-4 p-4 shadow-card transition-all duration-300 hover:shadow-elevated bg-card",
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-card-foreground">{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full animate-sensor-pulse", statusDotStyles[status])} />
        <span className="text-xs text-muted-foreground capitalize">{status}</span>
      </div>
    </div>
  );
}
