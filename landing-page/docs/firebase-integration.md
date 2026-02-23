# Firebase Integration

This guide covers the Firebase Analytics integration built into the landing page template. The analytics module follows Clean Architecture principles with swappable service implementations and dependency injection.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Analytics Setup](#analytics-setup)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Local Development](#local-development)
7. [Testing](#testing)

## Overview

The analytics module provides a unified interface for tracking events, user identity, and user properties. It ships with two implementations:

| Implementation             | When used                                             |
| -------------------------- | ----------------------------------------------------- |
| `FirebaseAnalyticsService` | Browser environment **and** Firebase config is set    |
| `LocalAnalyticsService`    | Server-side rendering **or** Firebase config is unset |

The active implementation is selected automatically at container registration time — no code changes are needed to switch between them.

## Architecture

The module follows the same layered structure as the rest of the codebase:

```
src/modules/analytics/
├── domain/
│   └── interfaces.ts          # AnalyticsService interface
├── infrastructure/
│   └── services/
│       ├── firebase-analytics-service.ts   # Firebase SDK implementation
│       └── local-analytics-service.ts      # Console-logging fallback
└── module-configuration.ts    # DI registration
```

### Domain Layer — `AnalyticsService`

The `AnalyticsService` interface defines four methods:

| Method                | Description                                  |
| --------------------- | -------------------------------------------- |
| `initialize()`        | Initialise the analytics provider            |
| `logEvent()`          | Log a named event with optional parameters   |
| `setUserId()`         | Associate a user ID with subsequent events   |
| `setUserProperties()` | Attach custom properties to the current user |

All presentation and application code depends only on this interface, making it straightforward to swap providers (e.g. replace Firebase with Mixpanel or PostHog) without touching consumers.

### Infrastructure Layer — Implementations

**`FirebaseAnalyticsService`** wraps the Firebase JS SDK (`firebase/analytics`). On `initialize()` it:

1. Skips initialisation on the server (`typeof window === "undefined"`).
2. Reads the Firebase config from `NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG`.
3. Checks browser support via `isSupported()`.
4. Reuses an existing Firebase app or creates a new one.
5. Obtains the `Analytics` instance for subsequent calls.

Errors during initialisation are caught and logged to the console so they never crash the app.

**`LocalAnalyticsService`** writes events to `console.debug`, useful during local development when Firebase is not configured.

### Module Configuration

`module-configuration.ts` registers the appropriate implementation as a singleton in the Awilix container:

```typescript
const useFirebase =
  typeof window !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG;

container.register({
  analyticsService: asClass(
    useFirebase ? FirebaseAnalyticsService : LocalAnalyticsService
  ).singleton(),
});
```

## Analytics Setup

### 1. Enable Google Analytics in Firebase

1. Open the [Firebase Console](https://console.firebase.google.com/) and select your project.
2. Navigate to **Analytics** → **Dashboard**.
3. If Analytics is not yet enabled, follow the prompts to enable it.
4. Note the `measurementId` (starts with `G-`) — it is part of the Firebase config object.

### 2. Get the Firebase Config

1. Go to **Project settings** → **General** → **Your apps**.
2. Copy the web app config object as a compact JSON string:

```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "measurementId": "G-..."
}
```

### 3. Set the Environment Variable

The entire JSON object is stored in a single variable:

```bash
NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG='{"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"...","measurementId":"G-..."}'
```

For local development, add it to `.env.local` (git-ignored). For production, set it as a **GitHub Actions secret** so it is embedded at build time. See the [Deployment guide](deployment.md) for details.

## Configuration

| Variable                                   | Required | Description                        |
| ------------------------------------------ | -------- | ---------------------------------- |
| `NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG` | No       | Firebase web config as JSON string |

When the variable is **absent**, the app falls back to `LocalAnalyticsService` and logs analytics events to the browser console.

## Usage

Analytics is initialised automatically by the `AppInitializer` component on the client side:

```typescript
// src/application/components/app-initializer.tsx
useEffect(() => {
  const container = getContainer();
  const analyticsService =
    container.resolve<AnalyticsService>('analyticsService');
  void analyticsService.initialize();
}, []);
```

To log events or set user context elsewhere in the app, resolve the service from the container:

```typescript
import { getContainer } from '@/common/utils/container';
import { type AnalyticsService } from '@/modules/analytics/domain/interfaces';

const analytics = getContainer().resolve<AnalyticsService>('analyticsService');

// Log a custom event
analytics.logEvent('page_view', { page: '/home' });

// Set user identity
analytics.setUserId('user_abc123');

// Set user properties
analytics.setUserProperties({ plan: 'premium' });
```

## Local Development

When developing without Firebase:

1. Leave `NEXT_PUBLIC_LANDING_PAGE_FIREBASE_CONFIG` unset (or remove it from `.env.local`).
2. The app will use `LocalAnalyticsService`, which outputs events to `console.debug`:

```
[Analytics] Event: page_view { page: "/home" }
[Analytics] Set User ID: user_abc123
[Analytics] Set User Properties: { plan: "premium" }
```

This lets you verify that analytics calls are firing correctly without sending data to Firebase.

## Testing

The analytics module has full test coverage. Tests are located at:

```
src/__tests__/modules/analytics/
├── infrastructure/services/
│   ├── firebase-analytics-service.test.ts
│   └── local-analytics-service.test.ts
└── module-configuration.test.ts
```

Key testing patterns:

- **Firebase mocking** — `vi.mock("firebase/analytics")` and `vi.mock("firebase/app")` replace SDK calls with controllable mocks.
- **Dynamic imports** — `vi.resetModules()` + dynamic `import()` ensure each test gets a fresh module instance.
- **SSR simulation** — `vi.stubGlobal("window", undefined)` tests the server-side early-return path.
- **Error handling** — Mocking `initializeApp` to throw verifies the graceful catch block.

Run the analytics tests in isolation:

```bash
npx vitest src/__tests__/modules/analytics/
```
