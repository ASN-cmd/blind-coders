from backend.prompts.batch_classification_prompt import BATCH_CLASSIFICATION_PROMPT
from backend.llm.mistral_client import call_llm
from backend.utils.json_extractor import extract_json
from backend.chunking.batch_builder import build_sentence_block
from backend.chunking.sentence_splitter import split_into_sentences
from backend.config.subdomains import ALLOWED_SUBDOMAINS

def batch_classify(policy_text: str):
    sentences = split_into_sentences(policy_text)

    # 🔥 LIMIT BATCH SIZE (very important for speed + stability)
    MAX_SENTENCES_PER_BATCH = 8
    sentences = sentences[:MAX_SENTENCES_PER_BATCH]

    sentence_block = build_sentence_block(sentences)

    prompt = BATCH_CLASSIFICATION_PROMPT.format(
        sentences=sentence_block,
        subdomains="\n".join(ALLOWED_SUBDOMAINS)
    )

    raw_response = call_llm(prompt)

    print("\n==== RAW LLM OUTPUT ====\n")
    print(raw_response)
    print("\n========================\n")

    data = extract_json(raw_response)

    # 🔒 SAFETY: if LLM output is broken, don’t crash
    if not isinstance(data, list):
        print("⚠️ Invalid batch classification output")
        return sentences, []

    # ✅ VALIDATE DOMAINS (THIS IS THE PART YOU ASKED ABOUT)
    VALID_DOMAINS = {
        "Information Security Management System (ISMS)",
        "Data Privacy and Security",
        "Patch Management",
        "Risk Management",
    }

    cleaned = []
    for item in data:
        if item.get("domain") in VALID_DOMAINS:
            cleaned.append(item)
        else:
            print("⚠️ Dropping invalid domain:", item)

    return sentences, cleaned
