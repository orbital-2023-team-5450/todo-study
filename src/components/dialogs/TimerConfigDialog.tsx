import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, FormGroup, FormControlLabel, Stack, Switch } from "@mui/material";
import { fetchTimerSettings, TimerSettings } from "../../utils/timerUtils";
import supabase from "../../supabase";

export default function TimerConfigDialog( { open, handleClose, onChange } : { open : boolean, handleClose : () => void, onChange: () => void }) {

    const [ timerSettings, setTimerSettings ] = useState<TimerSettings>({ user_id: "", use_milliseconds: false, low_time_warning: true});

    async function handleMsChange() {
        const submitInfo : TimerSettings = { ...timerSettings, use_milliseconds: !timerSettings.use_milliseconds };

        const submitMsChange = async () => {
            const { error } = await supabase.from('users_timer_config').update(submitInfo).eq('user_id', timerSettings.user_id);
            if (error !== null) {
                alert("Error updating timer settings: " + JSON.stringify(error));
            }
        };

        submitMsChange();
        onChange();
        fetchTimerSettings(setTimerSettings);
    }

    async function handleLtwChange() {
        const submitInfo : TimerSettings = { ...timerSettings, low_time_warning: !timerSettings.low_time_warning };

        const submitLtwChange = async () => {
            const { error } = await supabase.from('users_timer_config').update(submitInfo).eq('user_id', timerSettings.user_id);
            if (error !== null) {
                alert("Error updating timer settings: " + JSON.stringify(error));
            }
        };

        submitLtwChange();
        onChange();
        fetchTimerSettings(setTimerSettings);
    }

    useEffect(() => {
        fetchTimerSettings(setTimerSettings);
    }, [fetchTimerSettings]);   

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="timer-config-dialog-title"
            aria-describedby="timer-config-dialog-description"
        >
            <DialogTitle id="timer-config-dialog-title">
                Configure Timer
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="timer-config-dialog-description">
                    Configuration Settings
                </DialogContentText>
                <Stack gap={3} component="form">
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={timerSettings.use_milliseconds} onChange={handleMsChange} />} label="Use milliseconds in timer" />
                        <FormControlLabel control={<Switch checked={timerSettings.low_time_warning} onChange={handleLtwChange} />} label="Show warning when less than 5 seconds left" />
                    </FormGroup>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}