// Room data only: no rules live here. Times are minutes after midnight (600 = 10:00).
// Every room and booking is fictional.

export type Interval = { start: number; end: number };

export type Equipment = 'projector' | 'whiteboard' | 'video call' | 'computers';

export const EQUIPMENT: Equipment[] = ['projector', 'whiteboard', 'video call', 'computers'];

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: Equipment[];
  blocked: boolean;
  bookings: Interval[];
};

export const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', capacity: 8, equipment: ['whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', capacity: 12, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
  { id: 'c310', name: 'Room C-310', capacity: 20, equipment: ['projector', 'video call'], blocked: false, bookings: [{ start: 720, end: 810 }] },
  { id: 'd015', name: 'Lab D-015', capacity: 30, equipment: ['projector', 'whiteboard', 'computers'], blocked: false, bookings: [{ start: 540, end: 600 }, { start: 840, end: 960 }] },
  { id: 'e120', name: 'Room E-120', capacity: 16, equipment: ['projector', 'whiteboard', 'video call'], blocked: true, bookings: [] },
];
