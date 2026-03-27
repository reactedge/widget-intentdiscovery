from pydantic import BaseModel
from typing import Optional

class IntentRequest(BaseModel):
    intent: str
    context: Optional[dict] = None