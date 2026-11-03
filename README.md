# ShieldX 🛡️ — Privacy-First AI Digital Safety Agent

> **"Don't just detect suspicious content. Understand the entire attack chain and explain what the user should safely do next."**

ShieldX is a production-quality MVP defensive cybersecurity web application that connects messages, deceptive links, identity signals, and abnormal login events to detect coordinated digital threats and provide practical, explainable safe recovery actions.

---

## 🚀 Key Features & Core USP

1. **Multi-Signal Attack Chain Correlation**: Combines isolated signals (SMS + Email + Typosquatted Domain + Login Anomaly) into a visual, interactive **Digital Risk Graph**.
2. **Transparent Explainable AI (0–100 Risk Score)**: Decomposes risk into 7 configurable factor weights (Sender Anomaly, URL Risk, Impersonation, Urgency, Credential Harvesting, Login Anomaly, Correlation Boost).
3. **Purely Defensive Safe Action Protocols**: Generates actionable defensive recovery checklists (zero malware generation or offensive payloads).
4. **Privacy-First Architecture**: Implements local data minimization, PII scrubbing, zero raw message payload retention, anonymized hashes, user data purge, and real-time audit logs.
5. **Hackathon Demo Mode (5 Scenarios)**: Preloaded realistic attack scenarios (Phishing, Support Impersonation, Parcel Fee SMS, Brute-Force Account Takeover, and Flagship Coordinated Multi-Vector Campaign).
6. **Zero-Downtime Fallback AI Engine**: Operates via Google Gemini API when configured, with seamless instant fallback to the local deterministic rule engine.

---

## 🛠️ Architecture & Technology Stack

```
   +--------------------------------------------------------+
   |             ShieldX Defensive AI Frontend              |
   |   (React 19 + TypeScript + Vite + Tailwind CSS v4)    |
   +---------------------------+----------------------------+
                               | REST API (/api)
   +---------------------------v----------------------------+
   |            Node.js / Express API Server                |
   +---------------------------+----------------------------+
                               |
       +-----------------------+-----------------------+
       |                       |                       |
+------v-----+          +------v-----+          +------v-----+
| Normalizer |          | Feature    |          | Risk       |
| & PII Scrub|          | Extractor  |          | Scorer     |
+------+-----+          +------+-----+          +------+-----+
       |                       |                       |
       +-----------------------+-----------------------+
                               |
                 +-------------v-------------+
                 | AI Correlation Engine     |
                 | (Gemini / Local Fallback) |
                 +-------------+-------------+
                               |
                 +-------------v-------------+
                 |  Defensive Response       |
                 |  Checklist Generator      |
                 +---------------------------+
```

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Custom SVG Radial Gauge & Graph Renderer.
* **Backend**: Node.js, Express, TypeScript, REST APIs.
* **AI Layer**: Provider abstraction supporting Google Gemini API REST endpoint with deterministic local rule engine fallback.
* **Data Storage**: In-memory store with JSON persistence, seeded default events, attack chains, and audit logs.

---

## 📊 Transparent Risk Scoring Math

The composite risk score $(0 - 100)$ is computed using the exact weighted formula:

$$\text{Risk Score} = 0.15(\text{Sender}) + 0.20(\text{URL}) + 0.15(\text{Impersonation}) + 0.10(\text{Urgency}) + 0.15(\text{Credential}) + 0.15(\text{Login}) + 0.10(\text{Correlation})$$

---

## 🔒 Privacy Model

* **Data Minimization**: Redacts emails, phone numbers, and payment cards prior to analysis.
* **Zero Raw Payload Retention**: Raw message text is discarded after feature extraction.
* **Audit Trail**: Every privacy event is recorded with cryptographic pseudonyms.
* **Right to be Forgotten**: One-click "Delete My Security Data" instant data purge.

---

## 💻 Setup Instructions & Local Execution

### Prerequisites
* Node.js v18+ or v24+
* npm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run backend API server
npm run server

# 3. Run Vite frontend dev server (in parallel)
npm run dev
```

### Environment Variables (Optional `.env`)
```env
PORT=3001
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🏆 Live Demo Scenarios

1. **Scenario 1**: Fake Bank / Security Alert (Phishing)
2. **Scenario 2**: Tech Support Impersonation Scam
3. **Scenario 3**: Delivery Parcel Fee Payment SMS
4. **Scenario 4**: Automated Brute-Force Account Takeover
5. **Scenario 5**: **Flagship Coordinated Multi-Vector Attack** (Message → URL → Domain → Urgent OTP → Login Anomaly)
