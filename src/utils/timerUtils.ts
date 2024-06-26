import supabase from "../supabase";

/**
 * A type representing the individual timer settings, as reflected in
 * Supabase table users_timer_config.
 */
export type TimerSettings = {
  user_id: string,
  use_milliseconds: boolean,
  low_time_warning: boolean,
  timer_template_id: number,
};

/**
 * A type representing a timer template, as reflected in Supabase table
 * timer_templates.
 */
export type FullWorkRestCycle = {
  timer_template_id: number,
  title: string,
  description: string,
  user_id: string,
  work: number,
  rest: number,
  cycles: number,
};

/**
 * A type representing a work-rest cycle, as incorporated as part of a full
 * timer template (FullWorkRestCycle).
 */
export type WorkRestCycle = {
  work: number,
  rest: number,
  cycles: number,
}

/**
 * An async function that fetches the current user's timer settings and stores them as a
 * TimerSettings variable in a specified React state object.
 * 
 * @param setData The setter for the React state object to store the current user's timer
 *        settings as a TimerSettings variable.
 */
export async function fetchTimerSettings(setData : React.Dispatch<React.SetStateAction<any>>) {
  const { data: { user } } = await supabase.auth.getUser();
  const user_id : string = (user === null) ? "" : user.id;
    
  supabase.from('users_timer_config').select().eq("user_id", user_id).then(async (result) => {
    if (result.data === null || result.data === undefined || result.error) {
      console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
    } else if (result.data[0] === null || result.data[0] === undefined) {
      // user has not set up timer data yet. insert default timer settings.
      const submitInfo : TimerSettings = {
        user_id: user_id,
        use_milliseconds: false,
        low_time_warning: true,
        timer_template_id: 1,
      }

      const { error } = await supabase.from('users_timer_config').insert(submitInfo);
      
      console.log(submitInfo);
      console.log(result.data);

      // weirdly, this triggers occasionally when accessing the timer for the first time.
      // since the insertion works despite showing the error message at times, removing
      // the below block would work.

      // if (error !== null) {
      //   alert("Error updating timer information: " + JSON.stringify(error));
      // }
      setData(submitInfo);
    } else {
      // user has set up timer data.
      setData(result.data[0]);
    }
  });
}

/**
 * An async function that fetches timer templates from table timer_templates and stores them as
 * a FullWorkRestCycle[] array variable in a specified React state object.
 * 
 * @param setData The setter for the React state object to store the FullWorkRestCycle[] array
 */
export async function fetchTimerTemplates(setData : React.Dispatch<React.SetStateAction<any>>) {
  supabase.from('timer_templates').select().order("timer_template_id").then(async (result) => {
    if (result.data === null || result.data === undefined || result.error) {
      console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
    } else if (result.data[0] === null || result.data[0] === undefined) {
      // there are no timer templates available
      setData([]);
    } else {
      // there are timer templates available
      setData(result.data);
    }
  });
}

/**
 * Given a timer template ID (such as from the timer_settings table), fetches the timer template information
 * from the timer_templates table and stores it as a React state variable that holds a FullWorkRestCycle
 * (timer template).
 * 
 * @param id The ID of the timer template to be accessed (as in the timer_templates table).
 * @param setData The React state variable to store the resulting timer template as a type FullWorkRestCycle.
 */
export async function fetchTimerTemplateFromId(id : number, setData : (arg0 : FullWorkRestCycle) => void) {
  supabase.from('timer_templates').select().eq("timer_template_id", id).then(async (result) => {
    if (result.data === null || result.data === undefined || result.error) {
      console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
    } else if (result.data[0] === null || result.data[0] === undefined) {
      // there are no timer templates available
      setData({ timer_template_id: 1, title: "Pomodoro", description: "A timer using the Pomodoro technique for 4 cycles.", user_id: "", work : 1500000, rest: 300000, cycles: 4});
    } else {
      // there are timer templates available
      setData({
        timer_template_id: id,
        title: result.data[0].title,
        description: result.data[0].description,
        user_id: result.data[0].user_id,
        work: result.data[0].work,
        rest: result.data[0].rest, 
        cycles: result.data[0].cycles,
      });
    }
  });
}

/**
 * Gets the work-rest cycle from a timer template.
 * 
 * @param template The timer template to extract the work-rest cycle from.
 * @returns A work-rest cycle that can be plugged into the timer.
 */
export function getCycleFromTemplate(template : FullWorkRestCycle) : WorkRestCycle {
  return { work: template.work, rest: template.rest, cycles: template.cycles };
}

/**
 * Converts the number of hours/minutes/seconds to a string with padded zeros. If number is not a natural
 * number, this will just return the string representation of the number.
 * @param time The number of hours/minutes/seconds.
 * @param digits The number of digits to round to (default 2).
 * @returns The number of hours/minutes/seconds as a string, with padded zeros if they are a natural number.
 */
export function padTime(time : number, digits : number = 2) : string {
  if (Number.isInteger(time) && time >= 0) {
    return time.toString().padStart(digits, "0");
  } else {
    return time.toString();
  }
}

/**
 * Converts a value for the current time to a string.
 * 
 * @param timeInMs The current time elapsed/remaining, in milliseconds
 * @param isMsShown A boolean indicating whether the time in milliseconds is shown.
 * @param isTimerDisplay A boolean indicating whether to format the string as a timer display
 *                       or a hour/minute/second format.
 * @returns The current time elapsed/remaining as a formatted string.
 */
export function timerToString(timeInMs : number, isMsShown : boolean = false, isTimerDisplay : boolean = true) : string {

  // negative timing doesn't exist.
  if (timeInMs < 0) timeInMs = 0;

  // infinite timing should just print infinite
  if (timeInMs === Infinity) return "Infinity";

  // shows exact millisecond values if millisecond option is shown.
  // else, follows a format similar to Apple's timer functionality which
  // rounds the current time remaining to the nearest second. this can be
  // simulated by increasing the displayed time by 500ms such that timings
  // below .499 is shown rounded down and timings .500 and above is shown
  // rounded up to the nearest second.
  if (!isMsShown && isTimerDisplay) timeInMs += 500;

  const hours = Math.floor(timeInMs / 3600000);
  const minutes = Math.floor((timeInMs % 3600000) / 60000);
  const seconds = Math.floor((timeInMs % 60000) / 1000);
  const ms = timeInMs % 1000;

  const msExtra = isMsShown ? "." + padTime(ms, 3) : ""; 

  if (isTimerDisplay) {
    if (hours === 0) return padTime(minutes) + ":" + padTime(seconds) + msExtra;
    else return hours + ":" + padTime(minutes) + ":" + padTime(seconds) + msExtra;
  } else {
    let secondsDisplay;
    if (ms === 0) {
      secondsDisplay = seconds + "s";
    } else if (ms % 100 === 0) {
      secondsDisplay = seconds + "." + (ms / 100) + "s";
    } else if (ms % 10 === 0) {
      secondsDisplay = seconds + "." + (ms / 10) + "s";
    } else {
      secondsDisplay = seconds + "." + ms + "s";
    }

    if (hours === 0) {
      if (minutes === 0) {
        if (seconds === 0 && ms === 0) return "0s";
        else return secondsDisplay;
      } else {
        return minutes + "min" + ((seconds === 0 && ms === 0) ? "" : " " + secondsDisplay);
      }
    } else {
      if (minutes === 0) {
        if (seconds === 0 && ms === 0) return hours + "h";
        else return hours + "h 0min " + secondsDisplay;
      } else {
        return hours + "h " + minutes + "min" + ((seconds === 0 && ms === 0) ? "" : " " + secondsDisplay);
      }
    }
  }
}

/**
 * Splits a time in milliseconds into its constituent components (hours, minutes, seconds, milliseconds).
 * @param timeInMs The time to split, in milliseconds
 * @returns The time, split as an object containing the number of hours, minutes, seconds, and milliseconds.
 */
export function splitTimer(timeInMs : number) : { hours : number, minutes : number, seconds : number, ms : number } {

  // negative timing doesn't exist.
  if (timeInMs < 0) timeInMs = 0;

  const hours = Math.floor(timeInMs / 3600000);
  const minutes = Math.floor((timeInMs % 3600000) / 60000);
  const seconds = Math.floor((timeInMs % 60000) / 1000);
  const ms = timeInMs % 1000;

  return {
    hours : hours,
    minutes : minutes,
    seconds : seconds,
    ms : ms,
  }

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

/**
 * Returns whether the pattern given is valid or not.
 * 
 * @param workRestCycle The work-rest cycle to check the validity.
 * @returns true if work-rest cycle is valid, false otherwise.
 */
export function isValidPattern( workRestCycle : WorkRestCycle ) : boolean {
  return (getCycleLength(workRestCycle) > 0)
    && (workRestCycle.work >= 0)
    && (workRestCycle.rest >= 0)
    && (workRestCycle.cycles > 0);
}