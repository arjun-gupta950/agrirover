import { Camera, Maximize2, CameraIcon } from "lucide-react";
import { useState } from "react";
import farmHero from "@/assets/farm-hero.jpg";

export default function CameraFeed() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-card-foreground">Live Camera Feed</span>
          <span className="ml-2 flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-sensor-pulse" />
            LIVE
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => {}}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
            title="Take Snapshot"
          >
            <CameraIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="relative aspect-video bg-muted">
        <img
          src={farmHero}
          alt="Farm camera feed"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-3 left-3 rounded-md bg-foreground/70 px-2 py-1 text-[10px] font-mono text-primary-foreground">
          CAM-01 • {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
