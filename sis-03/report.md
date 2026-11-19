# SIS #03 — Report: Smart Campus Room Availability Checker

This is a revised version after the first submission. AI help in this report is listed in AI_USAGE.md.

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
| Web v1 from | fresh |

Python original and final were recovered from local Git ref `origin/week-05`. The original is unchanged; the final implementation is identical because no contract defect was found. The suite adds an explicit repeated-call test to the 33 inherited tests.

The week-06 page was made in Lovable, not Bolt, so I did not reuse it. I generated a fresh web v1 in Bolt.new with the prompt in section 4 and saved it unchanged in web/original/. After the repair prompts in section 7, I exported the final from Bolt through GitHub (github.com/safarinn/sis03-bolt) into web/final/.

Student details were taken from the existing Week 05 declaration: Muratov Nurali, 24B031887, GitHub safarinn. Group wording is the saved timetable label, Monday 16-19:00; a separate official group code was not supplied.

## 2. Baseline — before any new AI exchange

**Authorship and timing disclosure:** I rewrote section 2.1 and AC1–AC5 in section 2.2 in Russian, with explanatory feedback, and used AI to translate my wording into English. I wrote AC6 and sections 2.3–2.5 myself, with hints from Codex. This revision was made after the original submission and does not satisfy the original before-AI chronology.

### 2.1 Scope in my own words

**Scope:** The application helps students check whether a room is available at their chosen time. It only shows availability and does not create a booking. It checks one room using fictional data, without registration, a database, a backend, external APIs, or payments.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Time is given in whole minutes after midnight, from 0 to 1440. The start must be later than the current time and earlier than the end, and the end must not exceed 1440. |
| AC2 | The duration must not exceed 120 minutes. Exactly 120 minutes is allowed. |
| AC3 | If the room is blocked, every request must be rejected. |
| AC4 | The request is rejected if its time interval overlaps any existing booking. If one booking ends exactly when another begins, this is allowed. |
| AC5 | The application must clearly show whether the room is available and must not change existing bookings. |
| AC6 | The application must clearly explain input errors and be easy to use on a phone screen|

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | The application may treat touching endpoints as an overlap | AC4 | I will check a request from 660 to 720 with an existing booking from 600 to 660. I expect Available |
| 2 |  The application may allow a request to start exactly at the current time | AC1 | I will check a request from 540 to 570 with now = 540. I expect Unavailable |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | 	The start of the requested interval, in minutes after midnight |An integer that must be at least 0, later than now, and earlier than end |
| `end` | 	The end of the requested interval, in minutes after midnight | An integer that must be later than start and no greater than 1440. The duration must not exceed 120 minutes |
| `now` | The current time, in minutes after midnight | An integer from 0 to 1439. We assume it is provided correctly |
| `blocked` | Indicates whether the room is blocked |A Boolean value: True means blocked, and False means not blocked.  |
| `existing` | A list of existing bookings, each represented by a start and end pair in minutes after midnight | each represented by a start and end pair in minutes after midnight.	A list of integer pairs (start, end). It may be empty, and the function must not modify it. |
| returns |	Returns True if all conditions AC1–AC4 are met; otherwise, False. Existing bookings remain unchanged  | Boolean: True or False |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. I assume that now is provided correctly and is within the range from 0 to 1439
2. I assume that all times and existing bookings refer to the same day

**Checked manually:**

- I calculated manually: 840 − 720 = 120 minutes, which is allowed by AC2, while 841 − 720 = 121 minutes, which is not allowed.

## 3. Python v1 review


| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440):` | AC1 | Partly | If the start is below 0, is not earlier than the end, or the end exceeds 1440, the function returns False. The comparison with now is not checked here.|
| `if start <= now:` | AC1 | Yes | If the start is earlier than or equal to the current time, the function returns False. The start must be strictly later than now |
| `if end - start > 120:` | AC2 | Yes |If the duration exceeds 120 minutes, the function returns False. Exactly 120 minutes is allowed. |
| `if blocked:` |AC3 |Yes | If the room is blocked, the function returns False regardless of the selected time.|
| `if start < booked_end and end > booked_start:` |AC4 | Yes|	If the request starts before the existing booking ends and ends after it starts, the intervals overlap and the function returns False. Touching endpoints are allowed. |
| `for booked_start, booked_end in existing:` | AC4, AC5|Yes | 	The loop checks existing bookings until an overlap is found. If none is found, it checks the whole list, not just the first booking. It does not modify the bookings.|
| `return True` |	AC1–AC5 | Yes | 	If all checks pass and there are no overlaps, the function returns True. Existing bookings remain unchanged.|

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


| Generated file or component | Path | Its role |
| --- | --- | --- |
| Main component| src/App.tsx| 	Imports and displays the room availability checker page |
| Room availability checker | src/components/RoomAvailabilityChecker.tsx | Contains the time input fields, checks room availability, and displays the result. |


**What v1 does:**

- The page displays the room, the current time, and the existing booking.
- For 660–720, it shows Available; for 630–690, it shows Unavailable.
- When the input fields are empty, it shows an error.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Not testable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Available | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Unavailable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not testable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

**Notes on the page columns:**

- T5, T6, T7, T9: both pages do not show the word "Unavailable". They show an "Input error" box with a reason (duration over 120 minutes, start not after now, start not before end, time over 1440). The request is refused, so I wrote Unavailable.
- Page v1, T3 and T10: v1 has no control to block the room or to choose two bookings, so these cases could not be run.
- Page final was run on 2026-11-19 on the Bolt export in web/final (local Vite server). T3: Room blocked on, message "This room is currently blocked for maintenance." T10: Two bookings, message "Overlaps existing booking 11:40–12:40." T11: pressed Check twice, Available both times, booking list unchanged. T12: width 375 px, no horizontal scroll, see evidence/final-narrow.jpg.

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | 	Python: time-bound and now checks in code/booking.py and code/original/booking_v1.py. Page: validateInputs in web/original/src/components/RoomAvailabilityChecker.tsx | T6–T9 | Python: False, False, True, False. Page: Unavailable, Unavailable, Available, Unavailable. |Python: False, False, True, False. Page: validation error, validation error, Available, validation error  | Page: validation error, validation error, Available, validation error.	Python: False, False, True, False. Page final: Input error (Unavailable), Input error (Unavailable), Available, Input error (Unavailable). |
| AC2 | 	Python: if end - start > 120 in code/booking.py and code/original/booking_v1.py. Page: validateInputs in web/original/src/components/RoomAvailabilityChecker.tsx |T4–T5  | 	Python: True, False. Page: Available, Unavailable. | Python: True, False. Page: Available, validation error. | Python: True, False. Page final: Available, Input error (Unavailable). |
| AC3 |	Python: if blocked in code/booking.py and code/original/booking_v1.py. Page: checkAvailability in web/original/src/components/RoomAvailabilityChecker.tsx.  | T3 |Python: False. Page: Unavailable.  | Python: False. Page: Not testable because v1 has no control to change the blocked status. | Python: False. Page final: Unavailable, "This room is currently blocked for maintenance." |
| AC4 | Python: the loop and overlap condition in code/booking.py and code/original/booking_v1.py. Page: checkAvailability in web/original/src/components/RoomAvailabilityChecker.tsx. | T1, T2, T10 |	Python: True, False, False. Page: Available, Unavailable, Unavailable | Python: True, False, False. Page: Available, Unavailable, Not testable. T10 cannot be tested because v1 has no control to select two bookings | Python: True, False, False. Page final: Available, Unavailable, Unavailable ("Overlaps existing booking 11:40–12:40"). |
| AC5 | Python: can_book in code/booking.py and code/original/booking_v1.py does not modify existing bookings. Page: checkAvailability and result rendering in web/original/src/components/RoomAvailabilityChecker.tsx | T11 | Python: True on the second call; bookings unchanged. Page: Available on the second check; bookings unchanged. | Python: True on the second call; bookings unchanged. Page: Available on the second check; the displayed booking list remained unchanged. | Python: True on the second call; bookings unchanged. Page final: Available on both checks; the booking list stayed the same. |
| AC6 | Page: validateInputs, error-message rendering and responsive layout in web/original/src/components/RoomAvailabilityChecker.tsx. | T6, T7, T12 | 	Clear input-error messages and a usable layout at 375 px; T12 shows Available. | T6 and T7 showed explanatory error messages. At 375 px, T12 showed Available; the fields and button were visible, with no horizontal scrolling. | Page final: T6 and T7 showed clear error messages. At 375 px, T12 showed Available, with no horizontal scroll. |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 |v1 has no control to change the room’s blocked status  |T3 requires blocked = True, but this cannot be set through the v1 interface.  | Medium | Prompt 1: "добавить переключатель Room blocked и выбор One booking / Two bookings." Change: Bolt added a Room blocked switch. When it is on, the check shows Unavailable and the room badge changes from Open to Blocked. Changing the switch clears the old result | T3: 660–720 with Room blocked on → Unavailable, as expected. |
| 2 | 	v1 has no control to select a schedule with two bookings. | T10 requires bookings 600–660 and 700–760, but this schedule cannot be selected through the v1 interface. | Medium | Prompt 2: "Что ты увидел: при Two bookings второе бронирование стоит на 13:00–14:00, и запрос 12:00–13:00 даёт Available; что нужно по тесту: второе бронирование должно быть 11:40–12:40 (700–760), тогда T10 даёт Unavailable; ограничение: поменять только время второго бронирования, больше ничего не трогать." Change: the second booking is now 11:40–12:40. |After prompt 1: T10 (720–780, Two bookings) → Available, wrong. After prompt 2: T10 → Unavailable, as expected.  |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 1: v1 has no Room blocked switch and no booking choice; after prompt 1 both are on the page. The after screenshot was taken before prompt 2, so it still shows the second booking at 13:00–14:00.

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | AC4 is satisfied: touching endpoints are allowed, real overlaps are rejected. | I ran T1, T2 and T10 on the Python function and on the page. T1 gave True / Available, T2 and T10 gave False / Unavailable |accept  | The results match the expected values for AC4 (T1, T2, T10). |
| 2 | The function has no integer check, so a float like 540.5 is accepted. | I ran can_book(540.5, 600, 540, False, []) and it returned True. My test test_float_time_outside_contract_observed_behavior shows the same | modify | The claim is true, but my contract (§2.4) says times are integers, so I did not change the function. I wrote it as a limitation in §13. |
| 3 | AC6 is not satisfied: the function should return error messages or an object like {"ok": False, "reason": "..."} | I checked my contract in §2.4: the function returns a Boolean. On the page, T6 and T7 showed clear error messages. | reject | Error messages belong to the page (AC6), and the page shows them. Returning an object would break the contract and check F9 |
| 4 | The code has broken indentation: return False is not under its if|I opened code/booking.py and ran the test suite: 34 tests, OK| reject | The indentation broke only when I pasted the code into the chat. The real file is correct|

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | Make T10 testable on the page: the page needs a schedule with two bookings, 600–660 and 700–760 |
| Model / plan | Bolt planned to add a One booking / Two bookings choice to RoomAvailabilityChecker.tsx. |
| Tool call | Bolt edited RoomAvailabilityChecker.tsx and added the choice, but it put the second booking at 13:00–14:00 (780–840) because my prompt did not give the time |
| Observation | I ran T10 (720–780, Two bookings). The page showed Available, but Unavailable was expected |
| Next step | I sent a second prompt with the case and the exact time 11:40–12:40. Bolt changed only the second booking |
| Human review |I ran T10 again and it showed Unavailable. I also checked the code in web/final: the bookings are [[600, 660], [700, 760]]  |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Bolt.new | My prompt and the project files in its editor |It edited RoomAvailabilityChecker.tsx and showed the result in a preview  | Observed |
| Bolt.new | A default project template | It added @supabase/supabase-js to package.json, which I did not ask for. I think it comes from its template |Assumed  |
| Claude Code | My local repo files: report.md, README, tests | It ran shell commands: git clone, the checker and the Python tests, and changed files in web/final |Observed  |

### 9.3 Checkpoint and dependability

**Safety checkpoint:**
Before I accept a change from Bolt, I run the test cases it affects (for example T3 and T10) and read the changed code. I do not trust its summary, because for T10 the summary sounded correct but the time was wrong.
**Reliability, security, responsibility:**
Reliability: the AI can guess missing details, like the 13:00 booking, so every change needs a retest. Security: Bolt added a Supabase dependency that I did not ask for, and the checker found it (W3). Responsibility: the AI does not know my contract or test cases, so I decide what to accept and I am responsible for the final code
## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

In Python I saw every line of the code and ran 34 tests, while in Bolt I wrote prompts, got a full page and checked it only by testing it in the browser. I think Python gave me more control, because in Bolt I did not see what changed until I tested it.
A reliability risk: Bolt chose the time 13:00–14:00 by itself, so T10 gave Available instead of Unavailable. A usability risk: in v1 it was not possible to check T3 and T10, because there were no switches. A security risk: Bolt added an unnecessary dependency, Supabase, and the checker found it (W3).
Review, tool permissions and tests stay with the human, because Bolt said the change was done, but the time was wrong. Only my test showed it.
I rejected one AI advice: it said the function should return an object with a reason instead of True/False. This breaks my contract, and the page already shows error messages (T6, T7).
Next time I would write exact times and the test number in my prompts



## 11. Appendix A — AI exchanges

B1 and B2 are reused from week-05. B3 is the critique for section 8. B4 is the second Bolt repair prompt from section 7. The first Bolt repair prompt was under 15 words; it is quoted in section 7, issues 1 and 2. The earlier Codex messages from this SIS were general requests, not stage exchanges, so I removed them from this appendix.

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

Only the code part of the week-05 answer was saved; the explanation part was not.

### B3

- **Tool:** Claude
- **Model:** opus 5.5
- **Date:** 2026-11-19
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**




~~~~text
Review this Python function and this React page against AC1–AC6. For each AC, say if it is satisfied, and list any bugs or risks you see. Give each claim a number.
~~~~

**Response:**

~~~~text
AC1 — Integer minutes, 0 ≤ start < end ≤ 1440, start > now

1. Satisfied (partially). `0 <= start < end <= 1440`enforces range and ordering; `start <= now` enforces start-after-now. Boundary `start == now` is correctly rejected.
2. Bug: no integer check. The function accepts floats — `can_book(540.5, 600, 540, False, [])` returns `True`. The React page checks `Number.isInteger`; the Python function does not. If AC1 requires "integer minutes," this is a violation.
3. Note: the pasted code has broken indentation (`return False` lines aren't indented under their `if`). Assuming that's a paste artifact and the real code is properly indented.

AC2 — Duration ≤ 120, exactly 120 allowed

4. Satisfied. `end - start > 120` rejects only strictly-greater values; 120 passes.

AC3 — If blocked, any request is unavailable

5. Satisfied. `if blocked: return False` guarantees a blocked room never returns `True`.
6. Risk (low): The blocked check runs after validation. An invalid input on a blocked room returns `False` due to validation, not blocked. The boolean result is still `False`, so AC3 holds — but the function can't distinguish "blocked" from "invalid input," which matters for AC6.

AC4 — No overlap; boundary touching allowed

7. Satisfied. `start < booked_end and end > booked_start` uses strict inequalities on both sides, so exact boundary contact (e.g., start=660 against booking 600–660) is allowed. Logic matches the React page.

AC5 — Don't modify existing bookings on re-check

8. Satisfied. The function only iterates `existing` and never mutates it. Pure function, safe to call repeatedly.

AC6 — Clear input error messages

9. NOT satisfied. The function returns only `True`/`False`— zero error messages. AC6 requires distinct, human-readable messages for each failure case (empty, non-integer, out-of-range, start≥end, start≤now, duration>120, blocked, overlap). The React page satisfies this; the Python function does not.
10. Risk: Callers of `can_book` get no reason for rejection, so they cannot surface a meaningful message to the user without re-implementing all the checks externally.

Summary

11. AC1 — bug (#2): no integer validation; floats pass silently.
12. AC6 — violation (#9): the function returns a bare boolean with no error messages, unlike the React page which has six distinct messages.
13. AC2, AC3, AC4, AC5 — satisfied in both the Python function and the React page.
14. Cross-cutting risk (#6, #10): the blocked check ordering and the lack of any return reason mean the Python function can't tell a caller why a booking failed — it can only say that it did. If this function is meant to back the same UI as the React page, it would need to return a result object (e.g., `{"ok": False, "reason": "..."}`) rather than a boolean to satisfy AC6.
~~~~

### B4

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-19
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
что ты увидел: при Two bookings второе бронирование стоит на 13:00–14:00, и запрос 12:00–13:00 даёт Available;
что нужно по тесту: второе бронирование должно быть 11:40–12:40 (700–760), тогда T10 даёт Unavailable;
ограничение: поменять только время второго бронирования, больше ничего не трогать.
~~~~

English translation: What I observed: with Two bookings, the second booking is at 13:00–14:00 and 12:00–13:00 shows Available. What the test needs: the second booking must be 11:40–12:40 (700–760), so T10 shows Unavailable. Constraint: change only the time of the second booking. The structure of this prompt was suggested by Claude.

**Response:**

~~~~text
Поменял время второго бронирования в режиме "Two bookings" с 13:00–14:00 (780–840) на 11:40–12:40 (700–760). Теперь запрос 12:00–13:00 (720–780) пересекается с этим бронированием и даёт "Unavailable", что соответствует тесту T10. Больше ничего не трогал.
~~~~

Bolt commit 64aa828 in safarinn/sis03-bolt changed one line: `two: [[600, 660], [780, 840]]` → `two: [[600, 660], [700, 760]]`.

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
| X2 | B2: only the code from the week-05 answer was saved, the explanation part is lost. B4: Bolt's answer to prompt 2 is complete but short (under 60 words); the change is also confirmed by Bolt commit 64aa828 and by my retest of T10. | Keep it: nothing is missing from B4, and B2 cannot be recovered. Save full answers right away next time. |
| Bolt prompt 1 | It was under 15 words, so it is only quoted in section 7, not in section 11. | Write prompts with the case and exact times from the start. |
| Float input | `can_book(540.5, 600, 540, False, [])` returns True (section 8, row 2). The contract promises integers, so I did not change the function. | Add an integer check only if the contract changes. |
| Page result wording | For T5, T6, T7 and T9 the page shows "Input error" with a reason, not the word "Unavailable". | Keep it: the request is refused and the message is clear (AC6). |
| after-1.png | It was taken after prompt 1, so it shows the switches but the second booking is still 13:00–14:00. | Take a new screenshot with T10 → Unavailable to show issue 2 too. |
| web-v1.png | It is the same image as before-1.png. | None needed: both show v1 before any change. |
| Supabase dependency | Bolt's template added `@supabase/supabase-js` (unused). I asked Bolt to remove it; Bolt commit 0e47335 removed it and the checker W3 now passes. | Check package.json of every Bolt export. |
| Baseline chronology | Section 2 was rewritten after the first submission and after AI exchanges, not before them. | Agree the resubmission with the instructor. |
| AI help in the report | Wording of sections 7–9 and the format of sections 5, 6, 11 and 13 were prepared with Claude from my results; section 10 is my text with grammar fixed by Claude. | Disclosed in AI_USAGE.md. I can explain every row in class. |
| Group identifier | The timetable label "Monday 16-19:00" is used, not an official group code. | Confirm the code before submission. |
