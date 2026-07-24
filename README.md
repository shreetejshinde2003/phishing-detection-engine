# PhishGuard: AI Threat Detection Engine

An enterprise-grade, AI-powered phishing detection and forensic analysis tool built with React, Node.js, Express, and the Gemini 3.1-Flash-Lite model.

## Core Features
*   **Deep Forensic Analysis:** Evaluates email payloads for typosquatting, urgency markers, and financial pretexting.
*   **MITRE ATT&CK Mapping:** Automatically maps identified threats to standard MITRE IDs (e.g., T1566 - Phishing).
*   **Data Security:** Implements strict pre-processing regex pipelines to redact PII (SSNs, Phone Numbers) before data reaches external LLMs.
*   **Adversarial Defense:** Secured against prompt injection attacks using XML boundary isolation.
*   **Interactive SOC Training:** Generates synthetic spear-phishing scenarios for security analyst training.

## Tech Stack
*   **Frontend:** React, Vite, Tailwind CSS (Custom Dark/Glassmorphism UI)
*   **Backend:** Node.js, Express
*   **AI/LLM:** Google Gemini API
*   **Security:** In-memory Rate Limiting, Regex Sanitization, Gitleaks pre-commit scanning.

## Local Development
1. Clone the repository: `git clone https://github.com/shreetejshinde2003/phishing-detection-engine.git`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your `GEMINI_API_KEY`.
4. Run the server: `npm run dev`