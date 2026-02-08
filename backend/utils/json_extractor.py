import json
import re

def extract_json(text: str):
    """
    Extracts the first valid JSON object or array from LLM output.
    Works even if extra text or code fences are present.
    """

    if not text:
        return None

    # Remove markdown code fences if present
    text = re.sub(r"```(json)?", "", text, flags=re.IGNORECASE).strip()

    # Try direct JSON parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to extract JSON array
    match = re.search(r"(\[\s*{.*?}\s*\])", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Try to extract JSON object
    match = re.search(r"(\{\s*.*?\s*\})", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    return None
