import React, { useState } from 'react';
import { Stack, Typography, Button } from "@mui/material"
import { WorkRestCycle, getTotalTimeFromCycles, timerToString } from '../../utils/timerUtils';
import { useTimer } from '../../hooks/useTimer';
import TimeUpDialog from './dialogs/TimeUpDialog';
import TimerConfigDialog from './dialogs/TimerConfigDialog';


export default function TimerView({ pattern, showMs, onChange } : { pattern : WorkRestCycle, showMs : boolean, onChange : () => void }) {

    const [ dialogOpen, setDialogOpen ] = useState(false);
    const [ timerConfigOpen, setTimerConfigOpen ] = useState(false);

    function showDialog() {
        if (!dialogOpen) setDialogOpen(true);
    }

    function handleTimeUpDialogClose() {
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

    const handleTimerConfigOpen = () => {
        setTimerConfigOpen(true);
    }

    const handleConfigDialogClose = () => {
        setTimerConfigOpen(false);
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
            <Stack gap={5} alignItems="center">
                <Button onClick={ handleTimerConfigOpen } variant="outlined">Configure Timer</Button>
            </Stack>
            <TimeUpDialog open={dialogOpen} handleClose={ handleTimeUpDialogClose } />
            <TimerConfigDialog open={timerConfigOpen} handleClose={handleConfigDialogClose} onChange={onChange} timerRunning={isRunning} timerPaused={isPaused} />
        </Stack>
    );
}