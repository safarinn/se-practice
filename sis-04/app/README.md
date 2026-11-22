# Smart Campus Room Availability Checker

A small React + TypeScript page: pick what a room needs (attendees, equipment), choose one of the
fictional rooms that match, enter a time and see whether that room is available. No login, no
backend, no storage; all data is fictional and lives in `src/rooms.ts`.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Then open the address Vite prints (by default http://localhost:5173).

## Test

```bash
npx vitest run
```

`npm test` runs the same suite. `npm run build` type-checks (`tsc`) and builds.

## Modules

| File | What it does |
| --- | --- |
| `src/rooms.ts` | Data only: the `Room`, `Interval` and `Equipment` types and `ROOMS`, five fictional rooms |
| `src/booking.ts` | `canBook` (AC1–AC5, unchanged from Practice #08) and `checkRoom`, which checks the chosen room's own `blocked` and `bookings` (F3, F5) |
| `src/filter.ts` | `filterRooms`: capacity ≥ attendees (F1) and every selected item present (F2); blocked rooms stay in the list |
| `src/App.tsx` | The page: form state, the matching-rooms list, the empty state (F4), the result; imports every rule |
| `src/booking.test.ts`, `src/filter.test.ts` | Vitest suite with fixed test catalogs (AC1–AC5, F1–F5, B1–B6, INT) |
