---
name: ui-ux-pro-max
description: UI/UX design intelligence with searchable style, color, typography, UX, and stack guidance. Use for UI design/build/review requests.
---

# ui-ux-pro-max

Use this skill for UI/UX implementation and review tasks.

## Prerequisite

Ensure Python is available:

```bash
python3 --version || python --version
```

## Workflow

### 1) Analyze request

Extract:

- product type
- style keywords
- industry
- stack (default `html-tailwind` if unspecified)

### 2) Generate design system (required)

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "Project Name"
```

### 3) Optional deep searches

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain>
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```

Domains: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`, `react`, `web`, `prompt`

Stacks: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

## Notes

- Data files and scripts are colocated in `.cursor/skills/ui-ux-pro-max/`.
- Keep commands scoped to `.cursor/skills/ui-ux-pro-max/scripts/search.py` to avoid dependency on `.agent`.
