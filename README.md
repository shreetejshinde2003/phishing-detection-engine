# 🛡️ PhishGuard: AI Threat Detection Engine

An AI-powered phishing detection and forensic analysis web application built with **React**, **TypeScript**, **FastAPI**, and **Google Gemini 3.1 Flash Lite**.

This project demonstrates the customization, debugging, deployment, and enhancement of an AI-assisted phishing detection application, including backend integration, security improvements, and public deployment on Vercel.

---

# 📌 Project Background

This project originated from a prototype generated using **Google AI Studio's Text-to-App** capability.

Rather than treating the generated application as complete, the focus of this repository was to improve and refine it by resolving runtime issues, integrating a FastAPI backend, updating deprecated dependencies, improving documentation, and deploying it as a publicly accessible web application.

The project also served as a practical learning experience in working with AI-assisted software development workflows.

---

# 👨‍💻 My Contributions

My work on this project included:

- Debugging and resolving runtime issues
- Updating deprecated Google Gemini model versions
- Integrating and configuring the FastAPI backend
- Configuring deployment using Vercel Serverless Functions
- Improving project documentation
- Managing environment variables
- Publishing and maintaining the GitHub repository

---

# 🛡️ Application Features

- **Deep Forensic Analysis**
  - Evaluates email payloads for typosquatting, urgency markers, and financial pretexting.

- **MITRE ATT&CK Mapping**
  - Maps detected phishing techniques to MITRE ATT&CK techniques (for example, **T1566.002 – Spearphishing Link**).

- **PII Redaction**
  - Redacts sensitive information before data is sent to external language models.

- **Prompt Injection Protection**
  - Uses XML boundary isolation techniques to reduce prompt injection risks.

- **SOC Training**
  - Generates synthetic phishing scenarios for cybersecurity awareness and analyst training.

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Python 3.9+
- FastAPI
- Pydantic

## AI / LLM

- Google Gemini API
- Gemini 3.1 Flash Lite

## Infrastructure

- Vercel
- Serverless Functions

## Security

- Regex-based PII Sanitization
- Prompt Injection Protection
- Rate Limiting

---

# 💻 Local Development

## 1. Clone the Repository

```bash
git clone https://github.com/shreetejshinde2003/phishing-detection-engine.git
cd phishing-detection-engine
```

---

## 2. Install Backend Dependencies

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

Start the frontend:

```bash
npm run dev
```

Run the FastAPI backend in another terminal:

```bash
uvicorn api.index:app --reload
```

---

# 🚀 Deployment

This project is optimized for deployment on **Vercel**.

- React frontend is built using **Vite**.
- FastAPI backend inside the `/api` directory is deployed as **Vercel Serverless Functions**.
- Routing is configured through `vercel.json`.

---

# 📂 Project Structure

```text
phishing-detection-engine/
│
├── api/                     # FastAPI backend
├── src/                     # React + TypeScript frontend
├── public/                  # Static assets
├── package.json
├── package-lock.json
├── requirements.txt
├── vercel.json
├── vite.config.ts
├── .env.example
└── README.md
```

---

# 📚 What I Learned

Working on this project helped me gain practical experience with:

- Working with AI-generated applications
- Debugging React and TypeScript code
- FastAPI backend integration
- Google Gemini API integration
- Environment variable management
- Deploying applications using Vercel
- Version control using Git and GitHub
- Maintaining and documenting production-ready repositories

---

# 📄 License

This project is intended for educational, research, and cybersecurity demonstration purposes.

---

## 👨‍💻 Author

**Shreetej Shinde**

- GitHub: https://github.com/shreetejshinde2003
- Live Demo: https://phishing-detection-engine.vercel.app

---

⭐ If you found this project interesting, consider giving it a star on GitHub.