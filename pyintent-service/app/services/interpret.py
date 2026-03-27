from app.core.prompt_loader import load_prompt
from app.core.normalizer import normalize
from app.core.confidence import compute_confidence
from app.services.cache import call_model_with_cache

def interpret_intent(req, prompt_override=None):

    prompt = prompt_override or load_prompt()
    intent = req.intent

    if not prompt:
        return {
            "signals": {},
            "confidence": 0.0
        }

    try:
        raw = call_model_with_cache(prompt, intent)
    except Exception:
        print("[ERR] Failed to call openAI model:")
        raw = {}

    signals = normalize(raw)
    confidence = compute_confidence(signals, intent)

    result = {
        "signals": signals,
        "confidence": confidence
    }

    print({
      "intent": intent,
      "raw": raw,
      "signals": signals,
      "confidence": confidence
    })

    return result