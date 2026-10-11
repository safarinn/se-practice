# Week 05 — Lab report

**Name:** Muratov Nurali (24B031887)
**Group:** Monday 16-19:00
**Date:** 2026-10-11

Preparation note: the AI created the code, tests and draft review in this session.
The supplied fixed prompts were applied by the assistant; the student did not
send them separately in a new chat. This is disclosed, rather than presented as
a student-run chat. Personal verification remains pending. Week 04 details and GitHub were
confirmed from the repository supplied by the student.

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT (Codex Work Mode) |
| **Exact** model name | GPT-6 |
| Language and version | Python 3.12.14; standard library, compatible syntax for 3.13 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed — verified in Week 04 report §4.3 and submission.yml |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
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
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Steps 1-6; no invented rule found | AC1 bounds/future; AC2 duration; AC3 blocked; AC4 overlap; AC5 Boolean and unchanged inputs | Retained after AI-assisted review; student must verify |

**Boundary cases retained in the AI-assisted suite:**

- Day bounds, time order, future start, 120/121 minutes, touching on both sides,
  all overlap relationships, empty/several bookings and unchanged input.

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as generated in this session: yes.
The AI performed this pre-run review; the student has not yet confirmed it.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440):` | AC1 | Yes: rejects invalid bounds and nonpositive intervals. |
| 2 | `if start <= now:` | AC1 | Yes: the start must be strictly later than now. |
| 3 | `if end - start > 120:` | AC2 | Yes: 120 is allowed; 121 is rejected. |
| 4 | `if blocked:` | AC3 | Yes: blocked is guaranteed Boolean. |
| 5 | `if start < booked_end and end > booked_start:` | AC4 | Yes: both strict comparisons exclude touching endpoints. |
| 6 | `for booked_start, booked_end in existing:` | AC4, AC5 | Yes: checks each booking without changing order or contents. |
| 7 | `return False` and final `return True` | AC5 | Yes: every result is a Boolean; acceptance follows all checks. |

**Anything in v1 that no AC asks for:** none. No extra validation, sorting,
buffer, storage, logging or confirmation. The prediction from reading is that
v1 satisfies AC1–AC5 for contract inputs; test runs must verify it.

---

## 4. Task 3 — my tests

These tests were written by the assistant. Expected values for contract tests
were derived from AC1–AC5 before execution; student verification is pending.
Base input: `now=540, blocked=False, existing=[(600, 660)]`.
Every contract test checks the Boolean with `assertIs` and checks unchanged
contents/order. Unsorted input is important: sorting a one-item list is invisible.
A negative start cannot isolate the lower bound, as explained in §9.3.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | (660, 720) | `none` | True | AC4 | PASS | PASS |
| 2 | `test_partial_overlap_after_is_rejected` | (630, 690) | `none` | False | AC4 | PASS | PASS |
| 3 | `test_blocked_room_is_rejected` | (660, 720) | `blocked=True` | False | AC3 | PASS | PASS |
| 4 | `test_exactly_120_minutes_is_allowed` | (720, 840) | `none` | True | AC2 | PASS | PASS |
| 5 | `test_121_minutes_is_rejected` | (720, 841) | `none` | False | AC2 | PASS | PASS |
| 6 | `test_starts_now_is_rejected` | (540, 570) | `none` | False | AC1 | PASS | PASS |
| 7 | `test_zero_length_is_rejected` | (700, 700) | `none` | False | AC1 | PASS | PASS |
| 8 | `test_reversed_times_are_rejected` | (720, 700) | `none` | False | AC1 | PASS | PASS |
| 9 | `test_end_at_1440_is_allowed` | (1380, 1440) | `none` | True | AC1 | PASS | PASS |
| 10 | `test_end_after_1440_is_rejected` | (1380, 1441) | `none` | False | AC1 | PASS | PASS |
| 11 | `test_negative_start_is_rejected` | (-1, 30) | `none` | False | AC1 | PASS | PASS |
| 12 | `test_starts_one_minute_after_now_is_allowed` | (541, 571) | `none` | True | AC1 | PASS | PASS |
| 13 | `test_starts_in_past_is_rejected` | (500, 530) | `none` | False | AC1 | PASS | PASS |
| 14 | `test_start_at_midnight_now_is_rejected` | (0, 60) | `now=0` | False | AC1 | PASS | PASS |
| 15 | `test_one_minute_after_midnight_is_allowed` | (1, 61) | `now=0` | True | AC1 | PASS | PASS |
| 16 | `test_empty_bookings_is_allowed` | (600, 660) | `existing=[]` | True | AC4 | PASS | PASS |
| 17 | `test_blocked_empty_room_is_rejected` | (600, 660) | `blocked=True, existing=[]` | False | AC3 | PASS | PASS |
| 18 | `test_overlap_with_second_booking_is_rejected` | (720, 780) | `existing=[[600, 660], [700, 760]]` | False | AC4 | PASS | PASS |
| 19 | `test_overlap_in_unsorted_bookings_is_rejected` | (610, 650) | `existing=[[900, 960], [600, 660]]` | False | AC4 | PASS | PASS |
| 20 | `test_free_slot_among_several_is_allowed` | (760, 800) | `existing=[[600, 660], [700, 760], [800, 860]]` | True | AC4 | PASS | PASS |
| 21 | `test_touching_start_is_allowed` | (570, 600) | `none` | True | AC4 | PASS | PASS |
| 22 | `test_touching_both_sides_is_allowed` | (660, 720) | `existing=[[600, 660], [720, 780]]` | True | AC4 | PASS | PASS |
| 23 | `test_partial_overlap_before_is_rejected` | (570, 630) | `none` | False | AC4 | PASS | PASS |
| 24 | `test_inside_existing_is_rejected` | (615, 645) | `none` | False | AC4 | PASS | PASS |
| 25 | `test_contains_existing_is_rejected` | (570, 690) | `none` | False | AC4 | PASS | PASS |
| 26 | `test_identical_interval_is_rejected` | (600, 660) | `none` | False | AC4 | PASS | PASS |
| 27 | `test_one_minute_duration_is_allowed` | (720, 721) | `none` | True | AC2 | PASS | PASS |
| 28 | `test_accepted_input_is_unchanged` | (780, 840) | `existing=[[900, 960], [600, 660], [700, 760]]` | True | AC5 | PASS | PASS |
| 29 | `test_rejected_input_is_unchanged` | (610, 650) | `existing=[[900, 960], [600, 660], [700, 760]]` | False | AC5 | PASS | PASS |
| 30 | `test_last_minute_of_day_is_allowed` | (1439, 1440) | `now=1438, existing=[]` | True | AC1 | PASS | PASS |
| 31 | `test_exactly_120_minutes_to_midnight_is_allowed` | (1320, 1440) | `existing=[]` | True | AC1, AC2 | PASS | PASS |
| 32 | `test_float_time_outside_contract_observed_behavior` | (600.5, 660) | `existing=[]` | True (observed policy) | Outside contract; §9.2 | PASS | PASS |
| 33 | `test_string_time_outside_contract_observed_behavior` | ("600", 660) | `existing=[]` | TypeError (observed policy) | Outside contract; §9.2 | PASS | PASS |

Initial six-case run: M2, M3, M7, M8 and M10 survived. Adding day-end,
zero-length, later/unsorted booking, containing interval and unsorted unchanged-input
tests caught them. No faulty implementation was decoded or inspected.
The two outside-contract tests document §9.2 and are not used as mutation evidence
where the checker's reference function disagrees with them. The checker reports
which tests it excludes. The final suite also ran against the unchanged v1 in an
isolated temporary folder; the complete output is in `evidence/suite_v1.txt`.

---

## 5. Task 4 — debugging with evidence

No defect was observed in v1. All F1–F10 passed in the initial six-test checker
run. The expanded suite also passed v1. After that, one further edge case was
added: exactly 120 minutes ending at midnight. No implementation fix was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(1320, 1440, 540, False, [])` | True | True | `end <= 1440` and `end - start > 120` correctly allow both inclusive bounds | No fix; added `test_exactly_120_minutes_to_midnight_is_allowed` | Assistant proposed the edge test; no code fix |

**The debug prompt I sent, and the assistant's answer:** not used, because there
was no failing function case. The initial checker failures concerned missing
coverage and unfinished worksheet sections, not a v1 defect.

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
No defect was found for inputs guaranteed by the contract and AC1-AC5.
1. Outside-contract behavior: `if not (0 <= start < end <= 1440):`
   does not check the type. A numeric float may pass; a string raises
   TypeError. The contract says times are integers, but gives no required
   behavior for other types. This is a declared limitation, not an AC failure.
2. Redundancy: `0 <= start` is written explicitly, although `start > now`
   with valid `now >= 0` already implies a positive start. AC1 explicitly
   states both bounds. Keeping the comparison helps traceability and is correct.
The overlap condition uses strict comparisons, all bookings are visited,
and only True/False are returned. No rewrite is needed.
```

The following judgments are AI-assisted draft judgments, for student review.

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Declare non-integer behavior as an outside-contract limitation; no type guard requested | accept | Contract promises integer times; §9.2 records actual float/string behavior without inventing an AC | No code change; all 33 tests passed |
| 2 | Retain the explicit lower bound even though it is redundant | accept | AC1 writes `0 <= start`; the future requirement and valid now imply it, but preserving it is harmless | No code change; all 33 tests passed |

No accepted point required changing the function. No invented bug or debug
conversation is claimed. The final full suite was run after review.

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No implementation line changed; v1 and final are byte-for-byte identical | No failure on contract inputs justified a fix | F1–F10 PASS; all 33 tests PASS on both copies |
| 2 | Suite: 6 → 32 tests, including two outside-contract observations | Add missing edge relationships and visible mutation checks | M2, M3, M7, M8, M10 changed FAIL → PASS |
| 3 | Suite: 32 → 33 tests | Additional edge after v1 passed: 120 minutes ending at midnight | `test_exactly_120_minutes_to_midnight_is_allowed` PASS; no code change |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Complete captured stdout and stderr from `python3 -m unittest -v`, inside `code/`:

```text
test_121_minutes_is_rejected (test_booking.BookingTests.test_121_minutes_is_rejected)
AC2: expected False from the specification. ... ok
test_accepted_input_is_unchanged (test_booking.BookingTests.test_accepted_input_is_unchanged)
AC5: expected True from the specification. ... ok
test_blocked_empty_room_is_rejected (test_booking.BookingTests.test_blocked_empty_room_is_rejected)
AC3: expected False from the specification. ... ok
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected)
AC3: expected False from the specification. ... ok
test_contains_existing_is_rejected (test_booking.BookingTests.test_contains_existing_is_rejected)
AC4: expected False from the specification. ... ok
test_empty_bookings_is_allowed (test_booking.BookingTests.test_empty_bookings_is_allowed)
AC4: expected True from the specification. ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests.test_end_after_1440_is_rejected)
AC1: expected False from the specification. ... ok
test_end_at_1440_is_allowed (test_booking.BookingTests.test_end_at_1440_is_allowed)
AC1: expected True from the specification. ... ok
test_exactly_120_minutes_is_allowed (test_booking.BookingTests.test_exactly_120_minutes_is_allowed)
AC2: expected True from the specification. ... ok
test_exactly_120_minutes_to_midnight_is_allowed (test_booking.BookingTests.test_exactly_120_minutes_to_midnight_is_allowed)
AC1, AC2: both inclusive upper bounds are allowed together. ... ok
test_float_time_outside_contract_observed_behavior (test_booking.BookingTests.test_float_time_outside_contract_observed_behavior)
Outside contract: no type guard, so a valid numeric float is accepted. ... ok
test_free_slot_among_several_is_allowed (test_booking.BookingTests.test_free_slot_among_several_is_allowed)
AC4: expected True from the specification. ... ok
test_identical_interval_is_rejected (test_booking.BookingTests.test_identical_interval_is_rejected)
AC4: expected False from the specification. ... ok
test_inside_existing_is_rejected (test_booking.BookingTests.test_inside_existing_is_rejected)
AC4: expected False from the specification. ... ok
test_last_minute_of_day_is_allowed (test_booking.BookingTests.test_last_minute_of_day_is_allowed)
AC1: expected True from the specification. ... ok
test_negative_start_is_rejected (test_booking.BookingTests.test_negative_start_is_rejected)
AC1: expected False from the specification. ... ok
test_one_minute_after_midnight_is_allowed (test_booking.BookingTests.test_one_minute_after_midnight_is_allowed)
AC1: expected True from the specification. ... ok
test_one_minute_duration_is_allowed (test_booking.BookingTests.test_one_minute_duration_is_allowed)
AC2: expected True from the specification. ... ok
test_overlap_in_unsorted_bookings_is_rejected (test_booking.BookingTests.test_overlap_in_unsorted_bookings_is_rejected)
AC4: expected False from the specification. ... ok
test_overlap_with_second_booking_is_rejected (test_booking.BookingTests.test_overlap_with_second_booking_is_rejected)
AC4: expected False from the specification. ... ok
test_partial_overlap_after_is_rejected (test_booking.BookingTests.test_partial_overlap_after_is_rejected)
AC4: expected False from the specification. ... ok
test_partial_overlap_before_is_rejected (test_booking.BookingTests.test_partial_overlap_before_is_rejected)
AC4: expected False from the specification. ... ok
test_rejected_input_is_unchanged (test_booking.BookingTests.test_rejected_input_is_unchanged)
AC5: expected False from the specification. ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected)
AC1: expected False from the specification. ... ok
test_start_at_midnight_now_is_rejected (test_booking.BookingTests.test_start_at_midnight_now_is_rejected)
AC1: expected False from the specification. ... ok
test_starts_in_past_is_rejected (test_booking.BookingTests.test_starts_in_past_is_rejected)
AC1: expected False from the specification. ... ok
test_starts_now_is_rejected (test_booking.BookingTests.test_starts_now_is_rejected)
AC1: expected False from the specification. ... ok
test_starts_one_minute_after_now_is_allowed (test_booking.BookingTests.test_starts_one_minute_after_now_is_allowed)
AC1: expected True from the specification. ... ok
test_string_time_outside_contract_observed_behavior (test_booking.BookingTests.test_string_time_outside_contract_observed_behavior)
Outside contract: comparing a string with an integer raises TypeError. ... ok
test_touching_both_sides_is_allowed (test_booking.BookingTests.test_touching_both_sides_is_allowed)
AC4: expected True from the specification. ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed)
AC4: expected True from the specification. ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed)
AC4: expected True from the specification. ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected)
AC1: expected False from the specification. ... ok

----------------------------------------------------------------------
Ran 33 tests in 0.001s

OK
```

### 8.2 The checker, final run

The complete output is inserted last after all report content is prepared.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (13 lines)
PASS   S1   your suite has at least 11 tests            33 tests
PASS   S2   your suite is green on your own code        33 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_start_at_midnight_now_is_rejected, test_starts_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_1440_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_120_minutes_is_allowed, test_exactly_120_minutes_to_midnight_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_empty_room_is_rejected, test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_free_slot_among_several_is_allowed, test_touching_both_sides_is_allowed, test_touching_end_is_allowed and 1 more
PASS   M7   your tests catch a fault in AC4             caught by test_overlap_in_unsorted_bookings_is_rejected, test_overlap_with_second_booking_is_rejected, test_rejected_input_is_unchanged
PASS   M8   your tests catch a fault in AC4             caught by test_contains_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_accepted_input_is_unchanged, test_empty_bookings_is_allowed, test_end_at_1440_is_allowed and 10 more
PASS   M10  your tests catch a fault in AC5             caught by test_accepted_input_is_unchanged, test_overlap_in_unsorted_bookings_is_rejected, test_rejected_input_is_unchanged
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              7 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  33 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 2 points judged
PASS   L7   report 7: change log                        3 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      160 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```

### 8.3 Path B only — three faults I planted myself

Not applicable: Python, Path A. The shipped checker supplies ten mutation checks.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| N/A | No manually planted faults | Path A | Shipped M1–M10 used |

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

No functional or mutation checks remain failing. See the final run in §8.2.
The declaration validator is separate and now passes all 16 checks.
GitHub `safarinn` and the Week 04 touching policy `allowed` were verified from
the student-supplied repository. AC4 agrees with that policy, so the prior
diagrams need no change to their touching-interval assumption.

| Check | Why it stays |
| --- | --- |
| none (booking checker) | All 32 booking/report checks pass mechanically; personal authorship and confirmation are still required |

### 9.2 Outside the contract

AI-assisted draft: declared `not-handled`. The contract promises integer times,
so the function adds no type check. Actual calls:
`can_book(600.5, 660, 540, False, [])` returned True;
`can_book("600", 660, 540, False, [])` raised TypeError.
This is neither automatic conversion nor guaranteed rejection of every invalid
type. Separate tests record those observations. The policy requires student review.

### 9.3 A bound that never decides

AI-assisted draft: `0 <= start`. Because valid `now` is at least 0,
`start > now` implies `start > 0`. Therefore a negative start already fails
another AC1 condition. It cannot be rejected only by the lower bound. For example,
`can_book(-1, 30, 540, False, [(600, 660)])` also starts in the past.
By contrast, `(1380, 1441)` isolates the upper day limit: the order, future start,
duration and overlap conditions otherwise hold. Student explanation is pending.

---

## 10. Conclusion (120–180 words)

<!-- AI-DRAFT ONLY. The assignment requires the student's own words without the assistant.
This draft is disclosed in AI_USAGE.md. Rewrite it from your understanding before submitting.
The checker's word-count PASS does not establish authorship or satisfy that requirement. -->

Two intervals overlap when the requested start is before the existing end and the requested end is after the existing start. Both comparisons must be true. Strict comparisons allow touching bookings because equality makes one comparison false. The function also checks the day limits, a future start, the duration, and the blocked flag. It only reads the booking list.

The first six tests passed, but they missed M2, M3, M7, M8 and M10. These faults survived equally long, until the expanded suite was run. M10 was especially easy to overlook: the original cases already checked unchanged input, but their one-item lists could not reveal a change in ordering. Tests with unsorted multiple bookings exposed it.

Non-integer input needed a separate decision. This version assumes the promised integer inputs and adds no type guard. A float can pass, while a string raises TypeError. Those observations are documented separately from AC1–AC5. Correct code still needs tests that can detect incorrect alternatives.
