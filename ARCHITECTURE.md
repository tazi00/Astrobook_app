# ARCHITECTURE.md — Astrobook

> Complete project architecture reference.
> Naya developer aaye ya AI agent — yeh file padhke poora project samajh aayega.

---

## Project Summary

Astrobook ek role-based mobile app hai jahan users astrologers se paid consultation book karte hain — video/voice call ke zariye. Astrologers apna content bhi post kar sakte hain.

```
User                    Astrologer
 ↓                          ↓
Browse astrologers       Create services
Book slot                Set availability
Make payment             Create posts
Join session             Join session
Rate & review            View bookings
```

---

## Repository Structure

```
astrobook/
├── astrobook-mobile/    ← React Native + Expo frontend
└── astrobook-server/    ← Fastify backend
```

Dono alag repos hain — no monorepo.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Mobile | React Native + Expo SDK 56 | Cross-platform iOS + Android |
| Routing | Expo Router | File-based, role-based navigation |
| Server State | React Query | Caching, loading, error handling |
| Global State | Zustand | Lightweight, no Provider needed |
| HTTP | Axios | Interceptors for silent token refresh |
| Backend | Fastify (TypeScript) | Fast, schema-based, plugin system |
| ORM | Drizzle ORM | Type-safe, lightweight |
| Database | PostgreSQL (Railway) | Primary data store |
| Auth | JWT + MSG91 OTP | Custom, Redis-free OTP via PostgreSQL |
| Video/Voice | Agora RTC | Real-time consultation |
| Chat | Agora RTM | In-session messaging |
| Payments | Razorpay | Indian payment gateway |
| File Storage | Cloudinary | Images + videos |
| Jobs | BullMQ + Redis | Scheduled session start/end |
| Push | Expo Push Notifications | Session reminders |

---

## Backend Architecture

### Layer Pattern (per module)

```
HTTP Request
    ↓
Route (auth.routes.ts)         ← URL + method define, schema attach
    ↓
Controller (auth.controller.ts) ← req/res handle, call service
    ↓
Service (auth.service.ts)      ← Business logic + Drizzle queries
    ↓
Database (PostgreSQL)
```

**Rules:**
- Controllers never touch DB directly
- Services contain all logic
- Schemas (Zod) for request validation only — not DB schemas

### Response Format (always)

```ts
// Success
{ success: true, data: any }

// Error
{ success: false, message: string, code?: string }
```

### Folder Structure

```
astrobook-server/src/
├── db/
│   ├── schema/              ← All Drizzle schemas here (never inside modules)
│   │   ├── user.ts
│   │   ├── astrologer.ts
│   │   ├── otp-verification.ts
│   │   ├── auth-session.ts
│   │   ├── service.ts
│   │   ├── availability.ts
│   │   ├── booking.ts
│   │   ├── payment.ts
│   │   ├── session.ts
│   │   ├── message.ts
│   │   ├── post.ts
│   │   └── review.ts
│   ├── index.ts             ← DB connection + export all
│   └── migrations/
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.schema.ts   ← Zod request validation
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
│   └── utils/
├── config/
│   └── env.ts
├── app.ts
└── server.ts
```

---

## Frontend Architecture

### Layer Chain

```
Screen (app/ routing file)
    ↓
Feature Screen Component (features/<name>/screens/)
    ↓
Custom Hook (features/<name>/hooks/) — React Query wraps service
    ↓
Service Class (features/<name>/services/) — class-based singleton
    ↓
apiClient (services/api/client.ts) — Axios singleton + interceptors
    ↓
Backend API
```

### Folder Structure

```
astrobook-mobile/
├── app/                          ← Expo Router — routing ONLY
│   ├── _layout.tsx               ← Auth guard + restoreSession
│   ├── (auth)/
│   ├── (user)/
│   └── (astrologer)/
│
└── src/
    ├── features/                 ← Core — feature-first modules
    │   ├── auth/
    │   │   ├── screens/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/         ← AuthService class
    │   │   ├── store/            ← Feature-local state only
    │   │   ├── types/
    │   │   ├── schema/
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
    ├── components/               ← Global shared UI (Header, Button, etc.)
    ├── constants/                ← App-wide constants
    ├── hooks/                    ← Global hooks (useDebounce, etc.)
    │
    ├── lib/
    │   └── query-client.ts       ← React Query QueryClient
    │
    ├── services/
    │   ├── api/
    │   │   └── client.ts         ← Axios instance + interceptors ← BASE
    │   └── storage/
    │       └── index.ts          ← Typed AsyncStorage wrapper
    │
    ├── store/                    ← Global Zustand (2+ features use)
    │   ├── auth.store.ts
    │   └── cart.store.ts
    │
    ├── mocks/                    ← Mock data — exact backend shape
    ├── utils/                    ← Formatters, date helpers
    ├── types/                    ← Global types + API contracts
    ├── theme/                    ← Colors, spacing, fonts
    └── schema/                   ← Shared Zod schemas
```

---

## Key Design Decisions

### 1. Service Layer — Class-Based

Har feature ka ek service class hai. `apiClient` ke upar banta hai:

```ts
// features/astrologers/services/astrologer.service.ts
class AstrologerService {
  private readonly base = '/astrologers';

  async getAll(filters?: AstrologerFilters) {
    const res = await apiClient.get(this.base, { params: filters });
    return res.data.data as Astrologer[];
  }

  async getById(id: string) {
    const res = await apiClient.get(`${this.base}/${id}`);
    return res.data.data as Astrologer;
  }
}

export const astrologerService = new AstrologerService();
```

**Fayde:**
- Predictable API — class ke methods se pata chalta hai kya-kya possible hai
- Mock karna easy — class swap karo, screens same
- Type-safe — return types explicit

---

### 2. apiClient — Singleton Base

`services/api/client.ts` poori app ka HTTP base hai:

```
apiClient
  ├── baseURL from EXPO_PUBLIC_API_URL
  ├── Request interceptor → accessToken auto-attach
  └── Response interceptor → 401 → silent refresh → retry
```

Koi bhi feature seedha `axios` use nahi karega — hamesha `apiClient`.

---

### 3. Auth Store — Global Zustand

```ts
useAuthStore() → {
  isLoggedIn,
  user,           // /users/me se — role bhi yahan
  accessToken,
  loginSuccess(), // tokens save + user set
  logout(),       // tokens clear
  restoreSession() // app start pe — refresh + /users/me
}
```

`restoreSession()` important hai — yeh `/users/me` call karta hai refreshToken ke baad, isliye role-based redirect sahi kaam karta hai.

---

### 4. Store Placement Rule

```
Global store (src/store/)
  → 2+ features use karte hain
  → auth.store.ts, cart.store.ts

Feature store (features/<name>/store/)
  → sirf uss feature ke andar use hota hai
  → form state, UI state
```

---

### 5. OTP — Redis-Free

OTP `otp_verifications` PostgreSQL table mein — Redis nahi:

```
otp_verifications:
  id, phone, otp_hash (bcrypt), expires_at, attempts, created_at
```

- Rate limit: 3 OTP per phone per 10 min (DB count)
- Max 3 wrong attempts → 429
- One-time use: row deleted after success
- Dev mein: `console.log(otp)` — MSG91 nahi

---

### 6. Refresh Token Rotation

Har `/auth/refresh` call pe:
- Naya `accessToken` (15 min)
- Naya `refreshToken` (30 days) — purana invalid

Frontend dono save karta hai — Axios interceptor mein handle hota hai.

---

### 7. Contract-First Mock Data

Mock data ka shape = exact backend response shape.
Types `src/types/` mein define — mock aur service dono follow karte hain:

```ts
// types/astrologer.types.ts — YEH CONTRACT HAI
export type Astrologer = { id, name, rating, price, ... };

// mocks/astrologers.mock.ts — contract follow karta hai
export const MOCK_ASTROLOGERS: Astrologer[] = [...];

// service — same type return karta hai
async getAll(): Promise<Astrologer[]> { ... }
```

Backend ne response shape change ki → TypeScript error → build time pe pakad lega.

---

### 8. Mock → Real Swap

```ts
// MOCK phase
async getAll() {
  return MOCK_ASTROLOGERS;
}

// REAL phase — sirf internals change
async getAll() {
  const res = await apiClient.get(this.base);
  return res.data.data;
}
```

Screens aur hooks same rehte hain — zero screen changes.

---

### 9. Cart — Local Only

Cart `AsyncStorage` mein stored hai — no backend cart table:

```ts
CartItem = {
  serviceId, astrologerId, scheduledAt,
  price, serviceName, astrologerName
}
```

Slot availability check sirf checkout pe hota hai — `POST /slots/check`.

---

### 10. Post → Book Now Deep Link

```ts
// Feed post mein optional field
linkedServiceId?: string

// Book Now button
if (post.linkedServiceId) → router.push('service/[id]')
else                      → router.push('astrologer-profile')
```

---

## Auth Flow

```
━━━ APP START ━━━━━━━━━━━━━━━━━━━━━━━━━

_layout.tsx
    ↓
restoreSession()
    ↓
AsyncStorage mein refreshToken?  NO → login
    ↓
POST /auth/refresh
Token valid?                     NO → login
    ↓
GET /users/me → user set
    ↓
user.role === 'ASTROLOGER' → (astrologer)/dashboard
user.role === 'USER'       → (user)/feed


━━━ OTP LOGIN ━━━━━━━━━━━━━━━━━━━━━━━━

login.tsx → POST /auth/send-otp
    ↓
otp.tsx → POST /auth/verify-otp
    ↓
loginSuccess() → tokens AsyncStorage
    ↓
isNewUser? YES → onboarding → POST /users/onboard
          NO  → role check → home


━━━ SILENT REFRESH (automatic) ━━━━━━━

Any API call → 401
    ↓
Axios interceptor
    ↓
POST /auth/refresh → new accessToken + refreshToken
    ↓
Original request retry
User ko pata nahi chalta
```

---

## Booking Flow

```
Feed / Astrologer Profile
    ↓
Service Detail (service/[id])
    ↓
"Book Now" → book-slot (date + time)
    ↓
Slot select → 2 options:
  Add to Cart    → cart.tsx (multiple services checkout)
  Proceed        → checkout.tsx (direct)
    ↓
checkout.tsx
  Booking summary + coupon + price breakdown
    ↓
"Proceed to Pay"
    ↓
POST /slots/check → available?
NO  → error → back
YES → POST /bookings → Razorpay order
    ↓
Razorpay SDK opens
    ↓
booking-confirmation.tsx
    ↓
Actual confirm → Razorpay webhook (backend only)
```

---

## Database Tables

| Table | Purpose |
|---|---|
| `users` | All users — both roles |
| `astrologer_profiles` | Astrologer-specific info |
| `otp_verifications` | OTP storage (bcrypt hash, TTL) |
| `auth_sessions` | Refresh tokens |
| `services` | Consultation services created by astrologers |
| `availability` | Weekly schedule (day + time range) |
| `bookings` | Confirmed bookings |
| `payments` | Razorpay payment records |
| `sessions` | Agora session info |
| `messages` | In-session chat history |
| `posts` | Astrologer content posts |
| `reviews` | User ratings after session |

---

## API Routes — Quick Reference

```
Auth:       POST /auth/send-otp, verify-otp, google, refresh, logout
Users:      GET/PATCH /users/me, POST /users/onboard
Astrologers: GET /astrologers, /astrologers/:id
Services:   GET/POST/PATCH/DELETE /services
Slots:      GET /slots/:astroId/:serviceId, POST /slots/check
Bookings:   POST /bookings, GET /bookings/my, /bookings/:id
Sessions:   POST /sessions/:id/join, end, messages
Posts:      GET/POST/DELETE /posts
Reviews:    POST/GET /reviews
```

---

## Environment Variables

### Backend
```env
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
REDIS_URL=              ← BullMQ ke liye sirf (OTP ke liye nahi)
```

### Frontend
```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_AGORA_APP_ID=
EXPO_PUBLIC_RAZORPAY_KEY_ID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

---

## What NOT to Do

| ❌ Mat Karo | ✅ Karo |
|---|---|
| Screen mein seedha axios | Service class use karo |
| DB call in controller | Service layer se karo |
| Redux / Context API | Zustand use karo |
| Redis for OTP | PostgreSQL otp_verifications |
| Slot reserve in cart | Checkout pe check karo |
| Booking confirm from frontend | Webhook se confirm hoga |
| Admin dashboard | Out of scope |
| Post likes/comments | MVP scope nahi |
| Auto refund | Manual only |
| Expo Go for development | `npx expo run:android` |

---

*Astrobook MVP v2.0 — Inevelop Ventures — June 2026*
*ARCHITECTURE.md — Single source of truth for project structure*