/**
 * Creates a generic React text input event handler that encapsulates the state of the value.
 * @param setter The setter to set the value. Usually a React state setter function.
 * @returns The resulting change event generated.
 */
export const createTextEventHandler = (setter : (value : any) => void) => (event : React.ChangeEvent<HTMLInputElement>) => {
  event.preventDefault();
  setter(event.currentTarget.value);
}

/**
 * Creates a generic React text input event handler that encapsulates the state of the value, but
 * only accepts numeric values (integers) between a specified range.
 * @param setter The setter to set the value. Usually a React state setter function.
 * @returns The resulting change event generated.
 */
export const createNumericTextEventHandler = (setter : (value : any) => void, minRange : number, maxRange : number) => (event : React.ChangeEvent<HTMLInputElement>) => {
  event.preventDefault();
  const strValue = event.currentTarget.value;

  // checks whether string is a valid numeric string (characters only range from 0 to 9)
  // and falls within the range as specified. Empty strings are accepted as well, but parseInt
  // parses empty string as NaN, even if it works and parses as 0 in React.
  const isValid = (
    [...strValue].reduce((prev, cur) => (cur.charCodeAt(0) <= 57 && cur.charCodeAt(0) >= 48) && prev, true) &&
    parseInt(strValue) >= minRange &&
    parseInt(strValue) <= maxRange
    ) || (strValue === "");

  if (isValid) {
    setter(strValue);
  }
}