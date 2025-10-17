import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/uyirkappan")
client = MongoClient(MONGO_URL)
db = client.get_default_database()


def run():
    db.users.delete_many({})
    db.drivers.delete_many({})
    db.ambulances.delete_many({})
    db.hospitals.delete_many({})
    db.bookings.delete_many({})
    db.offers.delete_many({})
    db.pings.delete_many({})

    # Users
    db.users.insert_many([
        {"_id": "u_operator", "role": "operator", "name": "Operator", "phone": "+919000000001"},
        {"_id": "u_partner", "role": "partner", "name": "Partner", "phone": "+919000000002"},
    ])

    # Drivers & ambulances around Chennai
    drivers = []
    ambulances = []
    centers = [
        (13.0827, 80.2707),  # Chennai
        (13.05, 80.25),
        (13.09, 80.29),
        (13.07, 80.24),
        (13.1, 80.28),
        (13.06, 80.26),
    ]
    types = ["BLS", "ALS", "NEO"]

    for i in range(6):
        d = {"_id": f"d{i+1}", "userId": None, "rating": 4.2 + i * 0.1, "online": i % 2 == 0}
        a = {
            "plateNo": f"TN{i+1:02d}AB{i*3+1234}",
            "type": types[i % 3],
            "status": "idle" if d["online"] else "offline",
            "driverId": d["_id"],
            "location": {"lat": centers[i][0] + (i - 2) * 0.01, "lng": centers[i][1] + (i - 2) * 0.01},
        }
        drivers.append(d)
        ambulances.append(a)

    db.drivers.insert_many(drivers)
    db.ambulances.insert_many(ambulances)

    # Hospitals
    hospitals = [
        {"name": "Apollo Hospital", "capabilities": ["ICU", "NEO", "TRAUMA"], "location": {"lat": 13.0475, "lng": 80.2565}},
        {"name": "Fortis Malar Hospital", "capabilities": ["ICU", "CARDIO"], "location": {"lat": 13.0569, "lng": 80.2481}},
        {"name": "MIOT International", "capabilities": ["TRAUMA", "NEO"], "location": {"lat": 13.0332, "lng": 80.2358}},
        {"name": "Stanley Medical College", "capabilities": ["TRAUMA", "ICU"], "location": {"lat": 13.0978, "lng": 80.2860}},
        {"name": "Government Royapettah", "capabilities": ["ICU", "TRAUMA"], "location": {"lat": 13.0589, "lng": 80.2691}},
        {"name": "Kauvery Hospital", "capabilities": ["ICU"], "location": {"lat": 13.0442, "lng": 80.2525}},
        {"name": "SRM Hospital", "capabilities": ["TRAUMA"], "location": {"lat": 12.8230, "lng": 80.0459}},
        {"name": "Global Hospitals", "capabilities": ["ICU", "NEO"], "location": {"lat": 13.0108, "lng": 80.2182}},
    ]
    db.hospitals.insert_many(hospitals)

    print("Seeded database with demo data.")


if __name__ == "__main__":
    run()
