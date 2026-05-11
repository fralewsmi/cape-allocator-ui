# CAPE Allocator UI

[![CI](https://github.com/fralewsmi/cape-allocator-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/fralewsmi/cape-allocator-ui/actions/workflows/ci.yml)
[![Live](https://img.shields.io/badge/live-Cloudflare%20Workers-orange)](https://cape-allocator-ui.lewissmith-fraser.workers.dev)

Frontend for the Component CAPE + Merton Rule Portfolio Allocator [fralewsmi/cape-allocator](https://github.com/fralewsmi/cape-allocator)

Live app: <https://cape-allocator-ui.lewissmith-fraser.workers.dev>

The app is built with TanStack Start, React, Tailwind CSS, and the Cloudflare Vite plugin. It is intended to call the allocator API from the backend service.

The backend exposes the allocator endpoints used by the UI:

- `GET /health`
- `GET /api/market-inputs`
- `GET /api/cape-variants`
- `POST /api/allocation`
- `POST /api/allocation/manual`
- `GET /api/sensitivity`

## Prerequisites

- [Bun](https://bun.sh/)
- A running allocator API backend

## Local Development

Install dependencies:

```bash
bun install
```

Start the frontend:

```bash
bun run dev
```

By default the app runs on <http://localhost:3000>.

## Scripts

```bash
bun run dev        # start Vite dev server on port 3000
bun run build      # build for production
bun run preview    # preview the production build
bun run test       # run Vitest
bun run lint       # run oxlint
bun run lint:fix   # run oxlint with fixes
bun run fmt        # format with oxfmt
bun run fmt:check  # check formatting
```

## Deployment

Deployment to Cloudflare Workers is automatic. The production app is available at <https://cape-allocator-ui.lewissmith-fraser.workers.dev>.

## API Notes

The allocator API needs a `FRED_API_KEY` for live market data. See [fralewsmi/cape-allocator](https://github.com/fralewsmi/cape-allocator) for backend installation, environment variables, endpoint examples, and deployment notes.

For production, the API should expose a stable HTTPS origin that the Cloudflare-hosted frontend can call.

## Tech Stack

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)
- [Vitest](https://vitest.dev/)
