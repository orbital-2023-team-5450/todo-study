import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, FormGroup, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { fetchTimerSettings, fetchTimerTemplateFromId, FullWorkRestCycle, TimerSettings } from "../../../utils/timerUtils";
import supabase from "../../../supabase";
import CreateTemplateDialog from "./CreateTemplateDialog";
import SelectTemplateDialog from "./SelectTemplateDialog";

export default function TimerConfigDialog( { open, handleClose, timerRunning, timerPaused, onChange } : { open : boolean, handleClose : () => void, timerRunning: boolean, timerPaused: boolean, onChange: () => void }) {

    const [ createTemplateDialogOpen, setCreateTemplateDialogOpen ] = useState(false);
    const [ selectTemplateDialogOpen, setSelectTemplateDialogOpen ] = useState(false);
    const [ timerSettings, setTimerSettings ] = useState<TimerSettings>({ user_id: "", use_milliseconds: false, low_time_warning: true, timer_template_id: 1});
    const [ pattern, setPattern ] = useState<FullWorkRestCycle>( { timer_template_id: 1, title: "Pomodoro", description: "A timer using the Pomodoro technique for 4 cycles.", user_id: "", work: 1500000, rest: 300000, cycles: 4 });

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

    function handleCreateTemplateOpen() { setCreateTemplateDialogOpen(true); }
    function handleCreateTemplateClose() { setCreateTemplateDialogOpen(false); }

    function handleSelectTemplateOpen() { setSelectTemplateDialogOpen(true); }
    function handleSelectTemplateClose() { setSelectTemplateDialogOpen(false); }

    useEffect(() => {
        fetchTimerSettings(setTimerSettings);
        fetchTimerTemplateFromId(timerSettings.timer_template_id, setPattern);
    }, [fetchTimerSettings, timerSettings]);   

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="timer-config-dialog-title"
            aria-describedby="timer-config-dialog-description"
        >
            <DialogTitle id="timer-config-dialog-title">
                {timerRunning ? "Warning" : "Configure Timer"}
            </DialogTitle>
            <DialogContent>
                {timerRunning ?
                    <DialogContentText id="timer-config-dialog-running-message">
                        Timer cannot be modified while the timer is running. Try again when the timer is paused.
                    </DialogContentText>
                :
                    <Stack gap={5} component="main">
                        <Typography variant="h6" component="h1">Configuration Settings</Typography>
                        <Stack gap={3} component="form">
                            <FormGroup>
                                <FormControlLabel control={<Switch checked={timerSettings.use_milliseconds} onChange={handleMsChange} />} label="Use milliseconds in timer" />
                                <FormControlLabel control={<Switch checked={timerSettings.low_time_warning} onChange={handleLtwChange} />} label="Show warning when less than 5 seconds left" />
                            </FormGroup>
                        </Stack>
                        <Typography variant="h6" component="h1">Timer Templates</Typography>
                        <Typography component="p">You can select the appropriate work-rest cycle for your timer usage, or create a new timer template if needed.</Typography>
                        <Typography component="p">Current timer template: <b>{ pattern.title }</b></Typography>
                        { timerPaused ?
                            <DialogContentText>
                                Timer template cannot be changed while the timer is paused. Try again when the timer is restarted.
                            </DialogContentText>
                        :
                        <Stack gap={3} direction="row" justifyContent="center">
                            <Button variant="outlined" onClick={ handleSelectTemplateOpen }>Use existing timer template</Button>
                            <Button variant="outlined" onClick={ handleCreateTemplateOpen }>Create timer template</Button>
                        </Stack>
                        }
                    </Stack>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>OK</Button>
            </DialogActions>
            <SelectTemplateDialog open={selectTemplateDialogOpen} handleClose={handleSelectTemplateClose} onChange={onChange} />
            <CreateTemplateDialog open={createTemplateDialogOpen} handleClose={handleCreateTemplateClose} />
        </Dialog>
    );
}