from backend.domain.domain_inference import infer_domain_and_subdomain

policy_text = """
Purpose:
The purpose of this policy is to establish a framework for managing information security within the organization.

Scope:
This policy applies to all employees, contractors, and systems that handle organizational information.

Objectives:
- Protect organizational information assets
- Reduce security risks
- Ensure business continuity

Policy Statement:
The organization shall implement appropriate security controls to protect information assets from unauthorized access, disclosure, alteration, or destruction.

Information security controls shall be reviewed periodically to ensure effectiveness.

Compliance:
All employees are expected to comply with this policy. Non-compliance may result in disciplinary action.

"""

result = infer_domain_and_subdomain(policy_text)
print(result)
