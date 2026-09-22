import os
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
