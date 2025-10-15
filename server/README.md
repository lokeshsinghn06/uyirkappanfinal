Uyirkappan Backend (Flask + MongoDB + SocketIO)

Quick start (Docker)
- docker compose up -d
- docker compose exec server make seed

Quick start (Local)
- cd server
- python -m venv .venv && source .venv/bin/activate  # Windows: . .venv/Scripts/activate
- pip install -r requirements.txt
- cp .env.example .env && python app.py

Environment
- MONGO_URL: mongodb://mongo:27017/uyirkappan
- JWT_SECRET: devsecret
- CORS_ORIGINS: http://localhost:5173
- SOCKET_CORS_ORIGINS: http://localhost:5173
- OSRM_BASE: https://router.project-osrm.org
- DEBUG_NO_AUTH: true (bypass auth for demo)

Endpoints (/api)
- POST   /api/auth/login -> { token, user }
- GET    /api/ambulances?near=lat,lng
- GET    /api/hospitals?near=lat,lng&needs=ICU,NEO
- POST   /api/bookings -> create booking + offers
- GET    /api/bookings/:id
- PATCH  /api/bookings/:id/status
- GET    /api/bookings/:id/track
- GET    /api/dashboard/metrics

Driver portal
- GET    /api/driver/me
- PATCH  /api/driver/online {online}
- GET    /api/driver/offers
- POST   /api/driver/offers/:id/accept
- POST   /api/driver/offers/:id/reject

Socket events
client -> server
- join_booking { bookingId }
- driver_location { bookingId, location }
- booking_status { bookingId, status }

server -> client (room bookingId)
- offer_created { offer }
- status_changed { status, ts }
- location_update { lat, lng, ts }
- eta_update { mins }
