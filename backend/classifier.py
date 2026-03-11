"""
ONNX classifier for plant disease detection.
Falls back to a mock classifier when no model file is present.
"""

import io
import os
import json
import numpy as np
from PIL import Image

MODEL_PATH = "/home/agrirover/best.onnx"
LABELS_PATH = os.path.join(os.path.dirname(__file__), "models", "labels.txt")
TREATMENTS_PATH = os.path.join(os.path.dirname(__file__), "models", "treatments.json")

# ── built-in fallback treatment database ─────────────────────
DEFAULT_TREATMENTS = {
    "Tomato Late Blight": "Apply copper-based fungicide. Remove affected leaves. Improve air circulation around plants.",
    "Powdery Mildew": "Apply neem oil spray. Ensure adequate spacing between plants. Avoid overhead watering.",
    "Bacterial Leaf Spot": "Use copper hydroxide spray. Remove infected plant debris. Rotate crops annually.",
    "Early Blight": "Apply chlorothalonil-based fungicide. Remove lower affected leaves. Mulch around plants.",
    "Leaf Curl": "Remove and destroy affected leaves. Apply insecticidal soap for whitefly control. Use resistant varieties.",
    "Healthy": "No treatment needed. Continue regular maintenance and monitoring.",
}

# ── mock results for development without a model ─────────────
MOCK_RESULTS = [
    {"name": "Tomato Late Blight", "confidence": 94.2},
    {"name": "Powdery Mildew", "confidence": 88.7},
    {"name": "Bacterial Leaf Spot", "confidence": 72.1},
    {"name": "Early Blight", "confidence": 81.5},
]


class Classifier:
    def __init__(self):
        self.session = None
        self.input_name = None
        self.labels = []
        self.treatments = dict(DEFAULT_TREATMENTS)
        self._load_model()

    @property
    def is_loaded(self) -> bool:
        return self.session is not None

    # ── public API ──────────────────────────────────────────────

    def classify(self, image_bytes: bytes) -> dict:
        """
        Classify an image.
        Returns { name: str, confidence: float, treatment: str }
        """
        if not self.is_loaded:
            return self._mock_classify()

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        
        # ONNX format is typically NCHW [1, 3, 224, 224] for PyTorch exports
        arr = np.array(img, dtype=np.float32) / 255.0
        arr = np.transpose(arr, (2, 0, 1))  # HWC to CHW
        arr = np.expand_dims(arr, axis=0)   # NCHW

        # Run inference
        try:
            output = self.session.run(None, {self.input_name: arr})[0]
            
            # Simple softmax if output isn't already probabilities
            if np.max(output) > 1.0 or np.min(output) < 0.0:
                e_x = np.exp(output - np.max(output))
                probs = e_x / e_x.sum(axis=1, keepdims=True)
                output = probs

            output = output[0] # remove batch dim
            top_idx = int(np.argmax(output))
            confidence = float(output[top_idx]) * 100

            name = self.labels[top_idx] if top_idx < len(self.labels) else f"Class {top_idx}"
            treatment = self.treatments.get(name, "Consult a local agricultural expert for treatment advice.")

            return {
                "name": name,
                "confidence": round(confidence, 1),
                "treatment": treatment,
            }
        except Exception as e:
            print(f"[classifier] Inference error: {e}")
            return self._mock_classify()

    # ── internal ────────────────────────────────────────────────

    def _load_model(self):
        if not os.path.isfile(MODEL_PATH):
            print(f"[classifier] ⚠  No ONNX model at {MODEL_PATH} — running in MOCK mode")
            return

        try:
            import onnxruntime as ort
            self.session = ort.InferenceSession(MODEL_PATH)
            self.input_name = self.session.get_inputs()[0].name
            print(f"[classifier] ✔  ONNX Model loaded from {MODEL_PATH}")
        except Exception as e:
            print(f"[classifier] ✘  Failed to load ONNX model: {e}")
            self.session = None

        # Load labels
        if os.path.isfile(LABELS_PATH):
            with open(LABELS_PATH) as f:
                self.labels = [line.strip() for line in f if line.strip()]
            print(f"[classifier] ✔  {len(self.labels)} labels loaded")
        else:
            # Fallback mock labels just in case
            self.labels = ["Tomato Late Blight", "Powdery Mildew", "Bacterial Leaf Spot", "Early Blight", "Leaf Curl", "Healthy"]

        # Load custom treatments
        if os.path.isfile(TREATMENTS_PATH):
            with open(TREATMENTS_PATH) as f:
                self.treatments.update(json.load(f))

    def _mock_classify(self) -> dict:
        """Return a random mock result when no model is loaded or an error occurs."""
        import random
        pick = random.choice(MOCK_RESULTS)
        return {
            "name": pick["name"],
            "confidence": pick["confidence"],
            "treatment": self.treatments.get(
                pick["name"], "Consult a local agricultural expert."
            ),
        }
