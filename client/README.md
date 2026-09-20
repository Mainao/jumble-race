# Jumble Race — Client

React 19 + Vite + Tailwind CSS v4 frontend. See the [repo root README](../README.md) for how to run this alongside the server.

## Scripts

- `pnpm dev` — start the Vite dev server (http://localhost:5173)
- `pnpm build` — type-check (`tsc -b`) and build for production
- `pnpm lint` — run ESLint
- `pnpm preview` — preview the production build locally

## Structure

- `src/app/` — router setup (`react-router-dom`)
- `src/pages/` — route-level screens (`home`, `room`, `error`)
- `src/features/<name>/` — feature-owned components, hooks, and API/socket logic
- `src/ui/` — small reusable UI primitives (`Button`, `Input`), built with `class-variance-authority`
- `src/lib/` — shared, feature-agnostic utilities (the socket.io client instance, the `cn` class-merging helper)

Imports use the `@/*` path alias, which resolves to `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`).
