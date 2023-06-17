/**
 * Creates a generic React text input event handler that encapsulates the state of the value.
 * @param setter The setter to set the value. Usually a React state setter function.
 * @returns The resulting change event generated.
 */
export const createTextEventHandler = (setter : (value : any) => void) => (event : React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setter(event.currentTarget.value);
}