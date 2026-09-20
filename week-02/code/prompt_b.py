def analyze_marks(marks, pass_mark=50):
 
 """
 Analyze a list of marks.

 Returns a dictionary with:
 - average: arithmetic mean
 - highest: maximum mark
 - lowest: minimum mark
 - pass_rate: fraction of marks >= pass_mark
 """

 if not marks:
   raise ValueError("marks list cannot be empty")

 if not isinstance(pass_mark, (int, float)):
   raise ValueError("pass_mark must be numeric")

 total = 0
 highest = marks[0]
 lowest = marks[0]
 passed = 0

 for mark in marks:
   if not isinstance(mark, (int, float)):
     raise ValueError("all marks must be numeric")
   if mark < 0 or mark > 100:
     raise ValueError("all marks must be in the range 0 to 100")
   total += mark
   if mark > highest:
     highest = mark
   if mark < lowest:
     lowest = mark
   if mark >= pass_mark:
     passed += 1

 return {
 "average": total / len(marks),
 "highest": highest,
 "lowest": lowest,
 "pass_rate": passed / len(marks),
 }

print(analyze_marks([-1, 50, 101], 50))