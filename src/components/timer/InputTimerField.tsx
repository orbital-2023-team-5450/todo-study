import React, { useEffect, useState } from "react";
import { Button, Typography, TextField, Stack } from "@mui/material";
import { timerToString } from "../../utils/timerUtils";
import { createTextEventHandler } from "../../utils/textInputUtils";

export default function InputTimerField({ title, setValue } : { title : string, setValue : (arg : number) => void }) {

    const [ hours, setHours ] = useState<number>(0);
    const [ minutes, setMinutes ] = useState<number>(0);
    const [ seconds, setSeconds ] = useState<number>(0);
    const [ ms, setMs ] = useState<number>(0);

    const handleHoursTextChange = createTextEventHandler(setHours);
    const handleMinutesTextChange = createTextEventHandler(setMinutes);
    const handleSecondsTextChange = createTextEventHandler(setSeconds);
    const handleMsTextChange = createTextEventHandler(setMs);

    const totalTime = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + ms * 1;

    useEffect(() => {
        setValue(totalTime);
    }, [totalTime]);
    
    return (
        <>
            <Typography component="h1" variant="h6">{title}</Typography>
            <Stack direction="row" gap={3}>
                <TextField type="text" label="Hours" variant="outlined" value={hours} onChange={handleHoursTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                <TextField type="text" label="Minutes" variant="outlined" value={minutes} onChange={handleMinutesTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                <TextField type="text" label="Seconds" variant="outlined" value={seconds} onChange={handleSecondsTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                <TextField type="text" label="Milliseconds" variant="outlined" value={ms} onChange={handleMsTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            </Stack>
        </>
    );
}