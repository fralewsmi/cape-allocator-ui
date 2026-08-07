# Allocator UI

[![CI](https://github.com/fralewsmi/cape-allocator-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/fralewsmi/cape-allocator-ui/actions/workflows/ci.yml)
[![Live](https://img.shields.io/badge/live-Cloudflare%20Workers-orange)](https://cape-allocator-ui.lewissmith-fraser.workers.dev)

A lightweight frontend for the [portfolio allocator](https://github.com/fralewsmi/cape-allocator). It uses TanStack Start, React, Tailwind CSS v4, and Cloudflare Workers.

## Server interface

The UI calls the allocator API. Expected endpoints:

| Method | Path                     | Description                               |
| ------ | ------------------------ | ----------------------------------------- |
| `GET`  | `/health`                | API health and cache status               |
| `GET`  | `/api/market-inputs`     | Live CAPE and TIPS data                   |
| `GET`  | `/api/cape-variants`     | Available CAPE variant list               |
| `POST` | `/api/allocation`        | Allocation from market data               |
| `POST` | `/api/allocation/manual` | Allocation from manual inputs             |
| `GET`  | `/api/sensitivity`       | Allocation sweep across CAPE and γ values |

## Prerequisites

- [Bun](https://bun.sh/)
- A running allocator API

## Getting started

```bash
bun install   # installs deps and registers the pre-commit hook
bun run dev   # starts the local dev server at http://localhost:3000
```

## Scripts

```bash
bun run dev        # local dev server on port 3000
bun run build      # production build
bun run preview    # preview the production build
bun run test       # test runner in watch mode
bun run lint       # linter
bun run lint:fix   # linter with auto-fix
bun run fmt        # formatter
bun run fmt:check  # format check used in CI
```

## Pre-commit hook

[simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) + [lint-staged](https://github.com/lint-staged/lint-staged) run on every commit:

- **`.ts` / `.tsx`**: linting and formatting
- **`.js`, `.json`, `.css`, `.md`**: formatting

The prepare script registers the hook automatically when you run bun install. To bypass it in an emergency:

```bash
SKIP_SIMPLE_GIT_HOOKS=1 git commit -m "..."
```

## Continuous integration

GitHub Actions runs on every push and PR to `main`:

1. Format check
2. Lint
3. Tests
4. Build

## Tech stack

- [TanStack Start](https://tanstack.com/start) for server-side rendering
- [TanStack Router](https://tanstack.com/router) for file-based routing
- [TanStack Query](https://tanstack.com/query) for server state
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) for component primitives
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) for deployment
- The test runner and browser automation tool for testing
- The linter and formatter for linting and formatting

## Deployment

Deployed automatically to Cloudflare Workers with the Cloudflare plugin. Production: <https://cape-allocator-ui.lewissmith-fraser.workers.dev>
