#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# AgriDost Backend — start script
# ──────────────────────────────────────────────────────────────
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🌱 AgriDost Backend Launcher"
echo "──────────────────────────────"

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install deps
echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

# Start server
echo ""
python app.py
