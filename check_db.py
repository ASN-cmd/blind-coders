from chromadb import PersistentClient
from pathlib import Path

DB_PATH = Path("backend/db/chroma")

client = PersistentClient(path=str(DB_PATH))

print("Collections:", [c.name for c in client.list_collections()])

collection = client.get_collection("nist_controls")
print("Vector count:", collection.count())
