import json

def save_json(data, path):
    """Save a Python object as JSON to the specified file."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def load_json(path):
    """Load and return a Python object from a JSON file."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f) 