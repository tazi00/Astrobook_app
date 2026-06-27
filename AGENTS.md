# AGENTS.md — Astrobook

> This file is for AI coding agents (Claude Code, Cursor, Copilot, etc.).
> Read this fully before writing any code.

---

## Project Overview

**Astrobook** is a role-based mobile app connecting users with astrologers for paid consultation sessions via video or voice call, with real-time in-session chat and file sharing. Astrologers can also post content for users to discover.

- **Platform:** React Native + Expo (Dev Client) — iOS & Android
- **Team:** Inevelop Ventures
- **Version:** MVP 2.0

---

## Roles

Single app — two roles determined at registration:

| Role | Description |
|---|---|
| `USER` | Browse astrologers, book sessions, join sessions, view posts, rate/review |
| `ASTROLOGER` | Create services, set availability, create posts, join sessions, view bookings |

Role is stored in JWT. Navigation changes based on role.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native + Expo Dev Client |
| Backend | Fastify (TypeScript) |
| ORM | Drizzle ORM |
| Database | PostgreSQL on Railway |
| Auth | Custom JWT + MSG91 OTP + Google OAuth |
| Video / Voice | Agora RTC |
| In-session Chat | Agora RTM |
| Payments | Razorpay |
| File Storage | Cloudinary |
| Job Scheduling | BullMQ + Redis |
| Notifications | Expo Push Notifications |
| Server State | React Query |
| Global State | Zustand |
| Cart Storage | AsyncStorage (local, no backend cart table) |

---

## Repositories

Two separate repos — no monorepo.

| Repo | Description |
|---|---|
| `astrobook-server` | Fastify backend |
| `astrobook-mobile` | React Native + Expo frontend |

---

## Backend Structure — `astrobook-server/src/`

```
src/
├── db/
│   ├── schema/
│   │   ├── user.ts
│   │   ├── astrologer.ts
│   │   ├── service.ts
│   │   ├── availability.ts
│   │   ├── otp-verification.ts   ← OTP PostgreSQL mein (Redis nahi)
│   │   ├── booking.ts
│   │   ├── payment.ts
│   │   ├── session.ts
│   │   ├── message.ts
│   │   ├── post.ts
│   │   └── review.ts
│   ├── index.ts
│   └── migrations/
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.schema.ts
│   ├── astrologer/
│   ├── service/
│   ├── slot/
│   ├── booking/
│   ├── session/
│   ├── post/
│   └── review/
├── jobs/
│   ├── session-start.job.ts
│   └── session-end.job.ts
├── webhooks/
│   └── razorpay.webhook.ts
├── shared/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   ├── errors/
│   │   └── app-error.ts
│   ├── utils/
│   └── types/
├── config/
│   └── env.ts
├── app.ts
└── server.ts
```

### Backend Conventions

- **3-layer architecture per module:** `routes → controller → service`
- Controllers never touch DB directly — always call service
- Services contain all business logic and Drizzle queries
- `auth.schema.ts` = Zod schemas for request validation (not DB schema)
- All routes use `fastify-plugin` for encapsulation
- Error responses: `{ success: false, message: string, code?: string }`
- Success responses: `{ success: true, data: any }`
- All IDs are UUIDs
- Timestamps use `defaultNow()` in Drizzle
- Enums defined in `db/schema/` and reused across modules
- OTP stored in PostgreSQL (`otp_verifications` table) — Redis NOT used

---

## Frontend Structure — `astrobook-mobile/src/`

```
src/
├── app/                        ← Expo Router (routing only — no logic here)
│
├── features/                   ← Feature-first — each feature is self-contained
│   ├── auth/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/           ← AuthService class
│   │   ├── store/              ← Auth-local state only (form state etc)
│   │   ├── types/
│   │   ├── schema/             ← Zod validation for auth forms
│   │   └── utils/
│   ├── astrologers/
│   ├── feed/
│   ├── booking/
│   ├── payment/
│   ├── consultancy/
│   ├── profile/
│   ├── session/
│   ├── review/
│   └── report/
│
├── components/                 ← Global shared UI components only
│
├── constants/                  ← App-wide constants (routes, keys, etc.)
│
├── hooks/                      ← Global hooks used across features
│
├── lib/                        ← Library initializations
│   ├── query-client.ts         ← React Query client setup
│   └── axios.ts                ← (re-exports from services/api/client)
│
├── services/                   ← Global services
│   ├── api/
│   │   └── client.ts           ← Axios instance + interceptors (singleton)
│   └── storage/
│       └── index.ts            ← Typed AsyncStorage wrapper
│
├── store/                      ← Truly global Zustand stores (2+ features use)
│   ├── auth.store.ts           ← isLoggedIn, user, role, tokens
│   └── cart.store.ts           ← Cart items (AsyncStorage persisted)
│
├── mocks/                      ← Mock data + mock service implementations
│   ├── astrologers.mock.ts
│   ├── services.mock.ts
│   ├── bookings.mock.ts
│   ├── posts.mock.ts
│   └── auth.mock.ts
│
├── utils/                      ← Global helpers (formatters, date, string)
├── types/                      ← Global TypeScript types + API contracts
├── theme/                      ← Colors, spacing, fonts, shadows
└── schema/                     ← Shared Zod schemas (frontend + backend shared)
```

### Frontend Conventions

- `app/` folder mein sirf routing — zero logic
- Feature-based — each feature is self-contained
- **Service layer is class-based** — `new AstrologerService()`, exported as singleton
- All services extend/use `apiClient` from `services/api/client.ts`
- API calls go in `features/<name>/services/` — no direct axios calls in screens
- React Query for all server state — no manual loading/error states in screens
- Zustand for global client state — auth, cart only
- Feature-local state in `features/<name>/store/` — form state, UI state
- Mock data shape = exact backend response shape — **contract-first**
- Cart stored locally in AsyncStorage — no backend cart table
- Google Login deferred — OTP flow first, Dev Client required

### Service Layer Pattern

Every feature has a class-based service:

```ts
// features/astrologers/services/astrologer.service.ts
class AstrologerService {
  private readonly base = '/astrologers';
  async getAll(filters?) { ... }
  async getById(id: string) { ... }
  async getAvailability(id: string, date: string) { ... }
}
export const astrologerService = new AstrologerService();
```

Chain: `Screen → Hook (React Query) → Service Class → apiClient → Backend`

### Mock → Real API Swap Strategy

Mock phase mein service returns mock data. Real API phase mein sirf service internals change hote hain — screens/hooks same rehte hain:

```ts
// MOCK phase
async getAll() {
  return MOCK_ASTROLOGERS;
}

// REAL phase
async getAll() {
  const res = await apiClient.get(this.base);
  return res.data.data;
}
```

---

## Database Schema Summary

| Table | Key Fields |
|---|---|
| `users` | id, name, email, phone, role, google_id, is_onboarded |
| `astrologer_profiles` | user_id, bio, experience_years, languages[], specializations[], rating, photo_url |
| `otp_verifications` | id, phone, otp_hash, expires_at, attempts, created_at |
| `auth_sessions` | id, user_id, refresh_token, expires_at |
| `services` | astrologer_id, name, duration_mins, price, call_type (VIDEO/VOICE), is_active |
| `availability` | astrologer_id, day_of_week (0-6), start_time, end_time |
| `bookings` | user_id, service_id, astrologer_id, scheduled_at, status, payment_status |
| `payments` | booking_id, razorpay_order_id, razorpay_payment_id, amount, status |
| `sessions` | booking_id, agora_channel, started_at, ended_at, status |
| `messages` | session_id, sender_id, content, file_url, sent_at |
| `posts` | astrologer_id, content, media_url, media_type (IMAGE/VIDEO), linked_service_id |
| `reviews` | booking_id, user_id, astrologer_id, rating (1-5), comment |

---

## API Routes Summary

### Auth
```
POST /auth/send-otp
POST /auth/verify-otp
POST /auth/google
POST /auth/refresh        ← Refresh token rotation — returns new both tokens
POST /auth/logout
GET  /users/me            ← App restart pe user fetch (role check ke liye)
PATCH /users/me
POST /users/onboard
```

### Astrologers
```
GET  /astrologers
GET  /astrologers/:id
PATCH /astrologers/profile
POST /astrologers/availability
GET  /astrologers/:id/availability
```

### Services
```
GET  /services/astrologer/:id
POST /services
PATCH /services/:id
DELETE /services/:id
```

### Slots
```
GET  /slots/:astrologerId/:serviceId?date=YYYY-MM-DD
POST /slots/check
```

### Bookings
```
POST /bookings
POST /bookings/webhook
GET  /bookings/my
GET  /bookings/:id
```

### Sessions
```
POST /sessions/:bookingId/join
POST /sessions/:id/end
GET  /sessions/:id/messages
POST /sessions/:id/messages
```

### Posts
```
GET  /posts
GET  /posts/astrologer/:id
POST /posts
DELETE /posts/:id
```

### Reviews
```
POST /reviews
GET  /reviews/astrologer/:id
```

---

## Key Business Logic

### Auth — OTP (Redis-free)
- OTP stored in PostgreSQL `otp_verifications` table — no Redis
- OTP bcrypt-hashed before storing — plain text never stored
- Rate limit: 3 OTP requests per phone per 10 min (DB count check)
- Max 3 wrong attempts → 429, must resend
- One-time use: OTP row deleted after successful verify
- Refresh token rotation: every refresh returns new both tokens
- `/users/me` called after session restore — role-based redirect correct hoga

### Slot System
- Slots generated dynamically — no Slot table in DB
- Algorithm: fetch availability → generate slots (window / duration) → remove confirmed bookings overlap → return available
- Slots NOT reserved in cart
- Slot blocked only after payment webhook confirms

### Cart + Checkout
- Cart in AsyncStorage (Zustand + persist)
- Cart item: `{ serviceId, astrologerId, scheduledAt, price, serviceName, astrologerName }`
- At checkout: `POST /slots/check` first → slot taken? → error → reselect
- All slots ok → `POST /bookings` → Razorpay order → open Razorpay checkout
- Booking confirmed only after webhook

### Payment Flow
- Never confirm from frontend callback — webhook only
- Webhook: `POST /bookings/webhook`
- Verify Razorpay signature before processing
- On success: create bookings, schedule BullMQ jobs

### Post → Book Now Deep Link
- Posts can have optional `linkedServiceId`
- "Book Now" in feed: `linkedServiceId` hai → `service/[id]` → else → `astrologer-profile`
- Astrologer can link their service when creating a post

### Session Flow
- BullMQ job at `scheduled_at` → push notification to both
- Join: `POST /sessions/:bookingId/join` → Agora RTC + RTM tokens
- Channel: `session_{booking_id}`
- BullMQ end-job at `scheduled_at + duration_mins` → revoke tokens → ENDED
- No session extension in MVP

### In-Session Chat
- Agora RTM for real-time messaging
- Files → Cloudinary upload first → URL via RTM
- Messages saved to DB for history

---

## Auth Implementation Status

### Implemented ✅
- `src/services/api/client.ts` — Axios singleton + silent refresh interceptor
- `src/store/auth.store.ts` — Zustand store with `restoreSession()` + `/users/me`
- `src/features/auth/api/auth.api.ts` — sendOtp, verifyOtp, onboardUser
- `app/_layout.tsx` — Real auth guard
- `login.tsx`, `otp.tsx`, `onboarding.tsx` — Real handlers wired

### Pending ⏳
- Google Login (`@react-native-google-signin/google-signin`) — Dev Client required
- React Query setup in `lib/query-client.ts`
- Cart store with AsyncStorage persistence

---

## What NOT to Do

- Do NOT add admin dashboard — out of scope
- Do NOT add courses or products — out of scope
- Do NOT add post likes/comments/share — out of scope
- Do NOT reserve/hold slots in cart — real-time check at checkout only
- Do NOT confirm bookings from frontend payment callback — webhook only
- Do NOT put schema files inside module folders — always in `db/schema/`
- Do NOT call DB directly from controllers — always go through service layer
- Do NOT add automatic refund logic — manual only for MVP
- Do NOT use Redis for OTP — PostgreSQL otp_verifications table use karo
- Do NOT make direct axios calls in screens — always go through service class

---

## Environment Variables

### Backend (`astrobook-server/.env`)
```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
MSG91_AUTH_KEY=
MSG91_TEMPLATE_ID=
GOOGLE_CLIENT_ID=
AGORA_APP_ID=
AGORA_APP_CERTIFICATE=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REDIS_URL=                ← BullMQ ke liye (OTP ke liye nahi)
```

### Frontend (`astrobook-mobile/.env`)
```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_AGORA_APP_ID=
EXPO_PUBLIC_RAZORPAY_KEY_ID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

---

*Astrobook MVP v2.0 — Inevelop Ventures — June 2026*
