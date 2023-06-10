import { useState, useRef, useEffect } from 'react';
import { getCycleLength, getTotalTimeFromCycles } from '../utils/timerUtils';

/**
 * Custom React hook representing a timer that counts up like a
 * stopwatch, to a limit specified by the limit parameter.
 * 
 * @param pattern A work-rest cycle object representing the number of work-rest cycles to
 *                be performed before the timer finishes.
 * @param onTimeUp A function to be called once the time reaches the specific limit.
 * @returns A JavaScript object containing the start, stop and reset functions, a boolean
 *          indicating if the timer is running, and the current time (in milliseconds) itself.
 */
export const useTimer = ( pattern : { work : number, rest : number, cycles : number }, onTimeUp : () => void ) => {
    const [ elapsedTime, setElapsedTime ] = useState(0);
    const [ isRunning, setIsRunning ] = useState(false);
    const [ currentStatus, setCurrentStatus ] = useState({ isWork: true, cycles: 0 });
    const [ isPaused, setIsPaused ] = useState(false);
    const [ startTime, setStartTime ] = useState<number>(0);
    const [ timeWhenLastStopped, setTimeWhenLastStopped ] = useState<number>(0);
    const limit = getTotalTimeFromCycles(pattern);

    const displayedTime = currentStatus.isWork 
        ? (pattern.work + getCycleLength(pattern) * currentStatus.cycles - elapsedTime)
        : (getCycleLength(pattern) * (currentStatus.cycles + 1) - elapsedTime);

    if (displayedTime <= 0) {
        if (currentStatus.isWork) {
            currentStatus.isWork = false;
        } else {
            currentStatus.isWork = true;
            currentStatus.cycles++;
        }
    }

    if (elapsedTime >= limit) timeUp();

    console.log({...currentStatus, elapsedTime: elapsedTime});

    const interval = useRef<ReturnType<typeof setInterval>>();

    // bug (only occurs during development):
    // if you refresh the page (through updating the React virtual DOM) when the timer
    // continues running, the time up dialog will not close due to some quirks with
    // how setInterval works in React.
    useEffect(() => {
        if (isRunning) {
            interval.current = setInterval(() => {
                setElapsedTime(() => Date.now() - startTime + timeWhenLastStopped);
            }, 1);
        } else {
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = undefined;
            }
        }
    }, [currentStatus, limit, pattern, timeWhenLastStopped, startTime])

    function start() {
        setIsRunning(true);
        setIsPaused(false);
        setStartTime(Date.now());
    }

    function stop() {
        setIsRunning(false);
        setIsPaused(true);
        setStartTime(0);
        setTimeWhenLastStopped(elapsedTime);
    }

    function reset() {
        setIsRunning(false);
        setIsPaused(false);
        setStartTime(0);
        setCurrentStatus({ isWork: true, cycles: 0 });
        setTimeWhenLastStopped(0);
        setElapsedTime(0);
    }

    function timeUp() {
        reset();
        onTimeUp();
    }

    return { start, stop, reset, isRunning, isPaused, displayedTime };
}