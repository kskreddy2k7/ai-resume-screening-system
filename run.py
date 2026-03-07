#!/usr/bin/env python3
"""
Root-level entry point.
Run:  python run.py
      or
      flask --app run run
"""
import sys
import os

# Make sure the repo root is on the path so ``backend`` package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app import app  # noqa: E402

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
