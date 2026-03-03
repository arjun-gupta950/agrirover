import { useState, useEffect } from "react";
import { Droplets, Thermometer, Wind, FlaskConical, Sun } from "lucide-react";
import SensorCard from "@/components/dashboard/SensorCard";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import CameraFeed from "@/components/dashboard/CameraFeed";
import MiniChart from "@/components/dashboard/MiniChart";
import { generateSensorData, generateHistoricalData, mockAlerts, mockTasks, type SensorData } from "@/lib/mock-data";

function getSensorStatus(sensor: string, value: number): "normal" | "warning" | "critical" {
  switch (sensor) {
    case "soilMoisture": return value < 35 ? "critical" : value < 45 ? "warning" : "normal";
    case "temperature": return value > 38 ? "critical" : value > 33 ? "warning" : "normal";
    case "humidity": return value < 40 ? "warning" : value > 85 ? "warning" : "normal";
    case "soilPH": return value < 5.5 || value > 7.5 ? "warning" : "normal";
    default: return "normal";
  }
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>(generateSensorData());
  const [historical] = useState(generateHistoricalData(24));

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(generateSensorData());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sensors = [
    { key: "soilMoisture", label: "Soil Moisture", value: sensorData.soilMoisture, unit: "%", icon: Droplets, color: "#3b82f6" },
    { key: "temperature", label: "Temperature", value: sensorData.temperature, unit: "°C", icon: Thermometer, color: "#ef4444" },
    { key: "humidity", label: "Humidity", value: sensorData.humidity, unit: "%", icon: Wind, color: "#06b6d4" },
    { key: "soilPH", label: "Soil pH", value: sensorData.soilPH, unit: "pH", icon: FlaskConical, color: "#8b5cf6" },
    { key: "lightIntensity", label: "Light Intensity", value: sensorData.lightIntensity, unit: "lux", icon: Sun, color: "#f59e0b" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Farm Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring • Last updated: {new Date(sensorData.timestamp).toLocaleTimeString()}
        </p>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {sensors.map((s) => (
          <div key={s.key} className="animate-fade-in-up">
            <SensorCard
              label={s.label}
              value={s.value}
              unit={s.unit}
              icon={s.icon}
              status={getSensorStatus(s.key, s.value)}
            />
            <MiniChart
              data={historical.slice(-12).map((d) => d[s.key as keyof SensorData] as number)}
              color={s.color}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2">
          <CameraFeed />
        </div>

        {/* Alerts */}
        <div>
          <AlertsPanel alerts={mockAlerts} />

          {/* Quick Tasks */}
          <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Upcoming Tasks</h3>
            <div className="space-y-2">
              {mockTasks.filter(t => !t.completed).slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground truncate">{task.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
