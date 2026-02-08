DOMAIN_INFERENCE_PROMPT = """
You are a cybersecurity policy classification expert.

Classify the following organizational policy text into ONE of the domains below
and identify the most appropriate subdomain.

Domains:
1. Information Security Management System (ISMS)
2. Data Privacy and Security
3. Patch Management
4. Risk Management

Allowed Subdomains (choose one or more from this list):
- Acceptable Use Of Information Technology Resources Policy
- Access Control Policy
- Account Management Access Control
- Auditing And Accountability Policy
- Authentication Tokens
- Computer Security Threat Response Policy
- Configuration Management Policy
- Contingency Planning Policy
- Cyber Incident Response
- Encryption
- Identification And Authentication Policy
- Incident Response Policy
- Information Classification
- Information Security Policy
- Information Security Risk Management
- Maintenance Policy
- Media Protection Policy
- Mobile Device Security
- Patch Management
- Personnel Security Policy
- Physical And Environmental Protection Policy
- Planning Policy
- Remote Access
- Risk Assessment Policy
- Sanitization Secure Disposal
- Secure Configuration
- Secure System Development Life Cycle
- Security Assessment And Authorization Policy
- Security Awareness And Training Policy
- Security Logging
- System And Communications Protection Policy
- System And Information Integrity Policy
- System And Services Acquisition Policy
- Vulnerability Scanning

Rules:
- Choose ONLY ONE domain
- Choose ONLY ONE subdomain from the allowed list above
- Subdomain must exactly match the provided wording
- Confidence must be a float between 0 and 1
- Return STRICT JSON only
- No explanations, notes, or extra text outside JSON

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
