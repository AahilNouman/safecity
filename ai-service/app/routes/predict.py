from fastapi import APIRouter, HTTPException, Request
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
