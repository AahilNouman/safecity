from fastapi import FastAPI
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
