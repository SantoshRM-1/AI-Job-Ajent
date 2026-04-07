"""
In-memory vector store using sentence-transformers + numpy.
Replaces FAISS, which crashes on Python 3.12 / Windows.
All embeddings are stored as numpy arrays in a dictionary keyed by doc_id.
"""

import numpy as np
from typing import Optional

# Lazy import — only loaded on first use to avoid startup crashes
_model = None

def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

# In-memory storage: {doc_id: {"embedding": np.array, "text": str, "metadata": dict}}
_store: dict = {}

def add_document(doc_id: str, text: str, metadata: dict = None):
    """Embed and store a document in memory."""
    try:
        model = _get_model()
        embedding = model.encode([text])[0]
        _store[doc_id] = {
            "embedding": embedding,
            "text": text,
            "metadata": metadata or {}
        }
    except Exception as e:
        print(f"add_document error for {doc_id}: {e}")

def calculate_cosine_similarity(text1: str, text2: str) -> float:
    """Calculate cosine similarity between two raw strings (0.0 to 1.0)."""
    try:
        model = _get_model()
        vecs = model.encode([text1, text2])
        v1, v2 = vecs[0], vecs[1]

        dot = np.dot(v1, v2)
        n1 = np.linalg.norm(v1)
        n2 = np.linalg.norm(v2)

        if n1 == 0 or n2 == 0:
            return 0.0
        return float(dot / (n1 * n2))
    except Exception as e:
        print(f"cosine_similarity error: {e}")
        return 0.0

def similarity_search(query: str, k: int = 5):
    """Return top-k most similar stored documents."""
    if not _store:
        return []
    try:
        model = _get_model()
        q_vec = model.encode([query])[0]
        
        results = []
        for doc_id, doc in _store.items():
            emb = doc["embedding"]
            dot = np.dot(q_vec, emb)
            score = float(dot / (np.linalg.norm(q_vec) * np.linalg.norm(emb) + 1e-10))
            results.append((doc_id, score, doc))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:k]
    except Exception as e:
        print(f"similarity_search error: {e}")
        return []
