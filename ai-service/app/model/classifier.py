import os
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
