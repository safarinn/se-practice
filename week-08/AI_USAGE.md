# AI Usage Disclosure — Week 08

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex independent agent /root/without_skill | GPT-6; exact deployment version not displayed | Diagnosis without skill, fresh context | evidence/without-skill.md only |
| Codex independent agent /root/with_skill | GPT-6; exact deployment version not displayed | Diagnosis using supplied skill text, fresh context | evidence/with-skill.md only |
| Codex parent assistant | GPT-6; exact deployment version not displayed | Setup, tests, minimal fixes, execution, report, archive and PR | Week 08 deliverables except unchanged assignment source/checkers |

**SKILL.md was typed by me from the deck, not generated:** no. Codex copied the exact supplied text programmatically and created the ZIP.

**I applied the patches myself:** no. Codex changed the comparison line and removed bookings.push in separate commits after reviewing both diagnoses, then ran focused and full tests.

**I used another assistant for explanation/report drafting:** yes. The parent Codex assistant drafted all report sections, including hypotheses, comparison, limitation and conclusion. The hypotheses were documented after the independent responses, not authored by the student before asking an assistant.

**Every terminal output is from a real run, unedited:** yes. Raw stdout/stderr files are in evidence; enclosing report labels are separate.

**I can explain both bugs without the assistant:** not yet confirmed by the student. This declaration does not assert personal understanding or an independent signature.

**Anything accepted without fully understanding it:** student review is pending for the two patches, regression fixtures and report reasoning.

The two comparison agents were explicitly authorized by the student and started with fresh contexts. Only the second read the supplied skill. This was a prompt-only simulation, not native installation. install.png is a genuine screenshot of the archived record in TextEdit; it is not a live chat screenshot or installation confirmation.

Prepared for: Muratov Nurali. Date: 2026-11-08. Student review/signature pending.
