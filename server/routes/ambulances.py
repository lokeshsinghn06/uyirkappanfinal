from flask import Blueprint, current_app, jsonify, request
from geopy.distance import geodesic

bp = Blueprint("ambulances", __name__)


@bp.get("")
def list_ambulances():
    near = request.args.get("near")
    ambulances = list(current_app.mongo.ambulances.find())

    def serialize(a):
        a["_id"] = str(a["_id"])  # type: ignore
        return a

    if near:
        lat, lng = map(float, near.split(","))
        for a in ambulances:
            aloc = (a.get("location", {}).get("lat"), a.get("location", {}).get("lng"))
            if None not in aloc:
                a["distance_km"] = geodesic((lat, lng), aloc).km
        ambulances.sort(key=lambda x: x.get("distance_km", 1e9))

    return jsonify([serialize(a) for a in ambulances])
