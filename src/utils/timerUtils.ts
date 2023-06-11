import supabase from "../supabase";

export type TimerSettings = {
    user_id: string,
    use_milliseconds: boolean,
    low_time_warning: boolean,
};

export async function fetchTimerSettings(setData : React.Dispatch<React.SetStateAction<any>>) {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id : string = (user === null) ? "" : user.id;
      
    supabase.from('users_timer_config').select().eq("user_id", user_id).then(async (result) => {
        console.log(result.error);
        if (result.data === null || result.data === undefined || result.error) {
            console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
        } else if (result.data[0] === null || result.data[0] === undefined) {
            // user has not set up timer data yet. insert default timer settings.
            const submitInfo : TimerSettings = {
                user_id: user_id,
                use_milliseconds: false,
                low_time_warning: true,
            }

            const { error } = await supabase.from('users_timer_config').insert(submitInfo);
            if (error !== null) {
                alert("Error updating timer information: " + JSON.stringify(error));
            }
            setData(submitInfo);
        } else {
            // user has set up timer data.
            setData(result.data[0]);
        }
    });
}

/**
 * Converts the number of hours/minutes/seconds to a string with padded zeros.
 * @param time The number of hours/minutes/seconds.
 * @param digits The number of digits to round to (default 2).
 * @returns The number of hours/minutes/seconds as a string with padded zeros.
 */
function padTime(time : number, digits : number = 2) : string {
    return time.toString().padStart(digits, "0");
}

/**
 * Converts a value for the current time to a string.
 * 
 * @param timeInMs The current time elapsed/remaining, in milliseconds
 * @param isMsShown A boolean indicating whether the time in milliseconds is shown.
 * @returns The current time elapsed/remaining as a formatted string.
 */
export function timerToString(timeInMs : number, isMsShown : boolean = false) : string {

    // negative timing doesn't exist.
    if (timeInMs < 0) timeInMs = 0;

    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const ms = isMsShown ? timeInMs % 1000 : 0;

    const msExtra = isMsShown ? "." + padTime(ms, 3) : ""; 

    if (hours === 0) return padTime(minutes) + ":" + padTime(seconds) + msExtra;
    else return hours + ":" + padTime(minutes) + ":" + padTime(seconds) + msExtra;
}

/**
 * Calculates the total amount of time required to complete the specified work-rest cycle.
 * @param workRestCycle The specifications of the work-rest cycle to be used.
 * 
 * @returns The total amount of time required to complete the work-rest cycle.
 */
export function getTotalTimeFromCycles( workRestCycle : { work : number, rest : number, cycles : number } ) : number {
    return (workRestCycle.work + workRestCycle.rest) * workRestCycle.cycles;
}

/**
 * Calculates the total amount of time required to complete each specified work-rest cycle.
 * @param workRestCycle The specifications of the work-rest cycle to be used.
 * 
 * @returns The total amount of time required to complete each work-rest cycle.
 */
export function getCycleLength( workRestCycle : { work : number, rest : number, cycles : number } ) : number {
    return workRestCycle.work + workRestCycle.rest;
}

/**
 * Calculates the breakpoints from work to rest for multiple cycles.
 * 
 * @param workRestCycle The specifications of the work-rest cycle to be used.
 * 
 * @returns The breakpoints for the work-rest cycle, as a JavaScript object containing
 *          { all work breakpoints as an array, all rest breakpoints as an array }.
 */
export function getBreakpointsFromCycles( workRestCycle : { work : number, rest : number, cycles : number } ) : { work : number[], rest : number[] } {
    let result = { work : [] as number[] , rest : [] as number[] };
    const cycleLength = workRestCycle.work + workRestCycle.rest;
    for (let i = 0; i < workRestCycle.cycles; i++) {
        result.work.push(i * cycleLength + workRestCycle.work);
        result.rest.push((i + 1) * cycleLength);
    }
    return result;
}