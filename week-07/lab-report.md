# Week 07 — Lab report

**Name:** Muratov Nurali
**Group:** Monday 16–19
**Date:** 2026-11-06

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) |starter |
| Bolt project link (or `not shared`, and why) |not shared (the Week 06 export was incomplete) |
| Assistant that generated the tests (tool) |Codex |
| Exact model (with its version, or `not displayed`) |GPT-6 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) |My computer, Node 20.20.0 |
| Vitest version (the `RUN  v…` line of a run) |3.2.4 |
| Test command |npm test |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") |src/App.tsx, App.check |
| Its inputs |Candidate times, supplied clock, blocked flag and room.bookings |
| What it returned |Boolean stored in the local variable ok |
| How the page used it |The page called setResult(ok) to display Available or Unavailable. |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
The page still converts time strings to minutes and handles its validation message. The numeric checks moved into src/booking.ts, where canBook accepts the same five inputs. App.tsx imports that export and uses its Boolean directly. The strict endpoint comparisons, inclusive day limit and duration threshold follow the starter. A separate UI repair reads the time fields from the submitted form because U3 exposed a stale React value after clearing the visible input.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The occupied interval ends exactly at the requested start, so they share no minute. |
| T02 | 540–570 (starts now) | false | AC1 | Equality with the current time violates the strict future-start rule. |
| T03 | 720–720 (zero duration) | false | AC1 | The endpoints coincide, leaving zero minutes for the request. |
| T04 | 750–720 (reversed) | false | AC1 | The proposed end precedes the start by thirty minutes. |
| T05 | 1380–1441 (past day end) | false | AC1 | 1441 is one minute beyond the last allowed end. |
| T06 | 720–840 (120 minutes) | true | AC2 | The duration equals the inclusive two-hour limit and no booking intersects it. |
| T07 | 720–841 (121 minutes) | false | AC2 | One extra minute puts the request over the two-hour limit. |
| T08 | 570–600 (touching before) | true | AC4 | The candidate ends when the existing booking begins, leaving no shared minute. |
| T09 | 630–690 (partial overlap) | false | AC4 | The intervals both contain minutes 630 through 659. |
| T10 | 570–690 (contains booking) | false | AC4 | The requested interval includes the whole occupied hour. |
| T11 | 615–645 (inside booking) | false | AC4 | Every minute of the requested interval is already occupied. |
| T12 | 600–660 (identical interval) | false | AC4 | Identical positive-length intervals occupy the same minutes. |
| T13 | 660–720, blocked = true | false | AC3 | The blocked flag vetoes an otherwise free interval. |
| T14 | 630–690, bookings = [] | true | AC4 | Removing the only conflicting interval makes this future hour available. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | Checking an available slot must preserve each existing interval and its order. |
| X1 | 1380–1440 | true | AC1 | Midnight is a valid end, unlike 1441 in T05. |
| X2 | 720–780, bookings 600–660 and 700–760 | false | AC4 | Only the second reservation overlaps; inspecting just the first gives a wrong acceptance. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**Generation instructions applied by Codex in the existing assignment chat.** The supplied prompt was read from the README. The student did not send a separate fresh-chat message. Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The occupied interval ends exactly at the requested start, so they share no minute. |
| T02 | 540–570 (starts now) | false | AC1 | Equality with the current time violates the strict future-start rule. |
| T03 | 720–720 (zero duration) | false | AC1 | The endpoints coincide, leaving zero minutes for the request. |
| T04 | 750–720 (reversed) | false | AC1 | The proposed end precedes the start by thirty minutes. |
| T05 | 1380–1441 (past day end) | false | AC1 | 1441 is one minute beyond the last allowed end. |
| T06 | 720–840 (120 minutes) | true | AC2 | The duration equals the inclusive two-hour limit and no booking intersects it. |
| T07 | 720–841 (121 minutes) | false | AC2 | One extra minute puts the request over the two-hour limit. |
| T08 | 570–600 (touching before) | true | AC4 | The candidate ends when the existing booking begins, leaving no shared minute. |
| T09 | 630–690 (partial overlap) | false | AC4 | The intervals both contain minutes 630 through 659. |
| T10 | 570–690 (contains booking) | false | AC4 | The requested interval includes the whole occupied hour. |
| T11 | 615–645 (inside booking) | false | AC4 | Every minute of the requested interval is already occupied. |
| T12 | 600–660 (identical interval) | false | AC4 | Identical positive-length intervals occupy the same minutes. |
| T13 | 660–720, blocked = true | false | AC3 | The blocked flag vetoes an otherwise free interval. |
| T14 | 630–690, bookings = [] | true | AC4 | Removing the only conflicting interval makes this future hour available. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | Checking an available slot must preserve each existing interval and its order. |
| X1 | 1380–1440 | true | AC1 | Midnight is a valid end, unlike 1441 in T05. |
| X2 | 720–780, bookings 600–660 and 700–760 | false | AC4 | Only the second reservation overlaps; inspecting just the first gives a wrong acceptance. |

type BookingRequest = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: ReadonlyArray<{ start: number; end: number }>;
};

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  return !bookings.some(booking => start < booking.end && end > booking.start);
}

```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run npm test in app/.
AC1 covers T02–T05 and X1. AC2 covers T06–T07. AC3 covers T13. AC4 covers T01, T08–T12, T14 and X2. AC5 compares an available request’s bookings with a deep copy.
AC6 requires browser observations. The expected behavior for reversed existing bookings is unspecified.
```

The first suite was saved to `suites/first/` **before** any revision: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T06 and T07 | Reviewed the boundary expectations against the duration rule. | accept | AC2 permits 120 minutes and rejects 121. |
| 2 | AC5 preservation | A one-element list stays equal even after an in-place sort. | revise | Use two out-of-order intervals and compare the complete deep copy after acceptance. |
| 3 | X2 multiple bookings | A single-booking fixture cannot expose a premature return. | accept | Only the second booking conflicts under AC4. |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
> smart-campus-availability@0.0.0 test
> vitest run


 RUN  v3.2.4 /Users/nuralimuratov/Documents/Codex/2026-11-01/wor/work/w7/week-07/app

 ✓ src/booking.test.ts (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  20:09:49
   Duration  191ms (transform 23ms, setup 0ms, collect 19ms, tests 3ms, environment 0ms, prepare 38ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | 17 of 17 passed | Checked case inputs and expected values against the plan | No unit implementation fix | Strengthened the AC5 fixture after review. |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

> smart-campus-availability@0.0.0 test
> vitest run


 RUN  v3.2.4 /Users/nuralimuratov/Documents/Codex/2026-11-01/wor/work/w7/week-07/app

 ✓ src/booking.test.ts (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  20:09:49
   Duration  191ms (transform 23ms, setup 0ms, collect 19ms, tests 3ms, environment 0ms, prepare 38ms)

Codex review in this session: Keep each exact Boolean assertion. Add a later booking before the original interval in AC5 and retain the deep copy. This exposes a function that sorts caller data while still returning the correct availability. The initial run supplies no reason to change the booking rules. Exercise required-field feedback through the page separately.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
> smart-campus-availability@0.0.0 test
> vitest run


 RUN  v3.2.4 /Users/nuralimuratov/Documents/Codex/2026-11-01/wor/work/w7/week-07/app

 ✓ src/booking.test.ts (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  20:11:19
   Duration  218ms (transform 20ms, setup 0ms, collect 17ms, tests 3ms, environment 0ms, prepare 36ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | Assertion failed on the changed rule. |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | Assertion failed on the changed rule. |
| M3 | Remove the blocked-room rejection | Detected | T13 | Assertion failed on the changed rule. |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
> smart-campus-availability@0.0.0 test
> vitest run


 RUN  v3.2.4 /Users/nuralimuratov/Documents/Codex/2026-11-01/wor/work/w7/week-07/app

 ❯ src/booking.test.ts (17 tests | 1 failed) 6ms
   ✓ T01 AC4 touching after 1ms
   ✓ T02 AC1 starts now 0ms
   ✓ T03 AC1 zero duration 0ms
   ✓ T04 AC1 reversed 0ms
   ✓ T05 AC1 past day end 0ms
   × T06 AC2 120 minutes 3ms
     → expected false to be true // Object.is equality
   ✓ T07 AC2 121 minutes 0ms
   ✓ T08 AC4 touching before 0ms
   ✓ T09 AC4 partial overlap 0ms
   ✓ T10 AC4 contains booking 0ms
   ✓ T11 AC4 inside booking 0ms
   ✓ T12 AC4 identical interval 0ms
   ✓ T13 AC3 blocked room 0ms
   ✓ T14 AC4 empty schedule 0ms
   ✓ AC5 preserves existing bookings after an available check 0ms
   ✓ X1 AC1 allows an end at midnight 0ms
   ✓ X2 AC4 checks the second booking 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T06 AC2 120 minutes
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:29:38
     27| 
     28| test('T06 AC2 120 minutes', () => {
     29|   expect(canBook(request(720, 840))).toBe(true);
       |                                      ^
     30| });
     31| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
   Start at  20:11:16
   Duration  236ms (transform 21ms, setup 0ms, collect 17ms, tests 6ms, environment 0ms, prepare 37ms)

> smart-campus-availability@0.0.0 test
> vitest run


 RUN  v3.2.4 /Users/nuralimuratov/Documents/Codex/2026-11-01/wor/work/w7/week-07/app

 ❯ src/booking.test.ts (17 tests | 3 failed) 6ms
   × T01 AC4 touching after 4ms
     → expected false to be true // Object.is equality
   ✓ T02 AC1 starts now 0ms
   ✓ T03 AC1 zero duration 0ms
   ✓ T04 AC1 reversed 0ms
   ✓ T05 AC1 past day end 0ms
   ✓ T06 AC2 120 minutes 0ms
   ✓ T07 AC2 121 minutes 0ms
   × T08 AC4 touching before 0ms
     → expected false to be true // Object.is equality
   ✓ T09 AC4 partial overlap 0ms
   ✓ T10 AC4 contains booking 0ms
   ✓ T11 AC4 inside booking 0ms
   ✓ T12 AC4 identical interval 0ms
   ✓ T13 AC3 blocked room 0ms
   ✓ T14 AC4 empty schedule 0ms
   × AC5 preserves existing bookings after an available check 0ms
     → expected false to be true // Object.is equality
   ✓ X1 AC1 allows an end at midnight 0ms
   ✓ X2 AC4 checks the second booking 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01 AC4 touching after
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:9:38
      7| 
      8| test('T01 AC4 touching after', () => {
      9|   expect(canBook(request(660, 720))).toBe(true);
       |                                      ^
     10| });
     11| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/booking.test.ts > T08 AC4 touching before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:37:38
     35| 
     36| test('T08 AC4 touching before', () => {
     37|   expect(canBook(request(570, 600))).toBe(true);
       |                                      ^
     38| });
     39| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/booking.test.ts > AC5 preserves existing bookings after an available check
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:68:30
     66|   candidate.bookings.unshift({ start: 900, end: 960 });
     67|   const before = structuredClone(candidate.bookings);
     68|   expect(canBook(candidate)).toBe(true);
       |                              ^
     69|   expect(candidate.bookings).toEqual(before);
     70| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed | 14 passed (17)
   Start at  20:11:17
   Duration  231ms (transform 21ms, setup 0ms, collect 18ms, tests 6ms, environment 0ms, prepare 33ms)

> smart-campus-availability@0.0.0 test
> vitest run


 RUN  v3.2.4 /Users/nuralimuratov/Documents/Codex/2026-11-01/wor/work/w7/week-07/app

 ❯ src/booking.test.ts (17 tests | 1 failed) 5ms
   ✓ T01 AC4 touching after 1ms
   ✓ T02 AC1 starts now 0ms
   ✓ T03 AC1 zero duration 0ms
   ✓ T04 AC1 reversed 0ms
   ✓ T05 AC1 past day end 0ms
   ✓ T06 AC2 120 minutes 0ms
   ✓ T07 AC2 121 minutes 0ms
   ✓ T08 AC4 touching before 0ms
   ✓ T09 AC4 partial overlap 0ms
   ✓ T10 AC4 contains booking 0ms
   ✓ T11 AC4 inside booking 0ms
   ✓ T12 AC4 identical interval 0ms
   × T13 AC3 blocked room 3ms
     → expected true to be false // Object.is equality
   ✓ T14 AC4 empty schedule 0ms
   ✓ AC5 preserves existing bookings after an available check 0ms
   ✓ X1 AC1 allows an end at midnight 0ms
   ✓ X2 AC4 checks the second booking 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T13 AC3 blocked room
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:57:60
     55| 
     56| test('T13 AC3 blocked room', () => {
     57|   expect(canBook({ ...request(660, 720), blocked: true })).toBe(false);
       |                                                            ^
     58| });
     59| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
   Start at  20:11:18
   Duration  240ms (transform 22ms, setup 0ms, collect 19ms, tests 5ms, environment 0ms, prepare 37ms)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Available appeared for A-101 and the list showed 10:00–11:00. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | Unavailable replaced Available after enabling Room blocked. | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Clearing Start and submitting showed “Fill in the current time, the start and the end.” The earlier decision disappeared. | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | In a 375 × 812 CSS-pixel iframe the Check button was usable and the result displayed Available. Screenshot captures the frame directly. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | In the production build, two checks of 11:00–24:00 both showed Unavailable. The same single 10:00–11:00 booking appeared before, between and after the checks. | Pass |

---

## 9. Comparison and what still fails

AI-assisted analysis of recorded runs. Independent student review is pending.

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All automated checks passed. The personal authorship limitations are disclosed separately. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 17 / 17 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 on the planned inputs. AC5 has only one reservation. | AC1–AC5 plus order preservation. AC6 was exercised separately in U3 and U4. |
| Selected mutants detected | Additional sorting trial survived. M1–M3 were run on the final suite only. | M1, M2 and M3 detected. The additional sorting trial now fails AC5. |
| Accepted / revised / rejected tests | 16 tests retained. AC5 selected for revision. | 16 retained, one fixture strengthened, zero expectations reversed. |
| Remaining limitations | Sorting a single interval was invisible. | Coverage of malformed stored intervals remains unspecified. Browser behavior requires separate checks. |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

The direct call returned true. The request starts at 660, so the first overlap comparison, 660 < 650, is false. AC1 bounds apply to the candidate. The specification leaves malformed stored intervals open. A production data model would benefit from validating them at ingestion. This is an observed result for this input.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

**AI-assisted draft for student review.** The first AC5 test accepted a free slot and compared the schedule with a deep copy. That looked sufficient until the sorting experiment. Sorting one interval cannot change its order, so the faulty implementation passed all seventeen tests. Giving AC5 two intervals in reverse order exposed the mutation without changing the expected decision. The boundary pair at 120 and 121 minutes served a different purpose. When the maximum became exclusive, T06 failed while T07 still rejected the longer interval. Restoring the original comparison returned the suite to green. The UI checks also exposed a gap that a Boolean assertion cannot cover. Clearing the start field could leave the previous result visible until the form read its submitted values. One open question is how to handle corrupted schedule entries. The observed answer for a reversed reservation describes current behavior, while the course criteria leave the policy undecided.
