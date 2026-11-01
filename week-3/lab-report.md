# Lab report — Practice #03, Requirements Engineering with AI

Name: Nurali Muratov

Student ID: [24B031887]

GitHub username: [safarinn]

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | ChatGPT |
| Exact model name and version | GPT-5.6 Luna |
| Date of the session | 27 September 2026 |
| Diagram renderer used | PlantUML  |

One tool and one model were used for all three prompts. I did not switch tools or models.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```text
# User stories — Smart Campus study room booking

### US-01

**Story:** As a Student, I want to view room availability, so that I can find a suitable study room.

**Priority:** High

**Assumption:** Room availability is shown for a selected date and time.

### US-02

**Story:** As a Student, I want to book an available room, so that I can use it for studying.

**Priority:** High

**Assumption:** A booking must start in the future and last no more than two hours.

### US-03

**Story:** As a Student, I want to cancel my booking, so that the room becomes available when I no longer need it.

**Priority:** High

**Assumption:** A Student can cancel only their own booking.

### US-04

**Story:** As an Administrator, I want to block or unblock a room, so that I can prevent or allow new bookings when necessary.

**Priority:** High

**Assumption:** Only an Administrator can block or unblock rooms.

### US-05

**Story:** As an Administrator, I want to review room usage, so that I can understand how the study rooms are being used.

**Priority:** Medium

**Assumption:** Usage information includes room bookings and their usage periods.

### US-06

**Story:** As a Student, I want to receive a confirmation after booking, so that I know my reservation was successfully created.

**Priority:** Medium

**Assumption:** A confirmation is sent automatically after a successful booking.

### US-07

**Story:** As a Student, I want to receive a confirmation after cancelling a booking, so that I know my reservation was successfully cancelled.

**Priority:** Medium

**Assumption:** A confirmation is sent automatically after a successful cancellation.

### US-08

**Story:** As an Administrator, I want to see blocked rooms, so that I can manage room availability effectively.

**Priority:** Low

**Assumption:** A blocked room cannot receive new bookings.