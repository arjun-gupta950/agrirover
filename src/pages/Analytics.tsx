import { useState } from "react";
import { generateHistoricalData } from "@/lib/mock-data";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { format } from "date-fns";

const SENSORS = [
  { key: "soilMoisture", label: "Soil Moisture (%)", color: "#3b82f6" },
  { key: "temperature", label: "Temperature (°C)", color: "#ef4444" },
  { key: "humidity", label: "Humidity (%)", color: "#06b6d4" },
  { key: "soilPH", label: "Soil pH", color: "#8b5cf6" },
  { key: "lightIntensity", label: "Light (lux)", color: "#f59e0b" },
];

export default function Analytics() {
  const [hours, setHours] = useState(24);
  const [activeSensors, setActiveSensors] = useState<string[]>(["soilMoisture", "temperature"]);
  const data = generateHistoricalData(hours);

  const chartData = data.map((d) => ({
    ...d,
    time: format(new Date(d.timestamp), "HH:mm"),
  }));

  const toggleSensor = (key: string) => {
    setActiveSensors((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sensor Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Historical sensor data visualization</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {[6, 12, 24, 48].map((h) => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                hours === h ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {h}h
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {SENSORS.map((s) => (
            <button
              key={s.key}
              onClick={() => toggleSensor(s.key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                activeSensors.includes(s.key)
                  ? "border-transparent text-primary-foreground"
                  : "border-border text-muted-foreground bg-card hover:bg-muted"
              }`}
              style={activeSensors.includes(s.key) ? { backgroundColor: s.color } : {}}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
              />
              <Legend />
              {SENSORS.filter((s) => activeSensors.includes(s.key)).map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export */}
      <button
        onClick={() => {
          const csv = ["Timestamp," + SENSORS.map(s => s.label).join(","),
            ...data.map(d => `${d.timestamp},${d.soilMoisture},${d.temperature},${d.humidity},${d.soilPH},${d.lightIntensity}`)
          ].join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "sensor_data.csv";
          a.click();
        }}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Export CSV
      </button>
    </div>
  );
}
