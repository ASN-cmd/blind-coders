DOMAIN_INFERENCE_PROMPT = """
You are a cybersecurity policy classification expert.

Classify the following organizational policy text into ONE of the domains below
and identify the most appropriate subdomain.

Domains:
1. Information Security Management System (ISMS)
2. Data Privacy and Security
3. Patch Management
4. Risk Management

Rules:
- Choose ONLY ONE domain
- Subdomain should be short and specific
- Return STRICT JSON only
- No explanations outside JSON

Policy Text:
\"\"\"
{policy_text}
\"\"\"

Output JSON format:
{{
  "domain": "<domain name>",
  "subdomain": "<subdomain>",
  "confidence": <value between 0 and 1>
}}
"""
