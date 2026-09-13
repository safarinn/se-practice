# Week 01 — Manual vs AI: Comparison

**Name:** Nurali Muratov
**Group:** Monday 16:00
**Date:** 13.09.2026

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | python| Next.js and TypeScript|
| Time to first version that ran | 25 min | 10 min |
| Time to all 4 test cases passing | 30 | 10|
| Number of attempts / prompts needed | 5 | 4|
| Lines of code you actually wrote | 40 | 0 |
| Did it handle invalid marks (case B)? |yes | yes|
| Did it handle an empty list (case D)? | yes| yes|
| Did it use the ≥ 50 pass threshold? | yes| yes|
| Output format matches the spec? | yes| almost|
| Can you explain every line of it? | yes| no|

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | | | avg 67.00 · high 92 · low 23 · pass 60.0% | yes|
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | | | avg 71.60 · high 100 · low 47 · pass 80.0% |yes |
| C | `10, 20, 30` | | | avg 20.00 · high 30 · low 10 · pass 0.0% |yes |
| D | `abc, , xyz` | | | clear message, no crash | yes|

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

-Class name, subject , assessment, total marks , pass mark threshold , student name and  mark placeholder are added . Next .js 


## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

-It creates some collision in grouping by class. For example : you input 3 assessments by 10B grade and then 1 mark for 10A class it calculated it as one class, but in fact one of them is other class , because of it the average and min max statistics were changed.
-
input : 10B grade - 10 20 30 , 10A grade - 5 
output avg: 16,25 expected for 10A: 20
## 5. The defect I asked Rocket to fix

**Prompt I used:**
can you fix grouping by class because now it doesnt divide inputs by classes when i change name from 10b to 10a it just add by one to the list of assessments and only change the name of class you should fox it like this that each class should get their own statistics

**Result:** (fixed / partly fixed / broke something else)
fixed 

**What this tells me:**
it tells me that more precise prompt can fix any bugs in my code
---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?



<!-- Write your reflection below this line -->

During this experiment, AI genuinely helped me speed up some parts of the work. It was especially useful for explaining programming concepts, suggesting a basic structure for the program, and helping me understand how to handle input data. Instead of spending a long time searching for simple syntax or examples, I could ask AI and quickly get an explanation that helped me continue working.
However, AI also cost me some time. Some of its suggestions looked correct at first, but they did not always match the exact requirements of the task. For example, I had to check how invalid values should be handled and test the program myself. I learned that code that looks reasonable is not necessarily correct. I needed to run different test cases and compare the results with the expected output.
Of the two artefacts, I would be willing to put my name on the final version that I tested and corrected myself. I would not want to submit an AI-generated version without checking it, because I am responsible for understanding how my code works. The final result should represent my own understanding, even if AI helped me during the process.
After this experiment, I think a human engineer must still be responsible for understanding the requirements, checking whether the solution is actually correct, testing edge cases, and making the final decisions. AI can help write or explain code, but it cannot replace human responsibility. The engineer must verify the result and be able to explain and defend the decisions made in the project