from sentence_transformers import SentenceTransformer

_embedder = None

def load_embedding_model():
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _embedder
