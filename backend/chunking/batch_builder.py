def build_sentence_block(sentences: list[str]) -> str:
    lines = []
    for i, sentence in enumerate(sentences, start=1):
        lines.append(f"{i}. {sentence}")
    return "\n".join(lines)
