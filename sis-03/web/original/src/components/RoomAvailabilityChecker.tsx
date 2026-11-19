import { useState } from 'react';
import { Clock, DoorClosed, CalendarRange, CheckCircle2, XCircle, AlertTriangle, MapPin, Building2 } from 'lucide-react';

const NOW = 540;
const BLOCKED = false;
const EXISTING_BOOKINGS: [number, number][] = [[600, 660]];

function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

type ValidationResult = { error: string };
type AvailabilityResult =
  | { kind: 'available' }
  | { kind: 'unavailable'; reason: string };

function validateInputs(startStr: string, endStr: string): { start: number; end: number } | ValidationResult {
  if (startStr.trim() === '' || endStr.trim() === '') {
    return { error: 'Please enter both a start and an end time.' };
  }
  const start = Number(startStr);
  const end = Number(endStr);
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return { error: 'Times must be whole numbers (integer minutes after midnight).' };
  }
  if (start < 0 || end < 0 || start > 1440 || end > 1440) {
    return { error: 'Times must be between 0 and 1440 minutes (a full day).' };
  }
  if (start >= end) {
    return { error: 'Start time must be earlier than end time.' };
  }
  if (start <= NOW) {
    return { error: `Start time must be after the current time (${NOW} = ${minutesToLabel(NOW)}).` };
  }
  const duration = end - start;
  if (duration > 120) {
    return { error: `Duration is ${duration} minutes — the maximum allowed is 120 minutes.` };
  }
  return { start, end };
}

function checkAvailability(start: number, end: number): AvailabilityResult {
  if (BLOCKED) {
    return { kind: 'unavailable', reason: 'This room is currently blocked for maintenance.' };
  }
  for (const [s, e] of EXISTING_BOOKINGS) {
    if (start < e && end > s) {
      return {
        kind: 'unavailable',
        reason: `Overlaps existing booking ${minutesToLabel(s)}–${minutesToLabel(e)}.`,
      };
    }
  }
  return { kind: 'available' };
}

function RoomAvailabilityChecker() {
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [result, setResult] = useState<
    | { type: 'idle' }
    | { type: 'error'; message: string }
    | { type: 'available'; start: number; end: number }
    | { type: 'unavailable'; start: number; end: number; reason: string }
  >({ type: 'idle' });

  const handleCheck = () => {
    const validated = validateInputs(startStr, endStr);
    if ('error' in validated) {
      setResult({ type: 'error', message: validated.error });
      return;
    }
    const availability = checkAvailability(validated.start, validated.end);
    if (availability.kind === 'available') {
      setResult({ type: 'available', start: validated.start, end: validated.end });
    } else {
      setResult({
        type: 'unavailable',
        start: validated.start,
        end: validated.end,
        reason: availability.reason,
      });
    }
  };

  const handleReset = () => {
    setStartStr('');
    setEndStr('');
    setResult({ type: 'idle' });
  };

  const startNum = Number(startStr);
  const endNum = Number(endStr);
  const startPreview = startStr !== '' && Number.isInteger(startNum) && startNum >= 0 && startNum <= 1440
    ? minutesToLabel(startNum)
    : null;
  const endPreview = endStr !== '' && Number.isInteger(endNum) && endNum >= 0 && endNum <= 1440
    ? minutesToLabel(endNum)
    : null;
  const durationPreview = startPreview && endPreview && startNum < endNum ? endNum - startNum : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-lg">

        {/* Header */}
        <header className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center justify-center rounded-2xl bg-blue-600 p-3 shadow-lg shadow-blue-600/30">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Smart Campus
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Room Availability Checker
          </p>
        </header>

        {/* Room info card */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2.5">
                <MapPin className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Room A-301</p>
                <p className="text-xs text-slate-500">Library Building, 3rd Floor</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                BLOCKED
                  ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  BLOCKED ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
              {BLOCKED ? 'Blocked' : 'Open'}
            </span>
          </div>

          {/* Current time & existing bookings */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
              <Clock className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Current time
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {minutesToLabel(NOW)} <span className="text-slate-400">({NOW})</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
              <DoorClosed className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {BLOCKED ? 'Unavailable' : 'Available to check'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Existing bookings */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Existing bookings</h2>
          </div>
          {EXISTING_BOOKINGS.length === 0 ? (
            <p className="text-sm text-slate-400">No existing bookings today.</p>
          ) : (
            <ul className="space-y-2">
              {EXISTING_BOOKINGS.map(([s, e], i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 ring-1 ring-amber-100"
                >
                  <span className="text-sm font-medium text-amber-900">
                    {minutesToLabel(s)} – {minutesToLabel(e)}
                  </span>
                  <span className="text-xs text-amber-600">{e - s} min</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Request form */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">Check a time slot</h2>
          <p className="mb-4 text-xs text-slate-400">
            Enter times as minutes after midnight (0–1440). Start must be after {NOW} ({minutesToLabel(NOW)}).
            Max duration: 120 min.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start-input" className="mb-1.5 block text-xs font-medium text-slate-600">
                Start (min)
              </label>
              <input
                id="start-input"
                type="number"
                inputMode="numeric"
                min={0}
                max={1440}
                value={startStr}
                onChange={(e) => setStartStr(e.target.value)}
                placeholder="e.g. 570"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {startPreview && (
                <p className="mt-1 text-[11px] text-slate-400">{startPreview}</p>
              )}
            </div>
            <div>
              <label htmlFor="end-input" className="mb-1.5 block text-xs font-medium text-slate-600">
                End (min)
              </label>
              <input
                id="end-input"
                type="number"
                inputMode="numeric"
                min={0}
                max={1440}
                value={endStr}
                onChange={(e) => setEndStr(e.target.value)}
                placeholder="e.g. 600"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {endPreview && (
                <p className="mt-1 text-[11px] text-slate-400">{endPreview}</p>
              )}
            </div>
          </div>

          {durationPreview !== null && (
            <p className="mt-2 text-xs text-slate-500">
              Duration: <span className={durationPreview > 120 ? 'font-semibold text-red-600' : 'font-semibold text-slate-700'}>
                {durationPreview} min
              </span>
              {durationPreview > 120 && ' (exceeds 120 min max)'}
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCheck}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Check availability
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Result */}
        {result.type === 'error' && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Input error</p>
              <p className="mt-0.5 text-sm text-amber-700">{result.message}</p>
            </div>
          </div>
        )}

        {result.type === 'available' && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Available — {minutesToLabel(result.start)} to {minutesToLabel(result.end)}
              </p>
              <p className="mt-0.5 text-sm text-emerald-700">
                This time slot does not conflict with existing bookings.
              </p>
            </div>
          </div>
        )}

        {result.type === 'unavailable' && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                Unavailable — {minutesToLabel(result.start)} to {minutesToLabel(result.end)}
              </p>
              <p className="mt-0.5 text-sm text-red-700">{result.reason}</p>
            </div>
          </div>
        )}

        <footer className="mt-6 text-center text-xs text-slate-400">
          Times use fixed campus time — not your device clock.
        </footer>
      </div>
    </div>
  );
}

export default RoomAvailabilityChecker;
