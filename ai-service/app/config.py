import os
try:
    from pydantic_settings import BaseSettings
except ImportError:
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
