# Secure AI Policy Compliance & Gap Analysis System

A comprehensive, privacy-first solution for analyzing organizational policies against NIST SP 800-53 standards using a local AI architecture.

---

## 🚀 Project Overview

This system provides an offline, secure environment for auditing cybersecurity policies. It uses a local Large Language Model (Mistral-7B) and vector embeddings to autonomously partition policy documents, map them to NIST controls, detect compliance gaps, and generate actionable remediation roadmaps.

**Key Capabilities:**
- **Offline Inference:** Zero data leakage; all processing happens locally.
- **Semantic Mapping:** Uses vector embeddings for precise control alignment.
- **Automated Partitioning:** Intelligently segments huge PDFs into security domains.
- **RAG-Based Remediation:** Generates specific policy revisions based on retrieved NIST standards.

---

## 🛠️ Technology Stack

### **Backend (Python)**
*Core logic, AI inference, and API handling.*

| Component | Library/Tool | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | **Flask** | Latest | Lightweight WSGI web application framework for the REST API. |
| **CORS** | **Flask-CORS** | Latest | Handles Cross-Origin Resource Sharing for frontend communication. |
| **LLM Inference** | **CTransformers** | `0.2.27` | Runs quantized GGML/GGUF models (Mistral-7B) efficiently on CPU. |
| **Embeddings** | **Sentence-Transformers** | `5.2.2` | Generates 384-dimensional embeddings using `all-MiniLM-L6-v2`. |
| **Vector Database** | **ChromaDB** | `1.4.1` | Local vector store for indexing and retrieving NIST SP 800-53 controls. |
| **PDF Processing** | **PyPDF2** | Latest | Extracts text from standard PDF documents. |
| **OCR Handling** | **pdf2image** | `1.16.3` | Converts PDF pages to images for OCR when text extraction fails. |
| **OCR Engine** | **pytesseract** | `0.3.13` | Python wrapper for Google's Tesseract-OCR Engine. |
| **Data Handling** | **NumPy** | `2.4.2` | Efficient numerical operations for vector handling. |
| **ML Framework** | **PyTorch** | `2.10.0` | Underlying tensor library for transformer models. |
| **Utilities** | **python-dotenv** | `1.2.1` | Manages environment variables and configuration. |
| **Progress Bars** | **tqdm** | `4.67.3` | Displays progress for long-running batch operations. |

### **Frontend (TypeScript)**
*Interactive dashboard and user interface.*

| Component | Library/Tool | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js** | `16.1.6` | React framework for server-side rendering and static site generation. |
| **Library** | **React** | `19.2.3` | Core library for building composable user interfaces. |
| **Styling** | **Tailwind CSS** | `4.0` | Utility-first CSS framework for rapid UI development. |
| **Icons** | **Lucide React** | `0.563.0` | Consistent, lightweight icon set. |
| **Animations** | **Framer Motion** | `12.33.0` | Production-ready motion library for React. |
| **HTTP Client** | **Axios** | `1.13.5` | Promise-based HTTP client for API requests. |
| **Utilities** | **clsx** | `2.1.1` | Utility for constructing `className` strings conditionally. |
| **Utilities** | **tailwind-merge** | `3.4.0` | Merges Tailwind CSS classes without style conflicts. |
| **Linting** | **ESLint** | `9.0` | Pluggable linting utility for JavaScript and TypeScript. |

### **Infrastructure & Models**

| Component | Details |
| :--- | :--- |
| **LLM Model** | **Mistral-7B-Instruct-v0.3-Q5_K_M** (Quantized GGUF format for local inference) |
| **Embedding Model** | **sentence-transformers/all-MiniLM-L6-v2** (384 dimensions) |
| **Database** | **ChromaDB** (Persistent local parquet/sqlite storage) |
| **OCR Binary** | **Tesseract-OCR** (Must be installed on the host system) |

---

## 📋 Prerequisites

*   **Python:** 3.11+
*   **Node.js:** 18+ & npm
*   **Hardware:** Minimum 8GB RAM (16GB recommended for smooth LLM inference) on CPU. No GPU required.
*   **System Tools:** Tesseract-OCR installed and added to system PATH.

## 🚀 Quick Start

### 1. Backend Setup

1.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Linux/Mac
    source venv/bin/activate
    ```

2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3.  Start the backend API:
    ```bash
    python backend/app.py
    ```
    *Server runs at `http://localhost:5000`*

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    *App runs at `http://localhost:3000`*

---

## 🔄 Workflow

1.  **Upload:** User uploads a policy PDF via the frontend.
2.  **Partitoining (Backend):** 
    *   `PyPDF2` (or `pytesseract`) extracts raw text.
    *   Local LLM partitions text into domains (ISMS, Risk, etc.).
3.  **Selection (Frontend):** User selects a domain to analyze.
4.  **Analysis (Backend):**
    *   Text is converted to embeddings via `Sentence-Transformers`.
    *   `ChromaDB` retrieves relevant NIST controls.
    *   Local LLM compares policy vs. NIST controls to find gaps.
5.  **Results (Frontend):** Dashboard displays compliance score, gaps, and roadmap.