from collections import defaultdict

def aggregate_by_domain(sentences, classifications):
    chunks = defaultdict(lambda: {
        "text": [],
        "subdomains": set()
    })

    for item in classifications:
        idx = item["sentence_id"] - 1
        domain = item["domain"]
        subdomain = item["subdomain"]

        chunks[domain]["text"].append(sentences[idx])
        chunks[domain]["subdomains"].add(subdomain)

    final = {}
    for domain, obj in chunks.items():
        final[domain] = {
            "text": " ".join(obj["text"]),
            "subdomains": list(obj["subdomains"])
        }

    return final
