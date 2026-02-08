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

    for domain, content in data.items():
        if isinstance(content, list):
            text = " ".join(item.strip() for item in content if item.strip())
        elif isinstance(content, str):
            text = content.strip()
        else:
            continue

        if text:
            normalized[domain] = text

    return normalized


