import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        """AC4: expected True from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(660, 720, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_partial_overlap_after_is_rejected(self):
        """AC4: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(630, 690, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_blocked_room_is_rejected(self):
        """AC3: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(660, 720, 540, True, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_exactly_120_minutes_is_allowed(self):
        """AC2: expected True from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(720, 840, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_121_minutes_is_rejected(self):
        """AC2: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(720, 841, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_starts_now_is_rejected(self):
        """AC1: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(540, 570, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_zero_length_is_rejected(self):
        """AC1: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(700, 700, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_reversed_times_are_rejected(self):
        """AC1: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(720, 700, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_end_at_1440_is_allowed(self):
        """AC1: expected True from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(1380, 1440, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_end_after_1440_is_rejected(self):
        """AC1: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(1380, 1441, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_negative_start_is_rejected(self):
        """AC1: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(-1, 30, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_starts_one_minute_after_now_is_allowed(self):
        """AC1: expected True from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(541, 571, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_starts_in_past_is_rejected(self):
        """AC1: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(500, 530, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_start_at_midnight_now_is_rejected(self):
        """AC1: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(0, 60, 0, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_one_minute_after_midnight_is_allowed(self):
        """AC1: expected True from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(1, 61, 0, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_empty_bookings_is_allowed(self):
        """AC4: expected True from the specification."""
        existing = []
        before = existing.copy()
        result = can_book(600, 660, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_blocked_empty_room_is_rejected(self):
        """AC3: expected False from the specification."""
        existing = []
        before = existing.copy()
        result = can_book(600, 660, 540, True, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_overlap_with_second_booking_is_rejected(self):
        """AC4: expected False from the specification."""
        existing = [(600, 660), (700, 760)]
        before = existing.copy()
        result = can_book(720, 780, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_overlap_in_unsorted_bookings_is_rejected(self):
        """AC4: expected False from the specification."""
        existing = [(900, 960), (600, 660)]
        before = existing.copy()
        result = can_book(610, 650, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_free_slot_among_several_is_allowed(self):
        """AC4: expected True from the specification."""
        existing = [(600, 660), (700, 760), (800, 860)]
        before = existing.copy()
        result = can_book(760, 800, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_touching_start_is_allowed(self):
        """AC4: expected True from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(570, 600, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_touching_both_sides_is_allowed(self):
        """AC4: expected True from the specification."""
        existing = [(600, 660), (720, 780)]
        before = existing.copy()
        result = can_book(660, 720, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_partial_overlap_before_is_rejected(self):
        """AC4: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(570, 630, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_inside_existing_is_rejected(self):
        """AC4: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(615, 645, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_contains_existing_is_rejected(self):
        """AC4: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(570, 690, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_identical_interval_is_rejected(self):
        """AC4: expected False from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(600, 660, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_one_minute_duration_is_allowed(self):
        """AC2: expected True from the specification."""
        existing = [(600, 660)]
        before = existing.copy()
        result = can_book(720, 721, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_accepted_input_is_unchanged(self):
        """AC5: expected True from the specification."""
        existing = [(900, 960), (600, 660), (700, 760)]
        before = existing.copy()
        result = can_book(780, 840, 540, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_rejected_input_is_unchanged(self):
        """AC5: expected False from the specification."""
        existing = [(900, 960), (600, 660), (700, 760)]
        before = existing.copy()
        result = can_book(610, 650, 540, False, existing)
        self.assertIs(result, False)
        self.assertEqual(existing, before)

    def test_last_minute_of_day_is_allowed(self):
        """AC1: expected True from the specification."""
        existing = []
        before = existing.copy()
        result = can_book(1439, 1440, 1438, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, before)

    def test_float_time_outside_contract_observed_behavior(self):
        """Outside contract: no type guard, so a valid numeric float is accepted."""
        self.assertIs(can_book(600.5, 660, 540, False, []), True)

    def test_string_time_outside_contract_observed_behavior(self):
        """Outside contract: comparing a string with an integer raises TypeError."""
        with self.assertRaises(TypeError):
            can_book("600", 660, 540, False, [])

    def test_exactly_120_minutes_to_midnight_is_allowed(self):
        """AC1, AC2: both inclusive upper bounds are allowed together."""
        existing = []
        self.assertIs(can_book(1320, 1440, 540, False, existing), True)
        self.assertEqual(existing, [])


if __name__ == "__main__":
    unittest.main()
