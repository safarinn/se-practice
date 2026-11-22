# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude Code | Claude Opus 5.5 | read-only risk review (Task 2), in a read-only subagent | none — "WITHOUT editing files" |
| Claude Code | Claude Opus 5.5 | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, applied by Claude Code with two modifications |
| Claude Code | Claude Opus 5.5 | refactor proposal for R2 (Task 8), in a read-only subagent; applied by Claude Code | `app/src/booking.ts`, `app/src/App.tsx` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes


**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** yes — Claude Code (Claude Opus 5.5) drafted. Earlier course work used Codex (GPT-6).


**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes (colour codes removed; in §6.1 only the inner code fence was changed so the Markdown block stays closed)

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes 

**Anything I accepted from the AI without fully understanding it:**
- `app/src/booking.ts` `toRequest` (the R2 refactor): I understand that it turns the form times into minutes and that the R2 test checks it, but I did not follow every line of the "Ends at 24:00" handling myself.
- `lab-report.md` §5.1, rows 3c and 3d: I accepted the `no` for "integration checks" and "reviewable evidence" mostly from the README's table, without being fully sure where the line between a unit and an integration test is.
- `lab-report.md` §4.1, the likelihood scores: the impact scores are clear to me, but for some likelihoods (R2 = 2, R5 = 2) I took the assistant's judgement rather than reasoning them out myself.

Signed:Muratov Nurali
Date:22.11.2026
