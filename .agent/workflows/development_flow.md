---
description: General purpose development workflow: Branching, Features, Bug Fixes, Validation, and PR.
---

# Development Flow

Follow this workflow for ALL code changes. This is the standard lifecycle for both features and bug fixes.

## 1. Preparation (Start Here)

**CRITICAL**: You must ALWAYS create a new branch before making any code changes. NEVER push directly to `main` or commit to an existing branch unless explicitly instructed to continue work.

1.  **Sync with Main**:

    ```bash
    git checkout main
    git pull origin main
    ```

2.  **Create Branch**:
    - **Naming Convention**:
      - Features: `feature/[short-description]`
      - Bug Fixes: `fix/[short-description]`
      - Chores/Docs: `chore/[description]` or `docs/[description]`
    - **Command**:
      ```bash
      git checkout -b [type]/[your-branch-name]
      ```

3.  **Plan & Analyze**:
    - **If New Feature**:
      - Analyze requirements and identify core user stories.
      - Check `docs/engineering-handbook.md` for technology standards.
      - Explore codebase using `list_dir` and `view_file`.
      - Propose a brief implementation plan for complex features.
    - **If Bug Fix**:
      - Analyze the bug report: What is broken? Expected behavior? Steps to reproduce?
      - Prioritize based on P0-P3 scale.

## 2. Implementation & Work

Choose the path based on your task type:

### Path A: Implementing a Feature

1.  **Atomic Changes**: Implement the feature in small, logical chunks.
2.  **Feature Flags**: If the feature is risky or incomplete, wrap it in a feature flag.
3.  **Update Code**: Use `write_to_file` or `replace_file_content` to create/edit files.
4.  **Write Tests**: Create unit tests for business logic and integration tests for APIs.
    - _Rule_: Tests must cover the "Happy Path" and edge cases.

### Path B: Fixing a Bug (TDD Approach)

1.  **Create Test Case**: Write a test case that reproduces the bug.
    - _Goal_: The test **MUST FAIL** initially. This confirms the bug exists.
2.  **Analyze Root Cause**: Use `grep_search` or `view_file` to locate the faulty code.
3.  **Apply Fix**: Make minimal code changes to resolve the issue.
4.  **Verify Fix**: Run the reproduction test again.
    - _Goal_: The test **MUST PASS** now.
5.  **Regression Testing**: Ensure the fix didn't break existing functionality.

## 3. Validation (The "Gate")

Before committing, you MUST validate your changes to ensure they meet the quality standards.

1.  **Run Validation Script**:
    - Run: `npm run validate`
    - _Info_: This script runs linting, formatting checks, type checking, and tests with coverage.
    - _Action_: Fix ALL errors reported. Zero tolerance for warnings or test failures.
    - _Constraint_: checks **MUST PASS** before committing.
2.  **Context-Specific Validation**:
    - **If Fixing a Bug**: Ensure the reproduction test case now **PASSES**.
    - **If Implementing a Feature**: Ensure new tests cover the "Happy Path" and edge cases.

## 4. Finalize & Submit

1.  **Check Branch Alignment**:
    - **Check**: Verify the current branch name matches the work done.
    - **Action**: If misaligned (e.g., extensive refactoring on a `fix/` branch, or feature creep), either:
      - Rename the branch: `git branch -m new-name`
      - Or Create a new branch: `git checkout -b new-branch-name`
2.  **Stage Changes**:
    - Run: `git add .`
3.  **Commit**: Use **Conventional Commits** format.
    - Format: `type(scope): description`
    - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
    - Run: `git commit -m "type(scope): description"`
4.  **Push Branch**:
    - Run: `git push -u origin HEAD`
5.  **Create Pull Request**:
    - **Target**: `main`
    - **Command**:
      ```bash
      gh pr create --title "type(scope): description" --body "Description of changes"
      ```
    - Verify CI status after creation.
