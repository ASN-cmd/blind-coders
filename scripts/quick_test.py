import sys
import os
from pathlib import Path
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.domain.domain_inference import infer_domain_and_subdomain
from chromadb import PersistentClient
from backend.embeddings.embedding_model import load_embedding_model

# -------- Paths --------
BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "backend" / "db" / "chroma"
OUTPUT_DIR = BASE_DIR / "backend" / "output"
COLLECTION_NAME = "nist_controls"

# -------- Sample Policy Text --------
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


def fetch_related_records(subdomain: str, domain: str = None, top_k: int = 10):
    """
    Fetch related records from ChromaDB based on the inferred subdomain.
    Uses metadata filtering to find exact subdomain matches.
    """
    print(f"\n🔄 Connecting to ChromaDB...")
    client = PersistentClient(path=str(DB_PATH))
    collection = client.get_collection(name=COLLECTION_NAME)
    
    # Query by subdomain metadata filter
    print(f"🔍 Searching for records with subdomain: '{subdomain}'...")
    
    results = collection.get(
        where={"subdomain": subdomain},
        include=["documents", "metadatas", "embeddings"]
    )
    
    return results


def fetch_similar_records(policy_text: str, subdomain: str = None, top_k: int = 10):
    """
    Fetch similar records from ChromaDB using semantic search.
    Optionally filter by subdomain.
    """
    print(f"\n🔄 Loading embedding model...")
    embedder = load_embedding_model()
    
    print(f"🔄 Connecting to ChromaDB...")
    client = PersistentClient(path=str(DB_PATH))
    collection = client.get_collection(name=COLLECTION_NAME)
    
    # Create embedding for the input policy text
    print(f"🔄 Creating embedding for input policy...")
    query_embedding = embedder.encode(policy_text).tolist()
    
    # Build query
    query_params = {
        "query_embeddings": [query_embedding],
        "n_results": top_k,
        "include": ["documents", "metadatas", "distances"]
    }
    
    # Optionally filter by subdomain
    if subdomain:
        query_params["where"] = {"subdomain": subdomain}
        print(f"🔍 Searching for top {top_k} similar records in subdomain: '{subdomain}'...")
    else:
        print(f"🔍 Searching for top {top_k} similar records across all subdomains...")
    
    results = collection.query(**query_params)
    
    return results


def save_results_to_file(inference_result: dict, related_records: dict, similar_records: dict, policy_text: str):
    """Save the inference result and related records to a text file."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = OUTPUT_DIR / f"policy_analysis_{timestamp}.txt"
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("POLICY ANALYSIS REPORT\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 80 + "\n\n")
        
        # Input Policy
        f.write("-" * 80 + "\n")
        f.write("INPUT POLICY TEXT\n")
        f.write("-" * 80 + "\n")
        f.write(policy_text.strip() + "\n\n")
        
        # Inference Result
        f.write("-" * 80 + "\n")
        f.write("DOMAIN INFERENCE RESULT\n")
        f.write("-" * 80 + "\n")
        f.write(f"Domain: {inference_result.get('domain', 'N/A')}\n")
        f.write(f"Subdomain: {inference_result.get('subdomain', 'N/A')}\n")
        f.write(f"Confidence: {inference_result.get('confidence', 'N/A')}\n\n")
        
        # Related Records by Subdomain
        f.write("=" * 80 + "\n")
        f.write(f"RELATED RECORDS (Matching Subdomain: {inference_result.get('subdomain', 'N/A')})\n")
        f.write("=" * 80 + "\n\n")
        
        ids = related_records.get("ids", [])
        documents = related_records.get("documents", [])
        metadatas = related_records.get("metadatas", [])
        
        if ids:
            f.write(f"Found {len(ids)} matching records:\n\n")
            for i, (doc_id, doc, meta) in enumerate(zip(ids, documents, metadatas)):
                f.write(f"--- Record #{i+1} ---\n")
                f.write(f"ID: {doc_id}\n")
                f.write(f"Domain: {meta.get('domain', 'N/A')}\n")
                f.write(f"Subdomain: {meta.get('subdomain', 'N/A')}\n")
                f.write(f"Source: {meta.get('source_file', 'N/A')}\n")
                f.write(f"Text:\n{doc}\n\n")
        else:
            f.write("No exact subdomain matches found.\n\n")
        
        # Semantically Similar Records
        f.write("=" * 80 + "\n")
        f.write("SEMANTICALLY SIMILAR RECORDS (Top matches by embedding similarity)\n")
        f.write("=" * 80 + "\n\n")
        
        sim_ids = similar_records.get("ids", [[]])[0]
        sim_documents = similar_records.get("documents", [[]])[0]
        sim_metadatas = similar_records.get("metadatas", [[]])[0]
        sim_distances = similar_records.get("distances", [[]])[0]
        
        if sim_ids:
            f.write(f"Found {len(sim_ids)} similar records:\n\n")
            for i, (doc_id, doc, meta, dist) in enumerate(zip(sim_ids, sim_documents, sim_metadatas, sim_distances)):
                similarity = 1 - dist  # Convert distance to similarity
                f.write(f"--- Similar Record #{i+1} (Similarity: {similarity:.4f}) ---\n")
                f.write(f"ID: {doc_id}\n")
                f.write(f"Domain: {meta.get('domain', 'N/A')}\n")
                f.write(f"Subdomain: {meta.get('subdomain', 'N/A')}\n")
                f.write(f"Source: {meta.get('source_file', 'N/A')}\n")
                f.write(f"Text:\n{doc}\n\n")
        else:
            f.write("No similar records found.\n\n")
        
        f.write("=" * 80 + "\n")
        f.write("END OF REPORT\n")
        f.write("=" * 80 + "\n")
    
    return output_file


if __name__ == "__main__":
    # Step 1: Infer domain and subdomain
    print("🔄 Running domain inference...")
    result = infer_domain_and_subdomain(policy_text)
    print(f"\n✅ Inference Result:")
    print(f"   Domain: {result.get('domain')}")
    print(f"   Subdomain: {result.get('subdomain')}")
    print(f"   Confidence: {result.get('confidence')}")
    
    # Step 2: Fetch related records by subdomain
    subdomain = result.get("subdomain")
    if subdomain and subdomain != "Unknown":
        related_records = fetch_related_records(subdomain)
        print(f"📊 Found {len(related_records.get('ids', []))} records matching subdomain")
    else:
        related_records = {"ids": [], "documents": [], "metadatas": []}
        print("⚠️  No valid subdomain to fetch related records")
    
    # Step 3: Fetch semantically similar records
    similar_records = fetch_similar_records(policy_text, top_k=5)
    print(f"📊 Found {len(similar_records.get('ids', [[]])[0])} semantically similar records")
    
    # Step 4: Save results to file
    output_file = save_results_to_file(result, related_records, similar_records, policy_text)
    print(f"\n✅ Results saved to: {output_file}")
