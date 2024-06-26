import React, { useState } from 'react';
import { Stack, Typography, Button } from "@mui/material"
import { WorkRestCycle, timerToString } from '../../utils/timerUtils';
import { useTimer } from '../../hooks/useTimer';
import TimeUpDialog from './dialogs/TimeUpDialog';
import TimerConfigDialog from './dialogs/TimerConfigDialog';

type Variant = 	'body1'
| 'body2'
| 'button'
| 'caption'
| 'h1'
| 'h2'
| 'h3'
| 'h4'
| 'h5'
| 'h6'
| 'inherit'
| 'overline'
| 'subtitle1'
| 'subtitle2';

export default function TimerView({ pattern, showMs, onChange, textVariant = "h1", showConfigButton = true, displayTitle = true, onRun=()=>{}, onReset=()=>{} } : { pattern : WorkRestCycle, showMs : boolean, onChange : () => void, textVariant? : Variant, showConfigButton? : boolean, displayTitle? : boolean, onRun? : () => void, onReset? : () => void }) {

    const [ dialogOpen, setDialogOpen ] = useState(false);
    const [ timerConfigOpen, setTimerConfigOpen ] = useState(false);

    function showDialog() {
        if (!dialogOpen) {
            setDialogOpen(true);
            onReset();
        }
    }

    function handleTimeUpDialogClose() {
        setDialogOpen(false);
    }

    const { start, stop, reset, isRunning, isPaused, displayedTime, currentStatus } = useTimer(pattern, showDialog);
    
    function handleTimer() {
        if (isRunning) {
            stop();
        } else {
            if (!isPaused) onRun();
            start();
        }
    }

    const timerDisplay = timerToString(displayedTime, showMs);

    if (displayTitle) {
        if (isRunning) { 
            document.title = timerDisplay + " - Study Timer // TODO: Study";
        } else if (isPaused) {
            document.title = "[PAUSED] " + timerDisplay + " - Study Timer // TODO: Study";
        } else {
            document.title = "Study Timer // TODO: Study";
        }
    }

    const handleTimerConfigOpen = () => {
        setTimerConfigOpen(true);
    }

    const handleConfigDialogClose = () => {
        setTimerConfigOpen(false);
    }

    const statusString = () => {
        if (isRunning || isPaused) {
            if (currentStatus.isWork) {
                return "Work" + (isPaused ? " (paused)" : "");
            } else {
                return "Rest" + (isPaused ? " (paused)" : "");
            }
        } else {
            return "Not Running";
        }
    }

    const handleReset = () => {
        reset();
        onReset();
    }

    return (
        <Stack gap={3} component="section">
            <Typography textAlign="center" variant={ textVariant } component="h2">
                { timerDisplay }
            </Typography>
            <Typography textAlign="center" variant="body1" component="h3">
                Status: <strong>{statusString()}</strong> | Cycle { currentStatus.cycles + 1 } of { pattern.cycles }
            </Typography>
            <Stack gap={5} direction="row" justifyContent="center">
                <Button variant="outlined" onClick={ handleTimer }>
                    { isRunning ? "Pause" : "Start" } Timer</Button>
                <Button variant="outlined" onClick={ handleReset }>Reset Timer</Button>
            </Stack>
            { showConfigButton ? (
            <Stack gap={5} alignItems="center">
                <Button onClick={ handleTimerConfigOpen } variant="outlined">Configure Timer</Button>
            </Stack>
            ) : <></> }
            <TimeUpDialog open={dialogOpen} handleClose={ handleTimeUpDialogClose } />
            <TimerConfigDialog open={timerConfigOpen} handleClose={handleConfigDialogClose} onChange={onChange} timerRunning={isRunning} timerPaused={isPaused} />
        </Stack>
    );
}