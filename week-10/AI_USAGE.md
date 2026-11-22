# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude Code | Claude Opus 5.5 | read-only risk review (Task 2), in a read-only subagent | none — "WITHOUT editing files" |
| Claude Code | Claude Opus 5.5 | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, applied by Claude Code with two modifications |
| Claude Code | Claude Opus 5.5 | refactor proposal for R2 (Task 8), in a read-only subagent; applied by Claude Code | `app/src/booking.ts`, `app/src/App.tsx` |
| Claude Code | Claude Opus 5.5 | most of the lab: setup, running commands and the page, the R2 test, screenshots, labels in §3.2, the register, the audit and the text of §2–§9 | `app/`, `evidence/`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |
| Claude Code | Claude Opus 5.5 | drafted §9.3 and the release decision and conclusion in §10, filled `submission.yml`, ran `check_audit.py` and `validate_submission.py` | `lab-report.md` §9.3 and §10, `AI_USAGE.md`, `submission.yml` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** no — Claude Code opened the files and ran the page, and wrote the labels; I read them afterwards.

**Every change to `app/` was reviewed by me as a diff before I accepted it:** no — Claude Code reviewed and applied the diffs; they are pasted in §6.3 and §8 for me to read.
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** yes — Claude Code (Claude Opus 5.5) drafted the text of lab-report.md §2–§10, including the §10 conclusion. Earlier course work used Codex (GPT-6).
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes (colour codes removed; in §6.1 only the inner code fence was changed so the Markdown block stays closed)

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes / no

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: <your name>
Date:
