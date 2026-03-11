import { FileDown, FileText } from "lucide-react";
import {
  generateHistoricalData,
  mockAlerts,
  mockTasks,
  cropRecommendations,
  diseaseResults
} from "@/lib/mock-data";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const handleDownload = (title: string, format: string) => {
    const today = new Date().toISOString().split('T')[0];

    if (title === "Sensor Data Report" && format === "CSV") {
      const data = generateHistoricalData(24);
      if (data.length === 0) return toast.error("No historical data available.");

      const headers = ["Timestamp", "Soil Moisture (%)", "Temperature (°C)", "Humidity (%)", "Soil pH", "Light Intensity (lux)"];
      const rows = data.map(record => [
        new Date(record.timestamp).toLocaleString(),
        record.soilMoisture,
        record.temperature,
        record.humidity,
        record.soilPH,
        record.lightIntensity
      ]);

      const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `sensor_data_report_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Sensor Data CSV download started!");
    }
    else if (title === "Task Completion Report" && format === "CSV") {
      const headers = ["Task ID", "Title", "Type", "Due Date", "Status"];
      const rows = mockTasks.map(task => [
        task.id,
        `"${task.title}"`,
        task.type,
        new Date(task.dueDate).toLocaleString(),
        task.completed ? "Completed" : "Pending"
      ]);

      const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `task_completion_report_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Task Completion CSV download started!");
    }
    else if (title === "Farm Summary Report" && format === "PDF") {
      try {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("AgriDost - Farm Health Summary", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        // Alerts Section
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Current System Alerts", 14, 45);

        autoTable(doc, {
          startY: 50,
          head: [['Level', 'Sensor', 'Message', 'Time']],
          body: mockAlerts.map(a => [
            a.type.toUpperCase(),
            a.sensor,
            a.message,
            new Date(a.timestamp).toLocaleTimeString()
          ]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }
        });

        // Tasks Section
        const finalY = (doc as any).lastAutoTable.finalY || 50;
        doc.setFontSize(14);
        doc.text("Pending Tasks", 14, finalY + 15);

        const pendingTasks = mockTasks.filter(t => !t.completed);
        autoTable(doc, {
          startY: finalY + 20,
          head: [['Title', 'Type', 'Due Date']],
          body: pendingTasks.map(t => [
            t.title,
            t.type,
            new Date(t.dueDate).toLocaleString()
          ]),
          theme: 'grid',
          headStyles: { fillColor: [39, 174, 96] }
        });

        doc.save(`farm_summary_${today}.pdf`);
        toast.success("Farm Summary PDF downloaded!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to generate PDF.");
      }
    }
    else if (title === "Crop Analysis Report" && format === "PDF") {
      try {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("AgriDost - Crop & Disease Analysis", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        // Disease Section
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Disease Detections & Treatments", 14, 45);

        autoTable(doc, {
          startY: 50,
          head: [['Disease Name', 'Confidence', 'Recommended Treatment']],
          body: diseaseResults.map(d => [
            d.name,
            `${d.confidence}%`,
            d.treatment
          ]),
          theme: 'striped',
          headStyles: { fillColor: [192, 57, 43] },
          columnStyles: { 2: { cellWidth: 100 } }
        });

        // Crop Recommendations Section
        const finalY = (doc as any).lastAutoTable.finalY || 50;
        doc.setFontSize(14);
        doc.text("AI Crop Recommendations", 14, finalY + 15);

        autoTable(doc, {
          startY: finalY + 20,
          head: [['Crop', 'Confidence', 'Season', 'Soil', 'Water Req']],
          body: cropRecommendations.map(c => [
            c.crop,
            `${c.confidence}%`,
            c.season,
            c.soil,
            c.water
          ]),
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save(`crop_analysis_${today}.pdf`);
        toast.success("Crop Analysis PDF downloaded!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to generate PDF.");
      }
    }
    else {
      toast.info(`${format} generation for '${title}' is coming soon.`);
    }
  };

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
                <button
                  onClick={() => handleDownload(report.title, report.format)}
                  className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
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
