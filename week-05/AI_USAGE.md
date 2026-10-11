# AI Usage Disclosure — Week 05

AI use level D. Prepared with AI; student verification has not been recorded.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT (Codex Work Mode) | GPT-6 | Plan and AC review | lab-report.md §2; evidence/plan.txt |
| ChatGPT (Codex Work Mode) | GPT-6 | First implementation and explanation | code/original/booking_v1.py; code/booking.py; lab-report.md §3 |
| ChatGPT (Codex Work Mode) | GPT-6 | All test cases, expected-value derivation, test expansion and runs | code/test_booking.py; lab-report.md §4–5, §8; evidence/ |
| ChatGPT (Codex Work Mode) | GPT-6 | Critique, draft judgments and change log | lab-report.md §6–7; evidence/critique.txt |
| ChatGPT (Codex Work Mode) | GPT-6 | Draft answers, AI-written conclusion and declaration | lab-report.md §1, §9–10; submission.yml |
| ChatGPT (Codex Work Mode) | GPT-6 | Packaging, local commits and submission guide | ZIP, local history, delivery instructions |

**The assistant wrote, or helped write, my tests in `code/`:** yes, all 33.
31 are contract tests. Expected decisions were derived from AC1–AC5 before
execution. Two observe outside-contract float/string behavior. Student verification
of expected values is still pending. All contract tests compare Boolean identity
and unchanged list contents. M1–M10 were run without inspecting faulty sources.

**`code/original/` holds the assistant's first answer exactly as returned:** yes.
No implementation edit was made; original and final bytes match.

**Everything I submitted, I can explain and defend in class:** no confirmation yet.
`honesty.can_explain_overlap_without_ai` is conservatively `no` until the student
can explain it independently. This is not a claim that the student cannot learn it.

**Anything I accepted from the AI without fully understanding it:**
Student review is pending for all generated code, tests and report judgments.
Do not certify understanding until personally reviewed.

The instructor's fixed prompts were applied by the assistant in the current
session; no claim is made that the student sent them unchanged in a separate chat.
The supplied README/checkers are kept unchanged. No debug prompt was needed.

**Authorship restriction:** lab-report.md §9.2, §9.3 and §10 are AI-written drafts.
The handout asks for the student's own answers. Rewrite them independently before
submission; the draft must not be presented as unaided student writing.

**History:** commits were actually created by ChatGPT during this preparation,
in a new local repository with no remote. The supplied patches preserve that
provenance. No GitHub PR was created, pushed or submitted to Teams.
The student then supplied their Week 04 GitHub report link. The assistant read
the report and adjacent declaration and filled GitHub safarinn, group Monday
16-19:00 and prior touching policy allowed; evidence/week04_source.txt records
the sources. Personal Week 05 review is still pending.

Prepared for: Muratov Nurali (24B031887)
Student signature: not yet supplied
Date: 2026-10-11
