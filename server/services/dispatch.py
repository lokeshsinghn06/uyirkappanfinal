from typing import List
from geopy.distance import geodesic


def nearest_online_ambulances(ambulances: List[dict], pickup: dict, k: int = 5) -> List[dict]:
    online = [a for a in ambulances if a.get("status") in ("idle", "ONLINE") and a.get("location")]
    for a in online:
        loc = a["location"]
        a["distance_km"] = geodesic((pickup["lat"], pickup["lng"]), (loc["lat"], loc["lng"]))
    online.sort(key=lambda x: x["distance_km"])
    return online[:k]
