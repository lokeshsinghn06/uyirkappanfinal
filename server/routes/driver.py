from flask import Blueprint, current_app, jsonify, request
from bson import ObjectId

bp = Blueprint("driver", __name__)


@bp.get("/me")
def me():
    if current_app.debug_no_auth:
        return jsonify({
            "_id": "driver_demo",
            "name": "Kumar Venkatesh",
            "phone": "+91 98765 43210",
            "rating": 4.7,
            "online": False,
            "currentAmbulanceId": None,
        })
    # Real lookup would use JWT identity
    return jsonify({"error": "not implemented"}), 501


@bp.patch("/online")
def online():
    data = request.get_json() or {}
    online = bool(data.get("online"))
    # Demo: just echo
    return jsonify({"online": online})


@bp.get("/offers")
def offers():
    offers = list(current_app.mongo.offers.find({"status": "sent"}))
    for o in offers:
        o["_id"] = str(o["_id"])  # type: ignore
    return jsonify(offers)


@bp.post("/offers/<offer_id>/accept")
def accept_offer(offer_id):
    offer = current_app.mongo.offers.find_one({"_id": ObjectId(offer_id)})
    if not offer:
        return jsonify({"error": "offer not found"}), 404

    # First-accept-wins
    booking_id = offer.get("bookingId")
    already = current_app.mongo.offers.find_one({"bookingId": booking_id, "status": "accepted"})
    if already:
        current_app.mongo.offers.update_one({"_id": ObjectId(offer_id)}, {"$set": {"status": "expired"}})
        return jsonify({"status": "expired"}), 409

    current_app.mongo.offers.update_one({"_id": ObjectId(offer_id)}, {"$set": {"status": "accepted"}})
    current_app.mongo.offers.update_many({"bookingId": booking_id, "_id": {"$ne": ObjectId(offer_id)}}, {"$set": {"status": "expired"}})
    current_app.mongo.bookings.update_one({"_id": ObjectId(booking_id)}, {"$set": {"status": "accepted"}})
    return jsonify({"status": "accepted"})


@bp.post("/offers/<offer_id>/reject")
def reject_offer(offer_id):
    res = current_app.mongo.offers.update_one({"_id": ObjectId(offer_id)}, {"$set": {"status": "rejected"}})
    if not res.matched_count:
        return jsonify({"error": "offer not found"}), 404
    return jsonify({"status": "rejected"})
