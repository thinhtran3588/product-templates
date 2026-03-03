# Phase 0: Idea to App Workflow

This document defines how to go from a raw idea to a build-ready app plan, with an AI-first discovery and prototype validation loop before development starts.

## Overview

**Goal:** De-risk product direction before writing production code.  
**Input:** Raw idea, business objective, or user problem.  
**Output:** Validated prototype + updated specification document ready for implementation.  
**Core Tools:** ChatGPT/Gemini (or similar), Google Stitch, internal team feedback.

## End-to-End Flow

1. **AI Discovery and Product Definition**
2. **Specification Draft**
3. **Prototype with Google Stitch**
4. **Iterate: Spec <-> Prototype Alignment**
5. **Development Handoff**

Only move to development after prototype and specification are aligned and accepted.

---

## 1) AI Discovery and Product Definition

Use AI chat tools first to pressure-test the idea before creating UI or code.

### Activities

- Clarify problem statement, target users, and success metrics.
- Explore feature candidates (must-have vs nice-to-have).
- Identify risky assumptions and unknowns.
- Compare implementation options at a high level.

### Output

- Draft product direction.
- Prioritized feature list (`P0`, `P1`, `P2`).
- Initial acceptance criteria per core feature.

---

## 2) Specification Draft

Create a living specification document from the AI discussion.

### Recommended Spec Sections

- Product vision and non-goals
- User personas and key journeys
- Feature requirements and priority
- UX requirements and constraints
- Functional acceptance criteria
- Technical constraints/integrations (high-level only)
- Open questions and assumptions

### Gate to Continue

Do not start prototyping until the spec is clear enough for someone else to build a UI prototype without guesswork.

---

## 3) Prototype with Google Stitch

Use the specification as the source of truth for prompt inputs to Google Stitch.

### Activities

- Build prototype screens and core interaction flows.
- Cover critical states: default, loading, empty, error, success.
- Validate structure, flow clarity, and usability assumptions.

### Output

- Clickable or visual prototype covering key user journeys.
- Notes on mismatches between prototype and specification.

---

## 4) Iterate: Spec <-> Prototype Alignment Loop

Run this loop until the prototype satisfies business goals and user flow expectations.

### Iteration Loop

1. Review prototype with stakeholders/users.
2. Capture gaps, confusion, and missing states.
3. Update specification document first.
4. Regenerate/refine prototype from updated spec.
5. Re-validate against acceptance criteria.

### Exit Criteria

- Core journeys are complete and understandable.
- Acceptance criteria can be mapped to prototype behavior.
- High-risk UX and requirement ambiguities are resolved.
- Stakeholders agree the direction is ready for engineering.

---

## 5) Development Handoff (Only After Validation)

When the loop passes exit criteria, move to implementation planning.

### Handoff Package

- Final specification doc (latest, approved)
- Prototype link(s)
- Prioritized implementation scope for MVP
- Defined out-of-scope items
- Initial engineering task breakdown

Use `01-planning-and-design.md` and `02-development.md` as the next phases after this handoff.

---

## Same Flow for Future Features

Apply the same mini-cycle for every major feature after launch:

1. AI discussion for feature framing
2. Spec update/addendum
3. Stitch prototype for changed/new flows
4. Iteration until accepted
5. Development implementation

This keeps future development aligned with validated product intent instead of jumping directly into coding.

---

## Quick Checklist

- [ ] Idea discussed with AI and assumptions captured
- [ ] Specification doc created/updated
- [ ] Google Stitch prototype generated from spec
- [ ] Spec and prototype iterated until aligned
- [ ] Stakeholder validation complete
- [ ] Development phase started with approved handoff artifacts
