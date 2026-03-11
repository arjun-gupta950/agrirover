import { useState } from "react";
import { Landmark, ExternalLink } from "lucide-react";
import { mockSchemes } from "@/lib/mock-data";

export default function Schemes() {
  const [regionFilter, setRegionFilter] = useState("All");
  const regions = ["All", ...new Set(mockSchemes.map((s) => s.region))];
  const filtered = regionFilter === "All" ? mockSchemes : mockSchemes.filter((s) => s.region === regionFilter);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Government Schemes</h1>
        <p className="text-sm text-muted-foreground mt-1">Agricultural schemes and subsidies for farmers</p>
      </div>

      <div className="flex gap-2">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegionFilter(r)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${regionFilter === r
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
              }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((scheme) => (
          <div key={scheme.id} className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{scheme.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{scheme.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5">{scheme.region}</span>
                  <span>{scheme.eligibility}</span>
                </div>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Learn More <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
