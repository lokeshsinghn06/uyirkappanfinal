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


def test_health_ok(client):
    r = client.get('/api/health')
    assert r.status_code == 200
    assert r.get_json().get('status') == 'ok'
