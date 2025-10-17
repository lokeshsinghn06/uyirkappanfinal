import os
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/uyirkappan")
JWT_SECRET = os.getenv("JWT_SECRET", "devsecret")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")
SOCKET_CORS_ORIGINS = os.getenv("SOCKET_CORS_ORIGINS", "http://localhost:5173")
DEBUG_NO_AUTH = os.getenv("DEBUG_NO_AUTH", "true").lower() == "true"

client = MongoClient(MONGO_URL)
db = client.get_default_database()

socketio = SocketIO(cors_allowed_origins=SOCKET_CORS_ORIGINS.split(","), async_mode="eventlet")


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = JWT_SECRET
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

    CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS.split(",")}})
    JWTManager(app)
    socketio.init_app(app)

    # Attach db and helpers to app context
    app.mongo = db  # type: ignore
    app.debug_no_auth = DEBUG_NO_AUTH  # type: ignore

    # Health
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # Register blueprints
    from routes.auth import bp as auth_bp
    from routes.ambulances import bp as ambulances_bp
    from routes.hospitals import bp as hospitals_bp
    from routes.bookings import bp as bookings_bp
    from routes.dashboard import bp as dashboard_bp
    from routes.driver import bp as driver_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(ambulances_bp, url_prefix="/api/ambulances")
    app.register_blueprint(hospitals_bp, url_prefix="/api/hospitals")
    app.register_blueprint(bookings_bp, url_prefix="/api/bookings")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(driver_bp, url_prefix="/api/driver")

    # Register sockets
    import sockets.booking as booking_socket  # noqa: F401

    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    socketio.run(app, host="0.0.0.0", port=port)
