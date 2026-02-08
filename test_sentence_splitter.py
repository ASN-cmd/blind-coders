from backend.chunking.sentence_splitter import split_into_sentences

text = """
Purpose:
To ensure that systems are updated with the latest security patches.

Scope:
This policy applies to all servers and workstations owned by the organization.

Policy Statement:
System updates and patches should be applied when available.

IT teams are responsible for maintaining system updates.

Critical updates should be applied as soon as possible to reduce security risks.

Compliance:
Failure to follow this policy may result in security vulnerabilities.
"""

sentences = split_into_sentences(text)

print("TOTAL SENTENCES:", len(sentences))
for i, s in enumerate(sentences, 1):
    print(i, s)
