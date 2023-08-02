import { darkenColor, randomColor, getInitials } from "./avatarUtils";

function isHexColor(color : string) {
  const hexValues = "0123456789ABCDEFabcdef";
  const colorSplit = color.slice(1).split(""); // the colour, split into individual hex digits
  const colorContainsAllHexValues = colorSplit.map(v => hexValues.includes(v)).reduce((x, y) => x && y, true);

  return colorContainsAllHexValues;
}

// darkenColor
test('a white colour should be black if darkened by 100%', () => {
  expect(darkenColor("#ffffff", 100)).toBe("#000000");
});

test('a random colour should be black if darkened by 100%', () => {
  expect(darkenColor("#123456", 100)).toBe("#000000");
});

test('a colour should be black if darkened by 100%', () => {
  expect(darkenColor("#ffffff", 100)).toBe("#000000");
});


// randomColor
test('the random colour produced should be a 6-digit hex colour', () => {
  const color = randomColor("randomUsername");

  expect(color.startsWith("#")).toBeTruthy();
  expect(color.length === 7).toBeTruthy();
  expect(isHexColor(color)).toBeTruthy();
});

test('random colour should work for empty strings', () => {
  const color = randomColor("");

  expect(color.startsWith("#")).toBeTruthy();
  expect(color.length === 7).toBeTruthy();
  expect(isHexColor(color)).toBeTruthy();
});

// getInitials
test('initials of person with given first and last name is correct', () => {
  const tester = getInitials("First", "Last");
  expect(tester).toBe("FL");
});

test('initials of person with given first and last name with non-alphabetical characters is correct', () => {
  const tester = getInitials("first", "9ast");
  expect(tester).toBe("f9");
});

test('initials of person with given first and last name with Unicode characters is correct', () => {
  const tester = getInitials("我irst", "喜ast");
  expect(tester).toBe("我喜");
});

test('initials of person with first and last name as empty strings is correct', () => {
  const tester = getInitials("", "");
  expect(tester).toBe("");
});

test('initials of person with first name non-empty and last name as empty strings is correct', () => {
  const tester = getInitials("", "Hello");
  expect(tester).toBe("H");
});

test('initials of person with first name empty and last name non-empty is correct', () => {
  const tester = getInitials("World", "");
  expect(tester).toBe("W");
});

test('initials of person with given first name only is correct', () => {
  const tester = getInitials("First");
  expect(tester).toBe("F");
});

test('initials of person with given first name only with non-alphabetical characters is correct', () => {
  const tester = getInitials("#hello");
  expect(tester).toBe("#");
})

test('initials of person with given first name only with Unicode characters is correct', () => {
  const tester = getInitials("我很喜欢JavaScript");
  expect(tester).toBe("我");
});

test('initials of person with first name only as an empty string is correct', () => {
  const tester = getInitials("");
  expect(tester).toBe("");
})

test('initials of person with undefined last name still works', () => {
  const tester = getInitials("Hello", undefined);
  expect(tester).toBe("H");
})