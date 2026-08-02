# Aura - Next-Generation Enterprise Social Platform 🚀

Aura is an original, ultra-modern, production-ready social media ecosystem designed for real-time spatial creative sharing, generative AI workflows, WebRTC audio/video lounges, creator monetization, and high-frequency community spaces.

---

## Key Feature Matrix

### 🌟 Core Architectural Features
- **Monorepo Architecture**: Clean separation between Next.js 15 App Router frontend and NestJS / Express API backend.
- **Glassmorphism UI System**: Modern aesthetic with fluid micro-animations (Framer Motion), ambient glowing light spots, liquid navigation docks, and WCAG-compliant high-contrast dark mode.
- **Multi-Type Post Engine**: Photos, Videos, Carousels, Audio Frequency Streams (WebAudio), Live Polls, Text Stories, Scheduled Posts, and Pinned Creations.
- **Dynamic Feeds Algorithm**: Recommended ("For You"), Following, Trending, Audio Reels, and Nearby Location streams.
- **Real-Time Subsystem**: Socket.io real-time chat, typing indicators, read receipts, and WebRTC P2P audio/video calling.
- **Generative AI Suite**: Automated caption generator, hashtag suggestions, and intelligent content safety scanning.
- **Creator Monetization & Studio**: Subscriber VIP plans, direct tipping, engagement analytics charts, and impressions reach breakdown.
- **Admin Governance & Safety**: Content report queue, user verification badges, shadowban/suspension management, and audit logs.

---

## Tech Stack Overview

| Domain | Technology |
| :--- | :--- |
| **Frontend Web** | Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Redux Toolkit, React Query, Lucide Icons |
| **Backend API** | Node.js, NestJS / Express, TypeScript, Zod, JWT, bcryptjs |
| **Database & Cache** | PostgreSQL, Prisma ORM 6, Redis In-Memory Engine |
| **Realtime & Calling** | Socket.io Client & Server, WebRTC P2P Signaling |
| **DevOps & Infra** | Docker, Docker Compose, Nginx Reverse Proxy, GitHub Actions CI/CD |

---

## Quick Start & Installation

### Prerequisites
- Node.js v20+
- PostgreSQL & Redis (or Docker Compose)

### 1. Monorepo Setup
```bash
# Clone the repository
git clone https://github.com/your-username/aura-social.git
cd aura-social

# Install all workspace dependencies
npm install
```

### 2. Environment Configuration
Create a `.env` file in `backend/` and `frontend/`:
```env
# backend/.env
PORT=4000
DATABASE_URL="postgresql://aura_user:aura_secure_password_2026@localhost:5432/aura_db"
JWT_SECRET="aura-ultra-secure-jwt-secret-key-2026"

# frontend/.env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

### 3. Run Database Migrations
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Servers
```bash
# Start backend API (port 4000) and frontend App (port 3000) simultaneously
npm run dev
```

---

## Docker Deployment

To launch the full production environment with PostgreSQL, Redis, NestJS, Next.js, and Nginx reverse proxy using Docker Compose:

```bash
npm run docker:up
```

Open `http://localhost` in your browser.

---

## Monorepo Directory Structure

```
aura-social/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Auth, User, Post, Feed, Social, AI, Analytics, Admin
│   │   ├── services/         # Prisma DB service & Redis fallback
│   │   ├── sockets/          # Socket.io gateway & WebRTC signaling
│   │   └── server.ts         # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js 15 pages (Home, Explore, Reels, Messages, Profile, Studio, Admin)
│   │   ├── components/       # Glassmorphism Layout, PostCard, CreatePostModal, VideoCallModal
│   │   ├── store/            # Redux Toolkit feed & modal state
│   │   └── lib/              # Axios API helper
│   ├── package.json
│   └── tailwind.config.js
├── prisma/
│   └── schema.prisma         # PostgreSQL normalized schema
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── .github/
│   └── workflows/
│       └── ci-cd.yml
└── README.md
```

---

## License & Governance
Designed and built for enterprise scalability. © 2026 Aura Platform Inc.
