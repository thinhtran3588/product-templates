# Phase 3: Code Review & Quality Template

This document outlines the standard procedure for the **Review & Quality** phase, ensuring all code meets security, logic, and style standards before merging.

## Table of Contents

- [Overview](#overview)
- [Process Checklist](#process-checklist)
- [Artifacts Required](#artifacts-required)
- [Handling Bugs Found During Review](#handling-bugs-found-during-review)
- [Simulation](#-simulation-the-review-process)
- [Template: Pull Request Description](#template-pull-request-description)

## Overview

**Goal:** Validate functionality, catch bugs early, and maintain high code quality.
**Input:** A documented Pull Request (PR) (Issue in **In review**).
**Output:** Approved merge into `main` (Staging).
**Key Tools:** GitHub Pull Requests, GitHub Actions (CI), Preview Deployments.

## Process Checklist

- [ ] **Status:** Move Issue to **In review**.
- [ ] **Title:** Conventional Commits format (e.g., `feat(auth): login integration`).
- [ ] **Description:** Link the original Issue and provide testing steps.
- [ ] **Automated CI:** Check pass for Lint, Unit Tests, Build.
- [ ] **Preview:** Verify changes on the preview URL (Web only).
- [ ] **Peer Review:** At least 1 approval from a senior dev.
- [ ] **UAT (Optional):** PO or Designer checks visual correctness if UI changed.
- [ ] **Address Feedback:** Fix requested changes and re-request review.

## Artifacts Required

1. **Green PR:** All checks passed.
2. **Review Comments:** Constructive feedback.
3. **Approval:** Explicit sign-off.

---

## Handling Bugs Found During Review

It is common to find issues during code review. How you handle them depends on severity:

1.  **Blockers (Must Fix):**
    - **Logic Errors:** The code doesn't do what it says.
    - **Security Flaws:** Exposed keys, SQL injection risks.
    - **CI Failures:** Tests or linting failed.
    - **Design/Product Mismatch:** UI doesn't match Figma or missing acceptance criteria.
    - **Action:** Reviewer (or PO/Designer) clicks the **"Review changes"** button (top right of files view) and selects **"Request changes"**. The PR cannot be merged until these are fixed.

2.  **Minor Polish (Can Fix Later):**
    - **UI Tweaks:** "This padding looks slightly off" (unless it breaks the layout).
    - **Refactoring:** "This could be cleaner, but it works."
    - **Action:** Reviewer approves but leaves a comment: _"Optional: fix this if you have time, otherwise please open a ticket for it."_ **Create a new Issue** in the `Backlog` to track it.

3.  **Scope Creep (Out of Scope):**
    - "While testing input, I realized we also need phone number validation."
    - **Action:** **Do not** add this to the current PR. Create a new Feature Request in the `Backlog`.

---

## 🎭 Simulation: "The Review Process"

**Scenario:** Zoe (Web) and Max (App) have opened PRs for their Auth features. Now, Alex (CTO) and Ben (Backend) review them.

### The Conversation

**Role Players:**

- **Zoe (PR Author - Web Engineer)**
- **Max (PR Author - App Engineer)**
- **Alex (Reviewer - CTO)**
- **Ben (Reviewer - Backend Engineer)**
- **Sarah (Product Owner - UAT)**
- **Mia (Designer - UI/UX)**
- **Bot (GitHub Actions)**

#### 1. The Web PR (Zoe -> Alex)

> **GitHub PR #45: `feat(web): add Google login button`**

**Bot (CI)**

> ✅ Build Passed. ✅ Tests Passed. 🚀 Preview Ready: `http://pr-45.preview.product-templates.com`

##### Review Round 1 (Web)

**Alex (Reviewer)**

> (Line 42) Hey Zoe, hardcoded redirect URL here. Please move this to an environment variable (`NEXT_PUBLIC_AUTH_CALLBACK`) so it works on staging/prod too.

**Alex (Reviewer)**

> (Line 88) Looks like the loading state isn't handled if the user clicks twice rapidly. Can we disable the button while loading?

##### Fixing

**Zoe**

> Good catch on the URL. Fixed in `c4a1b2d`. Also added `disabled={isLoading}` to the button.

##### Approval

**Alex**

> Changes look solid. The preview works perfectly. Approved! 🚢

#### 2. The Mobile PR (Max -> Ben)

> **GitHub PR #46: `feat(app): login screen implementation`**

**Bot (CI)**

> ❌ Flutter Analyze Failed. (info_plist_key missing)

##### Review Round 1 (Mobile)

**Ben (Reviewer)**

> The CI failed because you forgot to add the `CFBundleURLTypes` for Google Auth to `Info.plist`. Also, I see we aren't handling network timeouts?

**Max**

> Ah, missed the plist key. I'll add a timeout interceptor to the API client.

##### PO Review (UAT on Preview)

**Sarah (PO)**

> Just tested PR #45 preview. The button color is slightly off—needs to follow the brand shade. @Mia (Designer) can you check?

**Mia (Designer)**

> Yeah, update `bg-blue-500` to our custom `bg-primary` token. Aside from that, looks great!

##### Resolution

**Zoe**

> Updated color to `bg-primary`. Ready for re-review.

**Alex**

> Perfect. Merging now.

---

## Template: Pull Request Description

Add this to every PR description.

```markdown
### Summary

Implements the login UI and integrates Firebase Auth API.

### Changes

- Added `LoginScreen` widget.
- Updated `AuthService` to include Google provider.
- Added environment variable support for redirects.

### Testing Instructions

1. Go to `/login` page.
2. Click "Sign in with Google".
3. Verify you are redirected back to `/dashboard`.
4. Check that failing to login shows an error toast.

### Checklist

- [x] Linting passed locally.
- [x] Unit tests added/updated.
- [x] Verified on iOS Simulator.
```
