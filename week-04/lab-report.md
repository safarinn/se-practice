# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name |Nurali Muratov |
| Group | Monday 16-19:00|
| AI assistant |  ChatGPT |
| Exact model | GPT-5.6 Luna |
| Renderer | PlantUML web server  |
| Behaviour diagram |  both |
| Stories used | the reference set from README §3> |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none; the revisions were made directly in the PlantUML source after comparing it with the handout and checker criteria.
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** touching bookings are allowed; blocking a room does not cancel existing bookings; only the owner may cancel their booking. The scenario does not explicitly define the first two, so they are declared assumptions rather than requirements.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Send confirmation | The initial draft linked the student directly to a confirmation use case, treating an outcome as a user goal. | R4 / US-01 | Removed the actor association; confirmation is included by Book room, with a `why` comment. |
| 2 | Book room → Send confirmation | The initial draft used `include` without a written rationale, so the relationship was not defended in the required notation. | R4 / US-01 | Added a `' why:` comment immediately above the include relationship. |
| 3 | Block / unblock room | The initial draft combined two admin goals into one label, making the separate block and unblock actions less explicit. | US-04 / US-05 | Split into `Block room` and `Unblock room`; both remain Administrator goals. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One student can own zero or many bookings. | Each booking belongs to exactly one student. | Student `1`; Booking `0..*` |
| Room — Booking | One room can have zero or many bookings over time. | Each booking is for exactly one room. | Room `1`; Booking `0..*` |

### 4.2 Constraints the multiplicities cannot show

- R2: A note attached to `Booking` states that active bookings for the same room cannot overlap. Multiplicity cannot encode a temporal non-overlap constraint.
- R1: `Booking.startTime` and `Booking.endTime` represent the requested interval; the behavior diagrams check future start and duration greater than zero and no more than two hours.
- R3: `Room.isBlocked` represents blocked state; a blocked room rejects new booking attempts.
- R4: A successful booking returns a confirmation; confirmation is not modeled as a domain class because no persistent confirmation entity is required by the scenario.
### 4.3 Assumptions

- A1: Touching intervals are allowed. Booking intervals are treated as half-open `[start, end)`, so one booking ending at 12:00 and another starting at 12:00 do not overlap.
- A2: Blocking a room prevents new bookings but preserves existing bookings. The scenario only says that a blocked room cannot accept a new booking; it does not direct cancellation of existing bookings.
- A3: A student may cancel only their own booking, as stated in the scenario. Authorization is represented as a use-case responsibility and operation constraint, not an extra user class.
- A4: A booking has an `ACTIVE` or `CANCELLED` status. This is a small domain enumeration to make the word “active” in R2 explicit.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student — Booking multiplicity | The initial draft used `1..*` bookings, which incorrectly says each student must already have at least one booking. | US-01 / US-03 | Changed the Booking end to `0..*`; students may have no bookings. |
| 2 | Room *-- Booking | The initial draft used composition, implying a booking is a lifecycle-owned part of a room without a requirement supporting that claim. | US-01 / US-03 | Replaced composition with a plain association and explicit multiplicities. |
| 3 | Booking attributes | The initial draft had start and duration but omitted end and status, making interval comparisons and active-booking checks less explicit. | R1 / R2 | Added `endTime` and `status`; retained start time. |
| 4 | BookingService in domain model | The initial draft included a service class in a domain diagram, mixing design architecture with domain concepts. | Task 2 requirements / CL6 | Removed it from the domain class diagram; it appears only as a lifeline in the sequence diagram. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** both sequence and activity diagrams are included as the optional extension; sequence makes request/reply order explicit, while activity makes the three sequential rule checks easy to audit.

**Design components added beyond the domain model:** 
- `BookingService` — coordinates validation, checks the room and overlap constraints, and requests persistence only after all checks pass.
- `BookingRepository` — answers room-state and overlap queries and persists a valid booking. It is a design component, not a domain class.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Sequence: save booking before validation | The initial draft saved immediately and did not show R1, R2, or R3 validation before persistence. | R1–R3 / US-01 | Added time-range validation, blocked-room check, and overlap check before the create/save message. |
| 2 | Sequence: `alt` branches | The initial draft used generic success/failure branches without clear guards or reasons, and its failure behavior was underspecified. | R1–R4 | Added guarded `created - all validations pass` and `unavailable - invalid time, blocked room, or overlap` branches; failure returns rejection without a save. |
| 3 | Activity: `Can book?` | The initial draft combined every rule into one decision, so it could not show which rule rejects a request. | R1 / R2 / R3 | Split into three sequential guarded decisions: time range, blocked room, and overlap. |
| 4 | Activity: create booking | The initial draft created the booking before documenting the separate rule checks. | R1–R3 / AC6 | Creation follows all three successful checks; each failure path rejects and terminates. |

---

## 6. AI critique


| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | A student should not be directly associated with a confirmation use case. | `Student -- Booking confirmation` in the original use-case draft | Accept | R4 makes confirmation an outcome of a successful booking, not a student goal. The revised diagram has no actor link to confirmation. |
| 2 | Composition between Room and Booking is unjustified. | `Room *-- Booking` in the original class draft | Accept | Requirements establish that a booking is for a room, not that a booking's lifecycle is compositionally owned by the room. A plain association is safer. |
| 3 | `1..*` bookings per student is too restrictive. | Student–Booking multiplicity in the original class draft | Accept | US-03 and the scenario do not require every student to have an existing booking; `0..*` is correct. |
| 4 | Both behavior diagrams are unnecessary because only one is required. | `models/sequence.puml` and `models/activity.puml` | Reject as a correctness issue; accept as a scope note | The handout says one behavior diagram is required and both are an optional extension that earns no extra credit. The user explicitly requested both, so both are retained. |
| 5 | Touching intervals and blocking a room with existing bookings are underspecified. | Class notes and behavior assumptions | Accept | The handout explicitly says these points must be declared, not guessed. Both assumptions are stated in the report and diagram notes. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | `Booking.startTime`, `Booking.endTime` | Sequence validation message; activity decision `Time range valid R1` |
| R2 | Book room; Cancel own booking | `Booking.status`; R2 note attached to `Booking` | Sequence overlap query; activity decision `Overlap found? R2` |
| R3 | Book room; Block room; Unblock room | `Room.isBlocked`, `Room.block()`, `Room.unblock()` | Sequence blocked-status check; activity decision `Room blocked? R3` |
| R4 | Book room | No separate domain class required; confirmation is an outcome | Sequence confirmation reply; activity confirmation action |
| US-01 | Book room | `Student`, `Room`, `Booking` | Both behavior diagrams show validated booking creation and confirmation |
| US-01 | Booking confirmation | `Booking` | Confirmation follows successful persistence in both behavior diagrams |
| US-02 | View room availability | `Room`, `Booking` | Availability query is outside the Book room behavior flow; use case and domain associations support it |
| US-03 | Cancel own booking | `Student`, `Booking`, `Booking.status` | Cancellation is a separate use case; not expanded into a behavior diagram in this lab |
| US-04 | Block room | `Room.isBlocked`, `Room.block()` | Blocked status is checked before booking; admin action is represented in use case/class model |
| US-05 | Unblock room | `Room.isBlocked`, `Room.unblock()` | Admin action is represented in use case/class model |
| US-06 | Review room usage | `Room`, `Booking` | Usage review is a use case over room/booking information; not expanded into the Book room flow |
| View room availability | View room availability | `Room`, `Booking` | Availability is a goal, not a screen or service |
| Book room | Book room | `Student`, `Room`, `Booking` | Sequence request and activity workflow |
| Cancel own booking | Cancel own booking | `Student`, `Booking` | Student owns and cancels own booking |
| Block room | Block room | `Room` | Administrator goal; sets blocked state |
| Unblock room | Unblock room | `Room` | Administrator goal; clears blocked state |
| Review room usage | Review room usage | `Room`, `Booking` | Administrator goal based on usage data |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Student directly associated with Send confirmation; combined Block / unblock room. | Removed student-confirmation association, justified the include, and separated Block room / Unblock room. | R4 and distinct US-04 / US-05 goals. |
| 2 | class | `Student 1 — 1..* Booking`; `Room *-- Booking`; service class mixed into domain model. | `1` to `0..*` associations, plain Room–Booking association, domain-only classes, status and end-time attributes, R2 note. | Correct multiplicities, avoid unjustified composition, and model R1–R3 explicitly. |
| 3 | sequence | Save occurred without visible rule validation; generic alt branches. | Validation before persistence, R1/R2/R3 checks, guarded branches, no save on failure, R4 confirmation. | Sequence review requirements SQ2–SQ7. |
| 4 | activity | One combined `Can book?` decision. | Three sequential decisions for R1, R3, and R2; rejection on every failure path. | The handout requires one decision per rule, labelled guards, and creation only after the last check. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  6 prompts pasted in §2
LR3  PASS  3 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 4 assumption(s) declared
LR5  PASS  4 behaviour-diagram findings in §5
LR6  PASS  5 critique issues with a verdict
LR7  PASS  4 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

Both behaviour diagrams present - the optional extension; both were checked.

SUMMARY pass=43 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none; the latest checker run reports 43 PASS, 0 FAIL, and 0 ERROR.

---

## 10. Conclusion (120–180 words)

The class diagram required the most correction. The first draft used `1..*` on the Booking end of Student–Booking, which would incorrectly require every student to have at least one booking, and used composition between Room and Booking without a requirement that booking lifetime be owned by a room. The revised model uses `0..*` bookings per student and per room, keeps each booking associated with exactly one student and one room, and states R2 as a note because multiplicity cannot express temporal non-overlap. The most consequential behavior error would have reached implementation if booking persistence happened before validation: invalid time ranges, blocked rooms, or overlapping bookings could be saved. Both behavior diagrams now check R1, R3, and R2 before creating a booking and return confirmation only on success. The critique correctly highlighted the confirmation actor link and unjustified composition. Its suggestion that both behavior diagrams should be removed was rejected as a grading requirement: the handout permits both as an optional extension, and both were explicitly requested. The critique was not independent because it occurred in the same conversation.