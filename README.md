# CAPE Allocator UI

[![CI](https://github.com/fralewsmi/cape-allocator-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/fralewsmi/cape-allocator-ui/actions/workflows/ci.yml)
[![Live](https://img.shields.io/badge/live-Cloudflare%20Workers-orange)](https://cape-allocator-ui.lewissmith-fraser.workers.dev)

Frontend for the [Component CAPE Portfolio Allocator](https://github.com/fralewsmi/cape-allocator). Built with TanStack Start, React, Tailwind CSS v4, and deployed to Cloudflare Workers.

## Backend API

The UI calls the allocator backend. Expected endpoints:

| Method | Path                     | Description                               |
| ------ | ------------------------ | ----------------------------------------- |
| `GET`  | `/health`                | API health and cache status               |
| `GET`  | `/api/market-inputs`     | Live CAPE, TIPS yield, momentum signal    |
| `GET`  | `/api/cape-variants`     | Available CAPE variant list               |
| `POST` | `/api/allocation`        | Merton ratio allocation from market data  |
| `POST` | `/api/allocation/manual` | Allocation from manually supplied inputs  |
| `GET`  | `/api/sensitivity`       | Allocation sweep across CAPE and γ values |

## Prerequisites

- [Bun](https://bun.sh/)
- A running allocator API backend

## Getting Started

```bash
bun install   # installs deps and registers the pre-commit hook
bun run dev   # starts Vite dev server on http://localhost:3000
```

## Scripts

```bash
bun run dev        # Vite dev server on port 3000
bun run build      # production build
bun run preview    # preview the production build
bun run test       # run Vitest (watch mode)
bun run lint       # oxlint
bun run lint:fix   # oxlint with auto-fix
bun run fmt        # format with oxfmt
bun run fmt:check  # check formatting (used in CI)
```

## Pre-commit Hook

[simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) + [lint-staged](https://github.com/lint-staged/lint-staged) run on every commit:

- **`.ts` / `.tsx`** — `oxlint --fix` then `oxfmt`
- **`.js`, `.json`, `.css`, `.md`** — `oxfmt`

The hook is registered automatically by the `prepare` script on `bun install`. To bypass in an emergency:

```bash
SKIP_SIMPLE_GIT_HOOKS=1 git commit -m "..."
```

## CI

GitHub Actions runs on every push and PR to `main`:

1. Format check (`oxfmt --check`)
2. Lint (`oxlint`)
3. Tests (`vitest --run`)
4. Build (`vite build`)

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — SSR framework
- [TanStack Router](https://tanstack.com/router) — file-based routing
- [TanStack Query](https://tanstack.com/query) — server state
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) — component primitives
- [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) — Workers deployment
- [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) — testing
- [oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter) — lint and format

## Deployment

Deployed automatically to Cloudflare Workers via the Cloudflare Vite plugin. Production: <https://cape-allocator-ui.lewissmith-fraser.workers.dev>
