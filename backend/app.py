"""
AgriDost Backend — Flask server for Raspberry Pi
Provides: live camera streaming, snapshots, and disease classification.
Registers via mDNS so the frontend can discover it by hostname.
"""

import atexit
import signal
import socket
import sys

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

from camera import Camera
from classifier import Classifier

# ── App setup ───────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # Allow requests from the Vite dev server on any origin

camera = Camera(device_index=0)
classifier = Classifier()

# ── mDNS registration ──────────────────────────────────────────
zc = None
info = None


def register_mdns(port: int = 5000):
    """Register the service as _agridost._tcp.local. via Zeroconf."""
    global zc, info
    try:
        from zeroconf import ServiceInfo, Zeroconf

        hostname = socket.gethostname()
        # Get all IPv4 addresses for this machine
        addresses = []
        try:
            for addr_info in socket.getaddrinfo(hostname, None, socket.AF_INET):
                addr = socket.inet_aton(addr_info[4][0])
                if addr not in addresses:
                    addresses.append(addr)
        except Exception:
            addresses = [socket.inet_aton("0.0.0.0")]

        info = ServiceInfo(
            "_agridost._tcp.local.",
            f"AgriDost Backend._agridost._tcp.local.",
            addresses=addresses,
            port=port,
            properties={"path": "/api/", "version": "1.0.0"},
            server=f"{hostname}.local.",
        )
        zc = Zeroconf()
        zc.register_service(info)
        print(f"[mdns]  ✔  Registered as {hostname}.local:{port}")
    except Exception as e:
        print(f"[mdns]  ⚠  mDNS registration failed (non-fatal): {e}")


def unregister_mdns():
    global zc, info
    try:
        if zc and info:
            zc.unregister_service(info)
            zc.close()
    except Exception:
        pass


# ── Routes ──────────────────────────────────────────────────────


@app.route("/api/health")
def health():
    """Health-check endpoint used by the frontend for discovery."""
    return jsonify(
        {
            "status": "ok",
            "camera": camera.is_open,
            "model_loaded": classifier.is_loaded,
            "hostname": socket.gethostname(),
        }
    )


@app.route("/api/stream")
def video_stream():
    """MJPEG live stream — works in any <img> or <video> tag."""
    if not camera.is_open:
        return jsonify({"error": "Camera not available"}), 503
    return Response(
        camera.stream(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


@app.route("/api/snapshot")
def snapshot():
    """Return a single JPEG frame."""
    frame = camera.get_frame()
    if frame is None:
        return jsonify({"error": "No frame available"}), 503
    return Response(frame, mimetype="image/jpeg")


@app.route("/api/detect", methods=["POST"])
def detect():
    """
    Accept an image upload and return classification results.
    Expects multipart/form-data with field name 'image'.
    """
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image_file = request.files["image"]
    image_bytes = image_file.read()

    if len(image_bytes) == 0:
        return jsonify({"error": "Empty image"}), 400

    result = classifier.classify(image_bytes)
    return jsonify(result)


@app.route("/api/detect-frame", methods=["POST"])
def detect_frame():
    """
    Classify the current camera frame (no upload needed).
    Useful for real-time object detection on the live feed.
    """
    frame = camera.get_frame()
    if frame is None:
        return jsonify({"error": "No frame available"}), 503
    result = classifier.classify(frame)
    return jsonify(result)


# ── Main ────────────────────────────────────────────────────────

def shutdown(_sig=None, _frame=None):
    camera.release()
    unregister_mdns()
    sys.exit(0)


if __name__ == "__main__":
    PORT = 5000

    # Initialize camera
    if not camera.initialize():
        print("[app]   ⚠  Running without camera — stream endpoints will return 503")

    # Register mDNS
    register_mdns(PORT)
    atexit.register(unregister_mdns)
    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    print(f"\n🌱 AgriDost Backend running on http://0.0.0.0:{PORT}")
    print(f"   Stream:   http://0.0.0.0:{PORT}/api/stream")
    print(f"   Snapshot: http://0.0.0.0:{PORT}/api/snapshot")
    print(f"   Detect:   POST http://0.0.0.0:{PORT}/api/detect")
    print(f"   Health:   http://0.0.0.0:{PORT}/api/health\n")

    app.run(host="0.0.0.0", port=PORT, threaded=True)
