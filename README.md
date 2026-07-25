# PhishGuard: AI Threat Detection Engine

An enterprise-grade, AI-powered phishing detection and forensic analysis tool built with **React**, **Python (FastAPI)**, and the **Gemini 3.1-Flash-Lite** model.

---

## 🛡️ Core Features

- **Deep Forensic Analysis:** Evaluates email payloads for typosquatting, urgency markers, and financial pretexting.
- **MITRE ATT&CK Mapping:** Automatically maps identified threats to standard MITRE ATT&CK techniques (e.g., **T1566.002 – Spearphishing Link**).
- **Data Security:** Implements strict pre-processing regex pipelines to redact Personally Identifiable Information (PII), including phone numbers and identification numbers, before data reaches external LLMs.
- **Adversarial Defense:** Protects against prompt injection attacks using XML boundary isolation.
- **Interactive SOC Training:** Generates synthetic spear-phishing scenarios for security analyst training.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS (Dark / Glassmorphism UI)

### Backend
- Python 3.9+
- FastAPI
- Pydantic

### AI / LLM
- Google Gemini API (`gemini-3.1-flash-lite`)

### Security & Infrastructure
- Regex-based PII Sanitization
- Vercel Serverless Functions

---

# 💻 Local Development

## 1. Clone the Repository

```bash
git clone https://github.com/shreetejshinde2003/phishing-detection-engine.git
cd phishing-detection-engine
```

---

## 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Install Frontend Dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL_VERSION=gemini-3.1-flash-lite
```

---

## 5. Run the Application

Start the Vite frontend:

```bash
npm run dev
```

To run the FastAPI backend locally in another terminal:

```bash
uvicorn api.index:app --reload
```

---

# 🚀 Deployment

This project is optimized for **Vercel** deployment.

- React frontend is built using **Vite**.
- FastAPI backend inside the `/api` directory is deployed automatically as **Vercel Serverless Functions**.
- Routing is configured through `vercel.json`.

---

## 📂 Project Structure

```text
phishing-detection-engine/
│
├── api/                 # FastAPI backend
├── src/                 # React frontend source
├── public/              # Static assets
├── package.json
├── requirements.txt
├── vercel.json
├── vite.config.js
└── README.md
```

---

## 📄 License

This project is intended for educational, research, and cybersecurity demonstration purposes.