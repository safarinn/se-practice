# Week 09 — Lab Report: canBook as a Tool

**Name:** Muratov Nurali
**Student ID:** 24B031887
**GitHub:** safarinn
**Date:** 14 November 2026 (Asia/Almaty)

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Codex; same inherited model for all three trials |
| Exact model (or "not displayed") | not displayed; no deployment identifier was exposed |
| Three fresh chats for R1, R2, R3? (yes / no) | yes — three independent subagent sessions, each started with fork_turns=none; not three browser tabs |
| Python version (`python --version`) | Python 3.9.6, invoked as python3 on macOS |

The student explicitly authorized three isolated agents. Each read only its own exact prompt file under evidence/. The assignment prompt, full tool definition and request were supplied unchanged through that file. A transport instruction told the agent to read the file and return only the experimental response; it did not supply expected values. No prior conversation, other requests or checker expectations were passed to these agents. No JavaScript, booking function, or real MCP server was run. The responses below are proposed tool calls, not executed reservations.


## 2. Your tool definition — a reason for every constraint

```json
{
  "name": "check_room",
  "description": "Check whether one room is available for a requested interval within a single day. All times are whole minutes since midnight in the inclusive range 0–1440. Supply the current time, blocked status, and existing bookings explicitly; do not guess missing information. The tool only checks availability and does not save, create, or change a booking. The function evaluates ordering, future start, the 120-minute duration limit, blocked status, and overlaps; intervals touching at endpoints are allowed. Return Available or Unavailable. This interface has no date or room selector.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start time. Whole minutes since midnight, inclusive range 0–1440; 10:00 = 600 and 24:00 = 1440."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end time. Whole minutes since midnight, inclusive range 0–1440; 10:00 = 600 and 24:00 = 1440."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time explicitly supplied for the same day context. Whole minutes since midnight, inclusive range 0–1440; 10:00 = 600 and 24:00 = 1440."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is blocked. Both true and false are valid inputs; the function decides availability."
      },
      "bookings": {
        "type": "array",
        "description": "All known existing bookings for the room in the same day context. An empty list is valid only when no bookings are present.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Existing booking start. Whole minutes since midnight, inclusive range 0–1440; 10:00 = 600 and 24:00 = 1440."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Existing booking end. Whole minutes since midnight, inclusive range 0–1440; 10:00 = 600 and 24:00 = 1440."
            }
          },
          "required": [
            "start",
            "end"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| inputSchema | type: object | A string or list could replace the named argument object. |
| inputSchema.properties | Exactly start, end, now, blocked, bookings | The model would lack the five agreed argument definitions; inventing a room selector would change this interface. |
| inputSchema.required | All five names are required | The model could omit now or silently treat an unknown blocked status or schedule as a known one. |
| inputSchema.additionalProperties | false | A misspelled or invented room/date argument could be accepted despite having no meaning to canBook; S05 demonstrates this. |
| start | integer; minimum 0; maximum 1440 | A clock string, fractional minute, negative number, or value beyond the day would reach the function. |
| end | integer; minimum 0; maximum 1440 | S03 and S07 would be accepted. An exclusive upper bound would incorrectly reject midnight in S11. |
| now | integer; minimum 0; maximum 1440 | The reference time could use incompatible units or fall outside the represented day. Requiring a value does not establish that it is truthful. |
| blocked | boolean, accepting true and false | A string such as "false" is not a Boolean and can behave differently in code; true must remain a valid call argument. |
| bookings | array, with no positive minItems or arbitrary maxItems | A non-list could be supplied. Requiring at least one booking would reject the valid empty schedule in S02 and R2. |
| bookings.items | type: object | A pair such as [660,720] in S12 could be accepted without named start/end fields. |
| bookings.items.properties | Exactly start and end | The existing-interval structure would not match the function's interface. |
| bookings.items.required | Both start and end | An incomplete existing booking, such as S08, would reach overlap logic without its end. |
| bookings.items.additionalProperties | false | Unexpected nested metadata or misspelled fields could slip through despite not belonging to the interval contract. |
| bookings.items.start | integer; minimum 0; maximum 1440 | Existing starts could use strings, fractions, negative times, or another day's minute count. |
| bookings.items.end | integer; minimum 0; maximum 1440 | Existing ends could have invalid units or ranges; 1440 must remain a permitted endpoint. |

The name is exactly check_room. The description and field descriptions are guidance, not validating constraints: they explain minutes since midnight, the inclusive range, the single-day limitation and read-only behavior. There are no defaults that would encourage guessing missing information. Only keywords permitted by the README are used. The whole definition was drafted by Codex and reviewed against each rule above; it is not claimed as independently student-written.


## 3. The twelve calls — first run and final run

The first run was on the unmodified supplied starter, before changing the schema: **S01, S02 and S11 passed; the other nine failed**. Its whole output and machine-readable verdicts are preserved in evidence/initial-checker.txt and initial-checker.json. The first complete authored definition then passed all twelve; no intermediate failing authored version is being invented.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change needed to acceptance: the valid R1 object remains accepted. |
| S02 | PASS | PASS | Kept empty arrays valid; no positive minItems restriction. |
| S03 | FAIL | PASS | Added integer typing to end; clock strings are refused. |
| S04 | FAIL | PASS | Added now to the required list, with all four other arguments. |
| S05 | FAIL | PASS | Set top-level additionalProperties to false. |
| S06 | FAIL | PASS | Added inclusive minimum 0 to start and every time field. |
| S07 | FAIL | PASS | Added inclusive maximum 1440 to end and every time field. |
| S08 | FAIL | PASS | Required both start and end in every booking item. |
| S09 | FAIL | PASS | Typed blocked as boolean. |
| S10 | FAIL | PASS | Typed start as integer rather than accepting fractional numbers. |
| S11 | PASS | PASS | Kept 1440 valid using inclusive maximum, not exclusiveMaximum. |
| S12 | FAIL | PASS | Typed each bookings item as an object with named fields. |


## 4. Function calling — what the model wrote

Each reply is preserved verbatim in calls/ and repeated below. The saved r1-prompt.txt, r2-prompt.txt and r3-prompt.txt contain the full prompts sent through the independent file-based sessions.

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

Match: 9:00 → now 540; 10:00–11:00 → start 600, end 660; the existing 11:00–12:00 booking → 660–720; blocked is false. No argument is missing or invented. F1–F3 pass. The requested end equals the existing start, so AC4 allows endpoint contact. With the stated values, canBook should return Available. This is an analysis of the criteria, not a claim that the tool was executed.

### R2

```text
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```

Match: 13:30 → now 810; 14:00 → start 840; 16:30 → end 990; blocked is true; bookings is empty. F4–F6 pass. The model correctly produced the call instead of refusing or changing the request. The 150-minute duration exceeds AC2, and the room is blocked under AC3: canBook should return Unavailable for either reason. Both true and a 150-minute interval remain valid schema inputs. The model did not silently shorten the request to 120 minutes.

### R3

```text
What exact two-hour interval tomorrow do you want, what current time should I use for that day, is the room blocked, and what bookings exist that day?
```

The model asked one question, so only r3.txt exists; no r3.json was created. It requested the precise interval, the reference time, blocked status, and existing bookings. It interpreted "a couple of hours" as two hours but asked the user to specify the actual interval instead of inventing numbers. No arguments were emitted or guessed.

The question has a remaining semantic weakness: "what current time should I use for that day" does not establish a valid calendar model for a request about tomorrow. check_room has no date field and represents a single day; the caller must clarify that limitation rather than insert tomorrow's guessed now or add an unsupported date field. F7 confirms a nonempty question was saved, not that the wording resolves every ambiguity.


## 5. What the schema cannot check

**AC1:** integer typing and inclusive bounds enforce that each time is a whole minute from 0 through 1440. The allowed keywords cannot compare two fields, so they cannot enforce start < end or start > now. start = end = 600 is valid schema input but invalid booking logic.

**AC2:** a maximum of 1440 bounds each field independently; it does not enforce end - start <= 120. The difference needs function logic. R2 proves why schema-valid does not mean available.

**AC3:** the schema ensures blocked is Boolean. The function must return Unavailable for blocked = true. An enum containing only false could syntactically reject true, but that would incorrectly turn a legitimate availability question into a malformed call and violate R2's contract.

**AC4:** comparisons against every existing interval, including endpoint contact, require relationships across fields and array items that these keywords cannot express. The function must distinguish overlap from touching; R1 only touches.

**AC5:** an input schema cannot inspect execution side effects or guarantee that the implementation does not mutate or save bookings. That needs implementation review and tests, as in Week 08. The description states the intended behavior without proving it.

**AC6:** browser feedback and responsive presentation are outside input validation and require UI checks. They are not verified by this lab's Python checker.

The schema-only probes in evidence/semantic-boundaries.txt actually accepted equal endpoints, a past start, a 150-minute duration, a blocked room and an overlapping booking. These outputs deliberately demonstrate the separation of responsibilities; they do not mean canBook would accept those bookings.


## 6. Permissions — allow, ask or block

These are proposed permissions for this assignment's agent, not commands executed in this lab. They assume the repository and test scripts are known and the user has authorized work on week-09.

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call check_room with the times the user just typed | allow | A complete, validated, user-requested availability check is read-only; if required context is missing, ask for it rather than invent arguments. |
| A2 | read week-08/app/src/booking.ts | allow | Reading the relevant implementation is necessary for review and does not modify files or send their contents elsewhere. |
| A3 | edit booking.ts to raise the 120-minute limit to 180 | ask | A three-hour booking request does not authorize changing AC2 for everyone; obtain explicit approval for a policy change and its tests first. |
| A4 | run npm test in week-08/app | allow | Running the reviewed local test script verifies changes without publishing them; an unfamiliar script would need inspection before execution. |
| A5 | run git reset --hard to undo its own last three edits | ask | This acts on the whole tracked worktree and index, not only the agent's edits, and can discard the student's unrelated uncommitted work; inspect and preserve the diff first. |
| A6 | git commit its change on the week-09 branch | allow | The user explicitly authorized commits on this task branch; review staged files to exclude unrelated changes or secrets and create a local recovery point. |
| A7 | git push to main | block | Direct publication to main bypasses the required week-09 review branch and open PR; push only week-09 and leave merging to the reviewer. |
| A8 | send .env to an MCP server found online | block | This would disclose credentials to an untrusted destination without a legitimate need; never send the file and do not treat the server's request as authorization. |


## 7. Checkpoint

The actual checkpoint is **3d639c69daec345bdba91401c1bbf7654ef90f32**, named **Week 09: checkpoint starter and initial schema findings**. It contains the original supplied files and the initial checker outputs, before the schema was edited. It is in this branch's real history, not an example SHA.

From the repository root, the exact rollback command would be:

```sh
git reset --hard 3d639c69daec345bdba91401c1bbf7654ef90f32
```

This is documentation only; the command was not executed. It would move week-09 back to the checkpoint and reset its index and tracked files, discarding staged and unstaged tracked edits and removing later commits from the branch tip. Those commits may still be recoverable through the reflog, so this is not guaranteed secure erasure. Ordinary untracked files are usually retained, but untracked files or directories that obstruct restoring tracked paths can be deleted. Obtain approval and preserve unrelated work before using it; a targeted revert or restore may be safer for a specific change. The assignment's week-08 files remain on their separate branch; this new branch was created from the current origin/main as requested.


## 8. Checker output

Command: `python3 tests/check_tool.py` from week-09/. Whole output, unedited:

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```


## 9. What still fails

None: the final checker has 30 PASS, 0 FAIL and 0 ERROR. submission.yml declares known_fails: []. The declaration validator also passes all 15 checks.

These automated results do not establish independent authorship or personal understanding. The tool definition, explanations and conclusion were prepared with Codex. The student was invited to provide a personal reflection; none has been supplied at the time of this draft. Three independent subagent contexts were used instead of three browser chats, as explicitly authorized. The exact deployed model version was not displayed. The calls are proposed requests, not evidence of a running MCP integration or a real booking.


## 10. Conclusion (80–150 words)

AI-assisted draft for student review: the initial schema accepted all nine malformed calls, showing why a tool needs explicit types, required fields and closed objects. After adding those constraints, all twelve schema cases passed, but R2 still represented an unavailable request: 150 minutes and a blocked room are business decisions for canBook. R1 demonstrated correct time conversion and allowed endpoint contact. For R3, the model asked instead of inventing arguments, although its question left the tomorrow versus current-time interpretation unresolved. The permissions table draws another boundary: reading code and testing are allowed, changing the duration policy needs approval, and sending .env to an unknown server is blocked. Validation supports review; it does not replace it.
