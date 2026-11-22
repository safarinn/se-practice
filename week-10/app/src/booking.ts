type BookingRequest = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: ReadonlyArray<{ start: number; end: number }>;
};

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  return true;
}

/** Raw values from the availability form: "HH:MM" strings plus the "Ends at 24:00" box. */
export type FormTimes = { start: string; end: string; now: string; endOfDay: boolean };

/** Minutes since midnight for an "HH:MM" string. */
function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** Pure conversion of the form times to minutes; "Ends at 24:00" becomes 1440. */
export function toRequest({ start, end, now, endOfDay }: FormTimes): { start: number; end: number; now: number } {
  return {
    start: toMinutes(start),
    end: endOfDay ? 1440 : toMinutes(end),
    now: toMinutes(now),
  };
}
