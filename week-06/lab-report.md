# Week 06 — Lab report

**Name:** Nurali Muratov
**Group:** Monday 4-7 pm
**Date:** 18.10.2026

Disclosure: this report, final recovery implementation, and verification were prepared with Codex assistance at the student's request. Sections 8 and 10 are AI-assisted drafts, not independently written student reflections. Original files remain unchanged. The builder workflow is incomplete and is not represented as fully compliant.

## 1. Setup

| Item | Value |
| --- | --- |
| Tool | Lovable (student-reported); supplied export identifies Atoms; Codex used for final recovery |
| Exact model | not displayed; Alex was recorded as an agent name, not a verified model version |
| Project link | https://atoms.dev/share/3f8be12cffe7450f8462dbf15dc82985 |
| Browser | Safari for student captures, version not recorded; browser verification attempted but blocked by environment |
| Fallback reason | Student reported Bolt errors and inability to obtain files; initial Bolt response said the prompt arrived empty. |

## 2. Task 1 — define before generating

| # | What I expect to go wrong | AC it concerns | Was I right? |
| --- | --- | --- | --- |
| 1 | Touching endpoints might be rejected. | AC4 | Not supported by source: original/availability.ts uses strict comparisons correctly. Required v1 fixture is absent. |
| 2 | Reversed times may lack useful feedback. | AC1, AC6 | Original source includes Start must be before end. Complete original UI source is missing, so rendering was not independently verified. |

Initial prompt recorded by the student:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

## 3. Task 2 — prototype v1

The original folder and v1 screenshot were already committed before this recovery. The export is incomplete: index.html references src/main.tsx, which is absent. The builder's verbatim file-list response was not supplied. The following is a filesystem inventory, not a fabricated builder response:

```text
original/index.html
original/package.json
original/availability.ts
```

- The v1 screenshot shows a room selector and supplied current-time input in minutes, initially 480 (08:00).
- original/availability.ts implements strict overlap comparisons and duration validation.
- Aurora has bookings 09:00–10:00 and 12:00–13:30; Birch has 10:00–11:30. No supplied room has the required sole booking 10:00–11:00.
- No original files were modified. A complete original source download remains missing.

Repair prompt: no builder repair transcript was supplied.

## 4. Task 3 — the nine cases

Base: supplied current time 09:00, A101 unblocked except T3, sole booking 10:00–11:00. Original results are Not testable under this exact fixture: the provided data contains no matching room and the local export lacks its UI entry point. Earlier student captures are preserved in evidence/prior-captures; they are not claimed as final evidence. Final browser cases are Not testable in this execution environment: browser launch was denied and file URL access was blocked. Separate Node function tests passed T1–T8 and the end-of-day boundary; evidence/logic-tests.txt contains actual results. T9 layout remains unverified.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Not testable | Not testable | missing (browser blocked) |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Not testable | Not testable | missing (browser blocked) |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Not testable | Not testable | missing (browser blocked) |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Not testable | Not testable | missing (browser blocked) |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Not testable | Not testable | missing (browser blocked) |
| T6 | Starts now | 09:00–09:30, now 09:00 | Unavailable | AC1 | Not testable | Not testable | missing (browser blocked) |
| T7 | Reversed times | 12:00–11:00, explanation required | Unavailable | AC1, AC6 | Not testable | Not testable | missing (browser blocked) |
| T8 | Same check twice | 11:00–12:00 twice without reload | Available | AC5 | Not testable | Not testable | missing (browser blocked) |
| T9 | Narrow screen | 11:00–12:00 at 375 px | Available | AC6 | Not testable | Not testable | missing (browser blocked) |

## 5. Issue log — cleanup targets

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Required test fixture absent | Select Aurora and inspect bookings, then inspect ROOMS in original/availability.ts → required sole booking 10:00–11:00 → Aurora has two other bookings and no other room matches; T1–T9 cannot use the required base. issue-1.png shows Aurora's data. | High | Fix |
| 2 | Time entry requires mental conversion | Inspect v1 Current time / Start / End → understandable entry for AC6 → numeric values 480, 610, 700 require minutes conversion, although helper labels reduce the problem. Usability cleanup, not a demonstrated AC6 failure. issue-2.png shows these fields. | Medium | Fix |

Both issue images are unedited copies of the same existing v1 capture, showing two different observations. They are not new historical screenshots.

## 6. Task 4 — cleanup with focused prompts

The required one-issue-per-prompt builder workflow was not completed. No Lovable cleanup answers are available. Actual final user request to Codex:

```text
просто сделай все за меня lab-report , submission.yml, AI disclosure  и prototype у меня дедлайн через 10 мин и заверши мне эту лабку и коммиты и запушить в гит
```

Codex implemented a standalone recovery page and ran isolated function checks; browser checks were blocked. This was one broad request, not the prescribed two focused prompts; L6 is retained as a known failure. No builder answer is invented.

| # | What changed or was considered | accept / reject | Reason — cite AC or scope | Retest |
| --- | --- | --- | --- | --- |
| 1 | Fixed fixture and explicit blocked toggle | accept | Makes AC1–AC4 test cases reproducible | T1–T8 function tests pass; T9 browser test blocked |
| 2 | HH:MM entry and readable validation feedback | accept | Supports AC6 and explicit 24:00 under AC1 | T7 and 23:00–24:00 function tests pass; T9 unverified |
| 3 | Saving reservations, accounts or remote services | reject | Scope excludes these; AC5 requires unchanged booking data. This is a design decision, not a claimed builder suggestion. | T8 repeated function call, source inspection |

## 7. Change log — v1 to final

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Required fixture absent | Accept | Codex edit: prototype/index.html defines sole booking 600–660 and a blocked checkbox | T1–T6 logic matches expected; browser evidence missing |
| 2 | Minute conversion burden | Accept | Codex edit: prototype/index.html accepts HH:MM, including 24:00, and provides clear feedback | T7 and end-of-day function tests pass |
| 3 | Incomplete original UI export | Accept recovery with disclosure | Codex edit: standalone prototype/index.html replaces missing UI dependencies; original stays untouched | T1–T8 function tests pass; browser and T9 layout checks blocked |

## 8. One generated component, in my own words

**File:** `index.html`

AI-assisted explanation; student independent understanding has not been verified. This final file was produced by Codex, not exported from Lovable. Its parseTime function converts an HH:MM string to minutes and permits 24:00 only as the midnight boundary. The form reads the supplied current time, start, end, and blocked state. The decision function rejects malformed times, reversed intervals, starts at or before now, durations above 120 minutes, blocked rooms, and overlapping bookings. Strict overlap comparisons allow touching endpoints. It reads a frozen bookings array without modifying it. The result area presents both a decision and a reason, while responsive CSS stacks inputs on a narrow screen.

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| E3 | Final browser captures unavailable: browser execution blocked. Prior captures retained separately. |
| E4 | No verified phone-width browser capture. |
| T1 | Final browser interaction not run; isolated logic test passes. |
| T2 | Final browser interaction not run; isolated logic test passes. |
| T3 | Final browser interaction not run; isolated logic test passes. |
| T4 | Final browser interaction not run; isolated logic test passes. |
| T5 | Final browser interaction not run; isolated logic test passes. |
| T6 | Final browser interaction not run; isolated logic test passes. |
| T7 | Final browser feedback rendering not verified; function returns a clear reason. |
| T8 | Repeated function calls pass without mutation; browser interaction unverified. |
| T9 | Mobile usability cannot be confirmed without browser execution. |
| L6 | Required two focused builder prompts and answers are unavailable; actual broad request is disclosed. |

Additional limitations not detected by the checker: original export is incomplete; builder tool metadata conflicts with the shared Atoms URL; the builder's original response is unavailable; sections 8 and 10 were drafted with AI rather than independently; final implementation is a Codex recovery rather than a builder cleanup export. No claim is made that the workflow earns full marks.

### 9.2 The end of the day

The end-time field accepts typed 24:00 and converts it to 1440, not zero. With now 09:00, an unblocked room and the sole booking 10:00–11:00, 23:00–24:00 is Available. This was checked by executing the actual JavaScript function in Node. Declare typed-24:00.

### 9.3 Which "now"?

The v1 screenshot shows an editable Current time field initially 480, with the helper label 08:00. Its source accepts now as a function argument. For T6 it should be set to 540. However, the required room fixture is absent, so exact prescribed v1 cases are recorded Not testable. Final verification explicitly supplies 09:00 and rejects a 09:00 start.

## 10. Conclusion (120–180 words)

AI-assisted draft; the student must review and be able to explain it.

The two initial predictions concerned touching endpoints and unclear reversed-time feedback. Source inspection did not confirm either defect: the original function uses strict overlap comparisons and includes a message explaining that start must precede end. The more concrete problem was the sample data. None of the supplied rooms had exactly the required 10:00–11:00 booking, so the prescribed baseline could not be reproduced. The local export also lacked the UI entry point referenced by its HTML. Under the deadline, Codex created a standalone recovery implementation and verified eight cases through isolated function tests. Browser verification was blocked, so layout and screenshots remain incomplete. This differs from the required focused builder cleanup workflow and is disclosed. Saving checked intervals would have been wrong because AC5 requires unchanged booking data. T8 demonstrates the distinction between appearance and correctness: the same interval remains Available after two checks, and existing bookings stay unchanged. A finished-looking interface alone cannot demonstrate those properties; repeatable checks and accurate evidence are necessary.
