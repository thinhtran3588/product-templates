# Landing page template

[![CI - Main](https://github.com/thinhtran3588/product-templates/actions/workflows/ci-main.yml/badge.svg?branch=main)](https://github.com/thinhtran3588/product-templates/actions/workflows/landing-page-ci-main.yml)
[![codecov - Main](https://codecov.io/gh/thinhtran3588/product-templates/branch/main/graph/badge.svg)](https://codecov.io/gh/thinhtran3588/product-templates/tree/main)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=reacthookform&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=flat&logo=firebase&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat&logo=testing-library&logoColor=white)

## Features

- **Clean Architecture** — Domain, Application, Infrastructure, Presentation layers with Awilix DI
- **Modular Structure** — Feature modules under `src/modules/` with clear boundaries
- **Tech Stack** — Next.js App Router, TypeScript (strict), Tailwind CSS, shadcn/ui (Radix)
- **Forms & Validation** — React Hook Form + Zod with type-safe schemas
- **State & i18n** — Zustand for client state, next-intl for localization
- **Testing** — Vitest + React Testing Library with 100% coverage requirement
- **Firebase** — Auth, Firestore & Analytics with abstracted interfaces for easy provider swapping

## Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Scripts

| Command            | Description                                     |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Start development server                        |
| `npm run build`    | Build for production                            |
| `npm run validate` | Run lint, format check, and tests with coverage |

## Documentation

| Document                                             | Description                                        |
| ---------------------------------------------------- | -------------------------------------------------- |
| [Architecture](docs/architecture.md)                 | Layers, data flow, design patterns, DI with Awilix |
| [Coding Conventions](docs/coding-conventions.md)     | File naming, App Router patterns, forms, i18n      |
| [Development Guide](docs/development-guide.md)       | Git workflow, adding features, creating modules    |
| [Testing Guide](docs/testing-guide.md)               | Test organization, coverage, best practices        |
| [Firebase Integration](docs/firebase-integration.md) | Analytics setup                                    |
| [Deployment](docs/deployment.md)                     | Firebase, Cloudflare Pages, GitHub Actions CI/CD   |

## License

MIT
