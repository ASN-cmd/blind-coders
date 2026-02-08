import json
import re
from backend.config.prompts import DOMAIN_INFERENCE_PROMPT
from backend.llm.mistral_client import call_llm


def extract_json(text: str) -> dict | None:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    return json.loads(match.group())


def infer_domain_and_subdomain(policy_text: str) -> dict:
    prompt = DOMAIN_INFERENCE_PROMPT.format(policy_text=policy_text)

    response = call_llm(prompt)

    data = extract_json(response)

    if not data:
        return {
            "domain": "Unknown",
            "subdomain": "Unknown",
            "confidence": 0.0
        }

    return {
        "domain": data.get("domain"),
        "subdomain": data.get("subdomain"),
        "confidence": data.get("confidence", 0.0)
    }
