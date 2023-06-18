import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography } from "@mui/material";
import { FullWorkRestCycle, fetchTimerTemplates } from "../../../utils/timerUtils";
import TimerTemplateCard from "../TimerTemplateCard";

export default function SelectTemplateDialog( { open, handleClose, onChange } : { open : boolean, handleClose : () => void, onChange : () => void }) {
    
    const [ templates, setTemplates ] = useState<FullWorkRestCycle[]>([]);

    useEffect(() => {
        fetchTimerTemplates(setTemplates);
    }, [setTemplates, templates]);
    
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="select-template-dialog-title"
            aria-describedby="select-template-dialog-description"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="select-template-dialog-title">
                Select a timer template
                <Typography component="p">Note that it will take a short while for the timer to update once the timer template is selected.</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack gap={3}>
                    {
                        templates.map((template) => <TimerTemplateCard template={template} onChange={onChange} onDelete={() => fetchTimerTemplates(setTemplates)} />)
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}