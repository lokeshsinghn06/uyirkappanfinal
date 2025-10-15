from flask import Blueprint, current_app, jsonify, request

bp = Blueprint("hospitals", __name__)


@bp.get("")
def list_hospitals():
    near = request.args.get("near")
    needs = request.args.get("needs")

    hospitals = list(current_app.mongo.hospitals.find())

    def serialize(h):
        h["_id"] = str(h["_id"])  # type: ignore
        return h

    if needs:
        needs_set = set([n.strip() for n in needs.split(",") if n.strip()])
        hospitals = [h for h in hospitals if needs_set.intersection(set(h.get("capabilities", [])))]

    return jsonify([serialize(h) for h in hospitals])
