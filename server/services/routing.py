import os
import requests
from geopy.distance import geodesic

OSRM_BASE = os.getenv("OSRM_BASE", "https://router.project-osrm.org")


def compute_route(pickup: dict, hospital: dict):
    try:
        url = f"{OSRM_BASE}/route/v1/driving/{pickup['lng']},{pickup['lat']};{hospital['lng']},{hospital['lat']}?overview=full&geometries=polyline"
        r = requests.get(url, timeout=5)
        r.raise_for_status()
        data = r.json()
        if data.get("routes"):
            route = data["routes"][0]
            return {
                "distance_m": int(route["distance"]),
                "duration_s": int(route["duration"]),
                "polyline": route.get("geometry"),
            }
    except Exception:
        pass

    # Fallback using geodesic distance and 30 km/h
    dist_km = geodesic((pickup["lat"], pickup["lng"]), (hospital["lat"], hospital["lng"]))
    distance_m = int(dist_km.km * 1000)
    duration_s = int((dist_km.km / 30.0) * 3600)
    return {"distance_m": distance_m, "duration_s": duration_s, "polyline": None}
