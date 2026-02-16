---
description: detailed workflow for reviewing a pull request or code changes
---

# Review a Pull Request

Follow this workflow to review code changes against the project's quality standards.

## 1. Context & Prerequisites

1. **Read Description**: Review the PR title and description.
   - _Check_: Does it follow Conventional Commits? (e.g., `feat: ...`, `fix: ...`)
   - _Check_: Are acceptance criteria listed?
2. **CI Structure**: (If applicable) Verify that automated checks (Lint, Test, Build) would pass.

## 2. Code Review Checklist

Review the changed files using `view_file`.

### A. Functionality & Logic

- [ ] **Completeness**: Does the code meet the user stories/requirements?
- [ ] **Correctness**: Are there logical errors or edge cases missed?
- [ ] **Security**: Are there exposed secrets, SQL injections, or unvalidated inputs?
- [ ] **Performance**: Are there obvious bottlenecks (e.g., N+1 queries, large loops)?

### B. Quality & Style

- [ ] **Readability**: Is the code easy to understand? Are variables named clearly?
- [ ] **Maintainability**: Is code modular and DRY (Don't Repeat Yourself)?
- [ ] **Testing**: Are unit/integration tests included? Do they cover the changes?

### C. Design (Frontend specific)

- [ ] **UI/UX**: Does the code match the design specs (colors, spacing, typography)?
- [ ] **Responsiveness**: (If checking logic) Are mobile/desktop cases handled?

## 3. Feedback Action

Based on the findings, determine the next step:

1.  **Request Changes (Blocker)**:
    - If there are Logic Errors, Security Flaws, or Missing Tests.
    - _Action_: clearly list the issues required to be fixed.

2.  **Comment (Minor)**:
    - For small polish or refactoring suggestions that aren't blockers.
    - _Note_: Mark as "Optional" or "Nitpick".

3.  **Approve**:
    - If the code meets all standards and tests are sufficient.
    - _Action_: Provide an approval message (e.g., "LGTM!").

## 4. Merge (If Approved)

- If you are tasked to merge:
  - Squash and Merge to `main`.
  - Ensure the commit message is clean.
