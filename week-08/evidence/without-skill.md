Two defects are visible:

1. **AC4: endpoint contact is treated as overlap.** The inclusive comparisons reject bookings that start when another ends, or end when another starts. This explains T01 and T08.
2. **AC5: checking availability mutates booking data.** `bookings.push(...)` inserts a booking even though this function should only return a Boolean.

The AC5 test fails at its availability assertion, before checking data preservation. Its failure alone does not demonstrate mutation; the mutation defect is established directly by the code. The supplied excerpt does not show the complete candidate or fixture, so its precise rejection path cannot be confirmed.

Minimal patch to the app’s copy of `canBook`:

```diff
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
```

Keep the existing endpoint tests. Add an isolated regression test using a strictly separated slot, so the mutation check does not depend on endpoint handling:

```ts
test('availability checks preserve bookings and are repeatable', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = structuredClone(bookings);
  const candidate = {
    start: 720,
    end: 780,
    now: 540,
    blocked: false,
    bookings,
  };

  expect(canBook(candidate)).toBe(true);
  expect(bookings).toEqual(before);
  expect(canBook(candidate)).toBe(true);
  expect(bookings).toEqual(before);
});
```

No code was edited or tests run.
