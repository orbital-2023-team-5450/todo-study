import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, TextField, Stack, Typography, Container } from "@mui/material";
import { getCycleFromTemplate, isValidPattern } from "../../../utils/timerUtils";
import { createNumericTextEventHandler, createTextEventHandler } from "../../../utils/textInputUtils";
import InputTimerField from "../InputTimerField";
import supabase from "../../../supabase";

export default function CreateTemplateDialog( { open, handleClose } : { open : boolean, handleClose : () => void }) {

    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ work, setWork ] = useState<number>(0);
    const [ rest, setRest ] = useState<number>(0);
    const [ cycles, setCycles ] = useState<number>(0);

    const handleTitleTextChange = createTextEventHandler(setTitle);
    const handleDescriptionTextChange = createTextEventHandler(setDescription);

    // although 0 is not accepted as an input, it has to be left there to ensure users
    // are able to change the number of cycles more easily in the component. further
    // validation in this code will prevent 0 from being accepted as input.
    const handleCyclesTextChange = createNumericTextEventHandler(setCycles, 0, Infinity);

    async function handleSubmit( event : React.SyntheticEvent<HTMLElement> ) {
        event.preventDefault();
        
        console.log("tr");
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
        
        const submitInfo = {
            user_id: user_id,
            title: title,
            description: description,
            work: work,
            rest: rest,
            cycles: cycles,
            created_at: ((new Date()).toISOString()),
        }

        async function insert() {
            const { error } = await supabase.from('timer_templates').insert(submitInfo);

            if (error !== null) {
                alert("Error adding timer template: " + JSON.stringify(error));
            }
        }

        if (!Number.isInteger(parseFloat(cycles.toString())) || cycles <= 0) {
            alert("Pattern is invalid! Ensure the number of cycles is a positive integer.");
        } else if (work <= 0) {
            alert("Pattern is invalid! Ensure that the amount of work done is positive!");
        } else if (rest < 0) {
            alert("Pattern is invalid! Rest time cannot be negative. If you don't need rest time, you can leave rest time as 0.")
        } else if (!isValidPattern(getCycleFromTemplate({...submitInfo, timer_template_id: 0}))) {      
            alert("Pattern is invalid! Ensure the work/rest length is at least zero and there are at least 1 cycle!");
        } else {
            insert();
            handleClose();
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="timer-template-dialog-title"
            aria-describedby="timer-template-dialog-description"
        >
            <DialogTitle id="timer-template-dialog-title">
                Create a timer template
            </DialogTitle>
            <DialogContent>
                <Stack gap={5} component="form" id="timer-template-dialog-form" onSubmit={handleSubmit}>
                    <DialogContentText id="timer-template-dialog-description">
                        Timer details
                    </DialogContentText>
                    <TextField sx={{width:"95%"}} type="text" label="Title" required variant="outlined" value={title} onChange={handleTitleTextChange} />
                    <TextField sx={{width:"95%"}} type="text" label="Description" variant="outlined" value={description} onChange={handleDescriptionTextChange} />
                    <InputTimerField title="Work" value={ work } setValue={setWork} reset={false} setReset={null} />
                    <InputTimerField title="Rest" value={ rest } setValue={setRest} reset={false} setReset={null} />
                    <Typography component="h1" variant="h6">Cycles</Typography>
                    <TextField sx={{width:"95%"}} type="text" label="Cycles" variant="outlined" value={cycles} onChange={handleCyclesTextChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>Cancel</Button>
                <Button type="submit" form="timer-template-dialog-form" autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}