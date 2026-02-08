from backend.ocr.pdf_loader import extract_text_from_pdf
from backend.ocr.text_cleaner import clean_text
from backend.chunking.domain_chunker import chunk_by_domain

pdf_path = "policies/policy1.pdf" 

raw_text = extract_text_from_pdf(pdf_path)
cleaned_text = clean_text(raw_text)

chunks = chunk_by_domain(cleaned_text)

print("TOTAL DOMAIN CHUNKS:", len(chunks))
for domain, obj in chunks.items():
    print("\n====", domain, "====")

    print("\nSubdomains:")
    for sd in obj.get("subdomains", []):
        print("-", sd)

    print("\nText:")
    print(obj["text"][:800])  # now slicing the STRING

