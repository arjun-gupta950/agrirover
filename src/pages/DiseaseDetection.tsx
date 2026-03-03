import { useState, useRef } from "react";
import { Upload, Leaf, AlertTriangle, CheckCircle, WifiOff } from "lucide-react";
import { useBackendDiscovery } from "@/hooks/useBackendDiscovery";

export default function DiseaseDetection() {
  const { backendUrl, isConnected } = useBackendDiscovery();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    name: string;
    confidence: number;
    treatment: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);

    // Send to backend
    setResult(null);
    setError(null);
    setAnalyzing(true);

    if (!backendUrl || !isConnected) {
      // Fallback: mock result when backend is offline
      setTimeout(() => {
        setResult({
          name: "Tomato Late Blight",
          confidence: 94.2,
          treatment:
            "Apply copper-based fungicide. Remove affected leaves. Improve air circulation around plants.",
        });
        setAnalyzing(false);
      }, 2000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${backendUrl}/api/detect`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      setResult({
        name: data.name,
        confidence: data.confidence,
        treatment: data.treatment,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Plant Disease Detection</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a leaf image for AI-powered disease analysis
          {!isConnected && (
            <span className="ml-2 inline-flex items-center gap-1 text-destructive">
              <WifiOff className="h-3 w-3" /> Backend offline — using mock results
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload */}
        <div
          onClick={() => inputRef.current?.click()}
          className="group cursor-pointer rounded-xl border-2 border-dashed border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[350px] p-8"
        >
          {image ? (
            <img
              src={image}
              alt="Uploaded leaf"
              className="max-h-[300px] rounded-lg object-contain"
            />
          ) : (
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Upload Leaf Image</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click or drag to upload a photo of the affected leaf
                </p>
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {/* Results */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-card-foreground">Analysis Results</h3>
          </div>

          {analyzing ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                {isConnected
                  ? "Analyzing leaf image with TFLite model..."
                  : "Simulating analysis (backend offline)..."}
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive/50" />
              <p className="text-sm text-destructive">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  inputRef.current?.click();
                }}
                className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : result ? (
            <div className="space-y-4 animate-fade-in-up">
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-semibold text-destructive text-sm">Disease Detected</span>
                </div>
                <p className="text-lg font-bold text-card-foreground">{result.name}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-destructive transition-all duration-1000"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">
                    {result.confidence}%
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-success/10 border border-success/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-semibold text-success text-sm">
                    Recommended Treatment
                  </span>
                </div>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {result.treatment}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Leaf className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Upload a leaf image to begin analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
