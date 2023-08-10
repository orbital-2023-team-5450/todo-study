import { darkenColor, randomColor, getInitials } from "./avatarUtils";

function isHexColor(color : string) {
  const hexValues = "0123456789ABCDEFabcdef";
  const colorSplit = color.slice(1).split(""); // the colour, split into individual hex digits
  const colorContainsAllHexValues = colorSplit.map(v => hexValues.includes(v)).reduce((x, y) => x && y, true);
  const colorIsCorrectLength = color.length === 4 || color.length === 7;

  return colorContainsAllHexValues && colorIsCorrectLength && color.startsWith("#");
}

// darkenColor
test('the darkened colour produced should be a hex colour', () => {
  const color = darkenColor("#abcdef", 45);

  expect(isHexColor(color)).toBeTruthy();
});

test('a white colour should be black if darkened by 100%', () => {
  expect(darkenColor("#ffffff", 100)).toBe("#000000");
});

test('a random colour should be black if darkened by 100%', () => {
  expect(darkenColor("#123456", 100)).toBe("#000000");
});

test('a random colour should be the same if darkened by 0%', () => {
  expect(darkenColor("#123456", 0)).toBe("#123456");
});

test('white should be perfectly grey if darkened by 50%', () => {
  expect(darkenColor("#ffffff", 50)).toBe("#808080");
});

test('a colour should be black if darkened by 100%', () => {
  expect(darkenColor("#ffffff", 100)).toBe("#000000");
});

test('a 3-digit hex colour should work as well', () => {
  expect(darkenColor("#fff", 13)).toBe("#dedede");
});

test('a hex colour without prefix works as well', () => {
  expect(darkenColor("123456", 13)).toBe("#102d4b");
})

test('a 3-digit hex colour without prefix works as well', () => {
  expect(darkenColor("edc", 72)).toBe(darkenColor("#eeddcc", 72));
})

test('a hex colour that is more than 100% darkened is black', () => {
  expect(darkenColor("#abcdef", 180)).toBe("#000000");
})

test('a hex colour that is infinitely darkened is black', () => {
  expect(darkenColor("#abcdef", Infinity)).toBe("#000000");
})

test('black that is infinitely darkened is black', () => {
  expect(darkenColor("#000000", Infinity)).toBe("#000000");
})

test('a hex colour with all non-zero RGB components with negative infinity darkening should be white', () => {
  expect(darkenColor("#010101", -Infinity)).toBe("#ffffff");
})

test('a hex colour with some zero RGB components with negative infinity darkening should have zero in the corresponding RGB component', () => {
  expect(darkenColor("#010001", -Infinity)).toBe("#ff00ff");
})

test('a black hex colour with negative infinity darkening should be black', () => {
  expect(darkenColor("#000000", -Infinity)).toBe("#000000");
})

// randomColor
test('the random colour produced should be a hex colour', () => {
  const color = randomColor("randomUsername");

  expect(isHexColor(color)).toBeTruthy();
});

test('random colour should work for empty strings', () => {
  const color = randomColor("");

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

test('initials of person with first and last name as empty strings is an empty string', () => {
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

test('initials of person with first name only as an empty string is an empty string', () => {
  const tester = getInitials("");
  expect(tester).toBe("");
})

test('initials of person with undefined last name still works', () => {
  const tester = getInitials("Hello", undefined);
  expect(tester).toBe("H");
})