# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude Code | Claude Opus 5.5 | 2026-11-22 | codebase analysis (Task 1), in a read-only subagent (report 8.1) | none |
| Claude Code | Claude Opus 5.5 | 2026-11-22 | review of the improvement plan, same read-only subagent (report 8.2) | none |
| Claude Code | Claude Opus 5.5 | 2026-11-22 | draft of `filter.test.ts`, in a read-only subagent (report 8.3); the draft was corrected before use | none (the text was pasted in by Claude Code) |
| Claude Code | Claude Opus 5.5 | 2026-11-22 | most of the work in the main session: setup and baseline, `rooms.ts`, `filter.ts`, `checkRoom`, the `checkRoom` tests, the `App.tsx` and CSS changes, the browser check and the five screenshots, the diagrams, `app/README.md`, and the text of report.md sections 1–9 | `app/src/*`, `app/README.md`, `diagrams/*`, `evidence/*`, `report.md` §1–§9, `AI_USAGE.md` (this table), `submission.yml` (facts) |
| Claude Code | Claude Opus 5.5 | 2026-11-22 | bullet points of facts for report.md §10; the reflection text itself is written by me | none |

<!-- Delete rows you did not use the assistant for; add rows for anything else. The optional
     extension (an existing skill or a read-only MCP server) goes here too, with its permissions. -->

**The assistant wrote, or helped write, tests in `app/`:** yes — Claude Code wrote the `checkRoom` tests and added B1–B4 to four week-08 test titles in `booking.test.ts`; a subagent drafted `filter.test.ts`, which was corrected (8.3). Every expected value was checked by hand against AC1–AC5 and F1–F5 (6.1), and the new tests failed before `checkRoom` and `filterRooms` existed.
<!-- Either answer is allowed. If "yes": which tests, and how you checked that their EXPECTED values
     come from AC1–AC5 and F1–F5, not from what the code happens to return. -->

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes 

**Every number in report.md section 7 was measured the way its row says:** yes 

**I shared no credentials, keys or private data with any tool:**  yes
**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes 

**Anything I accepted from the AI without fully understanding it:** nothing

Signed:Muratov Nurali
Date: 22.11.2026
