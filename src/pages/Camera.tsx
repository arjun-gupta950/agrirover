import { Camera as CameraIcon, Maximize2, Download } from "lucide-react";
import farmHero from "@/assets/farm-hero.jpg";

export default function CameraPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Camera Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">MJPEG stream from Raspberry Pi camera module</p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <CameraIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-card-foreground">CAM-01 — Field Overview</span>
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-sensor-pulse" />
              LIVE
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors">
              <Download className="h-3.5 w-3.5" /> Snapshot
            </button>
            <button className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors">
              <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
            </button>
          </div>
        </div>
        <div className="relative aspect-video bg-foreground/5">
          <img src={farmHero} alt="Live camera feed" className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-4 rounded-md bg-foreground/70 px-3 py-1.5 text-xs font-mono text-primary-foreground">
            RPi Camera Module v2 • 1280×720 • {new Date().toLocaleTimeString()}
          </div>
          <div className="absolute top-4 right-4 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h3 className="text-sm font-semibold text-card-foreground mb-2">Camera Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            ["Resolution", "1280×720"],
            ["Frame Rate", "15 fps"],
            ["Stream URL", "http://raspberrypi:8080/stream"],
            ["Protocol", "MJPEG over HTTP"],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="font-medium text-card-foreground">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
