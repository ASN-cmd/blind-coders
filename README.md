# PolicyGuard AI

A comprehensive solution for analyzing organizational policies against NIST standards using AI.

## Project Structure

- **`backend/`**: Python Flask API with Mistral LLM integration.
- **`frontend/`**: Next.js React application with premium UI.
- **`docs/`**: Detailed documentation.

## Prerequisites

- Python 3.11+
- Node.js 18+ & npm
- 8GB+ RAM (for running 7B model locally)

## Quick Start

### 1. Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Download the LLM Model:
   ```bash
   python scripts/download_model.py
   ```

4. Start the backend server:
   ```bash
   python backend/app.py
   ```
   Server runs at `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`

## Features

- **Automated Policy Analysis**: Upload PDFs to check compliance.
- **NIST Gap Identification**: Finds missing controls vs NIST SP 800-53.
- **Roadmap Generation**: Creates prioritized action plans.
- **Premium UI**: Modern dark mode interface with real-time feedback.

## Documentation

- [Frontend Setup](frontend/README.md)
- [Gap Analysis Architecture](docs/ARCHITECTURE.md) (Note: Check if file exists)