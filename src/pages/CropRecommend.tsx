import { useState } from "react";
import { Sprout, BarChart3 } from "lucide-react";
import { cropRecommendations } from "@/lib/mock-data";

export default function CropRecommend() {
  const [season, setSeason] = useState("Rabi");
  const [soilType, setSoilType] = useState("Loamy");
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Crop Recommendation</h1>
        <p className="text-sm text-muted-foreground mt-1">Get AI-powered crop suggestions based on your soil and season data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-4">Input Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Rabi</option>
                <option>Kharif</option>
                <option>Zaid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Loamy</option>
                <option>Sandy Loam</option>
                <option>Clay</option>
                <option>Alluvial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Soil Moisture</label>
              <p className="text-lg font-bold text-card-foreground">52%</p>
              <p className="text-[11px] text-muted-foreground">Auto-filled from sensor</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Soil pH</label>
              <p className="text-lg font-bold text-card-foreground">6.8</p>
              <p className="text-[11px] text-muted-foreground">Auto-filled from sensor</p>
            </div>
            <button
              onClick={() => setShowResults(true)}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Recommendations
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-card-foreground">Recommended Crops</h3>
          </div>

          {showResults ? (
            <div className="space-y-3">
              {cropRecommendations.map((crop, i) => (
                <div
                  key={crop.crop}
                  className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">{crop.crop}</p>
                    <p className="text-xs text-muted-foreground">
                      {crop.season} • {crop.soil} soil • {crop.water} water requirement
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold text-primary">{crop.confidence}%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">match score</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Sprout className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Configure parameters and click "Get Recommendations"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
