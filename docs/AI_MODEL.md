# SafeCity — AI Model Documentation

## Architecture

```
Input Text
    ↓
TextProcessor.clean_text()  →  lowercase, remove special chars, normalize whitespace
    ↓
Tokenizer (HuggingFace)    →  input_ids + attention_mask, max_length=128
    ↓
DistilBERT Base             →  768-dim contextual embeddings
    ↓
Classification Head         →  Linear(768 → 7) + Softmax
    ↓
Output: {category, confidence, all_scores}
```

## Categories (7-class classification)

| ID | Category | Base Severity |
|:---|:---|:---|
| 0 | Harassment | 0.65 |
| 1 | Stalking | 0.75 |
| 2 | Threat | 0.85 |
| 3 | Unsafe Area | 0.55 |
| 4 | Poor Lighting | 0.40 |
| 5 | Suspicious Activity | 0.60 |
| 6 | Other | 0.50 |

## Operating Modes

### Demo Mode (Default)
- **Mechanism**: Keyword-based matching
- **Purpose**: Development and testing without GPU/model download
- **Labels**: All predictions marked `is_demo: true`
- **Accuracy**: Not measured — NOT representative of real AI performance

Keyword map example:
- "follow", "stalk", "chase" → Stalking
- "harass", "catcall", "grope" → Harassment
- "dark", "lamp", "unlit" → Poor Lighting

### Production Mode
- **Model**: DistilBERT (distilbert-base-uncased) fine-tuned on incident data
- **Inference**: PyTorch, ~50ms per prediction on CPU
- **Training**: AdamW optimizer, lr=2e-5, 3 epochs, batch_size=16

## Training

```bash
cd ai-service
python training/train.py \
  --data_dir dataset \
  --output_dir app/model/saved \
  --epochs 3 \
  --batch_size 16 \
  --learning_rate 2e-5
```

### Dataset Format (CSV)
```csv
text,category
"A man followed me while walking home",Stalking
"Someone shouted inappropriate comments",Harassment
```

### Dataset Split
- `dataset/train.csv` — 80 samples (development)
- `dataset/validation.csv` — 20 samples
- `dataset/test.csv` — 20 samples

⚠️ All datasets are synthetic. Real-world training requires actual incident data.

## Evaluation

```bash
python evaluation/evaluate.py
```

Outputs:
- Accuracy, Precision, Recall, F1-score (macro + per-class)
- Confusion matrix
- Results saved to `evaluation/results.json`

## Severity Scoring

Rule-based severity calculation (backend service):

```
severity = base_severity[category]

if ai_confidence > 0.7:
    severity *= (1 + (ai_confidence - 0.7))

if nearby_incidents > 5 within 500m:
    severity += 0.1

severity = clamp(severity, 0.0, 1.0)

severity_level:
  < 0.4  → LOW
  0.4–0.7 → MEDIUM
  > 0.7  → HIGH
```

## DBSCAN Clustering

- **Algorithm**: DBSCAN (scikit-learn)
- **Metric**: Haversine distance on lat/lng coordinates
- **Default params**: epsilon=0.005 (~500m), min_samples=3
- **Input**: Verified incident coordinates
- **Output**: Cluster centroids, sizes, categories, severity averages, radius

## Limitations

1. Demo mode accuracy is NOT representative of trained model performance
2. Small synthetic dataset — real deployment needs thousands of labeled samples
3. DistilBERT is English-only — multilingual support needs mBERT or XLM-R
4. Classification is assistive — admin verification is required
5. Severity scoring is rule-based — could be improved with learned models
