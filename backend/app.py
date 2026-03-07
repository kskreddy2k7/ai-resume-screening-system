"""
AI Resume Screening System – Flask application entry point.
"""
from __future__ import annotations

import os
import logging
from flask import Flask, render_template

from backend.routes.api import api_bp

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
)
logger = logging.getLogger(__name__)


def create_app() -> Flask:
    """Application factory."""
    # backend/app.py lives one level below the repo root
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(backend_dir)

    app = Flask(
        __name__,
        template_folder=os.path.join(root_dir, "frontend", "templates"),
        static_folder=os.path.join(root_dir, "frontend", "static"),
    )

    # Configuration
    app.config["UPLOAD_FOLDER"] = os.path.join(root_dir, "uploads")
    app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024  # 50 MB total request limit
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-in-prod")

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Blueprints
    app.register_blueprint(api_bp)

    # Page routes
    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/results")
    def results():
        return render_template("results.html")

    @app.errorhandler(413)
    def request_entity_too_large(error):
        from flask import jsonify
        return jsonify({"success": False, "error": "File too large (max 50 MB total)."}), 413

    @app.errorhandler(404)
    def not_found(error):
        from flask import jsonify
        return jsonify({"success": False, "error": "Resource not found."}), 404

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    logger.info("Starting AI Resume Screening System on port %d", port)
    app.run(host="0.0.0.0", port=port, debug=False)
