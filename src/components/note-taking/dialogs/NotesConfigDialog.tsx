import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, FormGroup, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { DEFAULT_NOTES_SETTINGS, NotesSettings, fetchNotes, fetchNotesSettings } from "../../../utils/noteUtils";
import supabase from "../../../supabase";

export default function NotesConfigDialog( { open, handleClose, onChange } : { open : boolean, handleClose : () => void, onChange: () => void }) {

    const [ notesSettings, setNotesSettings ] = useState<NotesSettings>( DEFAULT_NOTES_SETTINGS );

    async function handleAutosaveChange() {
        const submitInfo : NotesSettings = { ...notesSettings, autosave: !notesSettings.autosave };

        const submitMsChange = async () => {
            const { error } = await supabase.from('users_notes_config').update(submitInfo).eq('user_id', notesSettings.user_id);
            if (error !== null) {
                alert("Error updating notes settings: " + JSON.stringify(error));
            }
        };

        submitMsChange();
        onChange();
        fetchNotesSettings(setNotesSettings);
    }
      
    useEffect(() => {
        fetchNotesSettings(setNotesSettings);
    }, []); 

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="notes-config-dialog-title"
        >
            <DialogTitle id="notes-config-dialog-title">
                Configure Notes App
            </DialogTitle>
            <DialogContent>
                <Stack gap={5} component="main">
                    <Typography variant="h6" component="h1">Configuration Settings</Typography>
                    <Stack gap={3} component="form">
                        <FormGroup>
                            <FormControlLabel control={<Switch checked={notesSettings.autosave} onChange={handleAutosaveChange} />} label="Automatically save notes on edit (not working)" />
                        </FormGroup>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}