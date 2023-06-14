import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, TextField, Stack, Typography, Card } from "@mui/material";
import { FullWorkRestCycle, TimerSettings, fetchTimerSettings, fetchTimerTemplates, timerToString } from "../../utils/timerUtils";
import { createTextEventHandler } from "../../utils/textInputUtils";
import InputTimerField from "../InputTimerField";
import supabase from "../../supabase";
import { getUsernameFromId } from "../../utils/fetchUserInfo";
import TimerTemplateCard from "../TimerTemplateCard";

export default function SelectTemplateDialog( { open, handleClose, onChange } : { open : boolean, handleClose : () => void, onChange : () => void }) {

    const [ templates, setTemplates ] = useState<FullWorkRestCycle[]>([]);

    useEffect(() => {
        fetchTimerTemplates(setTemplates);
    }, [fetchTimerTemplates]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="select-template-dialog-title"
            aria-describedby="select-template-dialog-description"
        >
            <DialogTitle id="select-template-dialog-title">
                Select a timer template
            </DialogTitle>
            <DialogContent>
                <Stack gap={3}>
                    {
                        templates.map((template) => <TimerTemplateCard template={template} onChange={onChange} />)
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}