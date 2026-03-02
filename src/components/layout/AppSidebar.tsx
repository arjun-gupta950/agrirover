import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Camera,
  Leaf,
  Sprout,
  Landmark,
  TrendingUp,
  Bell,
  CalendarCheck,
  FileDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/camera", label: "Live Camera", icon: Camera },
  { path: "/disease", label: "Disease Detection", icon: Leaf },
  { path: "/crop-recommend", label: "Crop Advisor", icon: Sprout },
  { path: "/schemes", label: "Gov. Schemes", icon: Landmark },
  { path: "/market", label: "Market Prices", icon: TrendingUp },
  { path: "/alerts", label: "Alerts", icon: Bell },
  { path: "/tasks", label: "Task Scheduler", icon: CalendarCheck },
  { path: "/reports", label: "Reports", icon: FileDown },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-earth">
          <Sprout className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-sidebar-foreground">Agribot</h1>
          <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50">Smart Farm</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-primary">
            F
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Farmer Demo</p>
            <p className="text-[11px] text-sidebar-foreground/50">Local System</p>
          </div>
          <button className="text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
