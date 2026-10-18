export type Booking = { start: number; end: number; label: string };
export type Room = { id: string; name: string; blocked: boolean; bookings: Booking[] };

export const ROOMS: readonly Room[] = [
  { id: "a101", name: "Aurora Hall A101", blocked: false, bookings: [
    { start: 540, end: 600, label: "Robotics Club" },
    { start: 720, end: 810, label: "Study Group" },
  ] },
  { id: "b204", name: "Birch Lab B204", blocked: false, bookings: [
    { start: 600, end: 690, label: "Chem Seminar" },
  ] },
  { id: "c310", name: "Cedar Studio C310", blocked: true, bookings: [] },
];

export type Decision = { available: boolean; reasons: string[] };

export function checkAvailability(room: Room | undefined, start: number, end: number, now: number): Decision {
  const reasons: string[] = [];
  if (!room) return { available: false, reasons: ["Select a room."] };
  if (![start, end, now].every(Number.isFinite)) return { available: false, reasons: ["Enter valid times."] };
  if (start < 0 || end > 1440) reasons.push("Times must be between 0 and 1440 minutes (00:00–24:00).");
  if (start >= end) reasons.push("Start must be before end.");
  if (start <= now) reasons.push("Start must be after the current time.");
  if (end - start > 120) reasons.push("Bookings cannot exceed 120 minutes.");
  if (room.blocked) reasons.push(`${room.name} is blocked.`);
  for (const b of room.bookings) {
    if (start < b.end && b.start < end) reasons.push(`Overlaps "${b.label}" (${fmt(b.start)}–${fmt(b.end)}).`);
  }
  return { available: reasons.length === 0, reasons };
}

export function fmt(m: number) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
