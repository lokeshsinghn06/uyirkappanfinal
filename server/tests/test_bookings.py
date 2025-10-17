import os
import pytest
from app import create_app

@pytest.fixture()
def app():
    os.environ["DEBUG_NO_AUTH"] = "true"
    app = create_app()
    app.config.update({
        "TESTING": True,
    })
    return app

@pytest.fixture()
def client(app):
    return app.test_client()


def test_create_booking_minimum(client, monkeypatch):
    # Stub route computation to be fast/deterministic
    monkeypatch.setenv('OSRM_BASE', 'http://invalid')

    payload = {
        "pickup": {"lat": 13.05, "lng": 80.25},
        "hospital": {"lat": 13.06, "lng": 80.26},
        "type": "BLS",
    }

    r = client.post('/api/bookings', json=payload)
    assert r.status_code == 201
    data = r.get_json()
    assert data['status'] == 'REQUESTED'
    assert 'fare' in data
