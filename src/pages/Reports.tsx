import { FileDown, FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Export</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and download farm reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Sensor Data Report", desc: "Export all sensor readings as CSV", format: "CSV" },
          { title: "Farm Summary Report", desc: "Overview of farm health and alerts", format: "PDF" },
          { title: "Crop Analysis Report", desc: "Disease detections and crop recommendations", format: "PDF" },
          { title: "Task Completion Report", desc: "Scheduled vs completed farm tasks", format: "CSV" },
        ].map((report) => (
          <div key={report.title} className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{report.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{report.desc}</p>
                <button className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                  <FileDown className="h-3.5 w-3.5" />
                  Download {report.format}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
