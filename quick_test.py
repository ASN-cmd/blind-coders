from backend.domain.domain_inference import infer_domain_and_subdomain

policy_text = """
The organization shall implement appropriate security controls
to protect information assets from unauthorized access.
"""

result = infer_domain_and_subdomain(policy_text)
print(result)
