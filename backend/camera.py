"""
Camera module — thread-safe singleton wrapping OpenCV VideoCapture.
Supports USB webcams (and any V4L2 device).
"""

import threading
import time
import cv2


class Camera:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, device_index: int = 0):
        with cls._lock:
            if cls._instance is None:
                obj = super().__new__(cls)
                obj._cap = None
                obj._device_index = device_index
                obj._frame = None
                obj._last_access = time.time()
                obj._thread = None
                obj._running = False
                cls._instance = obj
            return cls._instance

    # ── public API ──────────────────────────────────────────────

    def initialize(self):
        """Open the camera and start the background capture thread."""
        if self._cap is not None and self._cap.isOpened():
            return True
        self._cap = cv2.VideoCapture(self._device_index)
        if not self._cap.isOpened():
            print(f"[camera] ⚠  Could not open /dev/video{self._device_index}")
            return False
        # Sensible defaults
        self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        self._cap.set(cv2.CAP_PROP_FPS, 15)
        self._running = True
        self._thread = threading.Thread(target=self._capture_loop, daemon=True)
        self._thread.start()
        print("[camera] ✔  Camera initialized (USB webcam)")
        return True

    def get_frame(self) -> bytes | None:
        """Return the latest JPEG-encoded frame, or None."""
        self._last_access = time.time()
        if self._frame is None:
            return None
        return self._frame

    def stream(self):
        """Yield MJPEG multipart frames for streaming."""
        while self._running:
            frame = self.get_frame()
            if frame is None:
                time.sleep(0.05)
                continue
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
            )
            time.sleep(0.066)  # ~15 fps

    @property
    def is_open(self) -> bool:
        return self._cap is not None and self._cap.isOpened()

    def release(self):
        self._running = False
        if self._cap:
            self._cap.release()
        self._cap = None
        self._frame = None

    # ── internal ────────────────────────────────────────────────

    def _capture_loop(self):
        """Background thread: continuously grabs frames."""
        while self._running:
            if self._cap is None or not self._cap.isOpened():
                time.sleep(0.1)
                continue
            ok, raw = self._cap.read()
            if not ok:
                time.sleep(0.05)
                continue
            _, buf = cv2.imencode(".jpg", raw, [cv2.IMWRITE_JPEG_QUALITY, 80])
            self._frame = buf.tobytes()
