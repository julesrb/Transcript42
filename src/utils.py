import json

def log_event(path, message):
    """Append a log message to the specified log file."""
    with open(path, "a", encoding="utf-8") as f:
        f.write(message + "\n")

def save_json(data, path):
    """Save a Python object as JSON to the specified file."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def load_json(path):
    """Load and return a Python object from a JSON file."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f) 