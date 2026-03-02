import { mockAlerts } from "@/lib/mock-data";
import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const iconMap = { warning: AlertTriangle, critical: AlertCircle, info: Info };
const colorMap = { warning: "text-warning border-warning/30 bg-warning/5", critical: "text-destructive border-destructive/30 bg-destructive/5", info: "text-info border-info/30 bg-info/5" };

export default function Alerts() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Sensor threshold alerts and system notifications</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockAlerts.map((alert) => {
          const Icon = iconMap[alert.type];
          return (
            <div key={alert.id} className={cn("flex items-start gap-4 rounded-xl border p-5 transition-colors", colorMap[alert.type])}>
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{alert.message}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Sensor: {alert.sensor}</span>
                  <span>•</span>
                  <span>{format(new Date(alert.timestamp), "MMM d, HH:mm:ss")}</span>
                </div>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", alert.type === "critical" ? "bg-destructive text-destructive-foreground" : alert.type === "warning" ? "bg-warning text-warning-foreground" : "bg-info text-info-foreground")}>
                {alert.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
