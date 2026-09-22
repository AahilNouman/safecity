import re

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
