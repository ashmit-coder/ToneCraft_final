from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    AWS_AK: str
    AWS_SAK: str
    
    class Config:
        env_file = '.env'
