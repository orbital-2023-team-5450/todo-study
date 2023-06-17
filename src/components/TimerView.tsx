import React, { useState } from 'react';
import { Stack, Typography, Button } from "@mui/material"
import { getTotalTimeFromCycles, timerToString } from '../utils/timerUtils';
import { useTimer } from '../hooks/useTimer';
import TimeUpDialog from './dialogs/TimeUpDialog';


export default function TimerView({ pattern, showMs } : { pattern : { work : number, rest : number, cycles : number }, showMs : boolean }) {

    const [ dialogOpen, setDialogOpen ] = useState(false);

    function showDialog() {
        if (!dialogOpen) setDialogOpen(true);
    }

    function closeDialog() {
        setDialogOpen(false);
    }

    const { start, stop, reset, isRunning, isPaused, displayedTime } = useTimer(pattern, showDialog);
    
    function handleTimer() {
        if (isRunning) {
            stop();
        } else {
            start();
        }
    }

    const timerDisplay = timerToString(displayedTime, showMs);

    if (isRunning) { 
        document.title = timerDisplay + " - Study Timer // TODO: Study";
    } else if (isPaused) {
        document.title = "[PAUSED] " + timerDisplay + " - Study Timer // TODO: Study";
    } else {
        document.title = "Study Timer // TODO: Study";
    }

    return (
        <Stack gap={3} component="section">
            <Typography variant="h1" component="h2">
                { timerDisplay }
            </Typography>
            <Stack gap={5} direction="row" justifyContent="center">
                <Button variant="outlined" onClick={ handleTimer }>
                    { isRunning ? "Pause" : "Start" } Timer</Button>
                <Button variant="outlined" onClick={reset}>Reset Timer</Button>
            </Stack>
            <TimeUpDialog open={dialogOpen} handleClose={ closeDialog } />
        </Stack>
    );
}