# AI Usage Disclosure — SIS #03

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| ChatGPT (Codex Work Mode) | GPT-6, as recorded in Week 05 | Plan, original Python and tests | code/original/booking_v1.py, code/booking.py, inherited tests | week-05 |
| Lovable (student-reported) / Atoms (export metadata) | not displayed | Original incomplete web prototype | web/original/ | week-06 |
| Codex | GPT-6; runtime variant not displayed | Baseline draft, review, local page repair, test extension, report/disclosure/declaration preparation, Git work | report.md, code/test_booking.py, web/final/, evidence/, AI_USAGE.md, submission.yml | this SIS; final starts from week-06 Codex recovery |
| Bolt.new | not displayed | Fresh generation attempt; account dialog prevented a project | No generated source obtained | this SIS |

**The assistant wrote, or helped write, my tests in code/:** yes. All inherited tests and the added test_same_check_twice_is_stable are AI-assisted. Contract expected values come from AC1–AC5; 120 is accepted, 121 rejected, touching allowed, starts-now rejected, and repeated checks must not mutate inputs. Two inherited non-integer diagnostic tests are explicitly outside the contract. Student independent review remains pending.

**code/original/ and web/original/ hold the AI's first versions exactly as returned:** no, full provenance cannot be certified. Files are byte-for-byte copies of the saved Week 05/06 originals, but the web export is incomplete and its tool metadata conflicts. No original was repaired or replaced.

**Every result in report.md section 5 was actually run or seen, not assumed:** yes. Python results came from actual checker calls; final page results from browser interactions; original page is Not testable because its UI is absent. Mobile result was observed in a 375px iframe.

**Everything I submitted, I can explain and defend in class — including the overlap condition and what the agent did in section 9:** no; student understanding has not been confirmed.

**Anything I accepted from the AI without fully understanding it:** Student understanding is not yet verified. Review code/booking.py, the added T11 test, web/final/availability.js and report sections 8–10. Baseline and reflection are explicitly AI-assisted drafts, contrary to the assignment's independent-writing requirement. No student signature is substituted.

Screenshots are direct browser captures with no postprocessing. web-v1.png is an unchanged inherited capture. before-1.jpg compares the Week 06 recovery starting point, not the incomplete original. final-narrow.jpg is a direct capture of a real 375px frame, not a resized desktop image.

Prepared for: Muratov Nurali. Student signature pending.
Date: 2026-11-01
