# PolicyGuard AI Frontend

A Next.js frontend for the Policy Analysis system.

## Features
- **Modern UI**: Premium dark mode design with glassmorphism and animations.
- **Drag & Drop Upload**: Easy file handling.
- **Real-time Progress**: Visual feedback during analysis.
- **Interactive Report**: Collapsible sections for Gap Analysis, Revised Policy, and Roadmap.

## Prerequisites
- Node.js & npm installed
- Backend running on `http://localhost:5000`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the backend server (in a separate terminal):
   ```bash
   cd ../backend
   python app.py
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `src/app/page.tsx`: Main landing page
- `src/components/upload.tsx`: File upload component
- `src/components/gap-analysis-report.tsx`: Report visualization
- `src/app/globals.css`: Global styles & animations
