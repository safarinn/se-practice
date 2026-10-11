"""Run from se-practice after importing patches and reviewing the report.

Uses only the standard library. Does not edit the supplied checkers.
Refreshes captured output, measured counts, known_fails and the current commit.
"""
from pathlib import Path
import json
import re
import subprocess
import sys


def run(args, folder):
    result = subprocess.run(args, cwd=folder, capture_output=True, text=True)
    return result, result.stdout + result.stderr


def replace_block(text, section, output):
    section_start = text.index(section)
    start = text.index("```text\n", section_start) + len("```text\n")
    end = text.index("```", start)
    return text[:start] + output.rstrip() + "\n" + text[end:]


def main():
    folder = Path.cwd() / "week-05"
    if not (folder / "tests/check_booking.py").is_file():
        raise SystemExit("Run this script from the se-practice repository root.")
    head = subprocess.check_output(
        ["git", "rev-parse", "--short", "HEAD"], text=True
    ).strip()
    suite, suite_output = run([sys.executable, "-m", "unittest", "-v"], folder / "code")
    print(suite_output, end="")
    if suite.returncode:
        raise SystemExit("Suite failed. Resolve it before updating declarations.")
    report = folder / "lab-report.md"
    report.write_text(replace_block(report.read_text(), "### 8.1", suite_output))
    checker, checker_output = run([sys.executable, "tests/check_booking.py"], folder)
    report.write_text(replace_block(report.read_text(), "### 8.2", checker_output))
    # Report changed: run again, then paste the complete real output last.
    checker, checker_output = run([sys.executable, "tests/check_booking.py"], folder)
    report.write_text(replace_block(report.read_text(), "### 8.2", checker_output))
    machine, output = run([sys.executable, "tests/check_booking.py", "--json"], folder)
    measured = json.loads(output)
    counts = measured["counts"]
    failures = [r["id"] for r in measured["rows"] if r["verdict"] != "PASS"]
    declaration = folder / "submission.yml"
    content = declaration.read_text()
    for key, value in [("pass", counts["PASS"]), ("fail", counts["FAIL"]),
                       ("error", counts["ERROR"]), ("commit", '"' + head + '"'),
                       ("known_fails", "[" + ", ".join(failures) + "]")]:
        content = re.sub(r"(?m)^  " + key + r":.*$", "  " + key + ": " + str(value), content)
    content = re.sub(r"(?m)^  tests:.*$", "  tests: " + str(measured["measured"]["tests"]), content)
    declaration.write_text(content)
    evidence = folder / "evidence"
    evidence.mkdir(exist_ok=True)
    (evidence / "suite_final.txt").write_text(suite_output)
    (evidence / "checker_final.txt").write_text(checker_output)
    validator, validator_output = run([sys.executable, "tests/validate_submission.py"], folder)
    (evidence / "validator_final.txt").write_text(validator_output)
    print(checker_output, end="")
    print(validator_output, end="")
    if failures:
        print("Explain remaining checker IDs in lab-report.md section 9.1.")
    return 0 if checker.returncode == 0 and validator.returncode == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
