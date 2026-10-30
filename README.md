# Capital Connect Conclave 2026

**Digital Event Experience Platform**  
**Event Organizer:** Startup Synerz  
**Technology Partner:** UCreates  
**Platform Concept:** ULink Live  
**Architecture:** Next.js 16 (App Router) • TypeScript • Tailwind CSS • Local Persistence Service Layer

---

## Overview

Capital Connect Conclave is an institutional digital event ecosystem engineered to unite high-conviction founders with leading venture capital funds, family offices, and angel syndicates. 

Built with Apple-inspired product aesthetics, disciplined typography, and real-time interactive workflows, this MVP allows organizers and delegates to experience the full end-to-end conclave journey without external infrastructure overhead.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build Validation
```bash
npm run build
```

---

## Core Application Routes

- `/` — **Public Event Microsite**: Event branding, theme, live metrics, pillars, featured speakers, agenda preview, and attendee access CTAs.
- `/access` — **Attendee Access Portal**: Official delegate credential verification, invitation lookup, and 1-click demo persona entry.
- `/app` — **Personalized Attendee Hub**: Welcome banner, next upcoming session countdown, inline connection accept/decline, upcoming deal meetings, recommendation engine.
- `/app/pass` — **Digital Credential Pass**: Luxury physical lanyard styling, SVG QR code with non-sensitive token, print/PDF button, token copy.
- `/app/people` — **Directory & Investor Discovery**: Multi-filter by category, industry sector, stage, and keyword search. Direct meeting request integration.
- `/app/people/[id]` — **Profile Dossier**: Startup traction metrics & pitch elevator or investor check sizes & thesis, with institutional privacy protection.
- `/app/connections` — **Connection Management**: Tabs for Connected (Accepted), Received, and Sent requests with real-time status transitions.
- `/app/meetings` — **Deal Room Scheduler**: Predefined 20-minute conclave slots & Level 2 deal pods, conflict double-booking prevention.
- `/app/agenda` — **Summit Agenda**: 2-day programme, track category pills, speaker details modal, persistent personal agenda bookmarking ("My Schedule").
- `/admin` — **Organizer Command Center**: Live KPIs, camera & manual QR check-in scanner with duplicate pass detection, attendee enrollment & editing, access suspension, session publisher, broadcast alert center.
- `/app/post-event` — **Post-Event Continuity Hub**: Verified participation certificate, connection contact export (CSV), 4-metric evaluation form.

---

## Demo Mode & Role Switcher

The application features a sticky **DemoBar** at the top of every screen:

- **Arjun Mehta (Founder)** — CEO, NeuralScale AI (Seed Stage, raising $2.5M)
- **Elena Rostova (Investor)** — Partner, Apex Horizon Ventures (Pre-seed to Series A, $1M–$5M checks)
- **Dr. Rajesh Kulkarni (Mentor)** — Strategic Advisor & Former MD, Omnitech Advisors
- **Priya Nair (Ecosystem Partner)** — Director of Open Innovation, Vertex Capital Partners
- **Sanjay Verma (Organizer)** — Conclave Director, Startup Synerz

Clicking any persona instantly switches active authentication, digital pass credentials, incoming requests, and admin permissions across the platform.

A **Reset All Conclave Data** button restores the full seed dataset at any time.

---

## Design System

- **Primary Background:** `#080E18`
- **Secondary Background:** `#0D1522`
- **Surface:** `#111B2A`
- **Elevated Surface:** `#172335`
- **Primary Text:** `#F5F3EF`
- **Secondary Text:** `#9AA6B5`
- **Accent Champagne:** `#C7A875` (Hover: `#DFC394`)
- **Steel Blue:** `#7998B8`
- **Typography:** Manrope (UI), Instrument Serif (Headings), Inter (Data)
- **Mobile Navigation:** Fixed bottom navigation bar (`/app`, `/app/people`, `/app/agenda`, `/app/connections`, `/app/pass`)

---

## Future Backend Migration (Supabase)

All application data is consumed exclusively via strongly typed interfaces in `src/types/index.ts` and managed through `src/services/*`. 

To connect to production Supabase:
1. Initialize the PostgreSQL schema matching the types defined in `src/types/index.ts`.
2. Configure `.env.local` using `.env.example`.
3. Replace the local storage calls in `src/services/*` with Supabase Client queries without needing to modify any UI components.
