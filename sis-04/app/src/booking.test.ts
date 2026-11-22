import { expect, test } from 'vitest';
import { canBook, checkRoom } from './booking';
import type { Room } from './rooms';

function request(start: number, end: number) {
  return { start, end, now: 540, blocked: false, bookings: [{ start: 600, end: 660 }] };
}

test('T01 B3 AC4 touching after', () => {
  expect(canBook(request(660, 720))).toBe(true);
});

test('T02 AC1 starts now', () => {
  expect(canBook(request(540, 570))).toBe(false);
});

test('T03 AC1 zero duration', () => {
  expect(canBook(request(720, 720))).toBe(false);
});

test('T04 AC1 reversed', () => {
  expect(canBook(request(750, 720))).toBe(false);
});

test('T05 AC1 past day end', () => {
  expect(canBook(request(1380, 1441))).toBe(false);
});

test('T06 B1 AC2 120 minutes', () => {
  expect(canBook(request(720, 840))).toBe(true);
});

test('T07 B2 AC2 121 minutes', () => {
  expect(canBook(request(720, 841))).toBe(false);
});

test('T08 AC4 touching before', () => {
  expect(canBook(request(570, 600))).toBe(true);
});

test('T09 B4 AC4 partial overlap', () => {
  expect(canBook(request(630, 690))).toBe(false);
});

test('T10 AC4 contains booking', () => {
  expect(canBook(request(570, 690))).toBe(false);
});

test('T11 AC4 inside booking', () => {
  expect(canBook(request(615, 645))).toBe(false);
});

test('T12 AC4 identical interval', () => {
  expect(canBook(request(600, 660))).toBe(false);
});

test('T13 AC3 blocked room', () => {
  expect(canBook({ ...request(660, 720), blocked: true })).toBe(false);
});

test('T14 AC4 empty schedule', () => {
  expect(canBook({ ...request(630, 690), bookings: [] })).toBe(true);
});

test('AC5 preserves existing bookings after an available check', () => {
  const candidate = request(660, 720);
  candidate.bookings.unshift({ start: 900, end: 960 });
  const before = structuredClone(candidate.bookings);
  expect(canBook(candidate)).toBe(true);
  expect(candidate.bookings).toEqual(before);
});

test('X1 AC1 allows an end at midnight', () => {
  expect(canBook(request(1380, 1440))).toBe(true);
});

test('X2 AC4 checks the second booking', () => {
  const candidate = request(720, 780);
  candidate.bookings.push({ start: 700, end: 760 });
  expect(canBook(candidate)).toBe(false);
});

test('BUG-A AC4 touches both neighbors', () => {
  const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }];
  expect(canBook({ start: 660, end: 720, now: 540, blocked: false, bookings })).toBe(true);
});

test('BUG-B AC5 preserves a free non-touching request', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = structuredClone(bookings);
  expect(canBook({ start: 720, end: 780, now: 540, blocked: false, bookings })).toBe(true);
  expect(bookings).toEqual(before);
});

// checkRoom: a fixed catalog for these tests only, so editing ROOMS cannot change a result.
function catalog(): Room[] {
  return [
    { id: 'r1', name: 'Test room 1', capacity: 8, equipment: ['whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'r2', name: 'Test room 2', capacity: 12, equipment: ['projector'], blocked: false, bookings: [] },
    { id: 'r3', name: 'Test room 3', capacity: 20, equipment: ['projector'], blocked: true, bookings: [] },
  ];
}

test('F5 the same times give a different result in another room', () => {
  const rooms = catalog();
  const request = { start: 630, end: 690, now: 540 };
  expect(checkRoom(rooms, 'r1', request)).toBe(false);
  expect(checkRoom(rooms, 'r2', request)).toBe(true);
});

test('F3 AC3 a blocked room with a free valid slot is not available', () => {
  expect(checkRoom(catalog(), 'r3', { start: 720, end: 780, now: 540 })).toBe(false);
});

test('F3 an unknown room id is not available', () => {
  expect(checkRoom(catalog(), 'nope', { start: 720, end: 780, now: 540 })).toBe(false);
});

test('B3 AC4 checkRoom allows a request touching the chosen room booking', () => {
  expect(checkRoom(catalog(), 'r1', { start: 660, end: 720, now: 540 })).toBe(true);
});

test('B1 AC2 checkRoom allows exactly 120 minutes', () => {
  expect(checkRoom(catalog(), 'r2', { start: 720, end: 840, now: 540 })).toBe(true);
});

test('B2 AC2 checkRoom rejects 121 minutes', () => {
  expect(checkRoom(catalog(), 'r2', { start: 720, end: 841, now: 540 })).toBe(false);
});

test('AC1 checkRoom rejects a request in the past', () => {
  expect(checkRoom(catalog(), 'r2', { start: 480, end: 540, now: 540 })).toBe(false);
});

test('AC5 checkRoom does not change the catalog', () => {
  const rooms = catalog();
  const before = structuredClone(rooms);
  expect(checkRoom(rooms, 'r1', { start: 660, end: 720, now: 540 })).toBe(true);
  expect(checkRoom(rooms, 'r1', { start: 630, end: 690, now: 540 })).toBe(false);
  expect(rooms).toEqual(before);
});
