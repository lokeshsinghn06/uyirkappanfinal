from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token

bp = Blueprint("auth", __name__)


@bp.post("/login")
def login():
    data = request.get_json() or {}
    phone = data.get("phone")
    password = data.get("password")

    if current_app.debug_no_auth:
        user = {
            "_id": "u_operator",
            "role": "operator",
            "name": "Operator",
            "phone": phone or "+919999999999",
            "email": "op@example.com",
        }
        token = create_access_token(identity=user["_id"])  # type: ignore
        return jsonify({"token": token, "user": user})

    # TODO: Lookup real user
    if not phone or not password:
        return jsonify({"error": "invalid credentials"}), 401

    user = current_app.mongo.users.find_one({"phone": phone})
    if not user:
        return jsonify({"error": "invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]))
    user["_id"] = str(user["_id"])  # type: ignore
    return jsonify({"token": token, "user": user})
