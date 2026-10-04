# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

- **Overlap:** a booking that ends exactly when another begins is **allowed** under R3, because the
  bookings do not overlap.

- **Duration:** a booking of exactly two hours is **allowed** under R2, because R2 states that a
  booking lasts at most 2 hours.

- **Further assumption:** a student can cancel only their own existing booking.

---

## US-01 — View room availability

### AC-01

- **Given** a room is available during the selected time
- **When** the student views room availability
- **Then** the system shows the room as available

### AC-02

- **Given** a room already has a booking during the selected time
- **When** the student views room availability
- **Then** the system shows the room as unavailable

### AC-03

- **Given** a room is blocked by an administrator
- **When** the student views room availability
- **Then** the system shows the room as unavailable

---

## US-02 — Book room

### AC-04

- **Given** a room is available and the requested booking starts in the future
- **When** the student books the room for exactly two hours
- **Then** the system accepts the booking

### AC-05

- **Given** a room already has a booking that overlaps the requested time
- **When** the student tries to book the room
- **Then** the system rejects the booking and reports that the room is unavailable

### AC-06

- **Given** the requested booking starts in the past
- **When** the student tries to book the room
- **Then** the system rejects the booking and reports that the booking must start in the future

---

## US-04 — Block room

### AC-07

- **Given** an administrator selects an available room
- **When** the administrator blocks the room
- **Then** the system marks the room as blocked and prevents new bookings

### AC-08

- **Given** a room is already blocked
- **When** the administrator tries to block it again
- **Then** the system keeps the room blocked and does not create a duplicate block

### AC-09

- **Given** a student tries to block a room
- **When** the student submits the block action
- **Then** the system rejects the action because only an administrator can block rooms