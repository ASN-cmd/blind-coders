from backend.chunking.batch_classifier import batch_classify
from backend.chunking.domain_aggregator import aggregate_by_domain

policy_text = """
Purpose:
This policy defines how sensitive and personal data should be protected.

Scope:
Applies to all data stored, processed, or transmitted by the organization.

Policy Statement:
Sensitive and personal data must be handled securely and only accessed by authorized personnel.

Employees must ensure that data is not shared with unauthorized individuals.

Data should be stored securely to prevent unauthorized access.

Compliance:
Violations of this policy may lead to disciplinary action.
"""

sentences, classifications = batch_classify(policy_text)
chunks = aggregate_by_domain(sentences, classifications)

print("TOTAL DOMAINS:", len(chunks))
for domain, obj in chunks.items():
    print("\n====", domain, "====")
    print("Subdomains:", obj["subdomains"])
    print("Text:", obj["text"])
