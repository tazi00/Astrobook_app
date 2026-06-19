# FRONTEND.md — Astrobook Mobile

> AI agents aur developers ke liye frontend instruction file.
> Har feature build karte waqt is file ko update karte rehna.

---

## Project Info

- **Framework:** React Native + Expo (SDK 56)
- **Routing:** Expo Router (file-based)
- **Styling:** NativeWind (Tailwind for RN)
- **State:** Zustand
- **Server State:** React Query
- **Mock Phase:** Pehle mock data se poora UI banao, phir real API connect karo

---

## Folder Structure

```
app/                          ← Expo Router (routing only — no logic here)
├── _layout.tsx               ← Root layout, auth check, redirect
├── index.tsx                 ← Entry — token check karo, redirect karo
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── otp.tsx
│   └── onboarding.tsx
├── (user)/
│   ├── _layout.tsx           ← Bottom tab navigator — user
│   ├── feed.tsx
│   ├── explore.tsx
│   ├── my-bookings.tsx
│   └── profile.tsx
└── (astrologer)/
    ├── _layout.tsx           ← Bottom tab navigator — astrologer
    ├── dashboard.tsx
    ├── services.tsx
    ├── availability.tsx
    └── posts.tsx

src/
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api/
│   ├── feed/
│   ├── explore/
│   ├── astrologer/
│   ├── booking/
│   ├── session/
│   ├── my-bookings/
│   ├── review/
│   └── posts/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── store/
│   ├── auth.store.ts         ← isLoggedIn, user, role, token
│   └── cart.store.ts         ← cart items (AsyncStorage persist)
└── mock/
    ├── auth.mock.ts
    ├── astrologers.mock.ts
    ├── services.mock.ts
    ├── bookings.mock.ts
    └── posts.mock.ts
```

---

## Rules

- `app/` folder mein sirf routing files — koi logic nahi
- Logic `src/features/<name>/` mein hoga
- Screen file mein sirf feature ka component import karo
- API calls `src/features/<name>/api/` mein likhna
- Mock phase mein `src/mock/` se data aayega — API ready hone par sirf api/ file change karni hogi, screens same rahenge
- Zustand sirf global state ke liye — auth, cart
- React Query server state ke liye — astrologers, bookings, etc.

---

## Auth Flow

### App Start

```
App khula
    ↓
JWT token AsyncStorage mein hai?
    ↓
NO → (auth)/login
    ↓
YES → token valid hai?
    ↓
NO → (auth)/login
    ↓
YES → role check
    ↓
USER → (user)/feed
ASTROLOGER → (astrologer)/dashboard
```

### Phone Login Flow

```
(auth)/login
    ↓
Phone number enter karo
    ↓
POST /auth/send-otp (mock: always success)
    ↓
(auth)/otp
    ↓
OTP enter karo (mock: "1234" always works)
    ↓
New user hai? (mock: flag se check)
    ↓
YES → (auth)/onboarding → role select → (user)/feed ya (astrologer)/dashboard
NO  → role check → (user)/feed ya (astrologer)/dashboard
```

### Google Login Flow

```
(auth)/login
    ↓
"Continue with Google" tap
    ↓
Google OAuth (mock: skip, directly success)
    ↓
New user hai?
    ↓
YES → (auth)/onboarding
NO  → role check → home
```

### Mock Auth Store (Zustand)

```ts
// src/store/auth.store.ts
{
  isLoggedIn: boolean,
  isNewUser: boolean,
  role: 'USER' | 'ASTROLOGER' | null,
  user: { id, name, phone, email } | null,
  token: string | null,

  // Actions
  login(role, isNewUser),
  logout(),
  setUser(user),
}
```

### Mock Behaviour

- OTP screen mein "1234" enter karne par login success
- `isNewUser: true` → onboarding dikhega
- `isNewUser: false` → seedha home
- Onboarding mein role select hoga — USER ya ASTROLOGER
- Role ke hisaab se alag navigator load hoga

---

## Screens Status

| Screen                  | Status  | Notes                            |
| ----------------------- | ------- | -------------------------------- |
| Login                   | 🔲 Todo | Phone + Google option            |
| OTP                     | 🔲 Todo | Mock: "1234" works               |
| Onboarding              | 🔲 Todo | Role select — User ya Astrologer |
| User Feed               | 🔲 Todo | Posts list                       |
| User Explore            | 🔲 Todo | Astrologer list                  |
| Astrologer Profile      | 🔲 Todo | Profile + services               |
| Service Detail          | 🔲 Todo | Book karo                        |
| Slot Selection          | 🔲 Todo | Date + time pick                 |
| Cart                    | 🔲 Todo | Added services                   |
| Checkout                | 🔲 Todo | Review + pay                     |
| My Bookings             | 🔲 Todo | Upcoming/Completed/Cancelled     |
| Session Screen          | 🔲 Todo | Video/voice + chat               |
| Review Screen           | 🔲 Todo | Rating + comment                 |
| Astrologer Dashboard    | 🔲 Todo | Upcoming bookings                |
| Astrologer Services     | 🔲 Todo | CRUD services                    |
| Astrologer Availability | 🔲 Todo | Weekly schedule                  |
| Astrologer Posts        | 🔲 Todo | Create/manage posts              |

---

## API → Mock Swap Strategy

Mock phase mein:

```ts
// src/features/auth/api/auth.api.ts
export const sendOtp = async (phone: string) => {
  // MOCK
  return { success: true };
  // REAL (baad mein uncomment)
  // return await apiClient.post('/auth/send-otp', { phone })
};
```

Real API phase mein sirf `api/` files change hongi — screens touch nahi karni padegi.

---

_Astrobook MVP v2.0 — Inevelop Ventures — June 2026_
_Yeh file update hoti rahegi jaise jaise features build honge._
