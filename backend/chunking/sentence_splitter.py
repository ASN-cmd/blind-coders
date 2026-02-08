import re

def split_into_sentences(text: str) -> list[str]:
    """
    Splits policy text into sentences / bullet points deterministically.
    No LLM involved.
    """

    sentences = []

    # Normalize bullets
    text = text.replace("•", "-")
    
    # Split by newlines first
    lines = re.split(r"\n+", text)

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Handle bullet points
        if line.startswith("-"):
            bullet = line.lstrip("-").strip()
            if bullet:
                sentences.append(bullet)
            continue

        # Split normal sentences
        parts = re.split(r"(?<=[.!?])\s+", line)
        for part in parts:
            part = part.strip()
            if part:
                sentences.append(part)

    return sentences
