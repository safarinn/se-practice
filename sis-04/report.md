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

- **Catalog:** `src/rooms.ts` holds five fictional rooms (A-101 8 seats, B-204 12, C-310 20, Lab D-015 30, E-120 16 and blocked), with equipment from `projector`, `whiteboard`, `video call`, `computers`, and their own bookings. A-101 keeps its 10:00–11:00 booking from week 08.
- **Filter:** an "Attendees" number field and one checkbox per equipment item. The page calls `filterRooms` on every render and lists the matching rooms (blocked ones with a red "blocked" tag); the Room drop-down only offers those rooms and says "N of 5 match".
- **Empty state (F4):** "No rooms match 25 attendees with projector, video call. Lower the number of attendees or clear an equipment item." The drop-down and time fields are hidden and "Check availability" is disabled.
- **Room change (F5):** every change of room, filter or time clears the old result and error. If the filter hides the selected room, the page falls back to the first room still shown. The check calls `checkRoom(ROOMS, room.id, …)`, so it always uses the chosen room's `blocked` flag and bookings.
- **Removed on purpose:** the old "Room blocked" checkbox. AC3 is now shown by choosing E-120, the blocked room.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Saved as `filter-match.jpg`. Attendees 15, projector ticked: only C-310 (20 seats), Lab D-015 (30) and E-120 (16, tagged blocked) are listed, "3 of 5 match"; A-101 (8) and B-204 (12) are gone, and the selection moved from A-101 to C-310 by itself. |
| `evidence/filter-empty.png` | Saved as `filter-empty.jpg`. Attendees 25, projector and video call ticked: no room has both with 25 seats, so the empty-state message is shown and the Check button is greyed out (F4). |
| `evidence/switch-a.png` | Saved as `switch-a.jpg`. No filter, Room A-101, current time 09:00, 10:30–11:30: "Unavailable: Room A-101, 10:30–11:30", because A-101 has a 10:00–11:00 booking (AC4). |
| `evidence/switch-b.png` | Saved as `switch-b.jpg`. The same times, Room B-204 selected: the old "Unavailable" disappeared as soon as the room changed, and Check gives "Available: Room B-204, 10:30–11:30" (no bookings), so the result follows the chosen room (F5). |
| `evidence/narrow.png` | Saved as `narrow.jpg`, 375 px wide in portrait (shown at 750×1624). Attendees 10 and projector: four rooms listed, the fields stack in one column at full width, and "Available: Room B-204, 11:00–12:00" is readable under the button; nothing is cut off (AC6). |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Data only: the `Interval`, `Equipment` and `Room` types, the `EQUIPMENT` list and `ROOMS` (five fictional rooms). No functions. |
| `src/booking.ts` | The booking rules: `canBook` (AC1–AC5, logic unchanged from week 08) and `checkRoom`, which finds the room by id and calls `canBook` with that room's `blocked` and `bookings` (F3, F5); unknown id → not available. |
| `src/filter.ts` | `filterRooms`: keeps rooms with capacity ≥ attendees (F1) that have every selected item (F2), in catalog order; does not change its input. |
| `src/App.tsx` | UI only: form state, the matching-rooms list, the empty state, the room fallback and clearing the result on change; it imports `ROOMS`, `filterRooms` and `checkRoom` and holds no room data or rule of its own. |
| `src/booking.test.ts`, `src/filter.test.ts` | The suite: 41 tests with their own fixed catalogs; `filter.test.ts` also holds the INT test. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Blocked rooms stay in the filtered list with a red "blocked" tag; `checkRoom` makes them Unavailable | Hide blocked rooms inside `filterRooms` (the assistant offered both) | F1/F2 only speak about capacity and equipment, so `filterRooms` stays exactly those two rules; F3 is enforced in one place (`checkRoom` → `canBook`), and the test `F1 F2 blocked room is not removed by filterRooms` plus the INT test record the choice. The user also sees that the room exists but cannot be booked. |
| Remove the page's "Room blocked" checkbox; the room's own `blocked` field decides AC3 | Keep the checkbox as an extra override | The checkbox was risk 1 in 3.1: it ignored `room.blocked` and carried over to other rooms, so F3 could not hold per room. `checkRoom` reads `room.blocked`, tested by `F3 AC3 a blocked room with a free valid slot is not available`. |
| `checkRoom` returns a boolean, the same as `canBook` | Return `{ available, reason }` so the page can name the reason (assistant's optional step 11) | Out of scope for this change: the brief fixes the signature `checkRoom(...): boolean`, and the 19 `canBook` tests depend on a boolean. It stays as a remaining limitation in section 7. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/booking.ts` unused `BookingRequest` type, `canBook`'s inline bookings type, and `src/App.tsx` `type Interval` — the booking interval shape written three times | One `Interval` type in `src/rooms.ts`; `BookingRequest` deleted |
| `src/App.tsx` `ROOMS` array and `type Room` (room data in the UI) next to the room fields used by `canBook` | `src/rooms.ts` `Room` and `ROOMS`, imported by the page and typed into `checkRoom` |
| Two sources for AC3: the `blocked` checkbox state in `App()` and the unused `room.blocked` in the data | Only `room.blocked`, read by `checkRoom` in `src/booking.ts` |
| Two sources for the form values in `check()`: the controlled `useState` values and `new FormData(event.currentTarget)` | Only the state values; `FormData` and the `name=` attributes removed |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `AC1 checkRoom rejects a request in the past` (also `T02`–`T05 AC1`, `X1 AC1`) | r2, 08:00–09:00 at now 09:00 → `false` |
| AC2 | `T06 B1 AC2 120 minutes`, `T07 B2 AC2 121 minutes` | 720–840 → `true`; 720–841 → `false` |
| AC3 | `T13 AC3 blocked room`, `F3 AC3 a blocked room with a free valid slot is not available` | free 12:00–13:00 in a blocked room → `false` |
| AC4 | `T01 B3 AC4 touching after`, `T09 B4 AC4 partial overlap`, `BUG-A AC4 touches both neighbors` | 660–720 next to 600–660 → `true`; 630–690 → `false` |
| AC5 | `AC5 checkRoom does not change the catalog` (also `AC5 preserves…`, `BUG-B AC5…`) | two checks on r1 → the catalog equals its deep copy |
| F1 | `F1 keeps only rooms whose capacity is at least the attendees` | 5 attendees → m8, n10, l12, x20 (s4 has 4 seats) |
| F2 | `F2 room must contain all selected items, not just one` | projector + whiteboard → m8, x20 (l12 has only a projector) |
| F3 | `F3 AC3 a blocked room with a free valid slot is not available`, `F3 an unknown room id is not available` | blocked r3 → `false`; id `nope` → `false` |
| F4 | `F4 no room is big enough returns an empty array`, `F4 no room has the required item returns an empty array` | 21 attendees → `[]`; computers → `[]` |
| F5 | `F5 the same times give a different result in another room` | 10:30–11:30: r1 (booked 10:00–11:00) → `false`, r2 → `true` |
| B1 | `T06 B1 AC2 120 minutes`, `B1 AC2 checkRoom allows exactly 120 minutes` | 12:00–14:00 → `true` |
| B2 | `T07 B2 AC2 121 minutes`, `B2 AC2 checkRoom rejects 121 minutes` | 12:00–14:01 → `false` |
| B3 | `T01 B3 AC4 touching after`, `B3 AC4 checkRoom allows a request touching the chosen room booking` | 11:00–12:00 after 10:00–11:00 → `true` |
| B4 | `T09 B4 AC4 partial overlap` | 10:30–11:30 against 10:00–11:00 → `false` |
| B5 | `B5 capacity exactly equal to attendees is included` | 8 attendees → m8 (8 seats) included |
| B6 | `B6 capacity one below attendees is excluded` | 9 attendees → m8 (8 seats) excluded |
| INT | `INT F3 F5 filterRooms then checkRoom on the rooms it returned` | 10 attendees + projector → l12, x20; 12:00–13:00: l12 `true`, blocked x20 `false`; 10:30–11:30 in l12 `false`; m8 (filtered out) `false` |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd sis-04/app
npm install
npx vitest run
npm run build
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
 RUN  v3.2.4 /Users/nuralimuratov/Desktop/SE/se-practice-sis04/sis-04/app

 ✓ src/booking.test.ts (27 tests) 3ms
 ✓ src/filter.test.ts (14 tests) 3ms

 Test Files  2 passed (2)
      Tests  41 passed (41)
   Start at  11:57:57
   Duration  320ms (transform 60ms, setup 0ms, collect 69ms, tests 6ms, environment 0ms, prepare 150ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 19/19 | 41/41 | the `Tests` line of the runs in 1.1 (baseline commit 8bd6e50) and 6.3, `npx vitest run` in `app/` |
| Duplicated logic locations removed | 0 | 4 | the rows of 5.3, each pointed at in the diff `git diff 8bd6e50 -- sis-04/app/src` |
| Code structure: modules and their responsibilities | 2 modules + tests: `App.tsx` (data, conversion, state, rules for the form, rendering), `booking.ts` (`canBook`) | 4 modules + 2 test files: `rooms.ts` (data), `booking.ts` (`canBook`, `checkRoom`), `filter.ts` (`filterRooms`), `App.tsx` (UI only) | `git ls-files sis-04/app/src` at 8bd6e50 and at the final commit, read against 5.1 |
| Remaining limitation | — | No automated test covers `App.tsx`: the room fallback, clearing the result (F5 on the page) and the empty state were checked by hand only (4.2). Also, "Unavailable" does not say why (past, over 120 min, overlap or blocked) | the manual check in the browser at desktop width and 375 px recorded in 4.2; `checkRoom` returns only a boolean |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Claude Code, Claude Opus 5.5 (a read-only subagent that could not edit files)
**Date:** 2026-11-22
**Purpose:** Analysis of the starting code and a first plan (Task 1)

**Prompt:**

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

**Output used:**

```text
## Part 1 — Maintainability risks
[…]
**R1. The "Room blocked" checkbox overrides the room data. The room's own `blocked` field is never read.**
- **Where:** `src/App.tsx`, in `App()` and `check()`.
- **Evidence:** `const [blocked, setBlocked] = useState(false)` feeds `canBook({ ..., blocked, bookings: room.bookings })`. `room.blocked` appears nowhere, so the `blocked` field in `ROOMS` does nothing.
**R2. A misleading comment invites a change that would break AC5.**
- **Where:** `src/booking.ts`, in `canBook`.
- **Evidence:** just before `return true;` the comment reads `// keep the room's list current with the slot that was just found free`.
**R3. `canBook` has no type-level protection against mutating bookings, and its types are duplicated.**
- **Duplication:** the interval shape is written out three times: in `BookingRequest`, in `canBook`'s inline type, and in `type Interval` in `App.tsx`.
**R4. Rules are duplicated and inconsistent between the UI and the domain.**
- **Evidence:** `check()` repeats part of AC1 (`if (!(s < e)) setError(...)`). It then does not return, so it still calls `canBook` and shows both the error message and "Unavailable".
[…]
**R6. The selected room is assumed to exist.**
- **Evidence:** `const room = ROOMS.find(r => r.id === roomId)!`.
**R7. An old result stays on screen after the inputs change.**
- **Evidence:** `setResult(null)` is only called inside `check()`.
**R8. The form has two sources of truth.**
- **Evidence:** the inputs are controlled by `useState` (`now`, `start`, `end`). `check()` ignores that state and reads `new FormData(event.currentTarget)` instead.
[…]
## Part 2 — Prioritised plan
[…]
**Step 1. Harden `canBook`'s contract without changing behaviour (R2, R3, R9).**
- Test first: add one test that passes `Object.freeze`d bookings and expects an available result.
- Change: delete the misleading comment; export one `Interval` type; use `ReadonlyArray<Interval>`; pull out the constants `MAX_DURATION_MIN = 120` and `DAY_END_MIN = 1440`.
**Step 2. Move the time helpers into `src/time.ts` (part of R5).**
**Step 3. Add `src/rooms.ts` with the `Room` type and a catalog of at least four rooms.**
- Test first, in `rooms.test.ts`: at least four rooms, with unique ids; capacity is a positive integer; […]
**Step 4. Add `src/filter.ts` with `filterRooms(rooms, { attendees, equipment })`.**
- **Decision to make here: blocked rooms.** My recommendation is that `filterRooms` filters only on capacity and equipment, as the brief says. F3 is then enforced in `checkRoom`, and the UI labels the room "(blocked)" in the list.
**Step 5. Add `checkRoom(rooms, roomId, { start, end, now })` to `src/booking.ts`.**
[…]
**Step 12. Component tests (R12).** These would need `jsdom` and `@testing-library/react` as dev dependencies. […]
```

**Problems found:** The first plan wanted to change `canBook` (constants `MAX_DURATION_MIN`, `DAY_END_MIN`, a frozen-array test), although README §7 keeps `canBook` as in Practice #08; it proposed `rooms.test.ts` against the real `ROOMS`, which README §9 rules out (fixed catalog in the test file); `time.ts` and jsdom were more than this change needs. R9–R11 (magic numbers, boolean only, aria) are real but small.
**Changes made:** I kept risks R1, R2, R3, R4, R6, R7 and R8 as my risks 1–6 in 3.1, after opening `App.tsx` and `booking.ts` myself; I modified step 1 and rejected the `rooms.test.ts` step (3.3) and wrote my own smaller plan.
**Verified by:** `src/App.tsx` (line `const [blocked, setBlocked] = useState(false)`, no `room.blocked`; `ROOMS.find(...)!`; no `return` after the reversed-time `setError`; `new FormData`), `src/booking.ts` (the comment and the unused `BookingRequest`), and the page run in 4.2 where the old result stayed after switching rooms before the change.

### 8.2 Exchange 2

**Tool and model:** Claude Code, Claude Opus 5.5 (a read-only subagent that could not edit files)
**Date:** 2026-11-22
**Purpose:** Review of my improvement plan before editing (the plan)

**Prompt:**

```text
Thanks. I checked your risks in the code and I am changing your plan before I start. Two changes: (a) I will not change canBook beyond deleting the misleading comment and typing bookings as readonly; the brief says canBook stays as in Practice #08, so no MAX_DURATION_MIN/DAY_END_MIN constants and no frozen-array test; (b) I will not write rooms.test.ts against ROOMS, because my tests must use a fixed catalog inside the test file so editing demo data cannot change a result. I also skip time.ts and jsdom/Testing Library; the integration test will call filterRooms and then checkRoom on what it returned.

My plan:
1. Delete the comment in canBook, type bookings as ReadonlyArray; 19 tests green.
2. Add src/rooms.ts: Room type, one Interval type, ROOMS with 5 fictional rooms (one blocked, a101 keeps 10:00–11:00).
3. Test-first filterRooms in src/filter.ts: F1, F2, F4, B5 (capacity == attendees included), B6 (one below excluded).
4. Test-first checkRoom in src/booking.ts: F3, F5 (same times, two rooms, different result), unknown id false, AC5 no mutation; B1–B4 through checkRoom.
5. INT test: filterRooms then checkRoom on its result.
6. App.tsx: import ROOMS and checkRoom, remove the Room blocked checkbox.
7. App.tsx: attendees + equipment filters, empty state (F4).
8. App.tsx: fall back when the selected room is filtered out, clear the result on any change (F5), return after the reversed-time error, read state instead of FormData.

Review this plan only: is any step unsafe, in the wrong order, or missing something AC1–AC6 or F1–F5 needs? Keep it short, no code.
```

**Output used:**

```text
Your plan is sound overall. Steps 1–5 are safe and in the right order: step 1 has to come before step 4 because `checkRoom` passes the readonly `room.bookings` into `canBook`. […]
**Unsafe or in the wrong order**
1. **Steps 7 and 8 need reordering.** Once step 7 filters the dropdown, `ROOMS.find(r => r.id === roomId)!` can point at a room that is no longer shown, and the old result stays on screen. The commit after step 7 would then break F5. Move "fall back when the selected room is filtered out" and "clear the result on any change" into step 7, or just before it.
2. **Step 8 bundles four changes into one.** Split it so each one can be checked and reverted on its own. […]
**Missing for F1–F5**
3. **Blocked rooms (F3).** Decide whether `filterRooms` keeps or hides blocked rooms, and write a test that records the choice. If it keeps them, the INT test must show a blocked room coming back from `filterRooms` and then `checkRoom` returning false.
4. **More filter tests in step 3:** no equipment selected returns every room big enough; a room with extra equipment is still included; filterRooms does not change the array it is given; […]
5. **Empty list (F4) in the UI.** When no rooms match, also disable the Check button so `checkRoom` is never called with an empty or stale id.
6. **Result clearing (F5).** Clear the result when the filters change too, not only on room or time changes.
**Missing for AC6**
7. **No step covers feedback quality.** Add a final step: `role="status"` / `aria-live` on the result and error messages; CSS for the equipment fieldset and the empty-state message […]; a manual check at 375 px and at desktop width.
[…]
- In step 2, make equipment a string-literal union type. Then `tsc` catches typos in the data, which partly makes up for having no `rooms.test.ts`.
- Run `npm run build` after every step, not just `npm test`.
```

**Problems found:** None of its points was wrong, but point 4 ("decide what an empty or 0 attendees value means") was already handled by the number field's `min=1`, so I did not add a separate test for 0.
**Changes made:** I reordered my plan: the room fallback and clearing the result came before the filters, "read state" and "return early" became their own step, the Check button is disabled in the empty state, the result is also cleared when a filter changes, equipment is a string-literal union, and a final AC6 step was added. This is the plan in 3.2, committed (f459c54) before the first commit that changed `app/src`.
**Verified by:** `git log` shows `sis-04: analysis and plan` before `sis-04: canBook - drop the misleading comment…`; the F5 behaviour was then checked on the page (switch-a / switch-b: the old result disappears when the room changes); `npm run build` was run after every step.

### 8.3 Exchange 3

**Tool and model:** Claude Code, Claude Opus 5.5 (a read-only subagent that could not edit files)
**Date:** 2026-11-22
**Purpose:** Tests for filterRooms, written before the function (implementation / tests)

**Prompt:**

```text
Write Vitest tests (TypeScript) for a function that does not exist yet. Do not edit any file: reply with the content of src/filter.test.ts only. The project is /Users/nuralimuratov/Desktop/SE/se-practice-sis04/sis-04/app; read src/rooms.ts for the Room type.

Signature: `export function filterRooms(rooms: Room[], criteria: { attendees: number; equipment: string[] }): Room[]` in src/filter.ts.
Rules: F1 room capacity must be greater than or equal to the requested attendees. F2 the room must contain ALL selected required items. F4 when no room matches, the result is an empty array (the page shows an empty state). Blocked rooms are NOT removed by filterRooms (blocking is checked later by checkRoom).

Requirements for the tests:
- import { expect, test } from 'vitest' and { filterRooms } from './filter'; no mocks, no .skip/.only/.todo, no test.each.
- use a fixed catalog of rooms declared inside the test file, not ROOMS, so demo data cannot change a result.
- each test title starts with its ID(s): F1, F2, F4, B5 (capacity exactly equal to attendees -> included), B6 (capacity one below attendees -> excluded).
- also cover: no equipment selected returns every room big enough; a room with extra equipment is still included; the input array is not changed.
- expected values must come from the rules above, not from any implementation. Compare room ids.
```

**Output used:**

```text
// Fixed catalog: independent of ROOMS so demo data cannot change a result.
// No room has 'computers'. x20 is blocked on purpose.
function catalog(): Room[] {
  return [
    { id: 's4', name: 'Small 4', capacity: 4, equipment: ['whiteboard'], blocked: false, bookings: [] },
    { id: 'm8', name: 'Medium 8', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'n10', name: 'Bare 10', capacity: 10, equipment: [], blocked: false, bookings: [] },
    { id: 'l12', name: 'Large 12', capacity: 12, equipment: ['projector', 'video call'], blocked: false, bookings: [] },
    { id: 'x20', name: 'Hall 20', capacity: 20, equipment: ['projector', 'whiteboard', 'video call'], blocked: true, bookings: [{ start: 600, end: 660 }] },
  ];
}

function ids(rooms: Room[]): string[] {
  return rooms.map((r) => r.id).sort();
}

test('F1 keeps only rooms whose capacity is at least the attendees', () => {
  const result = filterRooms(catalog(), { attendees: 5, equipment: [] });
  expect(ids(result)).toEqual(['l12', 'm8', 'n10', 'x20']);
});
[…]
test('F4 each criterion matches some room but none matches both', () => {
  const result = filterRooms(catalog(), { attendees: 13, equipment: ['computers', 'projector'] });
  expect(result).toEqual([]);
});

test('B5 capacity exactly equal to attendees is included', () => {
  const result = filterRooms(catalog(), { attendees: 8, equipment: [] });
  expect(ids(result)).toContain('m8');
  expect(ids(result)).toEqual(['l12', 'm8', 'n10', 'x20']);
});

test('B6 capacity one below attendees is excluded', () => {
  const result = filterRooms(catalog(), { attendees: 9, equipment: [] });
  expect(ids(result)).not.toContain('m8');
  expect(ids(result)).toEqual(['l12', 'n10', 'x20']);
});
[…]
- Because ids are sorted before comparing, these tests won't catch a change in result order. If the page has to keep catalog order, compare `result.map(r => r.id)` without sorting.
```

**Problems found:** (1) The test 'F4 each criterion matches some room but none matches both' is wrong about itself: no room in its catalog has `computers`, so it is the same case as the test before it. (2) `ids()` sorts the ids, so the tests cannot catch a change of order, but the page falls back to the first room in the filtered list, so catalog order matters. I checked every expected list by hand against F1/F2 and the catalog: all of them were right.
**Changes made:** I deleted the misleading F4 test, made `ids()` keep catalog order and rewrote the expected lists in catalog order, gave l12 a 10:00–11:00 booking and added the INT test (`filterRooms` then `checkRoom`, including the blocked x20 and a filtered-out room).
**Verified by:** The run before `src/filter.ts` existed failed with "Cannot find module './filter'"; after adding `filterRooms` the suite went to 41/41 (6.3); `npm run build` passed; on the page, attendees 15 + projector listed exactly C-310, D-015 and E-120 (filter-match).

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | the last run of `python tests/check_sis.py` gave 33 PASS, 0 FAIL, 0 ERROR |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

I gave AI the file structure for Week 08, including App.tsx, booking.ts, and booking.test.ts. I also gave it the AC1–AC6 and F1–F5 requirements.

I set some important rules:

* Do not change canBook.
* All 19 old tests must still pass.
* Use fake data without a backend.
* First explain the risks and make a plan before changing the code.

The “Room blocked” checkbox did not use room.blocked correctly. AI also suggested checking the fallback room before applying filters and disabling the button when no rooms are available.

It wanted to add constants inside canBook, but I clearly said not to change this function.

There was also a wrong F4 test in filter.test.ts. It expected every filter to match at least one room, but no room had computers.

Another problem was that AI sorted room IDs in tests, while the application selected the first room based on the original list order.

I manually checked the expected results using F1/F2 and AC requirements instead of just trusting the code output.

I wrote tests before implementing the functions (red → green).

Some tests helped me make important decisions. For example:

* The F5 test checked that bookings belonged to the selected room.
* The INT test confirmed that blocked rooms stayed in the list, but checkRoom returned false.

I still need to add UI tests for App.tsx using jsdom and Testing Library.

Also, checkRoom currently returns only true or false. I want to improve it so it explains why booking is not possible, such as a blocked room, overlapping bookings, a time in the past, or a booking that is too long.

