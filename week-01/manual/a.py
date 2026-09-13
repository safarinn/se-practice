def process(data):
    values=[]

    data = data.split(",")

    for i in data:
        i=i.strip()

        if i.isdigit():
            num = int(i)
            if 0 <= num <= 100:
                values.append(num)
       
    if len(values) == 0:
        print("No crash")
        return

    passed=0

    avg = sum(values)/len(values) 
    lowest = min(values)
    highest=max(values)

    for num in values:
        if num>=50:
            passed+=1

    pass_rate = passed /len(values) * 100

    print(f"Valid: {len(values)}")
    print(f"Average: {avg:.2f}")
    print(f"Lowest: {lowest}")
    print(f"Highest: {highest}")
    print(f"Pass Rate: {pass_rate:.1f}%")


process("85, 23, 45, 90, 92")
process("88, 47, -5, 101, abc, 73, 50, , 100")
process("10, 20, 30")
process("abc, , xyz")