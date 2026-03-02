import { Alert } from "@/lib/mock-data";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const iconMap = {
  warning: AlertTriangle,
  critical: AlertCircle,
  info: Info,
};

const colorMap = {
  warning: "text-warning",
  critical: "text-destructive",
  info: "text-info",
};

export default function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h3 className="mb-3 text-sm font-semibold text-card-foreground">Recent Alerts</h3>
      <div className="space-y-2">
        {alerts.slice(0, 4).map((alert) => {
          const Icon = iconMap[alert.type];
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-muted/50"
            >
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", colorMap[alert.type])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-card-foreground">{alert.message}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
