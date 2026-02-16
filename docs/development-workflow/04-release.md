# Phase 4: Release & Environment Template

This document outlines the standard process for **deployment** and **release** management, ensuring feature stability before reaching end users.

## Table of Contents

- [Overview](#overview)
- [Process Checklist](#process-checklist)
- [Artifacts Required](#artifacts-required)
- [Handling Bugs Found During Staging UAT](#handling-bugs-found-during-staging-uat)
- [Simulation](#-simulation-releasing-auth-to-production)
- [Template: Release Notes (Changelog)](#template-release-notes-changelog)

## Overview

**Goal:** Deploy tested code to production with minimal risk.
**Input:** Merged code on `main` branch.
**Output:** Live feature on Production (Issue in **Done**).
**Key Tools:** GitHub Releases, TestFlight, Google Play Console, Feature Flags.

## Process Checklist

- [ ] **Status:** Move Issue to **Done**.
- [ ] **Staging:** Ensure auto-deploy to Staging succeeds.
- [ ] **Internal UAT:** PO and QA verify features on Staging (Wednesdays).
- [ ] **Release Notes:** Draft changelog based on PR titles.
- [ ] **Production (Web):** Promote to Production.
- [ ] **Production (Mobile):** Submit build for App Store Review.
- [ ] **Feature Flag:** Enable feature for 10% -> 100% of users.

## Artifacts Required

1. **Draft Release:** Tagged version (e.g., `v1.2.0`).
2. **Changelog:** Summary of user-facing changes.
3. **Green Build:** Passing pipeline on `main`.

---

## Handling Bugs Found During Staging UAT

If issues are found during the Wednesday UAT on Staging:

1.  **Blocker (Release Stopper):**
    - **Examples:** App crashes, login fails, critical data loss.
    - **Action:** **STOP the Release.** 🛑
      1.  Create a `fix/...` branch from `main`.
      2.  Fix the issue and merge.
      3.  Wait for auto-deploy to Staging.
      4.  **Re-verify.** Only then proceed to Production.

2.  **Minor Issue (Non-Blocking):**
    - **Examples:** Typo, slight animation glitch.
    - **Action:** Release can proceed. ✅
      1.  **Create an Issue** in `Backlog` to track it.
      2.  Continue with deployment.

---

## 🎭 Simulation: "Releasing Auth to Production"

**Scenario:** It's Release Wednesday. The Auth feature is merged to `main` and deployed to Staging. Now, the team prepares for the public launch.

### The Conversation

**Role Players:**

- **Sarah (Product Owner - PM/Founder)**
- **Alex (CTO / Solutions Architect)**
- **Leo (Marketing Lead / Growth)**
- **Ben (Backend Engineer)**

#### 1. Staging Verification (Wednesday Morning)

**Alex (Slack #releases)**

> Starting the release train for `v1.2.0`. Staging build includes the new Auth flow. @Sarah ready for UAT?

**Sarah (PO)**

> Testing on the Staging Web and TestFlight build #104.
>
> - Sign Up with Email: ✅ Works.
> - Google Login: ✅ Works.
> - Forgot Password: ✅ Works.
> - Wait, the 'Welcome Email' took 5 minutes to arrive. Is that normal?

**Ben (Backend)**

> Checking logs... Ah, the email queue is slightly backed up on Staging due to load testing. Production uses a dedicated queue, so it should be instant.

**Sarah**

> Okay, noted. As long as it eventually arrives. The flow is solid otherwise. **GO for release.**

#### 2. The Release (Wednesday Afternoon)

**Alex (GitHub)**

> Creating Release `v1.2.0`.
>
> - **Web:** Promoting Staging to Production on Cloudflare Pages... Done.
> - **Mobile:** Submitting Android Bundle to Play Store Review... Done.
> - **iOS:** Submitting via App Store Connect... Waiting for Review (usually 24h).

#### 3. Feature Flag Rollout

**Alex**

> Since this is a major change, I'm enabling the `new-auth-flow` feature flag for **internal users only** first to sanity check production.

**Ben**

> Production logs look clean. No spikes in 500 errors.

**Alex**

> Great. Opening it up to **50% of traffic**... Watching metrics... Stable.

**Alex**

> Rolling out to **100%.**

#### 4. Marketing Launch

**Leo (Marketing)**

> Since Auth is live on Web, I'm scheduling the newsletter announcement for tomorrow morning. 'Review your progress anywhere with our new login feature!'

**Sarah**

> Perfect. Let's hold the mobile announcement until Apple approves the build (likely Friday).

#### 5. Post-Release (The "oops")

**Ben**

> Heads up, seeing a few timeouts on the Google Auth callback. Seems like a rate limit on the provider side during peak hours?

**Alex**

> Let's increase the timeout duration in the config hotfix if it persists. Keeping an eye on it.

---

## Template: Release Notes (Changelog)

```markdown
**Version 1.2.0**

### 🚀 New Features

- **User Authentication:** You can now sign up and save your progress!
- **Social Login:** Added "Sign in with Google" for faster access.

### 🐛 Bug Fixes

- Fixed a crash when rotating the screen on the Settings page.
- Improved loading speed for the dashboard.

### 🔧 Internal

- Upgraded Firebase Admin SDK to v11.0.
- Added comprehensive E2E tests for login flow.
```
