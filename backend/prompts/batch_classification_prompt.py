BATCH_CLASSIFICATION_PROMPT = """
You are a cybersecurity policy classification system.

For EACH sentence below:
- Assign ONE domain
- Assign ONE subdomain
- Do NOT omit any sentence
- Do NOT merge sentences

Domains (choose ONLY ONE of these, exact match):
- Information Security Management System (ISMS)
- Data Privacy and Security
- Patch Management
- Risk Management

IMPORTANT:
- Domain must be EXACTLY one of the four above
- Subdomain must be chosen from the allowed list
- NEVER use a subdomain as a domain

Allowed Subdomains (use exact wording):
{subdomains}

Sentences:
{sentences}

Return JSON ONLY in the following format:
[
  {{
    "sentence_id": 1,
    "domain": "<domain>",
    "subdomain": "<subdomain>"
  }}
]
"""
