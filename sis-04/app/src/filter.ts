import type { Room } from './rooms';

// F1: capacity >= attendees. F2: the room has ALL selected items.
// Blocked rooms are kept; checkRoom makes sure they are never available (F3).
export function filterRooms(
  rooms: ReadonlyArray<Room>,
  criteria: { attendees: number; equipment: ReadonlyArray<string> },
): Room[] {
  return rooms.filter(room =>
    room.capacity >= criteria.attendees &&
    criteria.equipment.every(item => (room.equipment as string[]).includes(item)),
  );
}
