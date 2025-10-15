from flask import Blueprint, current_app, jsonify

bp = Blueprint("dashboard", __name__)


@bp.get("/metrics")
def metrics():
    active_trips = current_app.mongo.bookings.count_documents({"status": {"$in": ["enroute", "at_pickup", "to_hospital"]}})
    drivers_online = current_app.mongo.drivers.count_documents({"online": True})

    return jsonify({
        "activeTrips": int(active_trips),
        "avgEta": 8.5,
        "completionRate": 0.92,
        "driversOnline": int(drivers_online),
    })
