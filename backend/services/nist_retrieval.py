from pathlib import Path
from chromadb import PersistentClient
from backend.embeddings.embedding_model import load_embedding_model

# Paths
BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = BASE_DIR / "backend" / "db" / "chroma"
COLLECTION_NAME = "nist_controls"


def fetch_related_nist_records(subdomain: str, domain: str = None, top_k: int = 10):
    """
    Fetch related NIST records from ChromaDB based on subdomain.
    Uses metadata filtering to find exact subdomain matches.
    
    Args:
        subdomain: The subdomain to search for
        domain: Optional domain filter
        top_k: Maximum number of records to return
        
    Returns:
        List of dictionaries with 'id', 'text', 'metadata'
    """
    client = PersistentClient(path=str(DB_PATH))
    collection = client.get_collection(name=COLLECTION_NAME)
    
    # Build where clause
    where_clause = {"subdomain": subdomain}
    if domain:
        where_clause["domain"] = domain
    
    results = collection.get(
        where=where_clause,
        include=["documents", "metadatas"],
        limit=top_k
    )
    
    # Format results
    records = []
    ids = results.get("ids", [])
    documents = results.get("documents", [])
    metadatas = results.get("metadatas", [])
    
    for i, (doc_id, doc, meta) in enumerate(zip(ids, documents, metadatas)):
        records.append({
            "id": doc_id,
            "text": doc,
            "metadata": meta
        })
    
    return records


def fetch_similar_nist_records(policy_text: str, subdomain: str = None, top_k: int = 5):
    """
    Fetch similar NIST records using semantic search.
    
    Args:
        policy_text: The organization policy text to compare
        subdomain: Optional subdomain filter
        top_k: Number of similar records to return
        
    Returns:
        List of dictionaries with 'id', 'text', 'metadata', 'similarity'
    """
    embedder = load_embedding_model()
    client = PersistentClient(path=str(DB_PATH))
    collection = client.get_collection(name=COLLECTION_NAME)
    
    # Create embedding for the input policy text
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
    
    results = collection.query(**query_params)
    
    # Format results
    records = []
    sim_ids = results.get("ids", [[]])[0]
    sim_documents = results.get("documents", [[]])[0]
    sim_metadatas = results.get("metadatas", [[]])[0]
    sim_distances = results.get("distances", [[]])[0]
    
    for doc_id, doc, meta, dist in zip(sim_ids, sim_documents, sim_metadatas, sim_distances):
        similarity = 1 - dist  # Convert distance to similarity
        records.append({
            "id": doc_id,
            "text": doc,
            "metadata": meta,
            "similarity": similarity
        })
    
    return records


def format_nist_chunks_for_prompt(records: list) -> str:
    """
    Format NIST records into a readable text block for the LLM prompt.
    
    Args:
        records: List of record dictionaries
        
    Returns:
        Formatted string of NIST chunks
    """
    if not records:
        return "No relevant NIST controls found for this subdomain."
    
    formatted = []
    for i, record in enumerate(records, 1):
        meta = record.get("metadata", {})
        text = record.get("text", "")
        
        chunk = f"--- NIST Control #{i} ---\n"
        chunk += f"Source: {meta.get('source_file', 'Unknown')}\n"
        chunk += f"Domain: {meta.get('domain', 'N/A')}\n"
        chunk += f"Subdomain: {meta.get('subdomain', 'N/A')}\n"
        
        # Add similarity score if available
        if "similarity" in record:
            chunk += f"Similarity: {record['similarity']:.4f}\n"
        
        chunk += f"\nText:\n{text}\n"
        formatted.append(chunk)
    
    return "\n\n".join(formatted)
