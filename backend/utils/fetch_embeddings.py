"""
Fetch all embeddings from ChromaDB and save to a text file for verification.
This script retrieves all stored policy chunks from the ChromaDB database
and exports them to a readable text file to verify that ingestion and 
retrieval are working properly.
"""

import sys
import os
from pathlib import Path
from datetime import datetime

# Ensure project root is on PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from chromadb import PersistentClient

# -------- Paths --------
BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = BASE_DIR / "backend" / "db" / "chroma"
OUTPUT_DIR = BASE_DIR / "backend" / "output"
COLLECTION_NAME = "nist_controls"

def fetch_all_embeddings():
    """Fetch all embeddings from ChromaDB and save to a text file."""
    
    # Create output directory if it doesn't exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate output filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = OUTPUT_DIR / f"embeddings_verification_{timestamp}.txt"
    
    # Initialize ChromaDB client
    print("🔄 Connecting to ChromaDB...")
    
    if not DB_PATH.exists():
        print("❌ ChromaDB path does not exist!")
        return
    
    client = PersistentClient(path=str(DB_PATH))
    
    # Get the collection
    try:
        collection = client.get_collection(name=COLLECTION_NAME)
    except Exception as e:
        print(f"❌ Error getting collection '{COLLECTION_NAME}': {e}")
        return
    
    # Fetch all data from the collection
    print("🔄 Fetching all embeddings...")
    
    # Get all items from the collection
    # ChromaDB's get() without ids returns all items
    results = collection.get(
        include=["documents", "metadatas", "embeddings"]
    )
    
    ids = results.get("ids", [])
    documents = results.get("documents", [])
    metadatas = results.get("metadatas", [])
    embeddings = results.get("embeddings", [])
    
    total_count = len(ids)
    print(f"📊 Found {total_count} items in the collection.")
    
    # Write to output file
    print(f"📝 Writing to {output_file}...")
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("CHROMADB EMBEDDINGS VERIFICATION REPORT\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Collection: {COLLECTION_NAME}\n")
        f.write(f"Total Records: {total_count}\n")
        f.write("=" * 80 + "\n\n")
        
        for i in range(total_count):
            f.write("-" * 80 + "\n")
            f.write(f"RECORD #{i+1}\n")
            f.write("-" * 80 + "\n")
            
            # ID
            f.write(f"ID: {ids[i]}\n\n")
            
            # Metadata
            meta = metadatas[i] if i < len(metadatas) and metadatas else {}
            f.write("METADATA:\n")
            f.write(f"  - Domain: {meta.get('domain', 'N/A')}\n")
            f.write(f"  - Subdomain: {meta.get('subdomain', 'N/A')}\n")
            f.write(f"  - Source File: {meta.get('source_file', 'N/A')}\n\n")
            
            # Document text
            doc = documents[i] if i < len(documents) and documents else "N/A"
            f.write("DOCUMENT TEXT:\n")
            f.write(f"{doc}\n\n")
            
            # Embedding vector (first 10 values for brevity)
            if embeddings is not None and len(embeddings) > 0 and i < len(embeddings):
                embedding = embeddings[i]
                if embedding is not None and len(embedding) > 0:
                    embedding_preview = embedding[:10] if len(embedding) > 10 else embedding
                    f.write(f"EMBEDDING (first 10 of {len(embedding)} dimensions):\n")
                    f.write(f"{embedding_preview}\n")
                else:
                    f.write("EMBEDDING: Not available\n")
            else:
                f.write("EMBEDDING: Not available\n")
            
            f.write("\n")
        
        f.write("=" * 80 + "\n")
        f.write("END OF REPORT\n")
        f.write("=" * 80 + "\n")
    
    print(f"✅ Successfully saved embeddings to: {output_file}")
    print(f"📊 Total records exported: {total_count}")
    
    return output_file


def fetch_embeddings_summary():
    """Fetch a summary of embeddings grouped by domain and subdomain."""
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = OUTPUT_DIR / f"embeddings_summary_{timestamp}.txt"
    
    print("🔄 Connecting to ChromaDB...")
    
    if not DB_PATH.exists():
        print("❌ ChromaDB path does not exist!")
        return
    
    client = PersistentClient(path=str(DB_PATH))
    
    try:
        collection = client.get_collection(name=COLLECTION_NAME)
    except Exception as e:
        print(f"❌ Error getting collection '{COLLECTION_NAME}': {e}")
        return
    
    print("🔄 Fetching embeddings summary...")
    
    results = collection.get(include=["metadatas"])
    metadatas = results.get("metadatas", [])
    
    # Group by domain and subdomain
    domain_counts = {}
    subdomain_counts = {}
    
    for meta in metadatas:
        domain = meta.get("domain", "Unknown")
        subdomain = meta.get("subdomain", "Unknown")
        
        domain_counts[domain] = domain_counts.get(domain, 0) + 1
        subdomain_counts[subdomain] = subdomain_counts.get(subdomain, 0) + 1
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("CHROMADB EMBEDDINGS SUMMARY\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Collection: {COLLECTION_NAME}\n")
        f.write(f"Total Records: {len(metadatas)}\n")
        f.write("=" * 80 + "\n\n")
        
        f.write("COUNTS BY DOMAIN:\n")
        f.write("-" * 40 + "\n")
        for domain, count in sorted(domain_counts.items()):
            f.write(f"  {domain}: {count}\n")
        
        f.write("\n\nCOUNTS BY SUBDOMAIN:\n")
        f.write("-" * 40 + "\n")
        for subdomain, count in sorted(subdomain_counts.items()):
            f.write(f"  {subdomain}: {count}\n")
        
        f.write("\n" + "=" * 80 + "\n")
        f.write("END OF SUMMARY\n")
        f.write("=" * 80 + "\n")
    
    print(f"✅ Summary saved to: {output_file}")
    
    return output_file


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Fetch embeddings from ChromaDB")
    parser.add_argument(
        "--summary", 
        action="store_true", 
        help="Generate summary only (grouped by domain/subdomain)"
    )
    parser.add_argument(
        "--full", 
        action="store_true", 
        help="Generate full report with all documents and embedding previews"
    )
    
    args = parser.parse_args()
    
    if args.summary:
        fetch_embeddings_summary()
    elif args.full:
        fetch_all_embeddings()
    else:
        # Default: run both
        print("\n📋 Generating Summary Report...")
        fetch_embeddings_summary()
        print("\n📋 Generating Full Report...")
        fetch_all_embeddings()
