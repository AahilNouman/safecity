import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.utils.metrics import haversine_distance
import numpy as np

client = TestClient(app)

def test_cluster_valid():
    points = [
        {"lat": 12.971, "lng": 77.571, "category": "Harassment", "severity": 0.6},
        {"lat": 12.972, "lng": 77.572, "category": "Harassment", "severity": 0.7},
        {"lat": 12.973, "lng": 77.573, "category": "Stalking", "severity": 0.8}
    ]
    response = client.post("/cluster/", json={"coordinates": points, "epsilon": 0.05, "min_samples": 2})
    assert response.status_code == 200
    data = response.json()
    assert "clusters" in data
    assert "noise_count" in data
    assert "total_processed" in data
    assert data["total_processed"] == 3

def test_cluster_empty():
    response = client.post("/cluster/", json={"coordinates": []})
    assert response.status_code == 200
    assert response.json()["total_processed"] == 0

def test_haversine():
    dist = haversine_distance(12.97, 77.57, 12.98, 77.58)
    assert dist > 0
