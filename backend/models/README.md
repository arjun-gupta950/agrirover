# Models Directory

Place your TFLite model and labels here:

- **model.tflite** — Your trained TFLite classification model
- **labels.txt** — One label per line, matching model output classes
- **treatments.json** *(optional)* — A JSON object mapping disease names to treatment strings

## Example labels.txt

```
Tomato Late Blight
Powdery Mildew
Bacterial Leaf Spot
Early Blight
Leaf Curl
Healthy
```

## Example treatments.json

```json
{
  "Tomato Late Blight": "Apply copper-based fungicide...",
  "Healthy": "No treatment needed."
}
```

> If no model is present, the backend runs in **mock mode** and returns
> simulated disease results for development purposes.
