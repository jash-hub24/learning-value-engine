# LEARNING VALUE ENGINE (MVP)

> *"We don't measure how much students do. We measure what their effort actually produces."*

The **Learning Value Engine** addresses the critical *Learning Value Gap* in academia: academic institutions track vanity metrics (grades, attendance hours, assignment submission percentages), but these metrics fail to show what functional competencies a student's effort has actually produced.

---

## Core Workflow Loop

$$\text{Effort} \rightarrow \text{Evidence} \rightarrow \text{Learning Gain} \rightarrow \text{Competency} \rightarrow \text{Gap} \rightarrow \text{Action} \rightarrow \text{Measured Improvement}$$

1. **Effort Logged**: Tracked study, lecture, and lab hours (42 hours recorded for Rahul Sharma).
2. **Multi-Modal Evidence**: Practical exams, project milestone repos, theory tests, and reflections.
3. **Deterministic Scoring Engine**: Configurable weights (Default: Practical 40%, Project 30%, Theory 20%, Reflection 10%) with automatic normalization when evidence categories are absent.
4. **Measured Learning Gain**: Delta between post- and pre-diagnostic assessments ($76\% - 54\% = +22\text{ pp}$).
5. **Prototype Effort Efficiency**: Yield ratio ($\text{Gain} / \text{Normalized Effort} = +22 / 4.2 = 5.24\text{ pts/unit}$).
6. **Gap & Dissonance Detection**: Deterministically flags high theory vs low practical divergence.
7. **Prescriptive Action**: Specific project deliverable to close the gap.
8. **Reassessment & Improvement**: Dynamic re-evaluation demonstrating closed-loop growth.

---

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, Recharts.
- **Backend**: Node.js, Express.js REST API with clean service/repository architecture (ready for Spring Boot / MySQL migration).
- **Storage**: Persistent JSON database repository with automatic seed initialization.

---

## Quick Start

### 1. Run the Full Application (Single Command)
From the root directory:
```bash
npm start
```
Open **[http://localhost:3001](http://localhost:3001)** in your browser.

### 2. Run in Development Mode
To run backend with hot-reload and frontend Vite dev server concurrently:

**Terminal 1 (Backend - Port 3001):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend - Port 5173):**
```bash
cd frontend
npm run dev
```

### 3. Run Automated Core Flow Verification
```bash
cd backend
npx tsx src/verify-flow.ts
```

---

## Architecture & REST Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/student` | GET | Rahul Sharma profile & academic signals |
| `/api/competencies` | GET | Dynamically evaluated competencies from evidence |
| `/api/competencies/:id/trace` | GET | Step-by-step mathematical derivation of score |
| `/api/evidence` | GET, POST | Evidence ledger and submission |
| `/api/learning-gain` | GET | Pre/post assessment comparison (+22 pp) |
| `/api/effort-efficiency` | GET | Prototype yield metric (5.24 pts/unit) |
| `/api/gaps` | GET | Dissonance & status gap detection |
| `/api/recommendations` | GET | Deterministic recommendations & diagnostic reasons |
| `/api/scoring-config` | GET, PUT | Configurable weights with auto-normalization |
| `/api/reassess` | POST | Simulates action completion & practical reassessment |
| `/api/reset` | POST | Restores baseline demo student state |
