---
description: detailed workflow for fixing a bug
---

# Fix a Bug

Follow this workflow to diagnose, reproduce, and fix bugs efficiently.

## 1. Triage & Analysis

1. **Understand the Bug**: Read the bug report/issue. Identify:
   - What is broken?
   - What is the expected behavior?
   - Steps to reproduce.
2. **Prioritize**: specific urgency based on P0-P3 scale (refer to `docs/engineering-handbook.md`).

## 2. Setup

1. **Branching**: Create a fix branch.
   - Construct branch name: `fix/[bug-description]` (e.g., `fix/login-crash`).
   - Run: `git checkout -b fix/[your-fix-name]`.

## 3. Reproduction (TDD)

1. **Create Test Case**: Write a test case that reproduces the bug.
   - _Goal_: The test **MUST FAIL** initially. This confirms the bug exists and ensures the fix actually works.
2. **Run Test**: Confirm the failure.

## 4. Fix Implementation

1. **Analyze Root Cause**: Use `grep_search` or `view_file` to locate the faulty code.
2. **Apply Fix**: proper code changes to resolve the issue.
   - _Constraint_: Keep changes minimal and focused on the bug (avoid scope creep).
3. **Verify Fix**: Run the reproduction test again.
   - _Goal_: The test **MUST PASS** now.

## 5. Regression Testing

1. **Run All Tests**: Ensure the fix didn't break existing functionality.
   - Run: `npm test` (or equivalent).

## 6. Finalize

1. **Commit**: Commit the fix with a Conventional Commit message.
   - Format: `fix(scope): description`
   - Example: `fix(auth): handle null token in login flow`
