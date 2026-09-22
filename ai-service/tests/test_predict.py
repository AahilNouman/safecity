import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_predict_valid():
    response = client.post("/predict/", json={"text": "A man is stalking me"})
    assert response.status_code == 200
    data = response.json()
    assert "category" in data
    assert "confidence" in data
    assert "is_demo" in data
    assert "severity_suggestion" in data
    assert "all_scores" in data

def test_predict_empty():
    response = client.post("/predict/", json={"text": ""})
    assert response.status_code == 400

def test_categories_valid():
    response = client.post("/predict/", json={"text": "I feel unsafe"})
    assert response.status_code == 200
    valid_categories = ['Harassment', 'Stalking', 'Threat', 'Unsafe Area', 'Poor Lighting', 'Suspicious Activity', 'Other']
    assert response.json()["category"] in valid_categories
