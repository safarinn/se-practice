'use strict';
const schedules = Object.freeze({
  base: Object.freeze([Object.freeze([600, 660])]),
  multiple: Object.freeze([Object.freeze([600, 660]), Object.freeze([700, 760])])
});
function parseTime(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return NaN;
  const hour = Number(match[1]), minute = Number(match[2]);
  return minute < 60 && (hour < 24 || (hour === 24 && minute === 0)) ? hour * 60 + minute : NaN;
}
function checkAvailability(start, end, now, blocked, existing) {
  if (![start, end, now].every(Number.isInteger)) return [false, 'Enter valid times in HH:MM format. Only 24:00 is accepted at the day boundary.'];
  if (now < 0 || now > 1439) return [false, 'Current time must be from 00:00 to 23:59.'];
  if (!(0 <= start && start < end && end <= 1440)) return [false, 'End time must be later than start time, within the same day.'];
  if (start <= now) return [false, 'Start time must be after the supplied current time.'];
  if (end - start > 120) return [false, 'Choose an interval of 120 minutes or less.'];
  if (blocked) return [false, 'Room A101 is blocked and unavailable at all times.'];
  if (existing.some(([a, b]) => start < b && end > a)) return [false, 'This interval overlaps an existing booking. Choose a different time.'];
  return [true, 'This interval is free. Checking availability does not reserve the room.'];
}
const el = id => document.getElementById(id);
const formatTime = value => String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0');
function resetResult() {
  el('result').dataset.state = 'neutral';
  el('decision').textContent = 'Ready to check';
  el('reason').textContent = 'Inputs changed. Check availability for the updated interval.';
  el('result-icon').textContent = '○';
  el('checked').textContent = 'No reservations are created or changed.';
}
function renderSchedule() {
  el('bookings').replaceChildren(...schedules[el('schedule').value].map(([start, end]) => {
    const item = document.createElement('li'), time = document.createElement('span'), badge = document.createElement('span');
    time.textContent = formatTime(start) + ' – ' + formatTime(end);
    badge.textContent = 'Occupied'; badge.className = 'booking-label';
    item.append(time, badge); return item;
  }));
}
for (const id of ['now', 'start', 'end', 'blocked', 'schedule']) el(id).addEventListener('input', resetResult);
el('schedule').addEventListener('change', () => { renderSchedule(); resetResult(); });
el('form').addEventListener('submit', event => {
  event.preventDefault();
  const read = id => parseTime(el(id).value);
  const [ok, reason] = checkAvailability(read('start'), read('end'), read('now'), el('blocked').checked, schedules[el('schedule').value]);
  el('result').dataset.state = ok ? 'available' : 'unavailable';
  el('decision').textContent = ok ? 'Available' : 'Unavailable';
  el('reason').textContent = reason;
  el('result-icon').textContent = ok ? '✓' : '!';
  el('checked').textContent = 'Checked interval: ' + el('start').value + ' – ' + el('end').value + '. Existing bookings are unchanged.';
});
