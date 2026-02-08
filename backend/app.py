from flask import Flask
from flask_cors import CORS
from routes.upload_routes import upload_bp
from routes.health_routes import health_bp
import os
def create_app():
    app = Flask(__name__)
    CORS(app)

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "data", "uploads")
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(upload_bp, url_prefix="/api")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
