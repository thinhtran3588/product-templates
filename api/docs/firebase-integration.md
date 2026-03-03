# Firebase Integration

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication Setup](#authentication-setup)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Local Development](#local-development)
7. [Testing](#testing)

## Overview

The API uses Firebase Admin SDK for identity verification and account management. Firebase integration is wrapped behind interfaces so business logic does not depend on Firebase-specific APIs.

Core responsibilities:

- Verify incoming identity tokens.
- Read identity metadata needed by application flows.
- Support account lifecycle operations when required.

## Architecture

Firebase integration follows the same module layering used in the rest of the API.

### Domain Layer — `ExternalAuthenticationService`

Domain/application code depends on an authentication contract, not the Firebase SDK.

### Infrastructure Layer — Implementations

Infrastructure implements Firebase-specific behavior (token verification, user lookup, provider errors).

### Module Configuration

DI registers Firebase implementations and injects them into handlers/services.

## Authentication Setup

### 1. Enable Firebase Authentication

Enable required providers in Firebase Console (for example email/password and Google).

### 2. Create a Service Account

Create a service account with minimum required permissions and store the JSON securely.

### 3. Set Environment Variables

Use secrets for sensitive values:

- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_API_KEY`

## Configuration

Typical environment variables:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"..."}'
FIREBASE_API_KEY=your-public-firebase-api-key
```

Never commit service account credentials to source control.

## Usage

Typical flow:

1. Client authenticates with Firebase.
2. Client sends ID token to API.
3. API verifies token via Firebase Admin SDK.
4. API maps identity data into application context.
5. Command/query handlers apply authorization rules.

## Local Development

- Keep local Firebase secrets in `.env` files that are gitignored.
- Use a dedicated non-production Firebase project.
- If needed, mock authentication service in tests to avoid network calls.

## Testing

- Unit test authentication adapters with mocked Firebase SDK behavior.
- Test token parsing/claims mapping with happy-path and invalid-token cases.
- Ensure authorization failures map to consistent API error codes.
