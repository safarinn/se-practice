# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use one fictional room only; never use real room names, timetables or KBTU portal data.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps. A request that only touches a booking at an endpoint is not an overlap.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile. Never remove or weaken AC1–AC6 or their tests.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit any file in the project.
- Add packages when a task needs them.
- Do not add login, authentication, a database or Supabase; keep booking data in memory.
- Never add or commit secrets (API keys, tokens, passwords, `.env` values).

## Before you finish

- Make sure the page still loads.
- Never deploy anywhere (no Netlify, Vercel or other external hosts).
- Run `npm test` and `npm run build` before you propose acceptance; all tests must pass, and report the output.
