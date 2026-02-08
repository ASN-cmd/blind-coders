import json
import re
from backend.config.prompts import DOMAIN_CHUNKING_PROMPT
from backend.llm.mistral_client import call_llm


def extract_json(text: str):
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    return json.loads(match.group())


def chunk_by_domain(policy_text: str) -> dict:
    prompt = DOMAIN_CHUNKING_PROMPT.format(policy_text=policy_text)
    response = call_llm(prompt)

    # 1️⃣ KEEP RAW OUTPUT (for teammates / audit)
    with open("logs/domain_chunking_raw.log", "a", encoding="utf-8") as f:
        f.write("\n==== RAW LLM OUTPUT ====\n")
        f.write(response)
        f.write("\n=======================\n")

    # 2️⃣ PARSE JSON
    data = extract_json(response)
    if not data:
        return {}

    # 3️⃣ NORMALIZE (this is what pipeline uses)
    normalized = {}

    for domain, obj in data.items():
        if not obj:
            continue

        text_items = obj.get("text", [])
        subdomains = obj.get("subdomains", [])

        text = " ".join(t.strip() for t in text_items if t.strip())

        if text:
            normalized[domain] = {
                "text": text,
                "subdomains": subdomains
            }

    return normalized


