import React, { useEffect, useState } from "react";
import { Button, Typography, TextField, Stack } from "@mui/material";
import { timerToString } from "../../utils/timerUtils";
import { createNumericTextEventHandler } from "../../utils/textInputUtils";

export default function InputTimerField({ title, setValue, reset = false, setReset = null, disabled = false } : { title : string, setValue : (arg : number) => void, reset?: boolean, setReset? : (((arg : boolean) => void) | null), disabled? : boolean}) {

    const [ hours, setHours ] = useState<number>(0);
    const [ minutes, setMinutes ] = useState<number>(0);
    const [ seconds, setSeconds ] = useState<number>(0);
    const [ ms, setMs ] = useState<number>(0);

    const handleHoursTextChange = createNumericTextEventHandler(setHours, 0, Infinity);
    const handleMinutesTextChange = createNumericTextEventHandler(setMinutes, 0, 59);
    const handleSecondsTextChange = createNumericTextEventHandler(setSeconds, 0, 59);
    const handleMsTextChange = createNumericTextEventHandler(setMs, 0, 999);

    const totalTime = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + ms * 1;

    useEffect(() => {
        setValue(totalTime);
    }, [totalTime]);

    // triggers a reset of all of the fields.
    useEffect(() => {
        console.log("reset done");
        if (setReset !== null && reset) {
            console.log("reset yes");
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            setMs(0);
            setReset( false );
        }
    }, [reset])
    
    return (
        !disabled ?
        <>
            <Typography component="h1" variant="h6">{title}</Typography>
            <Stack direction="row" gap={3}>
                <TextField type="text" disabled={disabled} label="Hours" variant="outlined" value={hours} onChange={handleHoursTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                <TextField type="text" disabled={disabled} label="Minutes" variant="outlined" value={minutes} onChange={handleMinutesTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                <TextField type="text" disabled={disabled} label="Seconds" variant="outlined" value={seconds} onChange={handleSecondsTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                <TextField type="text" disabled={disabled} label="Milliseconds" variant="outlined" value={ms} onChange={handleMsTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            </Stack>
        </> : <></>
    );
}