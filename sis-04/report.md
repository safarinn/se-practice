# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude Code (a fresh read-only subagent for each exchange) |
| Assistant model | Claude Opus 5.5 |
| Starting point | week-08 |
| Baseline commit | 8bd6e50 |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | my computer (macOS, Node, `npx vitest run` in `sis-04/app`) |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
 RUN  v3.2.4 /Users/nuralimuratov/Desktop/SE/se-practice-sis04/sis-04/app

 ✓ src/booking.test.ts (19 tests) 2ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  11:48:46
   Duration  279ms (transform 27ms, setup 0ms, collect 23ms, tests 2ms, environment 0ms, prepare 54ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
src/booking.ts      — canBook({ start, end, now, blocked, bookings }): the AC1–AC5 rule, pure, minutes after midnight
src/booking.test.ts — 19 Vitest tests of canBook (T01–T14, X1, X2, AC5, BUG-A, BUG-B)
src/App.tsx         — the page: holds ROOMS (2 rooms: id, name, blocked, bookings), toMinutes/fmt helpers, the form state, check() which converts the form and calls canBook, and the result/bookings rendering
src/main.tsx        — mounts App
src/index.css       — the layout and the result colours
package.json        — scripts dev, build, preview, test (vitest run); React 18, Vite 5, Vitest 3.2.4
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am extending a small React + TypeScript project. The code is in /Users/nuralimuratov/Desktop/SE/se-practice-sis04/sis-04/app (read it, do not edit anything).

Repository map:
src/booking.ts      — canBook({ start, end, now, blocked, bookings }): the AC1–AC5 rule, pure, minutes after midnight
src/booking.test.ts — 19 Vitest tests of canBook (T01–T14, X1, X2, AC5, BUG-A, BUG-B)
src/App.tsx         — the page: holds ROOMS (2 rooms: id, name, blocked, bookings), toMinutes/fmt helpers, the form state, check() which converts the form and calls canBook, and the result/bookings rendering
src/main.tsx        — mounts App
src/index.css       — the layout and the result colours
package.json        — scripts dev, build, preview, test (vitest run); React 18, Vite 5, Vitest 3.2.4

Acceptance criteria to preserve:
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

New requirements (room selection): a fictional catalog of at least four rooms, each with id, name, capacity, equipment list, blocked status and its own bookings. Show only rooms that satisfy the selected requirements; the availability check must use the chosen room's bookings.
F1 Capacity filter: room capacity must be greater than or equal to the requested attendees.
F2 Equipment filter: the room must contain ALL selected required items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result appropriately.

Target structure: src/rooms.ts (Room type + ROOMS), src/filter.ts (filterRooms(rooms, { attendees, equipment })), src/booking.ts (canBook unchanged + checkRoom(rooms, roomId, { start, end, now }) that calls canBook with the chosen room's blocked and bookings), App.tsx with no rules or room data of its own.

Constraints: no login, no payments, no live APIs, no database or backend, no browser storage; fictional data only; no new runtime dependencies.

Please: (1) list the maintainability risks you see in the current code, each with the file and function it is in and the evidence; (2) give a prioritised plan of small, safe steps (tests first, one change at a time) to reach the target structure and F1–F5 without breaking AC1–AC6. I want a plan, not a full rewrite, and no code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The page's "Room blocked" checkbox decides AC3; the room's own `blocked` field is never read, and the tick carries over to another room, so F3 cannot hold per room | `src/App.tsx`, `App()` / `check()` | `useState(false)` for `blocked` is passed to `canBook`; `room.blocked` appears nowhere in the file | High |
| 2 | An old result stays on screen after the room or a time changes, which contradicts F5 | `src/App.tsx`, the room `<select>` `onChange` | `setResult(null)` is only called inside `check()`; switching A-101 → B-204 keeps "Unavailable" | High |
| 3 | The selected room is assumed to exist; once filters can hide it, the page would read `undefined.bookings` or check a room the user can no longer see | `src/App.tsx`, `App()` | `const room = ROOMS.find(r => r.id === roomId)!` with a non-null `!` | High |
| 4 | The reversed-time error does not stop the check, so the page shows the error and "Unavailable" together; the UI repeats part of AC1 | `src/App.tsx`, `check()` | after `setError('The end time must be after the start time.')` there is no `return`, and `canBook` is still called | Medium |
| 5 | A comment describes adding the free slot to the list, the exact change that BUG-B and the AC5 test guard against | `src/booking.ts`, `canBook()` | `// keep the room's list current with the slot that was just found free` just before `return true` | Medium |
| 6 | The booking interval shape is declared three times, and the form has two sources of truth (state and `FormData`) | `src/booking.ts` (`BookingRequest`, unused, and the inline type of `canBook`), `src/App.tsx` (`Interval`, `check()`) | `BookingRequest` is never used; `check()` reads `new FormData(...)` while the inputs are controlled by `useState` | Low |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Record the baseline (done: 19/19 in 1.1) and delete the misleading comment in `canBook`, typing `bookings` as readonly; logic unchanged, 19 tests stay green (risk 5).
2. Add `src/rooms.ts`: the `Room` type, one `Interval` type and `ROOMS` with five fictional rooms; equipment as a string-literal union so `tsc` catches typos. Nothing imports it yet.
3. Test first, then `filterRooms` in `src/filter.ts`: F1, F2, F4, B5, B6, no equipment selected, extra equipment still included, input not changed. Blocked rooms stay in the result (decision in 5.2).
4. Test first, then `checkRoom` in `src/booking.ts`: F3, F5 (same times, two rooms, different results), unknown id false, AC5 no mutation, B1–B4 through `checkRoom`.
5. INT test: `filterRooms` on a fixed catalog, then `checkRoom` on a room it returned, including a blocked one.
6. `App.tsx`: import `ROOMS` and `checkRoom`, remove the "Room blocked" checkbox (risk 1). Deliberate change: AC3 is now shown by choosing the blocked room.
7. `App.tsx`: read state instead of `FormData`, and return early on missing or reversed times with no result shown (risks 4, 6).
8. `App.tsx`: fall back to the first visible room when the selected one is filtered out, and clear the result on any change of room, filter or time (risks 2, 3, F5).
9. `App.tsx`: attendees and equipment filters, the empty-state message, Check disabled when nothing matches (F1, F2, F4).
10. AC6: `role="status"` on the messages, CSS for the equipment group and empty state, a manual check at desktop width and at phone width; `npm test` and `npm run build` after every step.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Step 1 of the first plan: extract `MAX_DURATION_MIN = 120` and `DAY_END_MIN = 1440` in `canBook` and add a frozen-array test; Step 3: write `rooms.test.ts` against the real `ROOMS` | Modified | I kept only the comment deletion and the readonly type, because README §7 says `canBook` stays unchanged from Practice #08 and A6 reads its 120 rule. I rejected `rooms.test.ts` on `ROOMS`: README §9 requires a fixed catalog inside the test file, so editing the demo data must not change a test result (F1–F5 tests use their own rooms). |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
