---
description: detailed workflow for implementing a new feature
---

# Implement a New Feature

Follow this workflow to implement a new feature from scratch, ensuring quality and adherence to the project's engineering standards.

## 1. Understand and Plan

1. **Analyze Requirements**: Read the user request and any linked documentation or issues. Identify the core user stories and acceptance criteria.
2. **Explore Codebase**: Use `list_dir` and `view_file` to understand the existing architecture and where the new feature fits.
   - _Key Check_: Check `docs/engineering-handbook.md` for technology standards.
3. **Propose Plan**: Briefly outline your implementation plan to the user if the feature is complex.

## 2. Setup Development Environment

1. **Branching**: Ensure you are on a new feature branch.
   - Construct branch name: `feature/[short-description]` (e.g., `feature/user-auth`).
   - Run: `git checkout -b feature/[your-feature-name]` (if not already on it).

## 3. Implementation (The "How")

1. **Atomic Changes**: Implement the feature in small, logical chunks.
2. **Feature Flags**: If the feature is risky or incomplete, wrap it in a feature flag.
3. **Update Code**: Use `write_to_file` or `replace_file_content` to create/edit files.

## 4. Verification & Testing

1. **Write Tests**: Create unit tests for business logic and integration tests for APIs.
   - _Rule_: Tests must cover the "Happy Path" and edge cases.
2. **Run Tests**: Execute the tests to ensure they pass.
   - Run: `npm test` (or project specific test command).
3. **Linting**: Ensure code follows style guides.
   - Run: `npm run lint` (if available).

## 5. Finalize

1. **Review**: Check your own code against the "Quality Assurance" guidelines in `docs/engineering-handbook.md`.
2. **Commit**: (If agent has git access) Stage and commit changes with a Conventional Commit message.
   - Format: `feat(scope): description`
