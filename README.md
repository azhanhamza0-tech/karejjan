# KARÊJAN — Multilingual Programming Learning Platform

Interactive coding academy with integrated Learning Groups, automated Practice & Assessments, live Code Lab, Daily Challenges, AI Tools Hub, Golden Prompts, and KARÊJAN AI Tutor across **Kurdish Sorani (`ckb`, RTL)**, **Kurdish Badini (`kmr`, RTL)**, **Arabic (`ar`, RTL)**, and **English (`en`, LTR)**.

Created by **AZHAN HAMMZA**.

## Deploy to Vercel

1. Push this repository to GitHub (public repository `karejan`).
2. Import the repository in **Vercel** (Framework Preset: **Vite**).
3. Configure Environment Variables in Vercel Project Settings:
   - `GEMINI_API_KEY` — Server-side Google Gemini API key (required for KARÊJAN AI & AI Content Studio)
   - `BOOTSTRAP_SUPER_ADMIN_EMAIL` — Super Admin verified email (optional override)
   - `FIREBASE_PROJECT_ID` — Firebase project ID (defaults to `firebase-applet-config.json`)
4. Click **Deploy**. Static frontend builds via `vite build` into `dist/`, and backend `/api/*` endpoints run on `api/[...path].mjs`.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```
