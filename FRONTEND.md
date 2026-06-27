# FRONTEND.md — Astrobook Mobile

> AI agents aur developers ke liye frontend instruction file.
> Har feature build karte waqt is file ko update karte rehna.

---

## Project Info

- **Framework:** React Native + Expo (SDK 56, Dev Client)
- **Routing:** Expo Router (file-based)
- **Server State:** React Query (`@tanstack/react-query`)
- **Global State:** Zustand
- **HTTP Client:** Axios (singleton `apiClient`)
- **Mock Phase:** Pehle mock data se poora UI banao, phir real API connect karo

---

## Folder Structure

```
astrobook-mobile/
├── app/                          ← Expo Router — routing ONLY, zero logic
│   ├── _layout.tsx               ← Root layout, auth check, redirect
│   ├── index.tsx                 ← Entry — token check, redirect
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── otp.tsx
│   │   └── onboarding.tsx
│   ├── (user)/
│   │   ├── _layout.tsx           ← Bottom tab navigator — user
│   │   ├── feed.tsx
│   │   ├── explore/
│   │   │   ├── index.tsx
│   │   │   └── [category].tsx
│   │   ├── astrologer-profile.tsx
│   │   ├── service/[id].tsx
│   │   ├── book-slot.tsx
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   ├── booking-confirmation.tsx
│   │   ├── my-bookings.tsx
│   │   ├── post/[id].tsx
│   │   ├── astroverse.tsx
│   │   └── profile.tsx
│   └── (astrologer)/
│       ├── _layout.tsx           ← Bottom tab navigator — astrologer
│       ├── dashboard.tsx
│       ├── services.tsx
│       ├── availability.tsx
│       └── posts.tsx
│
└── src/
    ├── features/                 ← Feature-first — self-contained modules
    │   ├── auth/
    │   │   ├── screens/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/         ← AuthService class
    │   │   ├── store/            ← Auth-local state (form state etc)
    │   │   ├── types/
    │   │   ├── schema/           ← Zod validation for auth forms
    │   │   └── utils/
    │   ├── astrologers/
    │   │   ├── screens/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/         ← AstrologerService class
    │   │   ├── types/
    │   │   └── utils/
    │   ├── feed/
    │   ├── booking/
    │   ├── payment/
    │   ├── consultancy/          ← Session / video call
    │   ├── profile/
    │   ├── session/
    │   ├── review/
    │   └── report/
    │
    ├── components/               ← Global shared UI only (Header, Button etc)
    ├── constants/                ← App-wide constants (route names, keys)
    ├── hooks/                    ← Global hooks (useDebounce, usePermission etc)
    │
    ├── lib/
    │   └── query-client.ts       ← React Query QueryClient setup
    │
    ├── services/                 ← Global services
    │   ├── api/
    │   │   └── client.ts         ← Axios singleton + interceptors
    │   └── storage/
    │       └── index.ts          ← Typed AsyncStorage wrapper
    │
    ├── store/                    ← Truly global Zustand (2+ features use)
    │   ├── auth.store.ts         ← isLoggedIn, user, role, tokens
    │   └── cart.store.ts         ← cart items (AsyncStorage persisted)
    │
    ├── mocks/                    ← Mock data — same shape as backend response
    │   ├── astrologers.mock.ts
    │   ├── services.mock.ts
    │   ├── bookings.mock.ts
    │   ├── posts.mock.ts
    │   └── auth.mock.ts
    │
    ├── utils/                    ← Formatters, date helpers, string utils
    ├── types/                    ← Global TypeScript types + API contracts
    ├── theme/                    ← Colors, spacing, fonts, shadows
    └── schema/                   ← Shared Zod schemas (frontend + backend)
```

---

## Rules — Must Follow

### Architecture
- `app/` mein sirf routing — koi logic, koi state, koi API call nahi
- Logic `src/features/<name>/` mein hoga
- Screen file mein sirf feature ka component render karo
- **Service layer class-based hoga** — singleton export
- API calls sirf `features/<name>/services/` se — screens directly axios nahi chalayenge
- React Query for server state — manual loading/error states nahi
- Zustand sirf global state ke liye — auth, cart
- Feature-local state `features/<name>/store/` mein

### Service Layer Pattern
```ts
// features/astrologers/services/astrologer.service.ts
import apiClient from '@/services/api/client';
import { Astrologer } from '../types';

class AstrologerService {
  private readonly base = '/astrologers';

  async getAll(filters?: AstrologerFilters): Promise<Astrologer[]> {
    const res = await apiClient.get(this.base, { params: filters });
    return res.data.data;
  }

  async getById(id: string): Promise<Astrologer> {
    const res = await apiClient.get(`${this.base}/${id}`);
    return res.data.data;
  }
}

export const astrologerService = new AstrologerService();
```

### Hook Pattern (React Query wraps service)
```ts
// features/astrologers/hooks/use-astrologers.ts
import { useQuery } from '@tanstack/react-query';
import { astrologerService } from '../services/astrologer.service';

export const useAstrologers = () => useQuery({
  queryKey: ['astrologers'],
  queryFn: () => astrologerService.getAll(),
});
```

### Screen Pattern
```ts
// Screen mein — sirf hook use karo, service nahi
const { data, isLoading } = useAstrologers();
```

**Chain:** `Screen → Hook (React Query) → Service Class → apiClient → Backend`

### Mock → Real Swap
Sirf service class ka internal change hoga — screens/hooks same:
```ts
// MOCK
async getAll() { return MOCK_ASTROLOGERS; }

// REAL (swap karo)
async getAll() {
  const res = await apiClient.get(this.base);
  return res.data.data;
}
```

### Contract-First Mock Data
Mock data ka shape = exact backend response shape.
Types global `src/types/` mein define karo — mock aur service dono usi type se:

```ts
// types/astrologer.types.ts — CONTRACT
export type Astrologer = {
  id: string;
  name: string;
  rating: number;
  price: number;
  // ...
};

// mocks/astrologers.mock.ts — isi type ko follow karta hai
export const MOCK_ASTROLOGERS: Astrologer[] = [ ... ];
```

---

## Auth Flow

### App Start
```
App khula
    ↓
_layout.tsx → restoreSession()
    ↓
refreshToken AsyncStorage mein hai?
NO  → (auth)/login
    ↓
YES → POST /auth/refresh → naya accessToken + refreshToken
    ↓
GET /users/me → user object fetch (role ke liye zaroori)
    ↓
role === 'ASTROLOGER' → (astrologer)/dashboard
role === 'USER'       → (user)/feed
```

### Phone OTP Flow
```
(auth)/login
    ↓
Phone enter → POST /auth/send-otp
    ↓
(auth)/otp
    ↓
OTP enter → POST /auth/verify-otp
    ↓
isNewUser?
YES → (auth)/onboarding → POST /users/onboard → home
NO  → role check → home
```

### Google Login (Deferred)
- Dev Client zaroori (`npx expo run:android`)
- Abhi "Coming Soon" Alert hai
- Implement karne ke liye `AUTH.md` dekho

### Auth Store (Zustand)
```ts
// src/store/auth.store.ts
{
  isLoggedIn: boolean,
  isNewUser: boolean,
  user: User | null,          // /users/me se aata hai
  accessToken: string | null,

  loginSuccess(data),         // tokens save + user set
  updateUser(updates),        // onboarding ke baad
  logout(),                   // tokens clear + API call
  restoreSession(),           // app start pe — refresh + /users/me
}
```

---

## Booking Flow

```
Feed Post "Book Now"
    ↓
linkedServiceId hai? → service/[id]
nahi               → astrologer-profile
    ↓
service/[id] → "Book Now" button
    ↓
book-slot (date + time select)
    ↓
2 buttons:
  "Add to Cart"        → cart.tsx (multiple services)
  "Proceed to Checkout" → checkout.tsx (direct)
    ↓
checkout.tsx
  - Booking summary (service, astrologer, slot)
  - Coupon apply
  - Price breakdown
  - "Proceed to Pay • ₹X"
    ↓
POST /slots/check → slot still available?
NO  → error → back to book-slot
YES → POST /bookings → Razorpay order
    ↓
Razorpay checkout opens
    ↓
Payment success/fail → booking-confirmation
    ↓
Actual confirmation → webhook se (backend)
```

---

## Screens Status

| Screen | Status | Notes |
|---|---|---|
| Login | ✅ Done | Phone + Google (Coming Soon) |
| OTP | ✅ Done | Real API wired |
| Onboarding | ✅ Done | Real API wired |
| User Feed | ✅ Done | Mock data |
| Explore | ✅ Done | Mock data |
| Astrologer Profile | ✅ Done | Mock data |
| Service Detail | ✅ Done | Book Now → book-slot |
| Slot Selection | ✅ Done | Date strip + grouped slots |
| Cart | ✅ Done | Local AsyncStorage |
| Checkout | ✅ Done | Coupon + price breakdown |
| Booking Confirmation | ✅ Done | |
| My Bookings | ✅ Done | Mock data |
| Astroverse | ✅ Done | |
| Profile | ✅ Done | Mock data |
| Astrologer Dashboard | ✅ Done | Mock data |
| Astrologer Services | ✅ Done | Mock data |
| Astrologer Availability | ✅ Done | Mock data |
| Astrologer Posts | ✅ Done | Mock data |
| Session Screen | 🔲 Todo | Agora RTC + RTM |
| Review Screen | 🔲 Todo | Rating + comment |

---

## Implemented Files

### Global Services
```
src/services/api/client.ts          ← Axios singleton + silent refresh
src/store/auth.store.ts             ← Zustand auth store
```

### Auth Feature
```
src/features/auth/api/auth.api.ts   ← sendOtp, verifyOtp, onboardUser
app/(auth)/login.tsx                ← Real handlers
app/(auth)/otp.tsx                  ← Real handlers
app/(auth)/onboarding.tsx           ← Real handlers
app/_layout.tsx                     ← Real auth guard
```

---

## Pending Implementation

```
src/lib/query-client.ts             ← React Query setup
src/store/cart.store.ts             ← Cart with AsyncStorage persistence
src/features/*/services/            ← All feature service classes
src/features/*/hooks/               ← React Query hooks per feature
src/types/                          ← Global type contracts
src/mocks/                          ← Restructured mock data
```

---

*Astrobook MVP v2.0 — Inevelop Ventures — June 2026*
*Yeh file update hoti rahegi jaise jaise features build honge.*
