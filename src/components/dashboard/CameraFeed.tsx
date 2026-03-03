import { Camera, Maximize2, CameraIcon, WifiOff, RefreshCw } from "lucide-react";
import { useBackendDiscovery } from "@/hooks/useBackendDiscovery";

export default function CameraFeed() {
  const { backendUrl, isConnected, isDiscovering, retry } = useBackendDiscovery();

  const handleFullscreen = () => {
    const el = document.getElementById("dashboard-camera-feed");
    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen();
      }
    }
  };

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

  return (
    <div
      id="dashboard-camera-feed"
      className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-card-foreground">Live Camera Feed</span>
          {isConnected ? (
            <span className="ml-2 flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-sensor-pulse" />
              LIVE
            </span>
          ) : (
            <span className="ml-2 flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              OFFLINE
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleSnapshot}
            disabled={!isConnected}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
            title="Take Snapshot"
          >
            <CameraIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleFullscreen}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-muted">
        {isConnected && backendUrl ? (
          <>
            <img
              src={`${backendUrl}/api/stream`}
              alt="Farm camera feed"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 rounded-md bg-foreground/70 px-2 py-1 text-[10px] font-mono text-primary-foreground">
              CAM-01 • {new Date().toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <WifiOff className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              {isDiscovering ? "Connecting..." : "Camera offline"}
            </p>
            {!isDiscovering && (
              <button
                onClick={retry}
                className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
