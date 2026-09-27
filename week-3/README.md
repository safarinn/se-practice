# Week 03 — Requirements Engineering with AI

## Project
Smart Campus Study Room Booking System

## Description
This project defines the requirements for a Smart Campus system that allows students to view and book study rooms and allows administrators to manage room availability and review usage.

## Actors
- Student
- Administrator

## Use Cases
- UC-01 — View availability
- UC-02 — Book room
- UC-03 — Cancel booking
- UC-04 — Block or unblock room
- UC-05 — Review usage
- UC-06 — Send confirmation

## Business Rules
- R1 — A booking must start in the future.
- R2 — A booking can last at most 2 hours.
- R3 — Bookings for the same room may not overlap.
- R4 — A blocked room cannot be booked.

## Requirements Artifacts

The `requirements/` folder contains:

- `user-stories.md` — user stories for the system
- `acceptance-criteria.md` — acceptance criteria for selected stories
- `use-cases.puml` — PlantUML use-case diagram
- `traceability.md` — traceability between use cases, stories, and criteria

## AI Usage

Generative AI was used as required by the course AI policy.  
Details are documented in:

- `AI_USAGE.md`

## Testing

The requirements checker is located in:

```text
tests/check_requirements.py