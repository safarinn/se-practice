# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Nurali Muratov
**Group:** Monday 16:00 - 19:00
**Date:** 20.09.2026

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant |Claude |
| Exact model name |Claude Opus 4.8 |
| Implementation language | Python|
| Date of the runs | 20.09.2026|

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
(paste here, or write "n/a — used Python")
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes 
- No follow-up questions were asked before Part 7: yes 
- Every output was saved **before** any editing: yes 

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1.Data format — used a hardcoded Python dictionary of name→mark instead of a file, list, or user input
2.Marks are integers on a 0–100 scale
3.Grade thresholds (A≥90, B≥80, C≥70, D≥60, F below) were invented; no grading scheme was given

**Questions it should have asked and did not:**

1.What input format and source should be used (file, list, dict etc), and does each student have one mark or several subjects?
2.What is the required grading scheme or pass threshold and rounding rule, and should results be printed or returned?

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called:

no — there is no analyze_marks function at all; the only function is get_grade(mark), and the analysis logic runs at module level

**First impression before testing** (one sentence — you will compare this with section 6 later):

 It looks like a tidy, runnable demo, but it's a self-contained toy script that answers a much narrower, more assumption-laden question than the one-sentence prompt actually asked
---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).
Return average, highest, lowest, and pass_rate in a dictionary. Accept marks
from 0 to 100; raise ValueError for an empty list, non-numeric values, or
out-of-range values. Use no external libraries. Return code plus a short
explanation

```

**What B fixed compared to A:**

1 Adds input validation for empty lists, non-numeric values, and out-of-range marks
2 Returns the required statistics in a dictionary.


**What B still leaves open:**

1.Whether `pass_rate` should be returned as a fraction or a percentage
2.Whether `pass_mark` should also be restricted to the 0 to 100 range

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark |yes |
| decimals | yes|
| custom pass_mark | yes|
| empty list | yes|
| text value |yes|
| below 0 / above 100 | yes|

**Do the AI's own tests pass against the AI's own code?** yes 

**Do they agree with the harness in section 6?**  no — if no, where do they disagree: The AI’s self-tests include an extra requirement: they also validate pass_mark must be numeric and between 0 and 100.
Section 6’s harness does not test invalid pass_mark at all.
Otherwise, the covered situations match the harness cases:
one mark - case 2
decimals - case 3
custom pass_mark - case 1 implicitly, but the harness has only the default 50 in the listed cases; the AI self-test uses 70
empty list - case 4
text value -  case 5
below 0 / above 100 ↔ case 6

**Assumptions C stated explicitly before the code:**
marks should be a non-empty iterable, typically a list.
Numeric marks are allowed as int or float, excluding bool.
pass_mark must also be numeric and in the range 0..100.
pass_rate is returned as a percentage rounded to 2 decimal places
---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).
Return average, highest, lowest, and pass_rate in a dictionary. Accept marks
from 0 to 100; raise ValueError for an empty list, non-numeric values, or
out-of-range values. Use no external libraries. Return code plus a short
explanation. Example: analyze_marks([40, 60, 80], 50) -> average 60, highest 80,
lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom
pass_mark, empty list, text value, and marks below 0 or above 100. State any
remaining assumptions before the code.

```

**What I deliberately added that A, B and C did not have:**

Exact function name analyze_marks(marks, pass_mark=50).
A precise output contract: average, highest, lowest, and pass_rate in a dictionary.
Explicit validation rules: empty list, non-numeric values, and out-of-range values must raise ValueError.
A concrete example with expected output values.
A request for tests covering six specific situations.
A requirement to state remaining assumptions before the code

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
The spec did not say whether pass_rate should be a fraction or a percentage, so I resolved it as a percentage because the example 66.67 matches that interpretation.

The spec did not specify rounding rules, so I implicitly resolved this by using the example’s two-decimal style.

The spec did not say whether pass_mark itself must be validated, so I added that validation in the implementation as a reasonable extension, but it was not explicitly required
---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 |ERROR | FAIL|PASS | PASS|
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 |ERROR |FAIL |PASS |PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR| FAIL| PASS| PASS|
| 4 | `analyze_marks([], 50)` | raises ValueError |ERROR | PASS| PASS| PASS|
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError |ERROR | PASS|PASS |PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError |ERROR |PASS |PASS |PASS |
| | **Totals** | |0 /6 | 3/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
A	1	Raised NameError: analyze_marks is not defined.
A	2	Raised NameError: analyze_marks is not defined.
A	3	Raised NameError: analyze_marks is not defined.
A	4	Raised NameError instead of the required ValueError.
A	5	Raised NameError instead of the required ValueError.
A	6	Raised NameError instead of the required ValueError.
B	1	Returned pass_rate: 0.6666666666666666 instead of 66.67.
B	2	Returned pass_rate: 1.0 instead of 100.
B	3	Returned pass_rate: 0.5 instead of 50.

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
Traceback (most recent call last):
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_a.py", line 43, in <module>
    analyze_marks([40, 60, 80], 50)
NameError: name 'analyze_marks' is not defined


FOR ALL CASES
```

**Prompt B**

```
(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_b.py
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 0.6666666666666666}
```

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_b.py
{'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 1.0}

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_b.py
{'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 1.0}

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_b.py
Traceback (most recent call last):
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_b.py", line 44, in <module>
    print(analyze_marks([], 50))
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_b.py", line 14, in analyze_marks
    raise ValueError("marks list cannot be empty")
ValueError: marks list cannot be empty

 File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_b.py", line 26, in analyze_marks
    raise ValueError("all marks must be numeric")
ValueError: all marks must be numeric

  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_b.py", line 44, in <module>
    print(analyze_marks([-1, 50, 101], 50))
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_b.py", line 28, in analyze_marks
    raise ValueError("all marks must be in the range 0 to 100")
ValueError: all marks must be in the range 0 to 100

**Prompt C**

```
All tests passed.
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_c.py
All tests passed.
{'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 100.0}

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_c.py
All tests passed.
{'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 100.0}

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_c.py
All tests passed.
Traceback (most recent call last):
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_c.py", line 124, in <module>
    print(analyze_marks([], 50))
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_c.py", line 33, in analyze_marks
    raise ValueError("marks must not be empty.")
ValueError: marks must not be empty.

  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_c.py", line 38, in analyze_marks
    raise ValueError("All marks must be numeric values.")
ValueError: All marks must be numeric values.

 File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_c.py", line 124, in <module>
    print(analyze_marks([-1, 50, 101], 50))
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_c.py", line 40, in analyze_marks
    raise ValueError("All marks must be between 0 and 100.")
ValueError: All marks must be between 0 and 100.
```

**Prompt D**

```
(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_d.py
All tests passed.
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_d.py
All tests passed.
{'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 100.0}

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_d.py
All tests passed.
{'average': 49.75, 'highest': 50, 'lowest': 49.5, 'pass_rate': 50.0}

(base) nuralimuratov@192 se-practice % /Library/Developer/CommandLineTools/usr/bin/python3 /Users/nuralimurat
ov/Desktop/SE/se-practice/week-02/code/prompt_d.py
All tests passed.
Traceback (most recent call last):
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_d.py", line 125, in <module>
    print(analyze_marks([], 50))
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_d.py", line 33, in analyze_marks
    raise ValueError("marks must not be empty.")
ValueError: marks must not be empty.

File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_d.py", line 125, in <module>
    print(analyze_marks([40, "60"], 50))
  File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_d.py", line 38, in analyze_marks
    raise ValueError("All marks must be numeric values.")
ValueError: All marks must be numeric values.

File "/Users/nuralimuratov/Desktop/SE/se-practice/week-02/code/prompt_d.py", line 40, in analyze_marks
    raise ValueError("All marks must be between 0 and 100.")
ValueError: All marks must be between 0 and 100.


```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) |0 |1 |2 |2 |
| Requirement coverage | 0| 2| 2| 2|
| Verifiability (tests) |0 |0 |2 | 2|
| Assumptions stated |0| 1|2 |2 |
| Noise (2 = none) | 0|2 | 1|1 |
| **Total / 10** | |0 | 6| 9| 9


**Prompt length, in words:** A __6__ · B __45__ · C __68__ · D __68__

**Words added per point gained** — B over A: 39 added words / 6 points gained = 6.5 words per point
C over B: 23 added words / 3 points gained = 7.7 words per point
D over C: 0 added words / 0 points gained = n/a

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)

Prompt C and D scored best at 9/10, and I would use that style at work because it is specific enough to be testable without being bloated. The single addition that bought the most correctness was adding the concrete example and explicit test list in Prompt C: it changed case 4, analyze_marks([], 50), from an under-specified situation into a clear ValueError requirement, and it also forced the model to handle cases 5 and 6 correctly. The pure noise was the extra student-grade example from Prompt A; it introduced unrelated grading logic and output formatting that was not part of the actual task. The main ambiguity was pass_rate: the spec did not say whether it should be a fraction or a percentage. I resolved it in Prompt C/D by treating it as a percentage, matching the example 66.67 for analyze_marks([40, 60, 80], 50). That choice also aligned the returned values for analyze_marks([49.5, 50], 50) as pass_rate: 50.0

```

**Word count:*172

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. Should specifications always state whether ratios like pass_rate are fractions or percentages?
2. When does extra validation, like checking pass_mark, become helpful rather than noisy?
