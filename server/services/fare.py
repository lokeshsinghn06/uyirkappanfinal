def estimate_fare(distance_m: int, amb_type: str) -> int:
    base = 200
    per_km = 25
    km = max(distance_m / 1000.0, 1.0)
    mult = {"BLS": 1.0, "ALS": 1.3, "NEO": 1.5}.get(amb_type, 1.0)
    return int(base + per_km * km * mult)
