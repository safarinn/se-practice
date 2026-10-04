# AI Usage Disclosure — Week 04

Required by the course academic policy (Generative AI use level **D** — AI-integrated). You are
responsible for the accuracy of everything you submit, including every diagram an AI drafted.

| Tool | Exact model | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-5.6 Luna | First drafts and revisions for the use-case diagram | `models/original/use-case.puml`, `models/use-case.puml` |
| ChatGPT | GPT-5.6 Luna | First drafts and revisions for the class diagram | `models/original/class.puml`, `models/class.puml` |
| ChatGPT | GPT-5.6 Luna | First drafts and revisions for sequence and activity diagrams | `models/original/sequence.puml`, `models/sequence.puml`, `models/original/activity.puml`, `models/activity.puml` |
| ChatGPT | GPT-5.6 Luna | Drafted worksheet content and critique checklist | `lab-report.md` |
| ChatGPT | GPT-5.6 Luna | Drafted the machine-readable declaration | `submission.yml` |

**The files in `models/original/` are the AI's first replies, unedited:** yes. They were created as files in this completion, not copied from literal standalone prompt replies.
**The revised diagrams in `models/` were corrected by me, and I can explain every element:** no — this is an AI-prepared draft. I must review the diagrams and report and be able to defend the modeling choices before submitting.

**Did an AI write any part of `lab-report.md` other than the critique it produced?** yes — AI drafted the report sections and consistency/change-log tables; I must verify them against the final files and course expectations.
**Anything I accepted from the AI without fully understanding it:**
- The diagrams use `BookingStatus` with `ACTIVE` and `CANCELLED`; verify that this domain detail is acceptable for the course.
- The interval assumption is half-open `[start, end)`; confirm that it matches the declared decision that touching bookings are allowed.
- The local PNGs are Graphviz previews, not PlantUML-rendered images; replace them with genuine PlantUML renders before submission.

Signed: Nurali Muratov
Date:2026-10-04
