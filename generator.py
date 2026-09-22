import os
import csv

BASE_DIR = r"C:\Users\AAHIL\.gemini\antigravity\scratch\safecity\ai-service"

FILES = {
    "requirements.txt": """fastapi==0.104.1
uvicorn[standard]==0.24.0
transformers==4.36.0
torch>=2.0.0
scikit-learn==1.3.2
pandas==2.1.4
numpy==1.26.2
pydantic==2.5.2
python-dotenv==1.0.0
requests==2.31.0
pytest==7.4.3
httpx==0.25.2
""",
    "app/__init__.py": "",
    "app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, cluster
from app.config import settings
from app.model.classifier import IncidentClassifier

app = FastAPI(title="SafeCity AI Classification Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier_instance = None

@app.on_event("startup")
async def startup_event():
    global classifier_instance
    classifier_instance = IncidentClassifier(model_path=settings.AI_MODEL_PATH, demo_mode=settings.AI_DEMO_MODE)
    app.state.classifier = classifier_instance

app.include_router(predict.router)
app.include_router(cluster.router)

@app.get("/health")
async def health_check():
    mode = "demo" if settings.AI_DEMO_MODE else "production"
    return {"status": "healthy", "mode": mode}

@app.get("/")
async def root():
    return {
        "service": "SafeCity AI Classification Service",
        "version": "1.0.0",
        "endpoints": ["/health", "/predict", "/cluster"]
    }
""",
    "app/config.py": """import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    AI_DEMO_MODE: bool = True
    AI_MODEL_PATH: str = "app/model/saved"
    CATEGORIES: list = ['Harassment', 'Stalking', 'Threat', 'Unsafe Area', 'Poor Lighting', 'Suspicious Activity', 'Other']
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
""",
    "app/preprocessing/__init__.py": "",
    "app/preprocessing/text_processor.py": """import re

class TextProcessor:
    @staticmethod
    def clean_text(text: str) -> str:
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    @staticmethod
    def normalize(text: str) -> str:
        return TextProcessor.clean_text(text)

    @staticmethod
    def tokenize_for_model(text: str, tokenizer) -> dict:
        return tokenizer(
            text,
            max_length=128,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )
""",
    "app/model/__init__.py": "",
    "app/model/classifier.py": """import os
import logging
from app.preprocessing.text_processor import TextProcessor

logger = logging.getLogger(__name__)

class IncidentClassifier:
    def __init__(self, model_path: str = None, demo_mode: bool = True):
        self.categories = ['Harassment', 'Stalking', 'Threat', 'Unsafe Area', 'Poor Lighting', 'Suspicious Activity', 'Other']
        if demo_mode or not model_path or not os.path.exists(model_path):
            self.demo_mode = True
            logger.warning("Running in DEMO MODE")
            self.model = None
            self.tokenizer = None
        else:
            self.demo_mode = False
            try:
                from transformers import DistilBertForSequenceClassification, DistilBertTokenizer
                self.tokenizer = DistilBertTokenizer.from_pretrained(model_path)
                self.model = DistilBertForSequenceClassification.from_pretrained(model_path)
            except Exception as e:
                logger.error(f"Failed to load model: {e}")
                self.demo_mode = True

    def predict(self, text: str) -> dict:
        if self.demo_mode:
            return self._predict_demo(text)
        else:
            return self._predict_model(text)

    def _predict_demo(self, text: str) -> dict:
        text_lower = text.lower()
        keyword_map = {
            'Stalking': ['follow', 'stalk', 'chase', 'pursue', 'trail', 'watch', 'shadow'],
            'Harassment': ['harass', 'catcall', 'grope', 'touch', 'comment', 'whistle', 'verbal', 'shout', 'abuse', 'molest'],
            'Threat': ['threat', 'kill', 'hurt', 'attack', 'weapon', 'knife', 'gun', 'beat', 'assault', 'danger'],
            'Poor Lighting': ['dark', 'light', 'lamp', 'streetlight', 'dim', 'unlit', 'broken light', 'no light'],
            'Unsafe Area': ['unsafe', 'abandoned', 'isolated', 'empty', 'deserted', 'lonely', 'secluded', 'alley'],
            'Suspicious Activity': ['suspicious', 'loiter', 'strange', 'weird', 'unusual', 'lurk', 'prowl', 'peek']
        }
        
        scores = {cat: 0.0 for cat in self.categories}
        
        words = text_lower.split()
        for cat, keywords in keyword_map.items():
            matches = sum(1 for word in words if any(kw in word for kw in keywords))
            if matches > 0:
                scores[cat] = min(0.5 + (matches * 0.1), 0.95)
                
        best_cat = max(scores, key=scores.get)
        best_score = scores[best_cat]
        
        if best_score == 0.0:
            best_cat = 'Other'
            best_score = 0.3
            scores['Other'] = 0.3
            
        return {
            'category': best_cat,
            'confidence': best_score,
            'is_demo': True,
            'all_scores': scores
        }

    def _predict_model(self, text: str) -> dict:
        import torch
        from torch.nn.functional import softmax
        
        text = TextProcessor.normalize(text)
        inputs = TextProcessor.tokenize_for_model(text, self.tokenizer)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = softmax(outputs.logits, dim=1).squeeze().tolist()
            
        scores = {cat: prob for cat, prob in zip(self.categories, probs)}
        best_cat = max(scores, key=scores.get)
        best_score = scores[best_cat]
        
        return {
            'category': best_cat,
            'confidence': best_score,
            'is_demo': False,
            'all_scores': scores
        }
""",
    "app/routes/__init__.py": "",
    "app/routes/predict.py": """from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

router = APIRouter(prefix="/predict", tags=["prediction"])

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=5, description="The incident description text")

class PredictResponse(BaseModel):
    category: str
    confidence: float
    is_demo: bool
    severity_suggestion: float
    all_scores: dict

@router.post("/", response_model=PredictResponse)
async def predict_incident(request: PredictRequest, req: Request):
    if not request.text or len(request.text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Text must be at least 5 characters long")
        
    classifier = req.app.state.classifier
    try:
        prediction = classifier.predict(request.text)
        
        # Simple severity heuristic based on category
        high_sev = ['Threat', 'Harassment', 'Stalking']
        severity = 0.8 if prediction['category'] in high_sev else 0.4
        
        return PredictResponse(
            category=prediction['category'],
            confidence=prediction['confidence'],
            is_demo=prediction['is_demo'],
            severity_suggestion=severity,
            all_scores=prediction['all_scores']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
""",
    "app/routes/cluster.py": """from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from sklearn.cluster import DBSCAN
from collections import Counter
from app.utils.metrics import calculate_radius

router = APIRouter(prefix="/cluster", tags=["clustering"])

class Point(BaseModel):
    lat: float
    lng: float
    category: str
    severity: float

class ClusterRequest(BaseModel):
    coordinates: List[Point]
    epsilon: float = 0.005
    min_samples: int = 3

class ClusterInfo(BaseModel):
    cluster_id: int
    centroid: Dict[str, float]
    incident_count: int
    primary_category: str
    avg_severity: float
    radius_meters: float
    categories: Dict[str, int]

class ClusterResponse(BaseModel):
    clusters: List[ClusterInfo]
    noise_count: int
    total_processed: int

@router.post("/", response_model=ClusterResponse)
async def create_clusters(request: ClusterRequest):
    if not request.coordinates:
        return ClusterResponse(clusters=[], noise_count=0, total_processed=0)
        
    try:
        coords = np.array([[p.lat, p.lng] for p in request.coordinates])
        coords_rad = np.radians(coords)
        
        # Earth radius in km
        earth_radius = 6371.0
        epsilon_rad = request.epsilon / earth_radius
        
        db = DBSCAN(eps=epsilon_rad, min_samples=request.min_samples, algorithm='ball_tree', metric='haversine')
        labels = db.fit_predict(coords_rad)
        
        clusters = []
        unique_labels = set(labels)
        noise_count = list(labels).count(-1)
        
        for k in unique_labels:
            if k == -1:
                continue
                
            class_member_mask = (labels == k)
            cluster_points = coords[class_member_mask]
            
            centroid_lat = float(np.mean(cluster_points[:, 0]))
            centroid_lng = float(np.mean(cluster_points[:, 1]))
            
            cluster_data = [p for i, p in enumerate(request.coordinates) if labels[i] == k]
            
            categories = [p.category for p in cluster_data]
            cat_counts = dict(Counter(categories))
            primary_category = max(cat_counts, key=cat_counts.get)
            
            avg_severity = float(np.mean([p.severity for p in cluster_data]))
            
            radius = calculate_radius(centroid_lat, centroid_lng, cluster_points)
            
            clusters.append(ClusterInfo(
                cluster_id=int(k),
                centroid={"lat": centroid_lat, "lng": centroid_lng},
                incident_count=len(cluster_data),
                primary_category=primary_category,
                avg_severity=avg_severity,
                radius_meters=radius,
                categories=cat_counts
            ))
            
        return ClusterResponse(
            clusters=clusters,
            noise_count=noise_count,
            total_processed=len(request.coordinates)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
""",
    "app/utils/__init__.py": "",
    "app/utils/metrics.py": """import math
import numpy as np

def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371000  # radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)
    
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
        
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def calculate_radius(center_lat: float, center_lng: float, points: np.ndarray) -> float:
    if len(points) == 0:
        return 0.0
        
    max_dist = 0.0
    for p in points:
        dist = haversine_distance(center_lat, center_lng, p[0], p[1])
        if dist > max_dist:
            max_dist = dist
            
    return max_dist
""",
    "dataset/README.md": "# SafeCity Development Dataset\n\n⚠️ SYNTHETIC DATA FOR DEVELOPMENT/TESTING ONLY\n\nThis data is NOT from real incidents.",
    "dataset/train.csv": """text,category
A man kept following me from the bus stop to my apartment,Stalking
Someone is following my car very closely for miles,Stalking
A strange person has been trailing me since I left the mall,Stalking
I noticed a guy watching me every day when I leave for work,Stalking
There is someone shadowing me in the park,Stalking
A person is pursuing me on my evening walk,Stalking
Someone is stalking me online and threatening to find me,Stalking
A car has been parked outside my house and following me,Stalking
He chased me down the street asking for my number,Stalking
I feel like I'm being watched from the building opposite mine,Stalking
A weird guy trails me to the grocery store,Stalking
He won't stop following me around the campus,Stalking
A group of men were catcalling me and making lewd comments,Harassment
Someone groped me on the crowded train,Harassment
Colleague keeps making inappropriate sexual comments,Harassment
People shouting abusive words at me as I walk by,Harassment
A stranger touched me without my consent,Harassment
They were whistling and harassing me on the street,Harassment
Constant verbal abuse from neighbors,Harassment
A guy tried to molest me in the alleyway,Harassment
Unwanted touching by a passenger on the bus,Harassment
They kept harassing me with unwanted messages,Harassment
He harassed me and my friend at the club,Harassment
Gross comments about my body from a stranger,Harassment
A man pulled a knife on me and demanded my wallet,Threat
Someone threatened to kill me if I didn't comply,Threat
A person with a gun attacked me,Threat
He threatened to hurt my family,Threat
I was beaten up and assaulted by thugs,Threat
They threatened to attack me after school,Threat
A man with a weapon is standing outside,Threat
I received a death threat letter,Threat
He verbally threatened to assault me,Threat
They said they would hurt me if I called the cops,Threat
A dangerous person is threatening people with a bat,Threat
I was assaulted and my life was threatened,Threat
This alley is completely deserted and feels very unsafe,Unsafe Area
The abandoned building has sketchy people inside,Unsafe Area
This isolated road has no one around,Unsafe Area
An empty parking lot that feels very dangerous,Unsafe Area
It's a secluded area where crimes happen,Unsafe Area
This neighborhood is known to be an unsafe area,Unsafe Area
The deserted park at night is scary,Unsafe Area
A very lonely street with no houses around,Unsafe Area
The abandoned warehouse district is unsafe,Unsafe Area
Isolated stretch of highway with no cell service,Unsafe Area
Empty subway station late at night,Unsafe Area
An alleyway known for muggings,Unsafe Area
The streetlights are broken and it's completely dark,Poor Lighting
There is no light in this underground passage,Poor Lighting
The park is dim and unlit at night,Poor Lighting
Broken lamp post makes the street dark,Poor Lighting
The area has very poor lighting and visibility,Poor Lighting
Dark corner near the station,Poor Lighting
Unlit parking garage,Poor Lighting
The path is completely dark with no streetlights,Poor Lighting
Dimly lit staircase in my building,Poor Lighting
No light in the alley,Poor Lighting
Broken street light for weeks,Poor Lighting
It is too dark to walk safely here,Poor Lighting
A suspicious person is loitering near my car,Suspicious Activity
Weird guy lurking outside the school,Suspicious Activity
Someone is prowling around the backyards,Suspicious Activity
A stranger is peeking into people's windows,Suspicious Activity
Unusual activity near the ATM machine,Suspicious Activity
Suspicious men sitting in a van for hours,Suspicious Activity
Strange person taking photos of houses,Suspicious Activity
Someone is loitering outside the jewelry store,Suspicious Activity
A person lurking in the shadows of the alley,Suspicious Activity
Weird behavior by a stranger near the playground,Suspicious Activity
Suspicious activity spotted near the bank,Suspicious Activity
A man prowling around parked cars,Suspicious Activity
My wallet was stolen from my pocket,Other
Loud music playing late at night,Other
A stray dog bit my friend,Other
Car accident at the intersection,Other
Water pipe burst flooding the street,Other
Someone scratched my car with a key,Other
Lost my phone somewhere around here,Other
Garbage dumped illegally on the sidewalk,Other
Two cars crashed into each other,Other
A loud explosion sound was heard,Other
Vandalism on the park benches,Other
Traffic light is broken,Other
""",
    "dataset/validation.csv": """text,category
I am being followed by a stranger,Stalking
Unwanted verbal comments from a group,Harassment
He showed a knife and threatened me,Threat
The street is completely empty and secluded,Unsafe Area
No streetlights working on this road,Poor Lighting
Someone is lurking around the neighborhood,Suspicious Activity
My bicycle was stolen,Other
Someone trailing me closely,Stalking
Groped on the subway,Harassment
Threatened with violence,Threat
Abandoned area with bad vibes,Unsafe Area
Very dark path in the park,Poor Lighting
Suspicious van parked for days,Suspicious Activity
Graffiti on my wall,Other
He kept pursuing me,Stalking
Catcalling on my way home,Harassment
Death threats online,Threat
Lonely road with no people,Unsafe Area
Broken lamp causing darkness,Poor Lighting
Stranger peeking in windows,Suspicious Activity
""",
    "dataset/test.csv": """text,category
A car is shadowing me slowly,Stalking
They touched me inappropriately,Harassment
A guy threatened to beat me up,Threat
Deserted alleyway feels dangerous,Unsafe Area
The parking lot has no lights,Poor Lighting
Weird person loitering by the gate,Suspicious Activity
Loud argument next door,Other
Someone is watching me from afar,Stalking
Abusive language used against me,Harassment
Attacked by a gang,Threat
Isolated path through the woods,Unsafe Area
Dimly lit street is scary,Poor Lighting
Prowler in the backyard,Suspicious Activity
Car broke down,Other
Followed home from the station,Stalking
Harassed by drunk men,Harassment
Gun pointed at me,Threat
Empty industrial estate,Unsafe Area
Pitch black street,Poor Lighting
Suspicious package left here,Suspicious Activity
""",
    "training/__init__.py": "",
    "training/train.py": """import os
import argparse
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, AdamW
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

class IncidentDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

def train(args):
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    
    train_df = pd.read_csv(args.train_data)
    val_df = pd.read_csv(args.val_data)
    
    le = LabelEncoder()
    train_labels = le.fit_transform(train_df['category'].tolist())
    val_labels = le.transform(val_df['category'].tolist())
    
    train_encodings = tokenizer(train_df['text'].tolist(), truncation=True, padding=True, max_length=128)
    val_encodings = tokenizer(val_df['text'].tolist(), truncation=True, padding=True, max_length=128)
    
    train_dataset = IncidentDataset(train_encodings, train_labels)
    val_dataset = IncidentDataset(val_encodings, val_labels)
    
    device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
    model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=len(le.classes_))
    model.to(device)
    
    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size)
    
    optimizer = AdamW(model.parameters(), lr=args.learning_rate)
    
    best_acc = 0.0
    for epoch in range(args.epochs):
        model.train()
        for batch in train_loader:
            optimizer.zero_grad()
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            loss.backward()
            optimizer.step()
            
        model.eval()
        val_preds = []
        val_true = []
        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                labels = batch['labels'].to(device)
                
                outputs = model(input_ids, attention_mask=attention_mask)
                preds = torch.argmax(outputs.logits, dim=1)
                
                val_preds.extend(preds.cpu().numpy())
                val_true.extend(labels.cpu().numpy())
                
        val_acc = accuracy_score(val_true, val_preds)
        print(f"Epoch {epoch+1}/{args.epochs} - Validation Accuracy: {val_acc:.4f}")
        
        if val_acc > best_acc:
            best_acc = val_acc
            model.save_pretrained(args.output_dir)
            tokenizer.save_pretrained(args.output_dir)
            print(f"Saved best model to {args.output_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--train_data', type=str, default='dataset/train.csv')
    parser.add_argument('--val_data', type=str, default='dataset/validation.csv')
    parser.add_argument('--output_dir', type=str, default='app/model/saved')
    parser.add_argument('--epochs', type=int, default=3)
    parser.add_argument('--batch_size', type=int, default=16)
    parser.add_argument('--learning_rate', type=float, default=2e-5)
    args = parser.parse_args()
    train(args)
""",
    "evaluation/__init__.py": "",
    "evaluation/evaluate.py": """import os
import json
import pandas as pd
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix
from app.model.classifier import IncidentClassifier

def evaluate(test_file, model_path, output_file):
    df = pd.read_csv(test_file)
    classifier = IncidentClassifier(model_path=model_path, demo_mode=False)
    
    true_labels = df['category'].tolist()
    pred_labels = []
    
    for text in df['text']:
        res = classifier.predict(text)
        pred_labels.append(res['category'])
        
    acc = accuracy_score(true_labels, pred_labels)
    p, r, f, _ = precision_recall_fscore_support(true_labels, pred_labels, average='macro', zero_division=0)
    
    report = classification_report(true_labels, pred_labels, zero_division=0)
    conf_matrix = confusion_matrix(true_labels, pred_labels).tolist()
    
    print("Classification Report:")
    print(report)
    print("Confusion Matrix:")
    print(conf_matrix)
    
    results = {
        "accuracy": acc,
        "precision_macro": p,
        "recall_macro": r,
        "f1_macro": f,
        "confusion_matrix": conf_matrix
    }
    
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w') as f_out:
        json.dump(results, f_out, indent=4)
        
if __name__ == "__main__":
    evaluate('dataset/test.csv', 'app/model/saved', 'evaluation/results.json')
""",
    "tests/__init__.py": "",
    "tests/test_predict.py": """import pytest
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
""",
    "tests/test_clustering.py": """import pytest
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
""",
    "Dockerfile": """FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
""",
    "app/model/saved/.gitkeep": ""
}

for rel_path, content in FILES.items():
    full_path = os.path.join(BASE_DIR, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Successfully generated {len(FILES)} files in {BASE_DIR}")
