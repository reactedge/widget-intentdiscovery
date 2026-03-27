from fastapi import FastAPI
from app.schemas import IntentRequest
from app.services.interpret import interpret_intent
from app.core.cors import setup_cors
from app.access.mount import setup_static

app = FastAPI()
setup_cors(app)
setup_static(app)

@app.post("/v1/intent/interpret")
def interpret(req: IntentRequest):
    return interpret_intent(req)

@app.get("/health")
def health():
    return {"status": "ok"}