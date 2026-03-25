# Frontend — Image Gallery (React + Vite + TypeScript)

## System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph Client["🌐 Client (Browser)"]
        USER["User"]
    end

    subgraph Frontend["📱 Frontend — Vercel / Netlify"]
        REACT["React + Vite SPA"]
        MASONRY["Masonry Layout"]
        SCROLL["Infinite Scroll"]
        FILTER["Hashtag Filter"]
    end

    subgraph Backend["⚙️ Backend — Render / Koyeb"]
        GIN["Gin HTTP Server"]
        HANDLER["Handlers Layer"]
        REPO["Repository Layer"]
    end

    subgraph Database["🗄️ Database — Supabase / Neon"]
        PG["PostgreSQL"]
    end

    USER -->|"HTTPS"| REACT
    REACT -->|"REST API (JSON)"| GIN
    GIN --> HANDLER
    HANDLER --> REPO
    REPO -->|"SQL"| PG
    REACT --- MASONRY
    REACT --- SCROLL
    REACT --- FILTER
```

---

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React.js** | UI Library |
| **Vite** | Build tool (HMR, Fast bundling) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling + Responsive design |
| **react-masonry-css** | Masonry layout สำหรับรูปขนาดต่างกัน |
| **axios** | HTTP client สำหรับเรียก Backend API |
| **IntersectionObserver API** | ตรวจจับ scroll position สำหรับ Infinite Scroll |

---

## Frontend Architecture

```mermaid
graph TD
    subgraph Entry["Entry Point"]
        MAIN["main.tsx"]
        INDEX_CSS["index.css - Tailwind"]
    end

    subgraph App["App Layer"]
        APP["App.tsx"]
    end

    subgraph Pages["Pages"]
        GALLERY["Gallery.tsx"]
    end

    subgraph Components["UI Components"]
        IMGCARD["ImageCard.tsx"]
        HASHFILTER["HashtagFilter.tsx"]
    end

    subgraph Hooks["Custom Hooks"]
        USESCROLL["useInfiniteScroll.ts"]
    end

    subgraph Services["API Layer"]
        API_SVC["api.ts - Axios"]
    end

    subgraph Types["Type Definitions"]
        TYPES["types/index.ts"]
    end

    MAIN --> APP
    MAIN --> INDEX_CSS
    APP --> GALLERY

    GALLERY --> IMGCARD
    GALLERY --> HASHFILTER
    GALLERY --> USESCROLL
    GALLERY --> API_SVC

    IMGCARD --> TYPES
    HASHFILTER --> TYPES
    API_SVC --> TYPES
```

### Layer Responsibilities

| Layer | Files | Responsibility |
|-------|-------|----------------|
| **Entry** | `main.tsx`, `index.css` | React mount point, Tailwind CSS |
| **Pages** | `Gallery.tsx` | State management, API orchestration, layout composition |
| **Components** | `ImageCard.tsx`, `HashtagFilter.tsx` | UI presentation (stateless, reusable) |
| **Hooks** | `useInfiniteScroll.ts` | IntersectionObserver logic สำหรับ Infinite Scroll |
| **Services** | `api.ts` | HTTP requests via axios, response typing |
| **Types** | `types/index.ts` | Shared TypeScript interfaces (Image, Hashtag, Response) |

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.ts              ← Vite + Tailwind plugin config
├── package.json
├── tsconfig.json
├── .env.example                ← VITE_API_URL
├── .gitignore
└── src/
    ├── main.tsx                ← React entry point
    ├── App.tsx                 ← Root component
    ├── index.css               ← Tailwind CSS import
    ├── types/
    │   └── index.ts            ← TypeScript interfaces
    ├── services/
    │   └── api.ts              ← Axios API client (getImages, getHashtags)
    ├── components/
    │   ├── ImageCard.tsx        ← แสดงรูปภาพ + clickable hashtags
    │   └── HashtagFilter.tsx    ← Hashtag pill buttons + active state
    ├── hooks/
    │   └── useInfiniteScroll.ts ← IntersectionObserver custom hook
    └── pages/
        └── Gallery.tsx          ← หน้าหลัก (Masonry + Scroll + Filter)
```

---

## Request Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant API as Backend (Gin :8080)
    participant DB as PostgreSQL

    Note over User, DB: Initial Page Load

    User->>FE: เปิดหน้าเว็บ
    FE->>API: GET /api/hashtags
    API->>DB: SELECT hashtags + COUNT
    DB-->>API: hashtag list
    API-->>FE: 200 OK (JSON)

    FE->>API: GET /api/images?page=1&limit=15
    API->>DB: SELECT images LIMIT 15 OFFSET 0
    DB-->>API: images batch 1
    API-->>FE: 200 OK - data, has_more
    FE->>User: แสดง Masonry Gallery

    Note over User, DB: Infinite Scroll

    User->>FE: เลื่อนลงมาถึง bottom
    FE->>FE: IntersectionObserver triggered
    FE->>API: GET /api/images?page=2&limit=15
    API->>DB: SELECT images LIMIT 15 OFFSET 15
    DB-->>API: images batch 2
    API-->>FE: 200 OK
    FE->>User: Append รูปเพิ่ม

    Note over User, DB: Hashtag Filtering

    User->>FE: คลิก #nature
    FE->>FE: Clear images, reset page=1
    FE->>API: GET /api/images?page=1&limit=15&hashtag=nature
    API->>DB: SELECT WHERE hashtag = nature
    DB-->>API: filtered images
    API-->>FE: 200 OK
    FE->>User: แสดงเฉพาะรูป #nature
```

---

## Features

| Feature | Implementation | Description |
|---------|---------------|-------------|
| **Gallery Display** | `Gallery.tsx` + `ImageCard.tsx` | แสดงรูปภาพพร้อม Hashtag ใต้รูป |
| **Masonry Layout** | `react-masonry-css` | รูปขนาดไม่เท่ากัน (Dynamic Aspect Ratio) |
| **Infinite Scroll** | `useInfiniteScroll.ts` | โหลดรูปเพิ่มอัตโนมัติเมื่อ scroll ถึง bottom |
| **Hashtag Filtering** | `HashtagFilter.tsx` | คลิก hashtag → เคลียร์รูปเก่า → โหลดรูปที่ match |
| **Responsive Design** | Tailwind CSS breakpoints | 1 col (mobile) → 2 col (tablet) → 3-4 col (desktop) |

---

## API Integration

| Endpoint | Function | Usage |
|----------|----------|-------|
| `GET /api/images?page=&limit=&hashtag=` | `getImages()` | ดึงรูปภาพ + pagination + filter |
| `GET /api/hashtags` | `getHashtags()` | ดึง hashtag ทั้งหมดพร้อม count |

---

## Deployment

| Item | Detail |
|------|--------|
| **Provider** | Vercel หรือ Netlify |
| **Platform** | Serverless, Node.js Environment |
| **Specs** | Auto-scaling (Free Tier) |
| **Method** | CI/CD เชื่อมต่อ GitHub — auto build & deploy เมื่อ push |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist/` |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# แก้ไข VITE_API_URL ถ้า backend ไม่ได้รันที่ localhost:8080

# 3. Start dev server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Backend API base URL |
