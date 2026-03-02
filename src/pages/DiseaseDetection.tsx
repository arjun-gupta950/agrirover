import { useState, useRef } from "react";
import { Upload, Leaf, AlertTriangle, CheckCircle } from "lucide-react";
import { diseaseResults } from "@/lib/mock-data";

export default function DiseaseDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof diseaseResults[0] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
      // Simulate AI analysis
      setAnalyzing(true);
      setTimeout(() => {
        setResult(diseaseResults[Math.floor(Math.random() * diseaseResults.length)]);
        setAnalyzing(false);
      }, 2500);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Plant Disease Detection</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload a leaf image for AI-powered disease analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload */}
        <div
          onClick={() => inputRef.current?.click()}
          className="group cursor-pointer rounded-xl border-2 border-dashed border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[350px] p-8"
        >
          {image ? (
            <img src={image} alt="Uploaded leaf" className="max-h-[300px] rounded-lg object-contain" />
          ) : (
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Upload Leaf Image</p>
                <p className="text-sm text-muted-foreground mt-1">Click or drag to upload a photo of the affected leaf</p>
              </div>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
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
              <p className="text-sm text-muted-foreground">Analyzing leaf image with TFLite model...</p>
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
                  <span className="text-sm font-medium text-card-foreground">{result.confidence}%</span>
                </div>
              </div>

              <div className="rounded-lg bg-success/10 border border-success/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-semibold text-success text-sm">Recommended Treatment</span>
                </div>
                <p className="text-sm text-card-foreground leading-relaxed">{result.treatment}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Leaf className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Upload a leaf image to begin analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
