from flask import current_app
from flask_jwt_extended import get_jwt_identity


def current_user_id():
    if current_app.debug_no_auth:
        return "demo_user"
    return get_jwt_identity()
