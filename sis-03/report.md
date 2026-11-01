# SIS #03 — Report: Smart Campus Room Availability Checker

This report was prepared with Codex assistance. Technical results below are observed runs; student understanding and personal authorship are not assumed. The original baseline was AI-assisted and created after discussion, and the reflection is explicitly an AI draft. These limitations are not cured by a mechanically passing checker.

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Codex |
| Coding assistant model | GPT-6 |
| Bolt.new model | not displayed |
| Bolt project link | not-shared |
| Language | Python 3.9, standard library |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

Python original and final were recovered from local Git ref `origin/week-05`. The original is unchanged; the final implementation is identical because no contract defect was found. The suite adds an explicit repeated-call test to the 33 inherited tests.

Web provenance is incomplete: Week 06 identifies Lovable, while export metadata identifies Atoms. Its three original files and original screenshot are preserved without alteration. This is not a Bolt export. The Week 06 Codex recovery page was the starting point for the local final, improved in this SIS. A new Bolt prompt was entered and Send attempted on 2026-11-01, but the available session displayed Create account instead of generating a project. No successful Bolt generation is claimed.

Student details were taken from the existing Week 05 declaration: Muratov Nurali, 24B031887, GitHub safarinn. Group wording is the saved timetable label, Monday 16-19:00; a separate official group code was not supplied.

## 2. Baseline — before any new AI exchange

**Authorship and timing disclosure:** This section is an AI-assisted draft prepared by Codex on 2026-11-01 after AI discussion of this assignment. It is not an independent student baseline written before AI use. The student must review and rewrite it in their own words; doing so does not change the original chronology.

### 2.1 Scope in my own words

**Scope:** Build a Python function and a responsive page that check whether a requested time interval is available for one selected campus room using fictional data. The page reports availability only and does not create reservations. Login, databases, backend services, external APIs and payments are outside the scope.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Use integer minutes within one day. Start must be earlier than end and strictly later than the supplied current time; an end of 1440 is allowed. |
| AC2 | Allow intervals lasting at most 120 minutes, including exactly 120 minutes. |
| AC3 | A blocked room must always produce an unavailable result. |
| AC4 | Reject any intersection with any existing booking, but allow one interval to start exactly when another ends. |
| AC5 | Show a clear Available or Unavailable decision and leave the existing booking data unchanged, including on repeated checks. |
| AC6 | Explain invalid input clearly and keep the form and result usable on a narrow phone screen. |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Treating touching endpoints as an overlap | AC4 | Run T1: with existing 600–660, request 660–720; expect Available. |
| 2 | Accepting a request that starts exactly now | AC1 | Run T6: now 540, request 540–570; expect Unavailable. |
| 3 | Checking only the first existing booking | AC4 | Run T10 with bookings 600–660 and 700–760; request 720–780 must be Unavailable. |
| 4 | Adding a reservation when checking availability | AC5 | Run T11 twice and compare existing data before and after; both results must be Available and the data unchanged. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Requested start, measured in minutes after midnight | Integer; a valid request requires 0 <= start < end and start > now. |
| `end` | Requested end, measured in minutes after midnight | Integer; a valid request requires start < end <= 1440 and end - start <= 120. |
| `now` | Supplied current time used for the future-start check | Integer from 0 through 1439; assumed valid by the assignment. |
| `blocked` | Whether the selected room is unavailable regardless of time | Boolean, True or False. |
| `existing` | Already scheduled intervals for the selected room | Collection of integer (start, end) pairs representing valid same-day intervals; may be empty and must not be modified. |
| returns | Whether all availability rules permit the requested interval | Boolean True only when AC1–AC4 hold; otherwise False. No booking is created. |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. Inputs follow the stated contract: times are integer minutes, now is valid, and existing bookings are valid same-day intervals. String parsing belongs to the page rather than the Python function.
2. All intervals use the same day and time reference. Their start is included and their end is excluded, so touching intervals are allowed.
3. Unless a test says otherwise, now is 540, blocked is False, and existing contains only (600, 660). The supplied clock is used instead of the computer's actual clock.

**Checked manually:**

- AI reasoning check only, not a student execution result: 660–720 and 600–660 share a boundary without intersecting, so T1 should be Available.
- AI arithmetic check only: 840 - 720 = 120, while 841 - 720 = 121; T4 should be Available and T5 Unavailable.
- Student manual checks and browser observations are still pending. No execution results for the reused artifacts are claimed by this draft.

## 3. Python v1 review

This is an AI-assisted review, independently checked by executing the supplied behavioral checker and the test suite; it is not claimed as unaided student analysis.

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440):` | AC1 | Yes | Rejects reversed/equal endpoints and out-of-day bounds. T7–T9 confirm the important boundaries. |
| `if start <= now:` | AC1 | Yes | Equality must fail: T6 returns False. A start one minute after now passes the suite. |
| `if end - start > 120:` | AC2 | Yes | Strict greater-than allows T4 and rejects T5. |
| `if blocked:` | AC3 | Yes | T3 returns False regardless of an otherwise available interval. |
| `if start < booked_end and end > booked_start:` | AC4 | Yes | Both strict comparisons are necessary for overlap; equality at either endpoint is permitted. T1 and both-side touching tests pass. |
| `for booked_start, booked_end in existing:` | AC4, AC5 | Yes | Every interval is inspected, including the second booking in T10. No assignment, append or sort mutates the supplied collection. |
| `return True` | AC5 | Yes | Reached only after every rejection rule and existing interval have been checked; T11 verifies stable repeated acceptance. |

Non-integer arguments are outside the inherited Python contract. Its two diagnostic tests document a float being accepted and a string raising TypeError; these are not counted as acceptance-criterion guarantees. The final page parses strings and validates integer minute values before deciding.

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

This exact text is reused from the Week 06 report. It was reported there as sent to Lovable, not successfully to Bolt. The section heading is retained to match the template, not to claim Bolt provenance. A fresh, more specific Bolt attempt in this SIS was blocked at the account dialog; it did not replace the original files.

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Availability rules and sample rooms | availability.ts | Exports the strict overlap check and fictional room data. |
| Original HTML entry shell | index.html | References `/src/main.tsx`, which is absent from the supplied export. |
| Original project manifest | package.json | Describes Vite/React dependencies; the rest of that project is missing. |

**What v1 does:**

- Source contains duration, future-start, blocked-room and overlap checks, with explanatory reasons.
- Sample rooms do not supply the exact required base fixture of one booking 600–660.
- The local original page renders an empty body because its entry point is missing; no T1–T12 page result can be observed from this export. Each is recorded Not testable.
- `evidence/web-v1.png` is the unchanged historical Week 06 screenshot, not a screenshot of the currently runnable local original.

## 5. Test cases — executed on both artifacts

Base: now = 540, blocked = False, existing = [(600, 660)]. Python columns are actual calls made by the SIS checker. Final page columns are actual browser interactions, recorded in `evidence/browser-cases.json`. Original page interactions cannot be performed because its UI is missing; Not testable records this observed blocker, not a hypothetical result. T12 was checked in a real 375px-wide iframe because the browser viewport override did not take effect; the capture is a direct screenshot of that frame, not a resized image.

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Not testable | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Not testable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Not testable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Not testable | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Not testable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Not testable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Not testable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not testable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Not testable | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Not testable | Available |

For T10 select Two existing bookings. For T11 both clicks returned Available and the visible schedule remained unchanged; the Python test also compares the collection before and after. T8/T9 use text entry: 24:00 is accepted, 24:01 rejected with feedback.

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | code/booking.py bounds/future guards; web/final/availability.js parseTime and guards | T6–T9 | False, False, True, False; matching page decisions | Python matches; page Not testable | Python and page match all four |
| AC2 | code/booking.py duration guard; web/final/availability.js duration guard | T4, T5 | True, False / Available, Unavailable | Python matches; page Not testable | Python and page match |
| AC3 | code/booking.py blocked guard; web/final/availability.js blocked guard | T3 | False / Unavailable | Python False; page Not testable | Python False; page Unavailable |
| AC4 | code/booking.py interval loop; web/final/availability.js existing.some | T1, T2, T10 | True, False, False | Python matches; page Not testable | Python and page match |
| AC5 | No mutation in can_book; frozen sample schedules and submit handler in availability.js | T11; test_same_check_twice_is_stable | Same Available result twice, data unchanged | Python True on second call; page Not testable | Python True; page Available twice; schedule unchanged |
| AC6 | web/final/index.html labelled fields/status; styles.css narrow layout; availability.js feedback/reset | T7, T9, T12; edit after T1 | Clear validation; usable 375px layout; no stale result | Original UI missing, Not testable | Feedback visible; mobile T1 Available; editing resets status |

## 7. Issue log

The v1 findings below distinguish the incomplete generated Week 06 original from the separate Week 06 recovery page used as the final's starting point. No Python defect was invented: its original passes all contract checks.

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | Missing UI entry point in generated original | AC6 / T1: open web/original/index.html; it references absent src/main.tsx and displays no form | High | Keep original unedited; use a self-contained local recovery only in web/final and disclose that it is not a Bolt export. This change was made by Codex under the broad user request, not a separate builder cleanup prompt. | Final T1 Available; original remains Not testable. |
| 2 | Required second-booking fixture unavailable in recovery page | T10: Week 06 recovery page has only fixed 600–660 and no schedule control | High | Codex operational repair: add two immutable fictional schedules and a selector, keeping A101 and availability-only scope. No separate user prompt is claimed. | Two-booking schedule lists 600–660 and 700–760; 720–780 returns Unavailable in browser. |
| 3 | Stale Available result after changing inputs in recovery page | AC5, AC6: run T1, edit start to 09:00 without submitting; old Available remains visible | Medium | Codex operational repair: reset result to Ready to check on input and schedule changes; show the exact checked interval after submission. No separate user prompt is claimed. | Editing a field resets the result; rerunning T6 displays Unavailable. |
| 4 | No dedicated repeated-call test in inherited Python suite | AC5 / T11: inspect 33-test suite; unchanged-input tests exist but no explicit second identical call | Low | Add test_same_check_twice_is_stable with expected True for both calls and an unchanged-list assertion. Preventive coverage, not a defect in can_book. | All 34 tests pass; all ten supplied mutation checks are caught. |

**Before / after:** `evidence/before-1.jpg` → `evidence/after-1.jpg` show issue 2: the inherited recovery page has only one fixed booking; the final page supports the two-booking fixture and rejects the overlapping request. These captures compare the recovery starting point to the SIS final, not the incomplete generated original. Additional before-stale.jpg and after-stale.jpg show issue 3.

## 8. Critique decisions

AI-assisted decisions, with verification by tools in this SIS. Student independent approval remains pending. The original broad user instruction authorized the work; the focused operational changes below were chosen by Codex, not invented student messages.

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | Keep Python unchanged because its contract checks pass | Ran F1–F10 and all 34 tests; inspected strict overlap comparisons | accept | AC1–AC5 and T1–T11 pass; changing working logic has no demonstrated benefit. |
| 2 | Replace the incomplete web export with a working local implementation | Opened original page and inspected missing entry point; checked original bytes against Week 06 | modify | Replacement is limited to web/final; web/original stays unchanged. Availability is restored without falsely claiming a complete Bolt v1. |
| 3 | Add a second-booking schedule so T10 can be reproduced through UI | Selected Two existing bookings, entered 12:00–13:00, clicked Check | accept | AC4 requires checking every interval; browser returned Unavailable and visible bookings did not change. |
| 4 | Clear old results after input edits | Observed Available remain after changing start to 09:00 in the recovery; repeated after repair | accept | AC5/AC6: final says Ready to check after edits rather than presenting an old decision for new inputs. |
| 5 | Add a repeated-call Python regression test | Executed the new test and the mutation checker | accept | AC5/T11: both calls True, input unchanged. No invented functional defect. |

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Continue README tasks and maximize submission quality using the saved practice work. |
| Model / plan | Recover Python from origin/week-05, preserve originals, execute checks, repair concrete web gaps and document limitations. |
| Tool call | Read Git objects; ran Python checker/unittest; used browser locators to change fields, click Check and read rendered results. |
| Observation | Python passed; original web shell was empty; recovery page lacked the second schedule and retained stale Available after editing. |
| Next step | Added an immutable second fixture, reset-on-edit behavior, accessible layout and the repeated-call regression test. |
| Human review | User authorized continuation and reported entering Bolt; independent code explanation, personal reflection and final review are still pending. |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Codex file and Git tools | README, report template, Python source, saved Week 05 Git objects | Read files and Git history; write inside the separate SIS worktree | Observed |
| Codex browser tools | Rendered local page, labels, controls and status text | Local HTTP server and browser interaction; saved direct screenshots | Observed |
| Bolt browser session | Detailed AC1–AC6 prompt entered on its visible landing page | Send attempt displayed an account dialog; no generated files observed | Observed |
| Model internal reasoning | Relevant source excerpts and prior dialogue likely influenced proposed fixes | Internal weighting of context is not exposed through the tool output | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before saving changes, compare the target path and Git branch with the intended SIS worktree, preserve original files byte-for-byte, inspect the diff for unrelated features, and run the stated boundary cases before accepting the final version. Publishing or submission must use the actual reviewed artifacts.

**Reliability, security, responsibility:** Reliability is supported by executed boundary tests and mutation checks, not by a plausible explanation. Mobile availability depends on a working entry point and usable controls, so the original empty shell remains a genuine limitation. The final reads only fictional local schedules and has no network, persistence or account feature. Tool permissions were limited to the worktree, Git metadata and local server needs. The student remains responsible for checking the evidence, understanding the overlap rule and declaring AI assistance accurately.

## 10. Reflection

**AI-assisted draft, not an independent student reflection. Student rewrite is required by the assignment.**

The Python function was small enough to review condition by condition, while the web prototype required checking both behavior and interaction. The inherited Python implementation already passed the contract tests, so adding a repeated-call test was more useful than rewriting it. The web work exposed a different problem: a plausible screenshot did not mean the downloaded project was complete. Its missing entry point made the original unusable locally. This is an availability risk. Incorrect endpoint comparisons would be a reliability risk, and unnecessary remote services could expose information or expand permissions. The final uses fictional local data and preserves bookings. I modified the replacement recommendation by keeping the original export untouched and placing recovery work only in the final folder. Human review is still needed because passing checks cannot establish authorship, understanding or the truth of a claimed transcript. Next, I would obtain a complete Bolt export and verify the same cases there without adding reservations or accounts.

## 11. Appendix A — AI exchanges

Evidence provenance: the Week 05 report explicitly states that its fixed prompts were applied by the assistant, not sent separately by the student. B1 preserves its stored plan. B2 preserves the first code artifact but the complete original answer is unavailable; it is not reconstructed. B3 and B4 are real messages from this SIS chat, not fabricated focused prompts. Consequently this appendix does not claim four complete prescribed-stage exchanges.

### B1

- **Tool:** ChatGPT (Codex Work Mode)
- **Model:** GPT-6
- **Date:** 2026-10-11
- **Stage:** Plan
- **Source:** week-05

**Prompt:**

~~~~text
Propose a short implementation plan for can_book. List the checks in order and identify assumptions. Use Python 3 and the supplied rules. Do not write code yet. Suggest boundary cases that could expose an incorrect implementation.
~~~~

**Response:**

~~~~text
1. Check 0 <= start < end <= 1440 (AC1). Return False if it fails.
2. Check start > now (AC1). Return False if it fails.
3. Reject end - start > 120 (AC2); exactly 120 is allowed.
4. Reject blocked rooms (AC3).
5. For every (booked_start, booked_end) in existing, reject when
   start < booked_end and end > booked_start (AC4).
6. Return True only after all checks pass (AC5). Read existing only;
   do not sort, append, remove, save, or send a confirmation.
Assumptions: now, blocked and existing meet the supplied contract.
Times are integers on one date. Behavior for other types is unspecified;
no extra type validation is part of this plan.
Boundary cases: equal/reversed endpoints; end 1440 and 1441; start now
and now + 1; durations 120 and 121; touching on both sides; contained,
containing and identical intervals; empty and unsorted multiple bookings;
input unchanged on accepted and rejected calls; Boolean result type.
~~~~

### B2

- **Tool:** ChatGPT (Codex Work Mode)
- **Model:** GPT-6
- **Date:** 2026-10-11
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
Implement can_book in booking.py using the supplied contract and AC1-AC5. Keep the signature. Use only the standard library. Do not modify existing. Return the function and explain each condition. Keep the feature within the stated scope.
~~~~

**Response:**

~~~~text
def can_book(start, end, now, blocked, existing):
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for booked_start, booked_end in existing:
        if start < booked_end and end > booked_start:
            return False
    return True
~~~~

Only the preserved code is available for B2; the original explanatory response is missing. This block is an artifact excerpt, not a complete conversation transcript. Passing a similarity check does not resolve this evidence gap.

### B3

- **Tool:** Codex
- **Model:** GPT-6
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
посмотри в папке se там есть week5,6
~~~~

**Response:**

~~~~text
Нашёл репозиторий в `Desktop/SE/se-practice`. **С нуля начинать не нужно.**

- **Week 05:** работа сохранилась в Git-ветке `origin/week-05`: исходная и финальная функции, **33 теста**, отчёт и материалы AI. Сейчас открыта ветка `week-06`, поэтому файлы Week 05 не видны в рабочей папке. Их можно извлечь без переключения ветки.
- **Week 06:** есть страница, исходные файлы и скриншоты. Но исходный экспорт неполный, а в отчёте указан **Lovable/Atoms вместо Bolt.new**. Финальную страницу создавал Codex. Поэтому эту работу нельзя просто объявить готовым Bolt-проектом для SIS.
- Папка **`sis-03` уже есть** внутри репозитория.

**Сейчас начни с раздела 2 в `sis-03/report.md`: напиши своими словами понимание задачи, правил и проверок.** Python затем возьмём из Week 05; основная оставшаяся работа — страница в Bolt, её проверка и новый отчёт.

Файлы и ветки я не менял.
~~~~

This is a real preliminary artifact critique, not a complete independent AC1–AC6 review. The current detailed review and decisions appear in section 8.

### B4

- **Tool:** Codex
- **Model:** GPT-6
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
следующие пункты по readme выполни и сделай максимально на высокую оценку и сделай на максимум
~~~~

**Response:**

~~~~text
Критический обзор: Python менять не нужно — тесты подтверждают правила AC1–AC5; усиление касается отдельного теста T11. Для неполного веб-экспорта предлагаю рабочую локальную замену, но только в `web/final/`: исходные файлы должны остаться неизменными, а происхождение замены — явным. В интерфейсе нужны два исправления: выбор расписания со вторым бронированием для T10 и сброс результата при изменении полей. Снимок старого проекта не доказывает, что текущая локальная копия работает; её пустой экран нужно указать как ограничение.
~~~~

B4 records an actual progress message in the ongoing repair turn, not its complete response. The broad request was not a targeted student cleanup prompt. Exact focused operational choices and verified outcomes are disclosed in section 7; complete stage-separated student exchanges remain missing.

## 12. Appendix B — Test output

### 12.1 Your suite

Command: `python3 -m unittest -v` from `code/`. Complete actual output:

~~~~text
test_121_minutes_is_rejected (test_booking.BookingTests)
AC2: expected False from the specification. ... ok
test_accepted_input_is_unchanged (test_booking.BookingTests)
AC5: expected True from the specification. ... ok
test_blocked_empty_room_is_rejected (test_booking.BookingTests)
AC3: expected False from the specification. ... ok
test_blocked_room_is_rejected (test_booking.BookingTests)
AC3: expected False from the specification. ... ok
test_contains_existing_is_rejected (test_booking.BookingTests)
AC4: expected False from the specification. ... ok
test_empty_bookings_is_allowed (test_booking.BookingTests)
AC4: expected True from the specification. ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests)
AC1: expected False from the specification. ... ok
test_end_at_1440_is_allowed (test_booking.BookingTests)
AC1: expected True from the specification. ... ok
test_exactly_120_minutes_is_allowed (test_booking.BookingTests)
AC2: expected True from the specification. ... ok
test_exactly_120_minutes_to_midnight_is_allowed (test_booking.BookingTests)
AC1, AC2: both inclusive upper bounds are allowed together. ... ok
test_float_time_outside_contract_observed_behavior (test_booking.BookingTests)
Outside contract: no type guard, so a valid numeric float is accepted. ... ok
test_free_slot_among_several_is_allowed (test_booking.BookingTests)
AC4: expected True from the specification. ... ok
test_identical_interval_is_rejected (test_booking.BookingTests)
AC4: expected False from the specification. ... ok
test_inside_existing_is_rejected (test_booking.BookingTests)
AC4: expected False from the specification. ... ok
test_last_minute_of_day_is_allowed (test_booking.BookingTests)
AC1: expected True from the specification. ... ok
test_negative_start_is_rejected (test_booking.BookingTests)
AC1: expected False from the specification. ... ok
test_one_minute_after_midnight_is_allowed (test_booking.BookingTests)
AC1: expected True from the specification. ... ok
test_one_minute_duration_is_allowed (test_booking.BookingTests)
AC2: expected True from the specification. ... ok
test_overlap_in_unsorted_bookings_is_rejected (test_booking.BookingTests)
AC4: expected False from the specification. ... ok
test_overlap_with_second_booking_is_rejected (test_booking.BookingTests)
AC4: expected False from the specification. ... ok
test_partial_overlap_after_is_rejected (test_booking.BookingTests)
AC4: expected False from the specification. ... ok
test_partial_overlap_before_is_rejected (test_booking.BookingTests)
AC4: expected False from the specification. ... ok
test_rejected_input_is_unchanged (test_booking.BookingTests)
AC5: expected False from the specification. ... ok
test_reversed_times_are_rejected (test_booking.BookingTests)
AC1: expected False from the specification. ... ok
test_same_check_twice_is_stable (test_booking.BookingTests)
AC5 / T11: checking availability must not create a booking. ... ok
test_start_at_midnight_now_is_rejected (test_booking.BookingTests)
AC1: expected False from the specification. ... ok
test_starts_in_past_is_rejected (test_booking.BookingTests)
AC1: expected False from the specification. ... ok
test_starts_now_is_rejected (test_booking.BookingTests)
AC1: expected False from the specification. ... ok
test_starts_one_minute_after_now_is_allowed (test_booking.BookingTests)
AC1: expected True from the specification. ... ok
test_string_time_outside_contract_observed_behavior (test_booking.BookingTests)
Outside contract: comparing a string with an integer raises TypeError. ... ok
test_touching_both_sides_is_allowed (test_booking.BookingTests)
AC4: expected True from the specification. ... ok
test_touching_end_is_allowed (test_booking.BookingTests)
AC4: expected True from the specification. ... ok
test_touching_start_is_allowed (test_booking.BookingTests)
AC4: expected True from the specification. ... ok
test_zero_length_is_rejected (test_booking.BookingTests)
AC1: expected False from the specification. ... ok

----------------------------------------------------------------------
Ran 34 tests in 0.001s

OK
~~~~

### 12.2 Path B only — three faults you planted

Not applicable: Python Path A. The supplied checker ran ten mutant implementations, all caught by the suite.

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| X2 | Short real B3 prompt; B2 lacks its full original explanation and B4 is only a progress response. No historical text was invented to satisfy the checker. | Recover complete original conversations; conduct and preserve genuine focused exchanges. |
| Baseline authorship and chronology | Section 2 was generated after AI discussion and committed with an AI-assistance title. | Student rewrites their understanding, retaining the chronology disclosure. |
| Reflection authorship | Section 10 is an AI-assisted draft, not unaided student writing. | Student writes their own 100–200 words after reviewing the work. |
| Bolt provenance | Original was reported as Lovable/Atoms and is incomplete; final is a Codex repair. The fresh Bolt attempt showed the account dialog. | Complete Bolt login, generate/export v1, preserve it, execute tests and perform targeted cleanup in Bolt. |
| Original page results | All original page cases are Not testable because src/main.tsx is absent; old screenshot is not current execution evidence. | Obtain the complete original export and rerun T1–T12. |
| Exchange completeness | Four listed records are not four complete prescribed-stage student conversations. | Keep the full prompts and responses, including generated source, with true dates. |
| Independent verification | Tool executions are real, but student understanding and independent decisions are not established. | Explain overlap, mutation tests and the observed/assumed distinction in person. |
| Group identifier | Saved timetable label is used; official group code was not supplied. | Confirm the code before final submission. |
| Screenshots | New images are direct unedited browser captures; historical v1 provenance is inherited from Week 06. Narrow capture uses a 375px iframe. | Retain provenance and inspect final-narrow.jpg at its original size. |
