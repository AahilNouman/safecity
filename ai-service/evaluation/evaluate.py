import os
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
