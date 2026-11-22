import { expect, test } from 'vitest';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

// Fixed catalog: independent of ROOMS so demo data cannot change a result.
// No room has 'computers'. x20 is blocked on purpose.
function catalog(): Room[] {
  return [
    { id: 's4', name: 'Small 4', capacity: 4, equipment: ['whiteboard'], blocked: false, bookings: [] },
    { id: 'm8', name: 'Medium 8', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'n10', name: 'Bare 10', capacity: 10, equipment: [], blocked: false, bookings: [] },
    { id: 'l12', name: 'Large 12', capacity: 12, equipment: ['projector', 'video call'], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'x20', name: 'Hall 20', capacity: 20, equipment: ['projector', 'whiteboard', 'video call'], blocked: true, bookings: [] },
  ];
}

// Catalog order is kept: the page falls back to the first room in the filtered list.
function ids(rooms: Room[]): string[] {
  return rooms.map((r) => r.id);
}

test('F1 keeps only rooms whose capacity is at least the attendees', () => {
  const result = filterRooms(catalog(), { attendees: 5, equipment: [] });
  expect(ids(result)).toEqual(['m8', 'n10', 'l12', 'x20']);
});

test('F1 larger group removes every room that is too small', () => {
  const result = filterRooms(catalog(), { attendees: 11, equipment: [] });
  expect(ids(result)).toEqual(['l12', 'x20']);
});

test('F2 room must contain all selected items, not just one', () => {
  const result = filterRooms(catalog(), { attendees: 1, equipment: ['projector', 'whiteboard'] });
  expect(ids(result)).toEqual(['m8', 'x20']);
});

test('F2 single required item', () => {
  const result = filterRooms(catalog(), { attendees: 1, equipment: ['video call'] });
  expect(ids(result)).toEqual(['l12', 'x20']);
});

test('F1 F2 capacity and equipment are both required', () => {
  const result = filterRooms(catalog(), { attendees: 9, equipment: ['projector'] });
  expect(ids(result)).toEqual(['l12', 'x20']);
});

test('F4 no room is big enough returns an empty array', () => {
  const result = filterRooms(catalog(), { attendees: 21, equipment: [] });
  expect(result).toEqual([]);
});

test('F4 no room has the required item returns an empty array', () => {
  const result = filterRooms(catalog(), { attendees: 1, equipment: ['computers'] });
  expect(result).toEqual([]);
});

test('B5 capacity exactly equal to attendees is included', () => {
  const result = filterRooms(catalog(), { attendees: 8, equipment: [] });
  expect(ids(result)).toContain('m8');
  expect(ids(result)).toEqual(['m8', 'n10', 'l12', 'x20']);
});

test('B6 capacity one below attendees is excluded', () => {
  const result = filterRooms(catalog(), { attendees: 9, equipment: [] });
  expect(ids(result)).not.toContain('m8');
  expect(ids(result)).toEqual(['n10', 'l12', 'x20']);
});

test('F1 no equipment selected returns every room big enough', () => {
  const result = filterRooms(catalog(), { attendees: 1, equipment: [] });
  expect(ids(result)).toEqual(['s4', 'm8', 'n10', 'l12', 'x20']);
});

test('F2 room with extra equipment is still included', () => {
  const result = filterRooms(catalog(), { attendees: 1, equipment: ['whiteboard'] });
  expect(ids(result)).toEqual(['s4', 'm8', 'x20']);
});

test('F1 F2 blocked room is not removed by filterRooms', () => {
  const result = filterRooms(catalog(), { attendees: 15, equipment: ['video call'] });
  expect(ids(result)).toEqual(['x20']);
});

test('F1 F2 input rooms and criteria are not changed', () => {
  const rooms = catalog();
  const before = structuredClone(rooms);
  const criteria = { attendees: 9, equipment: ['projector'] };
  filterRooms(rooms, criteria);
  expect(rooms).toEqual(before);
  expect(criteria).toEqual({ attendees: 9, equipment: ['projector'] });
});

test('INT F3 F5 filterRooms then checkRoom on the rooms it returned', () => {
  const rooms = catalog();
  const visible = filterRooms(rooms, { attendees: 10, equipment: ['projector'] });
  expect(ids(visible)).toEqual(['l12', 'x20']);
  const request = { start: 720, end: 780, now: 540 };
  expect(checkRoom(visible, 'l12', request)).toBe(true);
  expect(checkRoom(visible, 'x20', request)).toBe(false);
  expect(checkRoom(visible, 'l12', { start: 630, end: 690, now: 540 })).toBe(false);
  expect(checkRoom(visible, 'm8', request)).toBe(false);
});
