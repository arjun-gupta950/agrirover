import { useState, useEffect, useCallback } from "react";

const DISCOVERY_CANDIDATES = [
  "http://192.168.1.14:5000",
  "http://rpi.local:5000",
  "http://raspberrypi.local:5000",
  "http://agridost.local:5000",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
];

const LS_KEY = "agridost-backend-url";

interface BackendState {
  /** Resolved backend base URL  (e.g. "http://raspberrypi.local:5000") */
  backendUrl: string | null;
  /** Whether the backend is reachable */
  isConnected: boolean;
  /** Error message if discovery failed */
  error: string | null;
  /** True while probing */
  isDiscovering: boolean;
  /** Manually set (or override) the backend URL */
  setManualUrl: (url: string) => void;
  /** Re-run discovery */
  retry: () => void;
}

async function probe(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}

async function fastProbe(baseUrl: string): Promise<string> {
  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      signal: AbortSignal.timeout(800),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === "ok") return baseUrl;
    }
  } catch {
    // ignore timeouts or failed requests silently
  }
  throw new Error("Not found");
}

async function firstSuccess<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    let rejections = 0;
    if (promises.length === 0) reject(new Error("Empty promises array"));
    for (const p of promises) {
      p.then(resolve).catch(() => {
        rejections++;
        if (rejections === promises.length) reject(new Error("All promises rejected"));
      });
    }
  });
}

async function scanSubnet(subnet: string): Promise<string> {
  const promises: Promise<string>[] = [];
  for (let i = 2; i < 255; i++) {
    promises.push(fastProbe(`http://${subnet}.${i}:5000`));
  }
  return firstSuccess(promises);
}

export function useBackendDiscovery(): BackendState {
  const [backendUrl, setBackendUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(true);

  const discover = useCallback(async () => {
    setIsDiscovering(true);
    setError(null);

    // 1. Check saved URL first
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const ok = await probe(saved);
      if (ok) {
        setBackendUrl(saved);
        setIsConnected(true);
        setIsDiscovering(false);
        return;
      }
    }

    // 2. Probe known candidates
    for (const candidate of DISCOVERY_CANDIDATES) {
      const ok = await probe(candidate);
      if (ok) {
        localStorage.setItem(LS_KEY, candidate);
        setBackendUrl(candidate);
        setIsConnected(true);
        setIsDiscovering(false);
        return;
      }
    }

    // 3. Robust Subnet Scan Fallback
    try {
      // 192.168.1.x, 192.168.0.x, 192.168.29.x (common Jio fiber in India), 192.168.31.x (Mi routers)
      // Mobile Hotspots: 192.168.43.x (Android), 172.20.10.x (iOS), 192.168.137.x (Windows)
      const foundIp = await firstSuccess([
        scanSubnet("192.168.1"),
        scanSubnet("192.168.0"),
        scanSubnet("192.168.29"),
        scanSubnet("192.168.31"),
        scanSubnet("10.0.0"),
        scanSubnet("192.168.43"),
        scanSubnet("172.20.10"),
        scanSubnet("192.168.137"),
      ]);
      localStorage.setItem(LS_KEY, foundIp);
      setBackendUrl(foundIp);
      setIsConnected(true);
      setIsDiscovering(false);
      return;
    } catch {
      // All subnets failed
    }

    // 4. Nothing found
    setBackendUrl(null);
    setIsConnected(false);
    setError(
      "Could not find the AgriDost backend. Make sure the Raspberry Pi is running and on the same network."
    );
    setIsDiscovering(false);
  }, []);

  const setManualUrl = useCallback(
    (url: string) => {
      const clean = url.replace(/\/+$/, "");
      localStorage.setItem(LS_KEY, clean);
      setBackendUrl(clean);
      setError(null);
      // verify
      probe(clean).then((ok) => {
        setIsConnected(ok);
        if (!ok) setError("Backend not reachable at " + clean);
      });
    },
    []
  );

  useEffect(() => {
    discover();
    // Re-check every 30s
    const interval = setInterval(discover, 30_000);
    return () => clearInterval(interval);
  }, [discover]);

  return { backendUrl, isConnected, error, isDiscovering, setManualUrl, retry: discover };
}
