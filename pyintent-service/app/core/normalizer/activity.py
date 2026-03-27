def normalize_activity(value: str):
    if not value:
        return None

    value = value.lower()

    if any(word in value for word in ["run", "jog"]):
        return "running"

    if any(word in value for word in ["walk", "hike", "stroll"]):
        return "walk"

    if "outdoor" in value:
        return "outdoor"

    return None