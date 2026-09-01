# AGENTS.md

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 7, Tailwind CSS 3.4, zustand 5.
- npm only (package-lock.json); don't introduce pnpm/yarn.
- Deploy target is Vercel.

## Commands

```bash
npm run dev      # dev server, localhost:3000
npm run build    # production build; also the typecheck (next build runs tsc)
npm run lint     # eslint . (flat config in eslint.config.mjs)
```

- No test suite exists. Verify changes with `npm run build` + `npm run lint`.
- `next lint` no longer exists in Next 16 — don't reintroduce it.
- TS 7 (native) is installed but typescript-eslint 8 declares peer `<6.1.0`; the warning is harmless. If ESLint/ts tooling misbehaves, pinning `typescript@^5.9` is the known fix.

## Structure

- Single-page game app: all game code lives in `src/app/(home)/` (route group renders at `/`).
  - `store/store.ts` — zustand store (single store, no slices/persist)
  - `helpers/` — pure logic per game type (colors, numbers, emoji)
  - `components/game/` — game UI; `components/ui/` — shadcn primitives
- shadcn/ui is configured (`components.json`): primitives in `src/components/ui/`, `cn()` from `src/lib/utils.ts`, alias `@/*` → `src/*`.

## Gotchas

- Tailwind is v3 (`tailwindcss` PostCSS plugin + `tailwind.config.ts`), not v4 — don't migrate config or swap in `@tailwindcss/postcss` without being asked.
- `socket.io` is in dependencies but used nowhere in `src/` — candidate for removal, don't build on it.
- No env vars required; `.env` is gitignored.
