# Phase 1: Planning and Design Template

This document outlines the standard procedure for the **Planning & Design** phase of the development lifecycle, including a realistic simulation of how the team collaborates.

## Table of Contents

- [Overview](#overview)
- [Process Checklist](#process-checklist)
- [Artifacts Required](#artifacts-required)
- [Handling Large Features (Epics)](#handling-large-features-epics)
- [Simulation](#-simulation-adding-authentication)
- [Template: GitHub Issue Structure](#template-github-issue-structure)

## Overview

**Goal:** Define the "What" and "Why" before writing a single line of code.
**Input:** Raw idea or user request.
**Output:** A "Ready for Dev" GitHub Issue with clear specs and designs.
**Key Tools:** GitHub Projects, Figma, Slack/Discord.

## Process Checklist

- [ ] **Idea Generation:** Create a GitHub Issue (Draft).
- [ ] **Marketing Input:** Validate user need and messaging.
- [ ] **Product Definition:** PO defines user stories and acceptance criteria.
- [ ] **Design:** Designer attaches high-fidelity Figma prototypes.
- [ ] **Technical Feasibility:** CTO/Tech Lead approves the approach and estimates effort.
- [ ] **Triage:** Assign Priority (P0-P3) and move to `Backlog`.

## Artifacts Required

1. **GitHub Issue:** Title, Description, User Stories.
2. **Figma Link:** Mockups for all states (Empty, Loading, Error, Success).
3. **Tech Spec (Optional):** For complex features, a brief note on API changes or database schema.

---

## Handling Large Features (Epics)

For significant features (e.g., "Authentication"), **do not** keep everything in one massive issue. Instead, use the **Epic > Task** hierarchy.

1.  **Create the Epic Issue:**
    - This is the "Source of Truth" containing the user story, Figma links, and overall acceptance criteria.
    - **Label:** `epic` or `feature`.

2.  **Create Child Issues (Tasks):**
    - Break down the work into assignable chunks (e.g., "Implement Login UI", "Setup API").
    - **Label:** `task` or `sub-task`.

3.  **Link Them:**
    - In the Epic's description, use a Task List to track progress.

---

## 🎭 Simulation: "Adding Authentication"

**Scenario:** The team needs to add User Authentication (Sign Up / Login) to the app.

### The Conversation

**Role Players:**

- **Sarah (Product Owner - PM/Founder)**
- **Alex (CTO / Solutions Architect)**
- **Mia (Designer - UI/UX)**
- **Leo (Marketing Lead / Growth)**

#### 1. The Idea (Slack/Discord)

**Sarah (PO)**

> Hey team, we're seeing drop-offs because users can't save their progress. We need to prioritize Authentication for the next sprint. I've created a draft issue #42.

#### 2. Identifying Requirements

**Leo (Marketing)**

> Agreed. From a growth perspective, can we support 'Sign in with Google'? It reduces friction significantly. Also, we need a way to capture emails for the newsletter during sign-up.

**Sarah (PO)**

> Good point. Let's make Google Auth a P0 (Must Have). Email capture can be P1, but let's confirm with Engineering.

#### 3. Design & UX (Figma)

**Mia (Designer)**

> I've sketched out the flow.
>
> - Screen 1: Landing with 'Get Started'.
> - Screen 2: Social Login buttons (Google, Apple) or Email form.
> - Screen 3: Onboarding wizard.
>   Link: `figma.com/file/xyz/auth-flow`

**Alex (CTO)**

> Looks clean, Mia. One note: ensure we have an error state design for 'Account already exists' or 'Wrong password'.

**Mia (Designer)**

> On it. Updating the Figma frame now.

#### 4. Technical Strategy (GitHub Issue Comments)

**Alex (CTO)**

> I've reviewed the requirements.
>
> - **Backend:** We'll use Firebase or Auth0 to handle the heavy lifting. I prefer Firebase for the ecosystem integration (Auth + Firestore).
> - **Frontend:** We need a new `/auth` route in Next.js and a `LoginScreen` widget in Flutter.
> - **Effort:** This is a 3-day task for backend, 2 days for frontend. Let's break this into sub-tasks.

#### 5. Finalizing (The Handover)

**Sarah (PO)**

> Okay, I've updated Issue #42 with the finalized Figma link and the acceptance criteria:
>
> 1. User can sign up with Email/Password.
> 2. User can sign in with Google.
> 3. User session persists on app restart.
>
> Moving this to the **Ready** column.

---

## Template: GitHub Issue Structure

Use this template when creating new feature requests.

```markdown
### Title: [Feature] User Authentication

**Priority:** [P0 / P1 / P2 / P3]
**Type:** [Epic / Task / Bug]

**Description**
As a user, I want to create an account so that I can save my progress and access it from any device.

**Acceptance Criteria**

- [ ] User can sign up with valid email/password.
- [ ] User receives a confirmation email.
- [ ] 'Forgot Password' flow works.
- [ ] Layout matches Figma design precisely.

**Implementation Tasks (For Epics)**

- [ ] Backend: Setup Firebase #43
- [ ] Frontend: Login Screen UI #44
- [ ] Frontend: Google Auth Integration #45

**Resources**

- **Figma:** [Link]
- **Tech Notes:** Using Firebase Auth.
```
