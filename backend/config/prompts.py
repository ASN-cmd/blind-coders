

DOMAIN_CHUNKING_PROMPT = """
You are a cybersecurity policy analysis system.

Read the organizational policy text below and group the content
into the following FOUR domains:

1. Information Security Management System (ISMS)
2. Data Privacy and Security
3. Patch Management
4. Risk Management

Instructions:
- Assign each sentence or paragraph to the most relevant domain
- Combine all related content under the same domain
- Ensure that ALL policy text is assigned to exactly ONE domain
- Do not invent content
- If a domain is not mentioned, leave it empty
- Do not explain your reasoning

Allowed Subdomains (use exact wording):
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

Policy Text:
{policy_text}

At the end, return the result as JSON in the following format:
{{
  "ISMS": {{
    "text": [],
    "subdomains": []
  }},
  "Data Privacy and Security": {{
    "text": [],
    "subdomains": []
  }},
  "Patch Management": {{
    "text": [],
    "subdomains": []
  }},
  "Risk Management": {{
    "text": [],
    "subdomains": []
  }}
}}
"""


GAP_ANALYSIS_PROMPT = """
You are a cybersecurity compliance expert specializing in NIST framework alignment.

Domain: {domain}
Subdomain: {subdomain}

Organization Policy:
\"\"\"
{organization_policy}
\"\"\"

Relevant NIST Policy Extracts:
\"\"\"
{nist_chunks}
\"\"\"

Tasks:
1. Identify gaps where the organization policy does not meet NIST requirements.
2. List each gap clearly and reference the relevant NIST control or principle.
3. Provide revised policy statements to close each identified gap.
4. Create a clear implementation roadmap with short-term, mid-term, and long-term actions.

Output Format:
Return a JSON object with the following structure:
{{
  "domain": "{domain}",
  "subdomain": "{subdomain}",
  "gap_analysis": [
    {{
      "gap_id": "GAP-001",
      "description": "Brief description of the gap",
      "nist_reference": "Reference to NIST control or principle",
      "severity": "High/Medium/Low",
      "impact": "Description of impact if not addressed"
    }}
  ],
  "revised_policy": {{
    "introduction": "Revised policy introduction",
    "statements": [
      "Policy statement 1",
      "Policy statement 2"
    ],
    "compliance_notes": "Notes on how this addresses NIST requirements"
  }},
  "implementation_roadmap": {{
    "short_term": [
      {{
        "action": "Action description",
        "timeline": "0-3 months",
        "priority": "Critical/High/Medium/Low",
        "resources": "Required resources"
      }}
    ],
    "mid_term": [
      {{
        "action": "Action description",
        "timeline": "3-6 months",
        "priority": "Critical/High/Medium/Low",
        "resources": "Required resources"
      }}
    ],
    "long_term": [
      {{
        "action": "Action description",
        "timeline": "6-12 months",
        "priority": "Critical/High/Medium/Low",
        "resources": "Required resources"
      }}
    ]
  }}
}}

Be specific, actionable, and reference exact NIST controls where applicable.
Give answer in 15 lines or less.
"""

