# AI Usage Disclosure — SIS #03

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| ChatGPT (Codex Work Mode) | GPT-6, as recorded in Week 05 | Plan and Python v1 (B1, B2), the inherited tests | code/original/booking_v1.py, code/booking.py, code/test_booking.py | week-05 |
| Codex | GPT-6 | Earlier work on this SIS: added the T11 test, hints while I rewrote sections 2–6 | code/test_booking.py, report.md | this SIS |
| Bolt.new | not displayed | Web v1 from the section 4 prompt; two repair prompts (section 7, B4) | web/original/, web/final/ (exported through github.com/safarinn/sis03-bolt) | this SIS |
| Claude (chat, new conversation) | Opus 5.5 | Review of can_book and the page against AC1–AC6 | none — I checked its claims myself in section 8 | this SIS |
| Claude Code | Claude Opus 5.5 | Hints for sections 7–9; wording of the cells in sections 7–9 from my results; grammar fix of my reflection; copied the Bolt export to web/final; ran the page tests T1–T12 in its browser; filled sections 5 (page final), 6, 11 (format) and 13; updated submission.yml | report.md, web/final/, evidence/final-narrow.jpg, evidence/web-v1.png, submission.yml, AI_USAGE.md | this SIS |

**The assistant wrote, or helped write, my tests in code/:** yes. The tests come from week-05 (AI-assisted) and Codex added test_same_check_twice_is_stable. Expected values come from AC1–AC5.

**code/original/ and web/original/ hold the AI's first versions exactly as returned:** yes. code/original/booking_v1.py is the week-05 v1. web/original/ is the Bolt export before any repair prompt.

**Every result in report.md section 5 was actually run or seen, not assumed:** yes. Python results come from the checker run. Page v1 results come from my own tests. Page final results were run on 2026-11-19 by Claude Code in a browser on the local web/final export, while I watched; I had already seen T3 and T10 myself in Bolt.

**Everything I submitted, I can explain and defend in class — including the overlap condition and what the agent did in section 9:** yes. Overlap: `start < booked_end and end > booked_start`, so touching ends are allowed.

**Anything I accepted from the AI without fully understanding it:** The English wording in sections 7–9 and the format of section 11 were prepared by Claude from my results; I checked that they say what happened. Section 10 is my text; Claude fixed grammar and two places where the meaning was reversed. Section 2 was rewritten after the first submission, not before any AI exchange.

Screenshots are direct captures with no editing. web-v1.png is the same image as before-1.png.

Prepared by: Muratov Nurali.
Date: 2026-11-19
