import { expect, test } from 'vitest';
import { canBook } from './booking';

function request(start: number, end: number) {
  return { start, end, now: 540, blocked: false, bookings: [{ start: 600, end: 660 }] };
}

test('T01 AC4 touching after', () => {
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

test('T06 AC2 120 minutes', () => {
  expect(canBook(request(720, 840))).toBe(true);
});

test('T07 AC2 121 minutes', () => {
  expect(canBook(request(720, 841))).toBe(false);
});

test('T08 AC4 touching before', () => {
  expect(canBook(request(570, 600))).toBe(true);
});

test('T09 AC4 partial overlap', () => {
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
