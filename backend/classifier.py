"""
TFLite classifier for plant disease detection.
Falls back to a mock classifier when no model file is present,
so the app works even without a real model during development.
"""

import io
import os
import json
import numpy as np
from PIL import Image

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.tflite")
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
        self.interpreter = None
        self.labels = []
        self.treatments = dict(DEFAULT_TREATMENTS)
        self.input_details = None
        self.output_details = None
        self._load_model()

    @property
    def is_loaded(self) -> bool:
        return self.interpreter is not None

    # ── public API ──────────────────────────────────────────────

    def classify(self, image_bytes: bytes) -> dict:
        """
        Classify an image.
        Returns { name: str, confidence: float, treatment: str }
        """
        if not self.is_loaded:
            return self._mock_classify()

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Pre-process to match model input
        input_shape = self.input_details[0]["shape"]  # e.g. [1, 224, 224, 3]
        h, w = input_shape[1], input_shape[2]
        img = img.resize((w, h))
        arr = np.array(img, dtype=np.float32) / 255.0
        arr = np.expand_dims(arr, axis=0)

        self.interpreter.set_tensor(self.input_details[0]["index"], arr)
        self.interpreter.invoke()
        output = self.interpreter.get_tensor(self.output_details[0]["index"])[0]

        top_idx = int(np.argmax(output))
        confidence = float(output[top_idx]) * 100

        name = self.labels[top_idx] if top_idx < len(self.labels) else f"Class {top_idx}"
        treatment = self.treatments.get(name, "Consult a local agricultural expert for treatment advice.")

        return {
            "name": name,
            "confidence": round(confidence, 1),
            "treatment": treatment,
        }

    # ── internal ────────────────────────────────────────────────

    def _load_model(self):
        if not os.path.isfile(MODEL_PATH):
            print(f"[classifier] ⚠  No model at {MODEL_PATH} — running in MOCK mode")
            return

        try:
            # Try tflite_runtime first (lightweight, typical on RPi)
            try:
                from tflite_runtime.interpreter import Interpreter
            except ImportError:
                # Fallback to full TensorFlow
                from tensorflow.lite.python.interpreter import Interpreter  # type: ignore

            self.interpreter = Interpreter(model_path=MODEL_PATH)
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            print(f"[classifier] ✔  Model loaded from {MODEL_PATH}")
        except Exception as e:
            print(f"[classifier] ✘  Failed to load model: {e}")
            self.interpreter = None

        # Load labels
        if os.path.isfile(LABELS_PATH):
            with open(LABELS_PATH) as f:
                self.labels = [line.strip() for line in f if line.strip()]
            print(f"[classifier] ✔  {len(self.labels)} labels loaded")

        # Load custom treatments
        if os.path.isfile(TREATMENTS_PATH):
            with open(TREATMENTS_PATH) as f:
                self.treatments.update(json.load(f))

    def _mock_classify(self) -> dict:
        """Return a random mock result when no model is loaded."""
        import random
        pick = random.choice(MOCK_RESULTS)
        return {
            "name": pick["name"],
            "confidence": pick["confidence"],
            "treatment": self.treatments.get(
                pick["name"], "Consult a local agricultural expert."
            ),
        }
