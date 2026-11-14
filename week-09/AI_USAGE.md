# AI Usage Disclosure — Week 09

AI-use level D: AI-integrated, with explicit disclosure.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex, three independent subagents | not displayed; same inherited model, no override | Part 2 — writing the calls for R1, R2, R3 in separate fresh contexts | No files edited by the trial agents; parent saved replies verbatim in calls/ |
| Codex parent assistant | not displayed; deployment identifier unavailable | Schema drafting, constraint review, Python checks, permissions analysis, report and declaration, commits and PR | tool/check_room.json, lab-report.md, AI_USAGE.md, submission.yml, calls/ and evidence/ |

**I wrote tool/check_room.json myself:** no. Codex drafted the complete definition. The parent reviewed every constraint against the interface and ran the supplied S01–S12 checks. The student's independent understanding is not asserted.

**I used AI to explain a JSON Schema keyword or a check:** yes. Codex explained required, additionalProperties, integer bounds and nested items in report section 2, and the shape-versus-meaning distinction in section 5.

**Every reply in calls/ and report section 4 is exactly what the model returned:** yes. No incorrect values or wording were repaired. A terminating file newline was added; the response text was preserved. Each trial used fork_turns=none and read only its own prompt file. The user explicitly authorized this independent-agent approach.

**Every terminal output in the report was pasted from a real run, unedited:** yes. Complete captured outputs and JSON verdicts are retained under evidence/. The initial nine schema failures are preserved.

**Anything accepted without fully understanding it:** personal student review remains pending for the schema, permissions decisions, rollback consequences and conclusion. Sections 8–10 were prepared by the parent assistant, not independently written by the student. No student signature or personal understanding is asserted.

**Timing:** commits use their actual execution times. The user requested spacing of roughly ten minutes; no author or committer dates were backdated. Time between commits is not represented as independent student effort.

Signed: Codex (AI preparation only; Muratov Nurali's personal review and signature are pending)
Date: 2026-11-14, Asia/Almaty
