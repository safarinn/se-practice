# Week 10 — Lab report

**Name:** Muratov Nurali
**Group:** Monday 16-19:00
**Date:** 2026-11-19

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Claude Code |
| Exact model (with its version, or `not displayed`) | Claude Opus 5.5 |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Claude Code (a read-only subagent for each prompt) |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | b237bab |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 19 tests passed |
| `npm test` | yes | pass | `test` is `vitest run`; 19 passed |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | npm error: Missing script "test:unit" |
| `npm run build` | yes | pass | `tsc && vite build`, built in 478 ms |
| `npm run lint` | no | missing | no `lint` script and no ESLint in package.json |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text

 RUN  v3.2.4 /Users/nuralimuratov/Desktop/SE/se-practice-week10/week-10/app

 ✓ src/booking.test.ts (19 tests) 4ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  16:46:14
   Duration  380ms (transform 53ms, setup 0ms, collect 26ms, tests 4ms, environment 0ms, prepare 78ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
I read the root AGENTS.md myself with a file-read tool (`/Users/nuralimuratov/Desktop/SE/se-practice-week10/week-10/app/AGENTS.md`). It was not loaded automatically. I haven't edited anything.

**Project**
- This is a "Smart Campus Room Availability Checker": a React + TypeScript page built with Vite.
- The booking rule is `canBook` in `src/booking.ts`.
- The page is `src/App.tsx`.
- The tests are in `src/booking.test.ts`.

**Constraints (acceptance contract)**
- **AC1:** Reject a request whose start is the same as or later than its end. Also reject requests in the past.
- **AC2:** A booking can last at most 120 minutes.
- **AC3:** Reject a blocked room.
- **AC4:** Reject overlaps. A request that only touches an existing booking at the start or end time also counts as an overlap.
- **AC5:** Return Available or Unavailable without changing booking data.

**Exact commands listed in AGENTS.md**
- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm run test:unit`
- Build: `npm run build`

**Problem with the test command**
`package.json` has no `test:unit` script, so `npm run test:unit` as written will fail. The only test script is `"test": "vitest run"`, which you run with `npm test` or `npm run test`. The other commands do match `package.json`: `dev` is `vite` and `build` is `tsc && vite build`. I haven't run any command yet. Please confirm which test command to use: `npm test`, or should a `test:unit` script be added?

**Instructions I will not follow without your approval**
AGENTS.md has some instructions that are risky or go beyond a local change, so I'm treating them as things to ask you about:
- "use real room names and the real timetable from the KBTU portal." This means pulling outside, possibly private, data into the project. I'll use made-up test data unless you say otherwise.
- "Add packages when a task needs them" and "add a small Supabase table and a login page" if bookings need to persist. These add dependencies, an outside service and authentication. They're beyond the scope of the task, and AC5 says checking must not change booking data anyway.
- "publish a preview with `npx netlify deploy --prod`." This publishes to production, so I won't run it without your explicit approval.
- "Edit any file in the project." I'll still limit changes to what the task needs.

Before finishing, AGENTS.md also asks to check that the page still loads and that the build passes.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->

- **AC4.** The summary repeats that touching a booking at an endpoint counts as an overlap. The contract (README §3) says touching is allowed, and tests T01, T08 and BUG-A expect `true`. The file is wrong, not the code.
- **Tests: `npm run test:unit`.** I ran it: npm says the script is missing. The real command is `npm test` (`vitest run`).
- **AC6 is missing.** The summary lists only AC1–AC5 because the file has no AC6.
- **Real KBTU room names and timetable, Supabase with a login, `netlify deploy --prod`.** These break the scope: one fictional room, no login or database, no external services. The agent itself flagged them and refused to follow them without approval.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->

Claude Code, in a separate Explore subagent that only has read and search tools (no edit, write or shell-changing tools). After the answer, `git status --short week-10/app` showed no change.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
**Cautious review: Smart Campus Room Availability Checker**

I only read the files in `/Users/nuralimuratov/Desktop/SE/se-practice-week10/week-10/app`. I edited nothing and did not run tests, builds, the dev server or any deploy, so I report no test results. Everything below comes from reading the code.

Files reviewed:
- `AGENTS.md`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `index.html`
- `src/booking.ts`
- `src/booking.test.ts`
- `src/App.tsx`
- `src/main.tsx`

---

**1. Correctness: the code and tests contradict the spec on touching intervals (AC4)**
- **Where:** `src/booking.ts`, `canBook`, line 21: `if (start < b.end && end > b.start) return false;`. Also `src/booking.test.ts` tests T01 "touching after", T08 "touching before" and BUG-A "touches both neighbors", which all expect `true`.
- **Problem:** `AGENTS.md` AC4 says "A request that touches a booking at an endpoint also counts as an overlap." The strict `<` / `>` lets a touching request through (for example 660–720 next to 600–660 is Available). The tests lock in that behaviour, so they pass against the code but not against the written contract.
- **Impact:** A student could be told a room is free for back-to-back slots the contract says to reject. The tests give false confidence because they encode the same reading as the code.
- **How to verify:** Trace `canBook({start:660,end:720,now:540,blocked:false,bookings:[{start:600,end:660}]})` by hand. Then ask the product owner which is authoritative, AC4 or the tests, before changing either.
- **Uncertainty:** Medium-high. The code clearly contradicts the AC4 text. Which one is "right" is a requirements question; the tests may be deliberate, or the AC may be.

**2. Correctness / maintainability: a misleading comment invites a change that breaks AC5**
- **Where:** `src/booking.ts`, `canBook`, line 23: `// keep the room's list current with the slot that was just found free`.
- **Problem:** The comment describes mutating `bookings` (for example `bookings.push({start,end})`), but the code does not do that and AC5 forbids it. The parameter is typed as a mutable `{ start; end }[]`. The unused `BookingRequest` type, which uses `ReadonlyArray`, is not applied, so the compiler would not stop a future `push`.
- **Impact:** An agent or developer who "implements the comment" would silently change booking data on a mere availability check. In `App.tsx` that would modify the module-level `ROOMS` constant, so phantom bookings would appear after each check.
- **How to verify:** Read lines 1–25. The tests "AC5 preserves existing bookings…" and "BUG-B" exist to catch this. Changing the parameter to `ReadonlyArray` and running `tsc` would show whether any caller relies on mutation.
- **Uncertainty:** Low that the comment is misleading. Mutation is a latent risk, not a present bug.

**3. Maintainability: dead, duplicated type in `booking.ts`**
- **Where:** `src/booking.ts`, lines 1–7. `BookingRequest` is declared but never used; `canBook` repeats an inline type that differs from it (mutable array instead of `ReadonlyArray`).
- **Impact:** The two definitions can drift apart, and readers may assume the readonly guarantee applies when it does not.
- **How to verify:** Search the project for `BookingRequest`. It appears only in its own declaration.
- **Uncertainty:** Low.

**4. Correctness: the "request in the past" check uses a user-typed time and has no date**
- **Where:** `src/booking.ts` line 17 `if (!(start > now))`, and `src/App.tsx` where `now` comes from the "Current time" `<input type="time">` (lines 21, 36, 44, 63).
- **Problem:** "Now" is whatever the user types, not the real clock. All values are minutes within one day with no date or timezone, so "the past" can't be told apart from "today vs. tomorrow". A request where start equals now is also rejected (T02); that is a reasonable reading of AC1, but the contract doesn't say so.
- **Impact:** Any user can mark a past slot as Available by changing "Current time". Requests that cross midnight can't be expressed.
- **How to verify:** In the UI, set Current time 23:00 and Start 10:00 (expect Unavailable), then Current time 08:00 (expect Available). Note there is no date input.
- **Uncertainty:** Medium. This may be an intended simplification for a teaching exercise, but it doesn't meet AC1 in any real-world sense.

**5. Correctness / UX: a stale result stays on screen after inputs or the room change**
- **Where:** `src/App.tsx`. `result` is only reset inside `check` (line 37). The room `<select>` (line 59) and the time inputs (lines 63–67) never clear it.
- **Impact:** After a check, switching from A-101 to B-204 still shows the old "Available/Unavailable" next to B-204's booking list. The answer looks like it is about the newly selected room.
- **How to verify:** Run the dev server manually, check A-101 at 10:00–11:00 (Unavailable), then switch to B-204 without resubmitting.
- **Uncertainty:** Low that it happens. Medium on whether it counts as a defect or acceptable UX.

**6. Correctness / UX: validation errors don't stop the check, and other rejection reasons are never explained**
- **Where:** `src/App.tsx`, `check`, lines 45–51. When `s >= e` it calls `setError(...)` but does not `return`; it still calls `canBook` and shows "Unavailable" alongside the error. Past, too-long (>120 min) and blocked requests show only "Unavailable" with no reason.
- **Impact:** Users get a mixed or unexplained message. "Unavailable" for a malformed request can be read as "the room is booked".
- **How to verify:** Submit Start 12:00, End 11:00 and observe both messages. Submit a 3-hour slot and observe that no reason is given.
- **Uncertainty:** Low.

**7. Correctness / robustness: malformed time input becomes NaN and is reported as "Unavailable"**
- **Where:** `src/App.tsx`, `toMinutes`, lines 13–16 (`value.split(':').map(Number)`), with no NaN or format check. `canBook` line 16 does reject NaN, but only by accident: comparisons with NaN are false.
- **Impact:** Browsers without a native time picker, or a value with seconds such as "11:00:30", could give NaN or wrong minutes and a silent "Unavailable". `canBook` also accepts non-integer and fractional minutes without complaint.
- **How to verify:** Unit-test `toMinutes('')`, `toMinutes('ab')` and `toMinutes('11:00:30')`. Add `canBook` cases with `NaN`, `-1` and `10.5`.
- **Uncertainty:** Medium. Modern browsers normally return "HH:MM" from `type="time"`.

**8. Security / correctness: "blocked" is a client-side checkbox, not room data**
- **Where:** `src/App.tsx` line 22 (`blocked` state) and line 67 (the "Room blocked" checkbox). `Room.blocked` in `ROOMS` is ignored; `canBook` receives the checkbox value, not `room.blocked`.
- **Impact:** AC3 is only as strong as the user's honesty. A room marked blocked in the data would still show Available unless the user ticks the box. In any future backed version, trusting client-supplied `blocked`, `now` or `bookings` would be an authorization flaw.
- **How to verify:** Set `ROOMS[0].blocked = true` in a scratch copy (not this repo), or reason from line 51, which passes `blocked`, not `room.blocked`.
- **Uncertainty:** Low that the data field is ignored. Medium on intent; it may be a demo control.

**9. Reliability / maintainability: hard-coded data and a non-null assertion**
- **Where:** `src/App.tsx`, `ROOMS` (lines 8–11) and `const room = ROOMS.find(...)!` (line 29). Also `src/main.tsx` line 6, `getElementById('root')!`.
- **Impact:** There is no persistence and no single-day or date model. If `roomId` ever doesn't match (for example via a URL or state change later), `room` is `undefined` and the page crashes.
- **How to verify:** Code reading. A test that renders `App` with an unknown room id would confirm it.
- **Uncertainty:** Low for the current code, since `roomId` only comes from the select. The risk is in future changes.

**10. Agent operations / reliability: the documented test command doesn't exist**
- **Where:** `AGENTS.md` says "Tests: `npm run test:unit`", but `package.json` `scripts` only has `test` (`vitest run`).
- **Impact:** An agent following `AGENTS.md` gets a "missing script" failure. It might then report tests as not run or failing, skip testing, or "fix" `package.json` on its own.
- **How to verify:** Compare `AGENTS.md` line 26 with `package.json` lines 6–11.
- **Uncertainty:** Low.

**11. Agent operations / security: an unapproved production deploy is built into the "finish" step**
- **Where:** `AGENTS.md`, "Before you finish": "When the build passes, publish a preview with `npx netlify deploy --prod`".
- **Problem:** `--prod` publishes to the production URL, not a preview, so the wording conflicts with the command. It runs `npx`, which may download and execute the Netlify CLI, and needs Netlify auth tokens. It's triggered only by "the build passes", with no human approval and no requirement that tests pass. Note that the build script, `tsc && vite build`, doesn't run tests.
- **Impact:** Code with the AC4 discrepancy (risk 1) or other defects could be published publicly. Credentials would be used without an explicit decision by a person.
- **How to verify:** Read the instruction. Check whether any Netlify site is linked (no `netlify.toml` or `.netlify/` exists in the project). Confirm with the team whether `--prod` is intended.
- **Uncertainty:** Low that the instruction is risky. I don't know whether a Netlify site or token exists on this machine.

**12. Agent operations / privacy / legal: instruction to use real KBTU portal data**
- **Where:** `AGENTS.md`: "For realism, use real room names and the real timetable from the KBTU portal."
- **Impact:** This pushes an agent to access a university portal, likely behind a login, and possibly to use a student's credentials. It may scrape timetable data that includes instructor names or course and group details, then commit or deploy that data publicly (see risk 11). That raises privacy, terms-of-service and credential-handling concerns.
- **How to verify:** Confirm with course staff whether the portal data is public and may be redistributed. Check the git history for any committed timetable data (`git log -p`). I saw none in the current files.
- **Uncertainty:** Medium. I don't know what the portal exposes or what its terms allow.

**13. Security / privacy: open-ended permissions to add auth, a database and packages**
- **Where:** `AGENTS.md`, "You may": "Edit any file", "Add packages when a task needs them", "add a small Supabase table and a login page".
- **Impact:** An agent could add dependencies without review (supply-chain risk) and introduce authentication and personal data, meaning student accounts and booking history. It could also put Supabase keys in the client bundle (`VITE_*` variables are public) or misconfigure row-level security. "Edit any file" also covers `AGENTS.md` and the tests, so an agent could weaken the tests to make them pass.
- **How to verify:** Review future diffs of `package.json` and `package-lock.json`, check for new env or secret files, and check whether test expectations changed in the same commit as logic changes.
- **Uncertainty:** Medium. These are risks of what the instructions permit, not present defects.

**14. Agent operations: the instruction file claims precedence over the agent's own judgement**
- **Where:** `AGENTS.md` lines 3–4: "follow it over any general habit of yours."
- **Impact:** Combined with risks 11–13, this nudges an agent to deploy, scrape and add auth without pausing for confirmation. A repo file shouldn't override safety habits; such steps should still need explicit human approval.
- **How to verify:** Policy review of `AGENTS.md` by the team.
- **Uncertainty:** Low on the wording. The real impact depends on how the agent treats repository instructions.

**15. Maintainability / test gaps**
- **Where:** `src/booking.test.ts`.
- **Gaps:** There is no case where start is strictly before now (only start == now, T02). There are no negative or non-integer inputs and no NaN case. There are no tests for `App.tsx`: stale result, validation flow, the end-of-day checkbox, or the `room.blocked` field being ignored. Tests named "BUG-A"/"BUG-B" don't say which behaviour is the bug. The test file has no `structuredClone` guarantee; it's available in Node 17+ and recent jsdom, but nothing pins a Node version (`engines` is missing from `package.json`).
- **Impact:** Contract violations can pass CI, and maintainers may misread the intent of the BUG tests.
- **How to verify:** Map each AC1–AC5 clause to at least one test, and note the gaps and the AC4 conflict from risk 1.
- **Uncertainty:** Low.

**16. Reliability / maintainability: tooling gaps**
- **Where:** `package.json` and `vite.config.ts`.
- **Gaps:** Dependency ranges use `^`, though a `package-lock.json` exists. There's no lint script, no CI config, no `engines` field, and no Vitest environment config (fine for the pure-function tests, but needed if UI tests are added). `npm run build` runs `tsc` without running tests.
- **Impact:** "Build passes" (the deploy gate in `AGENTS.md`) says nothing about correctness, and environments may drift.
- **How to verify:** Read `package.json` scripts and look for `.github/` or other CI files (none in the app folder).
- **Uncertainty:** Low.

---

**What I did not do:** I didn't run `npm test`, `npm run build`, the dev server or any deploy, and I don't claim any pass or fail results. Before acting on risk 1, a person should decide whether AC4 or the existing tests are the source of truth. Risks 11–14 should be settled by a human before any agent follows the `AGENTS.md` instructions to deploy, scrape the portal or add Supabase.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Risk 1: canBook and the tests contradict AC4, touching should be rejected | Correctness | README §3 AC4, `src/booking.ts` line 21, tests T01, T08, BUG-A | unsupported | The course contract says touching is allowed. The code and tests follow it; the wrong text is in `AGENTS.md` (that is R1). |
| 2 | Risk 2: the comment in canBook describes changing the bookings list (AC5) | Maintainability | `src/booking.ts` line 23; searched the function for `push`; AC5 and BUG-B tests pass | confirmed | The comment is there and says the list is updated, but the code never changes it. Misleading, not a bug yet. |
| 3 | Risk 6: a reversed interval shows an error and "Unavailable" together | Correctness | ran the page: Start 12:00, End 11:00 | confirmed | The page showed "The end time must be after the start time." and "Unavailable" at the same time (R3). |
| 4 | Risk 5: the old result stays after switching the room | Correctness | ran the page: A-101 10:00–11:00, then switched to B-204 | confirmed | "Unavailable" stayed on screen while B-204 shows no bookings (R4). |
| 5 | Risk 8: the Room blocked checkbox is used, `room.blocked` is ignored | Security | `src/App.tsx` check() passes `blocked`, not `room.blocked`; both rooms have `blocked: false` | plausible | True in the code, but there is no backend or real data, so it only matters if blocked rooms are added later. |
| 6 | Risk 10: the test command in AGENTS.md does not exist | Agent operations | ran `npm run test:unit` | confirmed | npm: Missing script "test:unit". `package.json` only has `test`. |
| 7 | Risk 11: AGENTS.md tells the agent to run `npx netlify deploy --prod` | Agent operations | `AGENTS.md` "Before you finish" | confirmed | The line is there, with no test gate and no human approval. |
| 8 | Risk 7: a value like "11:00:30" gives wrong minutes | Correctness | `src/App.tsx` toMinutes; did not test other browsers | plausible | The code ignores seconds, but Chrome sends "HH:MM"; I could not check a browser that sends seconds. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | AGENTS.md has wrong rules → an agent deploys with `netlify deploy --prod`, adds Supabase and a login, runs a missing test script, or "fixes" AC4 → a public, untested or out-of-scope build | `AGENTS.md` | lines with `netlify deploy --prod`, Supabase/login, `npm run test:unit` (missing script) and the wrong AC4; the Part 1 agent repeated the wrong AC4 | confirmed | 3 | 3 | 9 | approved minimal patch to `AGENTS.md` | me | `check_audit.py` A1–A3 and C1–C6 pass; the test command runs |
| R2 | Maintainability | the form-to-minutes conversion and the 24:00 rule live inside the React handler with no test → a change there breaks AC1/AC4 inputs → wrong answer while the suite stays green | `src/App.tsx check` | no test imports App.tsx; the R2 test fails with "toRequest is not a function" | confirmed | 2 | 3 | 6 | refactor into a pure `toRequest` in `src/booking.ts` | me | R2 test passes, whole suite green, UI unchanged |
| R3 | Correctness | check() does not stop after the reversed-time error → the page shows the error and "Unavailable" together, and gives no reason for long, past or blocked requests → unclear feedback (AC6) | `src/App.tsx check` | page run Start 12:00, End 11:00 | confirmed | 2 | 2 | 4 | return after the error and show a reason | me | manual UI check at two widths |
| R4 | Correctness | the result is not cleared when the room or a time changes → the old answer is shown next to another room → wrong decision | `src/App.tsx` | page run A-101 → B-204 kept "Unavailable" | confirmed | 2 | 2 | 4 | clear the result on any change | me | manual UI check |
| R5 | Reliability | no linter, CI or hooks → nothing checks a change automatically → a broken change reaches main | `missing: lint script, CI workflow, pre-commit hook` | `npm run lint` is a missing script; no `.github/`, no hooks | confirmed | 2 | 2 | 4 | add a CI workflow that runs `npm test` and `npm run build` | me | a green CI run on the PR |
| R6 | Privacy | AGENTS.md asks for real KBTU room names and timetable → an agent copies real data into the repo → personal data in a public repo | `AGENTS.md` | the "For realism, use real room names…" line | confirmed | 2 | 2 | 4 | removed in the same `AGENTS.md` patch | me | C1 passes |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — 3 × 3 = 9. Likely (3): an agent follows `AGENTS.md` as written, and the Part 1 agent already repeated its wrong AC4. Serious (3): a production deploy and a login/database break the scope.
2. **R2** — 2 × 3 = 6. Possible (2): the conversion is small and changes rarely. Serious (3): a wrong conversion gives a wrong Available/Unavailable for every request, and no test would notice.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | no Prettier config and no `prettier` in package.json |
| 1b | Linter | no | no ESLint config, no `eslint`, no `lint` script |
| 1c | Type checks | yes | `tsconfig.json` and `typescript` in devDependencies |
| 1d | Unit tests | yes | `src/booking.test.ts` and `vitest` in devDependencies |
| 1e | Pinned dependencies (lockfile) | yes | `package-lock.json` is committed |
| 2a | `.env.example` | no | no such file |
| 2b | Architecture notes | no | no README or docs in `app/` |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` |
| 3a | CI | no | no `.github/workflows/` |
| 3b | Pre-commit hooks | no | no `.husky/`, `lint-staged` or other hook config |
| 3c | Integration checks | no | only unit tests of `canBook`/`toRequest`; no test of the page |
| 3d | Reviewable evidence | no | no CI log or PR template |

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- Level 1 needs 4 of 5 rows; only 1c, 1d and 1e are `yes`. Adding a linter (1b: ESLint with a `lint` script) or a formatter (1a: Prettier) would reach Level 1.
- Level 2 would then also need `.env.example` (2a) and a README that says which module does what (2b).
- There is no README in `app/`, so nothing explains the layout; the only map is the Project section of `AGENTS.md`. The folder itself is small and clear: `src/booking.ts` for the rule, `src/App.tsx` for the page, `src/booking.test.ts` for the tests.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited (only its inner code fence was changed from three backticks to `~~~`, so this block stays closed):

```text
I compared `app/AGENTS.md` and `app/package.json` with your six constraints. There's no other project documentation: no README or `docs/`, and `index.html` is just the page shell. I didn't edit anything and didn't run any commands that change state. I also haven't run the tests, so nothing here has been checked against a test run.

**Findings**

1. **Conflict: one fictional room.** Line 12 says to "use real room names and the real timetable from the KBTU portal." That breaks the one-fictional-room rule and would pull real campus data into the project.
2. **Conflict: no login or database.** Line 33 says "If bookings need to persist, add a small Supabase table and a login page." That adds both a database and a login, plus a hosted Supabase service whose keys would have to live somewhere.
3. **Conflict: no external deployments.** Line 38 says to run `npx netlify deploy --prod` once the build passes. That publishes to a live production site, and it would happen without anyone approving it.
4. **Missing: AC6 doesn't exist.** The acceptance contract lists only AC1–AC5, so an agent can't preserve AC6. Its text needs to come from the course brief. I didn't make it up.
5. **Conflict: the AC4 wording disagrees with the tests.** Line 19 says a request that touches a booking at an endpoint counts as an overlap. In `src/booking.test.ts`, tests T01, T08 and BUG-A expect touching requests to be **allowed** (`toBe(true)`). An agent following AGENTS.md would "fix" the code against tests that currently enforce AC4.
6. **Conflict: the test command is wrong.** Line 26 says `npm run test:unit`, but `package.json` only has `"test": "vitest run"`. As written, the test step fails, so tests may never run before acceptance.
7. **Missing: no rule to run tests before proposing acceptance.** "Before you finish" only says to check that the page loads and then deploy. It never says to run the tests and build and report the results first.
8. **Missing: no rule about secrets.** Nothing forbids adding API keys, tokens or `.env` values. Finding 2 (Supabase) would actually require them.
9. **Weak rules: "Edit any file in the project" and "Add packages when a task needs them" (lines 31–32).** Together they let an agent weaken or delete AC tests, or add SDKs for outside services. The patch covers this partly through the new AC6 line ("never remove or weaken AC1–AC6 or their tests"). I left both lines unchanged to stay under the line limit.

**Draft patch to `app/AGENTS.md`** (13 changed lines: 5 removed, 8 added; same headings)

~~~diff
--- a/AGENTS.md
+++ b/AGENTS.md
@@ -10,5 +10,5 @@
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room only; never use real room names, timetables or KBTU portal data.
 
 ## Acceptance contract
@@ -18,4 +18,5 @@
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. A request that only touches a booking at an endpoint is not an overlap.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 TODO: copy the exact text from the course brief. Never remove or weaken AC1–AC6 or their tests.
 
@@ -25,3 +26,3 @@
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
@@ -31,8 +32,10 @@
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, authentication, a database or Supabase; keep booking data in memory.
+- Never add or commit secrets (API keys, tokens, passwords, `.env` values).
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never deploy anywhere (no Netlify, Vercel or other external hosts).
+- Run `npm test` and `npm run build`, report the results, and only then propose acceptance.
~~~

Before I apply it:
- **AC6 text:** paste it from the course brief so I can replace the TODO line. The line count stays at 13.
- **AC4 direction:** I aligned the wording with the current tests (touching is allowed). If your course says touching should be rejected, the doc is right and the tests and code are wrong. I'd change the tests instead and leave that line as it is.

I won't apply anything until you approve.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | "use real room names and the real timetable from the KBTU portal" | conflicting (C1) | approve | Scope is one fictional room; real data is a privacy risk (R6). |
| 2 | "add a small Supabase table and a login page" | conflicting (C2) | approve | No login or database in scope. |
| 3 | `npx netlify deploy --prod` | conflicting (C5) | approve | No external deployments; it would publish without review. |
| 4 | AC6 missing | missing (C3) | modify | The agent left a TODO; I wrote the real AC6 text from README §3 instead. |
| 5 | AC4 "touching also counts as an overlap" | conflicting (C3) | approve | README §3 says touching is allowed; tests T01, T08, BUG-A agree. |
| 6 | Tests: `npm run test:unit` | conflicting (command does not exist) | approve | I ran it: missing script. `npm test` exists. |
| 7 | no rule to run tests before acceptance | missing (C6) | modify | Its line said "only then propose acceptance"; I wrote "before you propose acceptance; all tests must pass" to make the gate explicit. |
| 8 | no rule about secrets | missing (C4) | approve | Nothing forbade keys or `.env`. |
| 9 | "Edit any file", "Add packages when a task needs them" | weak | reject (no change) | Not one of the six constraints; changing them would make the patch bigger. Kept as a known limitation. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..81ba2ba 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,33 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room only; never use real room names, timetables or KBTU portal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. A request that only touches a booking at an endpoint is not an overlap.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile. Never remove or weaken AC1–AC6 or their tests.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, authentication, a database or Supabase; keep booking data in memory.
+- Never add or commit secrets (API keys, tokens, passwords, `.env` values).
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never deploy anywhere (no Netlify, Vercel or other external hosts).
+- Run `npm test` and `npm run build` before you propose acceptance; all tests must pass, and report the output.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The real run, with the new test failing:

```text

 RUN  v3.2.4 /Users/nuralimuratov/Desktop/SE/se-practice-week10/week-10/app

 ❯ src/booking.test.ts (20 tests | 1 failed) 126ms
   ✓ T01 AC4 touching after 9ms
   ✓ T02 AC1 starts now 1ms
   ✓ T03 AC1 zero duration 0ms
   ✓ T04 AC1 reversed 1ms
   ✓ T05 AC1 past day end 1ms
   ✓ T06 AC2 120 minutes 2ms
   ✓ T07 AC2 121 minutes 1ms
   ✓ T08 AC4 touching before 0ms
   ✓ T09 AC4 partial overlap 2ms
   ✓ T10 AC4 contains booking 2ms
   ✓ T11 AC4 inside booking 0ms
   ✓ T12 AC4 identical interval 1ms
   ✓ T13 AC3 blocked room 0ms
   ✓ T14 AC4 empty schedule 0ms
   ✓ AC5 preserves existing bookings after an available check 5ms
   ✓ X1 AC1 allows an end at midnight 0ms
   ✓ X2 AC4 checks the second booking 1ms
   ✓ BUG-A AC4 touches both neighbors 0ms
   ✓ BUG-B AC5 preserves a free non-touching request 1ms
   × R2 AC1: the form times become minutes, and "Ends at 24:00" becomes 1440 65ms
     → toRequest is not a function

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > R2 AC1: the form times become minutes, and "Ends at 24:00" becomes 1440
TypeError: toRequest is not a function
 ❯ src/booking.test.ts:95:10
     93| 
     94| test('R2 AC1: the form times become minutes, and "Ends at 24:00" becom…
     95|   expect(toRequest({ start: '11:30', end: '12:15', now: '09:00', endOf…
       |          ^
     96|   expect(toRequest({ start: '23:00', end: '', now: '09:00', endOfDay: …
     97| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  16:51:04
   Duration  9.24s (transform 1.65s, setup 0ms, collect 1.88s, tests 126ms, environment 2ms, prepare 1.50s)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1280 px | 11:00–12:00 shows Available; 10:30–11:30 Unavailable; 12:00–11:00 shows the error (and also Unavailable, R3); nothing cut off | works, with R3 still open | `evidence/ui-desktop.png` |
| Mobile | 375 px | the same checks; fields stack in one column, no horizontal scroll (page width 375) | works, with R3 still open | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
- `npm run lint` — there is no lint script or linter (R5).
- Tests of `App.tsx` (rendering, stale result, error flow) — the project has no component test setup; only the manual UI check covers it.
- A real phone and browsers other than Chromium — I used the browser's 375 px emulation only.
- No CI run — the project has no CI.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** The form-to-minutes conversion and the 24:00 rule were inside the React event handler in `App.tsx`, so no test could reach them. I used no pattern, only an extracted pure function `toRequest` in `src/booking.ts`, and now the R2 test covers it while the page works the same.

**What I rejected from the agent's patch, and why:** Nothing inside the patch: it only touched `src/booking.ts` and `src/App.tsx` and kept `canBook` as it was. The agent listed three other changes (remove the unused `BookingRequest` type, fix the misleading comment, stop showing two messages) and did not put them in the patch; I left them out too, because they are outside this refactor (R3 stays open).

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/src/App.tsx b/week-10/app/src/App.tsx
index 21d2e47..2bd4cef 100644
--- a/week-10/app/src/App.tsx
+++ b/week-10/app/src/App.tsx
@@ -1,6 +1,6 @@
 import { useState, type FormEvent } from 'react';
 
-import { canBook } from './booking';
+import { canBook, toRequest } from './booking';
 
 type Interval = { start: number; end: number };
 type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };
@@ -10,10 +10,6 @@ const ROOMS: Room[] = [
   { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
 ];
 
-const toMinutes = (value: string) => {
-  const [h, m] = value.split(':').map(Number);
-  return h * 60 + m;
-};
 const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
 
 export default function App() {
@@ -39,9 +35,7 @@ export default function App() {
       setError('Fill in the current time, the start and the end.');
       return;
     }
-    const s = toMinutes(start);
-    const e = endOfDay ? 1440 : toMinutes(end);
-    const n = toMinutes(now);
+    const { start: s, end: e, now: n } = toRequest({ start, end, now, endOfDay });
     if (!(s < e)) {
       setError('The end time must be after the start time.');
     } else {
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index f26d179..634d4ab 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -23,3 +23,21 @@ export function canBook({ start, end, now, blocked, bookings }: {
   // keep the room's list current with the slot that was just found free
   return true;
 }
+
+/** Raw values from the availability form: "HH:MM" strings plus the "Ends at 24:00" box. */
+export type FormTimes = { start: string; end: string; now: string; endOfDay: boolean };
+
+/** Minutes since midnight for an "HH:MM" string. */
+function toMinutes(value: string): number {
+  const [h, m] = value.split(':').map(Number);
+  return h * 60 + m;
+}
+
+/** Pure conversion of the form times to minutes; "Ends at 24:00" becomes 1440. */
+export function toRequest({ start, end, now, endOfDay }: FormTimes): { start: number; end: number; now: number } {
+  return {
+    start: toMinutes(start),
+    end: endOfDay ? 1440 : toMinutes(end),
+    now: toMinutes(now),
+  };
+}
```

### 8.2 The second mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** The AC6 line with "TODO: copy the exact text" (I wrote the real AC6 text instead), and its wording "only then propose acceptance" (changed to "before you propose acceptance; all tests must pass"). Finding 9 ("Edit any file", "Add packages") stays unchanged. Details in §6.2.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..81ba2ba 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,33 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room only; never use real room names, timetables or KBTU portal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. A request that only touches a booking at an endpoint is not an overlap.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile. Never remove or weaken AC1–AC6 or their tests.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, authentication, a database or Supabase; keep booking data in memory.
+- Never add or commit secrets (API keys, tokens, passwords, `.env` values).
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never deploy anywhere (no Netlify, Vercel or other external hosts).
+- Run `npm test` and `npm run build` before you propose acceptance; all tests must pass, and report the output.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R2 | 2 | 3 | 6 | 1 | 3 | 3 | The R2 test now passes and fixes the conversion; a change to it now fails a test. Impact stays 3 because a wrong conversion is still serious. |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | The patched `AGENTS.md` forbids deploys, login, database and secrets, names `npm test` (it exists) and has the right AC4; C1–C6 pass. A human could still deploy by hand. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text

 RUN  v3.2.4 /Users/nuralimuratov/Desktop/SE/se-practice-week10/week-10/app

 ✓ src/booking.test.ts (20 tests) 32ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  16:54:48
   Duration  8.27s (transform 2.01s, setup 0ms, collect 688ms, tests 32ms, environment 1ms, prepare 3.95s)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | its own branch and git worktree from `week-10` (for example `agent/<task>`), never `main`; no access to my other folders |
| Permitted files | only `week-10/app/src/booking.ts`, `src/App.tsx`, `src/booking.test.ts`; not `AGENTS.md`, `package.json` or the lockfile without asking |
| Commands | `npm install` (from the lockfile), `npm test`, `npm run build`, `npm run dev` locally; nothing else |
| Prohibited actions | deploying (Netlify or anything), adding packages, login, database or Supabase, secrets or `.env`, real KBTU data, deleting or weakening tests, pushing to `main`, merging |
| Required evidence | the `git diff`, the full `npm test` output (all passing, same or more tests), the `npm run build` output, and a short note: which AC or risk ID it touches and what it did not check |
| Before merging or deploying | I read the diff and rerun `npm test` and `npm run build` myself, check the page at desktop and 375 px, then open a PR; merging is my decision; deploying is not allowed at all |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Release decision and conclusion

**Decision:** GO / CONDITIONAL / NO-GO

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
