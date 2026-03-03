import { useState } from "react";
import { Camera as CameraIcon, Maximize2, Download, WifiOff, RefreshCw, Settings } from "lucide-react";
import { useBackendDiscovery } from "@/hooks/useBackendDiscovery";

export default function CameraPage() {
  const { backendUrl, isConnected, error, isDiscovering, setManualUrl, retry } =
    useBackendDiscovery();
  const [manualIp, setManualIp] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleSnapshot = async () => {
    if (!backendUrl) return;
    try {
      const res = await fetch(`${backendUrl}/api/snapshot`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agridost-snapshot-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      console.error("Snapshot failed");
    }
  };

  const handleFullscreen = () => {
    const el = document.getElementById("camera-feed-container");
    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen();
      }
    }
  };

  const handleManualConnect = () => {
    if (!manualIp.trim()) return;
    const url = manualIp.includes("://") ? manualIp : `http://${manualIp}`;
    setManualUrl(url.replace(/\/+$/, ""));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Camera Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">
          MJPEG stream from USB webcam via Raspberry Pi
        </p>
      </div>

      <div
        id="camera-feed-container"
        className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <CameraIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-card-foreground">CAM-01 — Field Overview</span>
            {isConnected ? (
              <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-sensor-pulse" />
                LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                OFFLINE
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSnapshot}
              disabled={!isConnected}
              className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" /> Snapshot
            </button>
            <button
              onClick={handleFullscreen}
              className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
            </button>
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="relative aspect-video bg-foreground/5">
          {isConnected && backendUrl ? (
            <>
              <img
                src={`${backendUrl}/api/stream`}
                alt="Live camera feed"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-md bg-foreground/70 px-3 py-1.5 text-xs font-mono text-primary-foreground">
                USB Webcam • 1280×720 • {new Date().toLocaleTimeString()}
              </div>
              <div className="absolute top-4 right-4 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <WifiOff className="h-16 w-16 text-muted-foreground/30" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {isDiscovering ? "Searching for camera..." : "Camera Offline"}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {error || "Make sure the Raspberry Pi backend is running"}
                </p>
              </div>
              <button
                onClick={retry}
                disabled={isDiscovering}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isDiscovering ? "animate-spin" : ""}`} />
                {isDiscovering ? "Searching..." : "Retry"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings / Connection panel */}
      {showSettings && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-card-foreground">Connection Settings</h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={manualIp}
              onChange={(e) => setManualIp(e.target.value)}
              placeholder="e.g. 192.168.1.42:5000"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              onKeyDown={(e) => e.key === "Enter" && handleManualConnect()}
            />
            <button
              onClick={handleManualConnect}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {/* Camera Configuration */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h3 className="text-sm font-semibold text-card-foreground mb-2">Camera Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            ["Resolution", "1280×720"],
            ["Frame Rate", "15 fps"],
            ["Stream URL", backendUrl ? `${backendUrl}/api/stream` : "Not connected"],
            ["Protocol", "MJPEG over HTTP"],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="font-medium text-card-foreground break-all">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
