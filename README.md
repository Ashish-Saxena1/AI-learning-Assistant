# AI Learning Assistant

> An AI-powered study companion that turns any PDF into summaries, flashcards, quizzes, and an interactive Q&A chat — built on the MERN stack with Google Gemini as the reasoning engine.

[![Status](https://img.shields.io/badge/status-work%20in%20progress-yellow)]()
[![Node.js](https://img.shields.io/badge/backend-Node.js%20%2F%20Express-339933)]()
[![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)]()
[![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248)]()
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)]()

> ⚠️ **Project status:** This project is actively under development. Core features are functional, but the codebase, API contracts, and UI are still evolving. Expect breaking changes between commits.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Known Issues / WIP Notes](#known-issues--wip-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**AI Learning Assistant** is a full-stack web application designed to help students and self-learners study more efficiently from their own documents. Users upload a PDF (lecture notes, research papers, textbooks, etc.), and the platform uses the **Google Gemini API** to automatically:

- Generate structured, markdown-formatted study notes
- Explain any specific concept from the document on demand
- Create flashcard sets for active recall
- Generate multiple-choice quizzes to test understanding
- Power a contextual chat assistant that answers questions grounded in the document's content

The goal is to reduce a student's workflow from *"read → summarize → test yourself"* down to a single upload.

---

## Features

| Module | Description |
|---|---|
|  **Authentication** | Secure signup/login using JWT stored in HTTP-only cookies, with `bcrypt` password hashing |
|  **PDF Upload & Parsing** | Upload PDFs via `multer`, extract raw text server-side, and store files on **Cloudinary** |
|  **AI Summarization** | Automatic structured notes generation (headers, bold key terms, bullet points, examples) on upload |
|  **Concept Explainer** | Ask the AI to explain any topic in-depth using the uploaded document as grounding context |
|  **Flashcard Generator** | Generate versioned sets of Q&A flashcards from document content |
|  **Quiz Generator** | Generate multiple-choice quiz sets (question, options, correct answer) per document |
|  **Document-Aware Chat** | Chat interface that answers questions using the PDF as context, with persisted chat history |
|  **Modern UI** | Responsive React interface styled with Tailwind CSS + DaisyUI, animated with Framer Motion |

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS 4 + DaisyUI
- Zustand (state management)
- React Router DOM
- Axios
- Framer Motion
- React Markdown (rendering AI-generated notes/explanations)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (JWT) for auth
- bcrypt for password hashing
- Multer + Cloudinary for file storage
- `pdf-parse` for text extraction from PDFs
- Google Gemini API (`@google/genai`) for all AI generation tasks

---

## System Architecture

```
┌────────────────┐        REST (Axios, JWT cookie)        ┌──────────────────┐
│  React Client   │ ─────────────────────────────────────▶ │  Express API      │
│  (Vite + Zustand)│ ◀───────────────────────────────────── │  (Node.js)         │
└────────────────┘                                          └────────┬─────────┘
                                                                      │
                        ┌─────────────────────────────────────────────┼───────────────────────┐
                        ▼                                             ▼                        ▼
                ┌────────────────┐                          ┌──────────────────┐      ┌──────────────────┐
                │   MongoDB       │                          │   Cloudinary       │      │  Google Gemini    │
                │ (Users, Docs,   │                          │  (PDF file store)  │      │  (Summaries, Quiz, │
                │  Chats)         │                          │                    │      │  Flashcards, Chat) │
                └────────────────┘                          └──────────────────┘      └──────────────────┘
```

**Flow:**
1. User uploads a PDF → text is extracted with `pdf-parse` and the file is stored on Cloudinary.
2. Extracted text is sent to Gemini to generate an initial summary, which is saved alongside the document.
3. On-demand endpoints (explain / flashcards / quizzes / chat) send the stored document text + user request to Gemini and persist the structured response in MongoDB.

---

## Project Structure

```
AILEARNINGASSISTANT/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Cloudinary configuration
│   │   ├── controllers/     # Route handlers (auth, document, chat)
│   │   ├── middleware/      # JWT auth guard, multer upload config
│   │   ├── models/          # Mongoose schemas (User, Document, Chat)
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Gemini AI service layer
│   │   ├── utils/           # PDF parsing, token generation, dev scripts
│   │   └── index.js         # App entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI (chat box, sidebar, flashcards, quizzes, navbar...)
    │   ├── pages/            # Route-level views (homepage, documents, PDF viewer, auth, settings)
    │   ├── store/             # Zustand stores (auth, chat, documents, theme)
    │   ├── lib/               # Axios instance
    │   └── constants/
    └── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local instance or Atlas cluster)
- A [Cloudinary](https://cloudinary.com/) account (for file storage)
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/AILEARNINGASSISTANT.git
cd AILEARNINGASSISTANT
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables)).

```bash
npm run dev
```

The API server starts on the port defined in `PORT` (default flow assumes `http://localhost:<PORT>`).

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will start (default `http://localhost:5173`).

> Make sure the backend's CORS `origin` list in `backend/src/index.js` includes your frontend's URL.

---

## Environment Variables

Create a `backend/.env` file with the following keys:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ID=your_oauth_client_id
CLIENT_SECRET=your_oauth_client_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

> ⚠️ **Never commit your `.env` file.** Make sure it's listed in `.gitignore`.

---

## API Reference

Base URL: `/api`

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Log in and receive JWT cookie | No |
| POST | `/logout` | Clear auth cookie | No |
| GET | `/check` | Verify current session | Yes |

### Documents — `/api/docs`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/all` | Get all documents for the logged-in user | Yes |
| POST | `/upload` | Upload a PDF, extract text, generate initial AI summary | Yes |
| DELETE | `/delete/:docID` | Delete a document | Yes |
| POST | `/explain/:docID` | Get an AI explanation of a specific topic within the document | Yes |
| GET | `/quizz/:docID` | Fetch all generated quiz sets for a document | Yes |
| POST | `/quizz/:docID` | Generate a new AI quiz set for a document | Yes |
| POST | `/flashcards/:docID` | Generate a new AI flashcard set for a document | Yes |

### Chat — `/api/chat`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/history/:docID` | Fetch chat history for a document | Yes |
| POST | `/aiChat/:docID` | Send a message and get a document-grounded AI reply | Yes |

---

## Roadmap

- [ ] Add chat history context window (currently disabled/stubbed)
- [ ] Add unit & integration tests (backend + frontend)
- [ ] Improve error handling & input validation across controllers
- [ ] Add pagination for documents, flashcard sets, and quiz sets
- [ ] Add user profile picture support (`profilepic` field currently commented out)
- [ ] Rate-limiting / usage caps on Gemini calls
- [ ] CI/CD pipeline & production deployment (Docker)
- [ ] Improve mobile responsiveness across pages

---

## Known Issues / WIP Notes

Since this project is actively being developed, a few areas are intentionally rough:

- Some debug `console.log` statements are still present in controllers (chat controller in particular).
- Chat history context (`historyContext`) is currently hardcoded to an empty string — the AI chat does not yet use prior conversation turns.
- The `User` model has minor schema typos (`requried` instead of `required`) that don't break functionality but should be fixed.
- No automated test suite yet.

Contributions to address any of the above are very welcome.

---

## Contributing

This is a learning/portfolio project and still evolving, but contributions, suggestions, and issue reports are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project currently has no explicit license. All rights reserved by the author unless a license file is added.

---

<p align="center">Built with ❤️ using the MERN stack and Google Gemini.</p>
