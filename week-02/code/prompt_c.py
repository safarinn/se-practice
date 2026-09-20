def analyze_marks(marks, pass_mark=50):
 """
 Analyze a collection of marks and return summary statistics.

 Args:
 marks: Non-empty iterable of numeric marks, each in range 0..100.
 pass_mark: Numeric threshold in range 0..100 for passing.

 Returns:
 dict with keys:
 - average
 - highest
 - lowest
 - pass_rate

 Raises:
 ValueError: If marks is empty, contains non-numeric values,
 contains values outside 0..100, or pass_mark is invalid.
 """
 if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)):
  raise ValueError("pass_mark must be a numeric value.")
 if not (0 <= pass_mark <= 100):
  raise ValueError("pass_mark must be between 0 and 100.")

 if marks is None:
  raise ValueError("marks must be a non-empty list of numeric values.")
 try:
  marks = list(marks)
 except TypeError:
  raise ValueError("marks must be an iterable of numeric values.")

 if len(marks) == 0:
  raise ValueError("marks must not be empty.")

 validated_marks = []
 for mark in marks:
  if isinstance(mark, bool) or not isinstance(mark, (int, float)):
   raise ValueError("All marks must be numeric values.")
  if not (0 <= mark <= 100):
   raise ValueError("All marks must be between 0 and 100.")
  validated_marks.append(mark)

 average = sum(validated_marks) / len(validated_marks)
 highest = max(validated_marks)
 lowest = min(validated_marks)
 passed = sum(1 for mark in validated_marks if mark >= pass_mark)
 pass_rate = round((passed / len(validated_marks)) * 100, 2)

 return {
 "average": average,
 "highest": highest,
 "lowest": lowest,
 "pass_rate": pass_rate,
 }

# -------------------
# Simple tests
# -------------------

def _assert_raises_value_error(func, *args, **kwargs):
 try:
  func(*args, **kwargs)
 except ValueError:
  return
 raise AssertionError("Expected ValueError was not raised.")

def run_tests():
 result = analyze_marks([40, 60, 80], 50)
 assert result == {
 "average": 60.0,
 "highest": 80,
 "lowest": 40,
 "pass_rate": 66.67,
 }

 # One mark
 result = analyze_marks([75])
 assert result == {
 "average": 75.0,
 "highest": 75,
 "lowest": 75,
 "pass_rate": 100.0,
 }

 # Decimals
 result = analyze_marks([49.5, 50.5, 100.0], 50)
 assert result == {
 "average": 66.66666666666667,
 "highest": 100.0,
 "lowest": 49.5,
 "pass_rate": 66.67,
 }

 # Custom pass_mark
 result = analyze_marks([40, 60, 80], 70)
 assert result == {
 "average": 60.0,
 "highest": 80,
 "lowest": 40,
 "pass_rate": 33.33,
 }

 # Empty list
 _assert_raises_value_error(analyze_marks, [])

 # Text value
 _assert_raises_value_error(analyze_marks, [50, "A", 70])

 # Below 0
 _assert_raises_value_error(analyze_marks, [-1, 50, 60])

 # Above 100
 _assert_raises_value_error(analyze_marks, [40, 101, 60])

 # Invalid pass_mark
 _assert_raises_value_error(analyze_marks, [40, 60], 120)
 _assert_raises_value_error(analyze_marks, [40, 60], "50")

 print("All tests passed.")

if __name__ == "__main__":
 run_tests()
