# Student marks analysis

students = {
 "Alice": 85,
 "Bob": 72,
 "Charlie": 91,
 "David": 64,
 "Eva": 78
}

# Calculate statistics
marks = list(students.values())
average_mark = sum(marks) / len(marks)
highest_mark = max(marks)
lowest_mark = min(marks)

# Function to assign grade
def get_grade(mark):
 if mark >= 90:
   return "A"
 elif mark >= 80:
   return "B"
 elif mark >= 70:
   return "C"
 elif mark >= 60:
   return "D"
 else:
   return "F"

# Print analysis
print("Student Marks Analysis")
print("-" * 25)
print(f"Average mark: {average_mark:.2f}")
print(f"Highest mark: {highest_mark}")
print(f"Lowest mark: {lowest_mark}")
print()

print("Individual Grades:")
for student, mark in students.items():
 grade = get_grade(mark)
 print(f"{student}: {mark} -> Grade {grade}")
