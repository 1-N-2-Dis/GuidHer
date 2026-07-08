<div align="center">
  <table border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td><h1>GuidHer</h1></td>
      <td><img src="frontend/GuidHer_Assets/appicon.png" alt="GuidHer Logo" width="32" height="32" style="margin-left: 10px; margin-bottom: 10px; vertical-align: middle; border-radius: 6px;"></td>
    </tr>
  </table>
  <p>A community-sourced safer-routing guide for women commuting the PUP Sta. Mesa zone.</p>
  <p><i>"Because safety knowledge shouldn't live only in private group chats."</i></p>
</div>

---

## Team Information

**Team Name:** 1N2

**Project Name:** GuidHer

---

## Project Brief

**The Problem**

A woman studying at PUP Sta. Mesa who finishes an evening class has no reliable way to know, before she sets out, which stretches of her commute are unsafe tonight. The knowledge that would keep her safe — which stretch of Teresa Street has no working lights, which station approach has had recent incidents, which jeepney route is running empty — lives only in private group chats, in a friend's memory, or in her own body after something has already happened. Official records capture only what gets formally reported. The entire burden of route-avoidance falls on her, daily, alone.

**The Solution**

GuidHer is a community-powered zone safety map that shows women which route segments to avoid tonight and why — before they leave. It structures the informal safety knowledge women already share in group chats into a visible, trustworthy, and actionable map. The platform covers the LRT-2 Pureza/Legarda corridor, jeepney routes along Pureza and Magsaysay, and walking stretches including Teresa Street, with a focus on commuters traveling after evening classes.

Unlike women-only train cars (which cover only the rail leg) or panic-button apps (which assume a rescue that can't happen), GuidHer works across the first and last mile where exposure is highest — and it reports conditions only, never crime labels.

**Intended Users**

* Women students aged 18–24 at PUP Main Campus (Sta. Mesa, Manila) who commute the zone daily, especially after evening classes
* LGBTQ+ riders in the same commute zone experiencing harassment-driven route avoidance

**Impact**

GuidHer enables women to make data-backed adjustments to their evening routes before they leave campus — reducing the cost of uncertainty that currently makes women re-route, pay extra for transport, or stay home altogether. It also surfaces aggregated infrastructure vulnerability data (poor lighting, isolated stretches) that can be handed directly to local Barangay officials as actionable PDF briefs, creating a feedback loop from community observation to government response.

---

## Team Members

| Name | Role |
| ---- | ---- |
| Alexander Neverro | Business Research |
| Farhana Lardizabal | Data Analysis \| AI Engineer |
| Jimuelle Patron | Full-Stack Developer |
| Helena Herrero | UI/UX Designer |

<div align="center">
  <br>
  <a href="https://github.com/Alexandre-Nevero" target="_blank">
    <img src="https://img.shields.io/badge/Alexandre--Nevero-%236f42c1?style=for-the-badge&logo=github&logoColor=fff&labelColor=%23ffc107" alt="Alexandre-Nevero GitHub">
  </a>
  <a href="https://github.com/HitsukiMok" target="_blank">
    <img src="https://img.shields.io/badge/HitsukiMok-%236f42c1?style=for-the-badge&logo=github&logoColor=fff&labelColor=%23ffc107" alt="HitsukiMok GitHub">
  </a>
  <a href="https://github.com/Jimuelle07" target="_blank">
    <img src="https://img.shields.io/badge/Jimuelle07-%236f42c1?style=for-the-badge&logo=github&logoColor=fff&labelColor=%23ffc107" alt="Jimuelle07 GitHub">
  </a>
  <a href="https://github.com/helenaherrero515" target="_blank">
    <img src="https://img.shields.io/badge/helenaherrero515-%236f42c1?style=for-the-badge&logo=github&logoColor=fff&labelColor=%23ffc107" alt="helenaherrero515 GitHub">
  </a>
  <br><br>
</div>

---

## Google Technologies Used

* **Gemini API (`gemini-2.5-flash`)** — Powers three server-side AI features: report moderation (classifies each submission as valid/spam/mismatch, assigns severity, detects duplicates), route check assessment ("Is my route okay tonight?" grounded only in real current reports), and segment risk summarization. The Gemini key is held exclusively server-side on Render — it never reaches the client bundle.

* **Firebase Authentication** — Handles identity for all users. Anonymous sign-in is the default (no friction for first-time reporters); users can optionally upgrade to a persistent Google or email/password account via account linking, preserving their existing report history under the same UID.

* **Cloud Firestore** — Stores the `users/{uid}` role documents that gate admin access, and the `segments` collection seeded during setup. Also serves as the Auth/role source of truth for the `isAdmin` middleware on all admin API routes.

---

## Features

* **Zone Safety Map** — Crowdsourced segment flags on a MapLibre GL + OpenFreeMap rendered map (keyless, no Google Maps dependency)
* **Client-Side Smart Routing** — Rust/WebAssembly A\* engine in a Web Worker over a preprocessed pedestrian graph. No external API, no key, no quota. Returns up to 2 routes: "Recommended" (avoids red/yellow segments) and "Alternative" (shortest path)
* **One-Tap Reporting** — File a condition report (poor lighting, no crowd, recent incident) with Gemini moderation, duplicate detection, and AI severity assignment
* **Pre-Trip Route Check** — Gemini-assessed verdict on whether a selected route is flagged tonight
* **Community Heatmap** — Red/yellow severity overlay showing where validated reports cluster
* **Admin Control Panel** — Restricted dashboard (`/admin`) for report moderation, barangay PDF export, and analytics cache recompilation
* **Barangay PDF Briefs** — AI-generated infrastructure summary reports for 25 zone anchors, downloadable for local government coordination
* **Analytics & Transparency** — Aggregated zone metrics and platform data-integrity counters served from a pre-compiled Firestore cache

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Frontend | React 18.3, Vite 6, MapLibre GL 5.24, OpenFreeMap |
| Routing Engine | Rust/WebAssembly (A\* over a 20km pedestrian graph, Web Worker) |
| Backend API | Node.js 20, Express 4.21 — deployed on Render |
| Database | Cloud Firestore (Auth/users) + Supabase PostgreSQL (reports/analytics) |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Auth | Firebase Authentication |
| Frontend Hosting | Vercel |
| Local Dev | Docker Compose, Firebase Emulator Suite |

---

## SparkFest 2026

This project was developed as part of **SparkFest 2026**, the flagship hackathon organized by the **Google Developer Groups on Campus – Polytechnic University of the Philippines (GDG on Campus PUP)**.

**Challenge Theme:** *"How can we leverage technology to build smarter, safer, and more inclusive communities that enhance public services, strengthen infrastructure, improve accessibility, and create lasting social impact?"*

GuidHer addresses **public safety + inclusion + strong institutions** — community-sourced safety data for women in a single high-risk commute zone, surfaced to local government through downloadable infrastructure briefs.

---

## Installation & Setup

> **Fastest path — Docker:** `docker compose up --build` from the repo root starts everything with no local Node/Java/firebase-tools setup required.

```bash
git clone https://github.com/1-N-2-Dis/GuidHer.git
cd GuidHer
docker compose up --build
```

| URL | Service |
| --- | ------- |
| http://localhost:5173 | Frontend |
| http://localhost:8080 | Backend API |
| http://localhost:4000 | Firebase Emulator UI |

The seed service auto-populates: 8 zone segments, 9 baseline heatmap reports, and 3 demo accounts — `admin@gmail.com`, `user1@gmail.com`, `user2@gmail.com` (password: `Passw0rd!`).

For manual setup and full deployment instructions see [`docs/LOCAL_DEV.md`](docs/LOCAL_DEV.md) and [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md).

---

## Repository Information

* **Live Demo:** https://guidher.vercel.app/
* **GitHub:** https://github.com/1-N-2-Dis/GuidHer/
* **Video Pitch:** https://youtu.be/owj2gd-km5s
* **Presentation Deck:** *URL (optional)*
* **Project Document:** *URL (optional)*

---

<div align="center">
  <i>GuidHer — Because every woman deserves to know before she goes.</i>
</div>
