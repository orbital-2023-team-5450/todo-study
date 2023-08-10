import { timerToString, splitTimer, getTotalTimeFromCycles, getCycleLength, getBreakpointsFromCycles, isValidPattern, FullWorkRestCycle, WorkRestCycle, getCycleFromTemplate, padTime } from "./timerUtils";
import _ from "lodash";

jest.mock('@supabase/supabase-js');

// timerToString: basics and edge cases
test('0 seconds displays 00:00.000 with milliseconds', () => {
  expect(timerToString(0, true, true)).toBe("00:00.000");
})

test('0 seconds displays 00:00 without milliseconds', () => {
  expect(timerToString(0, false, true)).toBe("00:00");
})

test('negative time displays 00:00 without milliseconds', () => {
  expect(timerToString(-1238, false, true)).toBe("00:00");
})

test('negative time displays 00:00.000 with milliseconds', () => {
  expect(timerToString(-2398489, true, true)).toBe("00:00.000");
})

test('10 minutes displays 10:00.000 with milliseconds', () => {
  expect(timerToString(600000, true, true)).toBe("10:00.000");
})

test('10 minutes displays 10:00.000 without milliseconds', () => {
  expect(timerToString(600000, false, true)).toBe("10:00");
})

test('1 hour displays 1:00:00.000 with milliseconds', () => {
  expect(timerToString(3600000, true, true)).toBe("1:00:00.000");
})

// timerToString: hour display
test('4658273 milliseconds displays 1:17:38.273 with milliseconds', () => {
  expect(timerToString(4658273, true, true)).toBe("1:17:38.273");
});

test('1058273 milliseconds displays 17:38.273 with milliseconds', () => {
  expect(timerToString(1058273, true, true)).toBe("17:38.273");
});

// timerToString: rounding without milliseconds
test('3652000 milliseconds displays 1:00:52 without milliseconds', () => {
  expect(timerToString(3652000, false, true)).toBe("1:00:52");
});

test('3652500 milliseconds displays 1:00:53 without milliseconds', () => {
  expect(timerToString(3652500, false, true)).toBe("1:00:53");
});

test('4658273 milliseconds displays 1:17:38 without milliseconds', () => {
  expect(timerToString(4658273, false, true)).toBe("1:17:38");
});

test('4658573 milliseconds displays 1:17:39 without milliseconds', () => {
  expect(timerToString(4658573, false, true)).toBe("1:17:39");
});

// timerToString: when isTimerDisplay is set to false
test('0 milliseconds display 0s when not in display mode', () => {
  expect(timerToString(0, false, false)).toBe("0s");
  expect(timerToString(0, true, false)).toBe("0s");
});

test('800 milliseconds display 0.8s when not in display mode', () => {
  expect(timerToString(800, false, false)).toBe("0.8s");
  expect(timerToString(800, true, false)).toBe("0.8s");
});

test('150 milliseconds display 0.15s when not in display mode', () => {
  expect(timerToString(150, false, false)).toBe("0.15s");
  expect(timerToString(150, true, false)).toBe("0.15s");
});

test('198 milliseconds display 0.198s when not in display mode', () => {
  expect(timerToString(198, false, false)).toBe("0.198s");
  expect(timerToString(198, true, false)).toBe("0.198s");
});

test('2198 milliseconds display 2.198s when not in display mode', () => {
  expect(timerToString(2198, false, false)).toBe("2.198s");
  expect(timerToString(2198, true, false)).toBe("2.198s");
});

test('60000 milliseconds display 1min when not in display mode', () => {
  expect(timerToString(60000, false, false)).toBe("1min");
  expect(timerToString(60000, true, false)).toBe("1min");
});

test('125593 milliseconds display 2min 5.593s when not in display mode', () => {
  expect(timerToString(125593, false, false)).toBe("2min 5.593s");
  expect(timerToString(125593, true, false)).toBe("2min 5.593s");
});

test('600500 milliseconds display 10min 0.5s when not in display mode', () => {
  expect(timerToString(600500, false, false)).toBe("10min 0.5s");
  expect(timerToString(600500, true, false)).toBe("10min 0.5s");
});

test('3600000 milliseconds display 1h when not in display mode', () => {
  expect(timerToString(3600000, false, false)).toBe("1h");
  expect(timerToString(3600000, true, false)).toBe("1h");
});

test('3652500 milliseconds display 1h 0min 52.5s when not in display mode', () => {
  expect(timerToString(3652500, false, false)).toBe("1h 0min 52.5s");
  expect(timerToString(3652500, true, false)).toBe("1h 0min 52.5s");
});

test('3652500 milliseconds display 1h 0min 52.5s when not in display mode', () => {
  expect(timerToString(3652500, false, false)).toBe("1h 0min 52.5s");
  expect(timerToString(3652500, true, false)).toBe("1h 0min 52.5s");
});

test('4658573 milliseconds display 1h 17min 38.573s when not in display mode', () => {
  expect(timerToString(4658573, false, false)).toBe("1h 17min 38.573s");
  expect(timerToString(4658573, true, false)).toBe("1h 17min 38.573s");
});

// timerToString: extreme values
test('Infinity milliseconds displays "Infinity" no matter what', () => {
  expect(timerToString(Infinity, false, true)).toBe("Infinity");
  expect(timerToString(Infinity, true, true)).toBe("Infinity");
  expect(timerToString(Infinity, false, false)).toBe("Infinity");
  expect(timerToString(Infinity, true, false)).toBe("Infinity");
})

test('Negative milliseconds displays as 0s equivalent no matter what', () => {
  expect(timerToString(-3125789, false, true)).toBe(timerToString(0, false, true));
  expect(timerToString(-3125789, true, true)).toBe(timerToString(0, true, true));
  expect(timerToString(-3125789, false, false)).toBe(timerToString(0, false, false));
  expect(timerToString(-3125789, true, false)).toBe(timerToString(0, true, false));
})

test('Negative Infinity milliseconds displays as 0s equivalent no matter what', () => {
  expect(timerToString(-Infinity, false, true)).toBe(timerToString(0, false, true));
  expect(timerToString(-Infinity, true, true)).toBe(timerToString(0, true, true));
  expect(timerToString(-Infinity, false, false)).toBe(timerToString(0, false, false));
  expect(timerToString(-Infinity, true, false)).toBe(timerToString(0, true, false));
})

// for timer template related tests
const TEST_TIMER_TEMPLATE : FullWorkRestCycle = {
  timer_template_id: 23,
  title: "Test",
  user_id: "default user",
  description: "A test timer template",
  work: 249,
  rest: 349,
  cycles: 29
};

const TEST_WRC : WorkRestCycle = {
  work: 249,
  rest: 349,
  cycles: 29
}

const POMODORO : FullWorkRestCycle = {
  timer_template_id: 1,
  title: "Pomodoro",
  user_id: "something",
  description: "A timer containing a Pomodoro timer for 3 cycles",
  work: 25*60000,
  rest: 5*60000,
  cycles: 3,
};

const POMODORO_WRC : WorkRestCycle = {
  work: 25*60000,
  rest: 5*60000,
  cycles: 3,
}

// getCycleFromTemplate
// Lodash's isEqual function performs equality on objects, allowing for easier testing
test('getCycleFromTemplate functions normally', () => {
  expect(_.isEqual(
    getCycleFromTemplate(TEST_TIMER_TEMPLATE),
    TEST_WRC
  )).toBeTruthy();
});

test('getCycleFromTemplate functions normally (2nd test)', () => {
  expect(_.isEqual(
    getCycleFromTemplate(POMODORO),
    POMODORO_WRC
  )).toBeTruthy();
});

// padTime
test('padTime with one argument works for 2-digit', () => {
  expect(padTime(10)).toBe("10");
})

test('padTime with one argument works for 1-digit', () => {
  expect(padTime(4)).toBe("04");
})

test('padTime with one argument works for 3-digit', () => {
  expect(padTime(140)).toBe("140");
})

test('padTime with one argument works for 0', () => {
  expect(padTime(0)).toBe("00");
})

test('padTime with one argument with negative number should return its string representation', () => {
  expect(padTime(-1)).toBe("-1");
})

test('padTime with one argument with negative number should return its string representation', () => {
  expect(padTime(-20)).toBe("-20");
})

test('padTime with two arguments works for 3-digit', () => {
  expect(padTime(144, 3)).toBe("144");
})

test('padTime with two arguments works for 2-digit', () => {
  expect(padTime(10, 3)).toBe("010");
})

test('padTime with two arguments works for 1-digit', () => {
  expect(padTime(4, 3)).toBe("004");
})

test('padTime with two arguments works for 0', () => {
  expect(padTime(0, 3)).toBe("000");
})

test('padTime with negative number should return its string representation', () => {
  expect(padTime(-1, 3)).toBe("-1");
})

test('padTime with negative number should return its string representation', () => {
  expect(padTime(-20, 3)).toBe("-20");
})

test('padTime with infinity should return its string representation', () => {
  expect(padTime(Infinity)).toBe("Infinity");
})

test('padTime with negative infinity should return its string representation', () => {
  expect(padTime(-Infinity, 3)).toBe("-Infinity");
})

test('padTime with negative digits set should return its string representation', () => {
  expect(padTime(10, -2)).toBe("10");
})

test('padTime with non-integer digits set should round down the number of digits to the nearest integer', () => {
  expect(padTime(0, 3.5)).toBe(padTime(0, 3));
  expect(padTime(21949, 155.23523)).toBe(padTime(21949, 155));
  expect(padTime(24098, 1859.882)).toBe(padTime(24098, 1859));
})

test('padTime with negative digits set should return its string representation', () => {
  expect(padTime(0, -4)).toBe("0");
})

// splitTimer
test('splitTimer works with zero or positive time', () => {
  expect(_.isEqual(splitTimer(3600000), { hours: 1, minutes: 0, seconds: 0, ms: 0 })).toBeTruthy();
  expect(_.isEqual(splitTimer(32589), { hours: 0, minutes: 0, seconds: 32, ms: 589 })).toBeTruthy();
  expect(_.isEqual(splitTimer(0), { hours: 0, minutes: 0, seconds: 0, ms: 0 })).toBeTruthy();
  expect(_.isEqual(splitTimer(4658573), { hours: 1, minutes: 17, seconds: 38, ms: 573 })).toBeTruthy();
})

test('splitTimer with negative time has the same result as zero', () => {
  expect(_.isEqual(splitTimer(-3600000), { hours: 0, minutes: 0, seconds: 0, ms: 0 })).toBeTruthy();
  expect(_.isEqual(splitTimer(-92479), { hours: 0, minutes: 0, seconds: 0, ms: 0 })).toBeTruthy();
  expect(_.isEqual(splitTimer(-0), { hours: 0, minutes: 0, seconds: 0, ms: 0 })).toBeTruthy();
  expect(_.isEqual(splitTimer(-19841048), { hours: 0, minutes: 0, seconds: 0, ms: 0 })).toBeTruthy();
})