# Memory Game

A memory match game built with Next.js. Flip two cards per turn — matching pairs stay open, misses hide again. Clear every pair to win.

Play it: four game types, five modes, four difficulty levels, all playable solo or hot-seat with a friend.

## Features

**Game types**

- **Color** — match identical swatches
- **Number** — match identical numbers
- **Number Sequence** — reveal numbers in order, 1, 2, 3… (the header shows what comes next)
- **Emoji** — match identical emojis

**Modes**

- **Classic** — a straightforward round
- **Daily Challenge** — a date-seeded board, the same for everyone that day; share the link (`/?daily=YYYYMMDD`) to race friends
- **Time Attack** — 60 seconds, clear as much as you can
- **Duel** — hot-seat for two players: a match keeps your turn, a miss passes it
- **Best of 3** — a duel across three rounds, first to two round wins takes the series
- **Zen** — no timer, no score; practice at your own pace
- **Custom board** — any pair count (4–40) and column layout

**Complexity** — Easy (8 pairs), Medium (16), Hard (24), Extreme (24, mismatch wipes found pairs, and after every 5 matches the remaining cards quietly swap positions).

**Tools**

- Optional **3 lives** — each mismatch costs one; run out and the round is lost
- Optional **wildcards** — two ★ jokers that match anything (their partner's twin auto-clears)
- **Trap card** — Hard/Extreme boards hide one ☠️: costs 2 moves and breaks your streak
- **Peek** — once per round, reveal the whole board for 3 seconds (costs 2 moves)
- **Pause** — hides the board and freezes the timer; auto-pauses after 30s idle
- **Sound effects + haptics** — Web Audio and vibration, toggleable
- **Keyboard play** — Tab into the grid, arrow keys to move, Enter/Space to flip
- **Theme packs** — emoji packs (Faces/Animals/Food/Space) and color palettes (Vibrant/Pastel/Neon)

**Progress (saved locally)**

- Best time and fewest moves per game type + complexity, plus a best-time sparkline
- Achievements (first clear, flawless run, 5-streak, comeback wins, and more)
- Daily-streak calendar
- An in-progress round survives a page refresh
- Share your result as an image (Web Share API, with clipboard/download fallback)

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 3.4
- zustand for game state (persisted to localStorage)
- shadcn/ui primitives, vaul drawer, lucide icons
- canvas-confetti for wins
- No backend, no env vars required

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (also typechecks)
npm run lint     # eslint
npm start        # serve the production build
```

## Project structure

```
src/app/(home)/           # the game (single-page app)
  store/store.ts          # zustand store (persisted)
  helpers/                # pure logic: decks, seeded RNG, sfx, stats/achievements
  hook/                   # game + countdown hooks
  components/game/        # board, cards, header, modals
  components/game-states/ # setup + end screens
  components/game-info/   # how-to-play drawer, progress viewer
src/components/ui/        # shadcn/ui primitives
```

Created by Chris Thapa.
