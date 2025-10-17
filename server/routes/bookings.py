from datetime import datetime
from flask import Blueprint, current_app, jsonify, request
from bson import ObjectId
from services.routing import compute_route
from services.fare import estimate_fare
from services.dispatch import nearest_online_ambulances

bp = Blueprint("bookings", __name__)


def now_iso():
    return datetime.utcnow().isoformat() + "Z"


def oid_str(o):
    return str(o)


@bp.post("")
def create_booking():
    data = request.get_json() or {}
    pickup = data.get("pickup")
    hospital = data.get("hospital")
    amb_type = data.get("type", "BLS")

    if not pickup or not hospital:
        return jsonify({"error": "pickup and hospital required"}), 400

    route = compute_route(pickup, hospital)
    fare = estimate_fare(route["distance_m"], amb_type)

    booking = {
        "code": f"UYR{ObjectId()}"[-6:],
        "pickup": pickup,
        "hospital": hospital,
        "type": amb_type,
        "status": "REQUESTED",
        "etaMins": max(int(route["duration_s"] / 60), 1),
        "fare": fare,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }

    res = current_app.mongo.bookings.insert_one(booking)
    booking["_id"] = oid_str(res.inserted_id)

    # Offers to nearest 3-5 online ambulances
    ambulances = list(current_app.mongo.ambulances.find())
    nearest = nearest_online_ambulances(ambulances, pickup, 5)

    for a in nearest[:5]:
        offer = {
            "bookingId": booking["_id"],
            "ambulanceId": oid_str(a.get("_id")),
            "status": "sent",
            "expiresAt": int(datetime.utcnow().timestamp()) + 15,
        }
        current_app.mongo.offers.insert_one(offer)

    return jsonify(booking), 201


@bp.get("/<booking_id>")
def get_booking(booking_id):
    b = current_app.mongo.bookings.find_one({"_id": ObjectId(booking_id)})
    if not b:
        return jsonify({"error": "not found"}), 404
    b["_id"] = oid_str(b["_id"])  # type: ignore
    return jsonify(b)


@bp.patch("/<booking_id>/status")
def update_status(booking_id):
    data = request.get_json() or {}
    status = data.get("status")
    if status not in ["accepted", "enroute", "at_pickup", "to_hospital", "completed", "canceled"]:
        return jsonify({"error": "invalid status"}), 400
    current_app.mongo.bookings.update_one({"_id": ObjectId(booking_id)}, {"$set": {"status": status, "updatedAt": now_iso()}})
    return jsonify({"ok": True})


@bp.get("/<booking_id>/track")
def track_booking(booking_id):
    ping = current_app.mongo.pings.find_one({"bookingId": booking_id}, sort=[("ts", -1)])
    if not ping:
        return jsonify({"bookingId": booking_id, "location": None, "etaMins": None})
    return jsonify({
        "bookingId": booking_id,
        "location": ping.get("location"),
        "etaMins": ping.get("etaMins"),
    })
