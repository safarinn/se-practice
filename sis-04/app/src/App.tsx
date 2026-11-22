import { useState, type FormEvent } from 'react';

import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { EQUIPMENT, ROOMS, type Equipment } from './rooms';

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function App() {
  const [attendees, setAttendees] = useState(1);
  const [required, setRequired] = useState<Equipment[]>([]);
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const visible = filterRooms(ROOMS, { attendees, equipment: required });
  // F5: if the chosen room is filtered out, fall back to the first room still shown (or none).
  const room = visible.find(r => r.id === roomId) ?? visible[0];

  // F5: any change to what is being checked clears the old answer.
  function changed<T>(set: (value: T) => void) {
    return (value: T) => {
      set(value);
      setResult(null);
      setError('');
    };
  }

  function toggle(item: Equipment) {
    changed(setRequired)(required.includes(item) ? required.filter(x => x !== item) : [...required, item]);
  }

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    if (!room) return;
    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in the current time, the start and the end.');
      return;
    }
    const s = toMinutes(start);
    const e = endOfDay ? 1440 : toMinutes(end);
    if (!(s < e)) {
      setError('The end time must be after the start time.');
      return;
    }
    setError('');
    setResult(checkRoom(ROOMS, room.id, { start: s, end: e, now: toMinutes(now) }));
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <form onSubmit={check}>
        <fieldset className="needs">
          <legend>What the room needs</legend>
          <label>Attendees
            <input type="number" min={1} value={attendees}
              onChange={e => changed(setAttendees)(Math.max(1, Number(e.target.value) || 1))} />
          </label>
          <div className="equipment">
            {EQUIPMENT.map(item => (
              <label key={item} className="inline">
                <input type="checkbox" checked={required.includes(item)} onChange={() => toggle(item)} /> {item}
              </label>
            ))}
          </div>
        </fieldset>

        {room && (
          <ul className="matches" aria-label="Rooms that match">
            {visible.map(r => (
              <li key={r.id}>
                <strong>{r.name}</strong> · {r.capacity} seats · {r.equipment.join(', ') || 'no equipment'}
                {r.blocked && <span className="tag">blocked</span>}
              </li>
            ))}
          </ul>
        )}

        {room ? (
          <div className="row">
            <label>Room ({visible.length} of {ROOMS.length} match)
              <select value={room.id} onChange={e => changed(setRoomId)(e.target.value)}>
                {visible.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.capacity} seats{r.blocked ? ' · blocked' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label>Current time<input type="time" value={now} onChange={e => changed(setNow)(e.target.value)} /></label>
            <label>Start<input type="time" value={start} onChange={e => changed(setStart)(e.target.value)} /></label>
            <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => changed(setEnd)(e.target.value)} /></label>
            <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => changed(setEndOfDay)(e.target.checked)} /> Ends at 24:00</label>
          </div>
        ) : (
          <p className="empty" role="status">
            No rooms match {attendees} attendee{attendees === 1 ? '' : 's'}
            {required.length ? ` with ${required.join(', ')}` : ''}. Lower the number of attendees or clear an equipment item.
          </p>
        )}
        <button type="submit" disabled={!room}>Check availability</button>
      </form>

      <div role="status" aria-live="polite">
        {error && <p className="error">{error}</p>}
        {result !== null && room && (
          <p className={`result ${result ? 'available' : 'unavailable'}`}>
            {result ? 'Available' : 'Unavailable'}: {room.name}, {start}–{endOfDay ? '24:00' : end}
          </p>
        )}
      </div>

      {room && (
        <section className="details">
          <h2>{room.name}</h2>
          <p>{room.capacity} seats · {room.equipment.join(', ') || 'no equipment'}{room.blocked ? ' · blocked, cannot be booked' : ''}</p>
          <h3>Existing bookings</h3>
          <ul>{room.bookings.length ? room.bookings.map(b => <li key={b.start}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
        </section>
      )}
    </main>
  );
}
