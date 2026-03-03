import { TrendingUp, TrendingDown } from "lucide-react";
import { mockCropPrices } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function Market() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Market Prices</h1>
        <p className="text-sm text-muted-foreground mt-1">Current commodity prices from local APMC markets</p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Crop</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Market</th>
            </tr>
          </thead>
          <tbody>
            {mockCropPrices.map((item) => (
              <tr key={item.crop} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4 font-medium text-card-foreground">{item.crop}</td>
                <td className="px-5 py-4 text-card-foreground">
                  {item.price.toLocaleString("en-IN")} <span className="text-muted-foreground">{item.unit}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={cn("flex items-center gap-1 text-sm font-medium", item.change >= 0 ? "text-success" : "text-destructive")}>
                    {item.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {item.change >= 0 ? "+" : ""}{item.change}%
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{item.market}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
