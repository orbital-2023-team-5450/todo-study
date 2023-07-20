import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, Icon, IconButton, 
         InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import supabase from "../../supabase";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickerChangeHandlerContext } from "@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types";
import { DateTimeValidationError } from "@mui/x-date-pickers";
import SortTaskFilter from "./SortTaskFilter";

/**
 * A component that is displayed to facilitate the creation and update of a task.
 * 
 * @param open A switch to determine if the this pop up is displayed.
 * @param onClose A useState setter to close the pop up.
 * @param taskType The purpose of the task.
 * @param id The task to be changed according to the id.
 * @param fetchTask A function thats is called whenever there is any change to any task to update the shown page.
 * @returns A pop up for the creation and update for the task.
 */
export default function TaskPopUp({ open, onClose, taskType, id, fetchTask } : 
                                  { open: boolean, onClose: () => void, taskType: string, id : number, fetchTask : () => void }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<string | null>(null);
    const [type, setType] = useState<string>("");
    const [completed, setCompleted] = useState(false);
    const [expired, setExpired] = useState(false);
    const [taskCollectionId, setTaskCollectionId] = useState();
    const [isDisabled, setIsDisabled] = useState(false);

    /*
        An asyncronous function to fetch the data of the task and assign each of them
        to the useState variable accordingly.
    */
    const fetchInfo = async () => {

        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
    
        if (id !== -1) {
            supabase.from('tasks').select().eq('userId', user_id).eq("id", id).then((result) => {
            
                console.log(result.data);
                if (result.data === null || result.data === undefined || result.error) {
                    console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
                } else if (result.data[0] === null || result.data[0] === undefined) {
                    // this should never be reached
                } else {
                    setTitle(result.data[0].title);
                    setDescription(result.data[0].description);
                    setDueDate(result.data[0].dueDate);
                    setType(result.data[0].type);
                    setCompleted(result.data[0].completed);
                }
            });
        }  
    }

    useEffect(() => {
        fetchInfo();
    }, [open]);

    /*
        Handle the submission or the update of the task for the button.
    */
    const submitTask = (event : React.SyntheticEvent) => { 

        event.preventDefault();
        setIsDisabled(true);
        const getUserID = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const user_id : string = (user === null) ? "" : user.id;
            return user_id;
        }

        getUserID().then((userId : string) => {

            if (title === "") {

                alert("Please set a name for the title.")
                setIsDisabled(false);
            } else if (type === "") {

                alert("Please set a type for the task.")
                setIsDisabled(false);
            } else {

                reset();
                const submitInfo = {

                    "userId": userId,
                    "title": title,
                    "description": description,
                    "dueDate": dueDate,
                    "type": type,
                    "completed": completed,
                    "expired": expired,
                    "taskCollectionId": taskCollectionId,
                };

                const upsertion = async () => {
                    console.log(submitInfo);
                    if (taskType === 'Create') {
                        const { error } = await supabase.from('tasks').insert(submitInfo);
                        if (error !== null) {
                            alert("Error creating task: " + JSON.stringify(error));
                        } else {}
                    } else {
                        const { error } = await supabase.from('tasks').update(submitInfo).eq('userId', userId).eq('id', id);
                        if (error !== null) {
                            alert("Error updating task: " + JSON.stringify(error));
                        } else {}
                    }
                }
                upsertion();
            }
        });     
        fetchTask();
    }

    /* 
        Reset the form whenever a task is updated or created.
    */ 
    const reset = () => {

        onClose();
        setTitle("");
        setDescription("");
        setDueDate(null);
        setIsDisabled(false);
    }

    /*
        Handle the event to assign the title of the form to the according variable.
    */
    const handleTitleTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {

        event.preventDefault();
        setTitle(event.currentTarget.value);
    }

    /*
        Handle the event to assign the desciption of the form to the according variable.
    */
    const handleDescriptionTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {

        event.preventDefault();
        setDescription(event.currentTarget.value);
    }

    const handleDateTimeChange = (value: Dayjs | null, content: PickerChangeHandlerContext<DateTimeValidationError>) => {  

        if (value === null || content.validationError !== null) {
        } else {
            setDueDate(value.toISOString());
        }
    }

    /*
        Handle the clear event and reset the dateTimepicker
    */
    const handleClear = (event : React.MouseEvent<HTMLElement>) => {
        
        event.preventDefault();
        setDueDate(null);
    }

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setType(event.target.value);
    }

    return (
        <Dialog open={open} onClose={reset}>
            <DialogTitle>
                <Typography component="h4" variant="h4" marginBottom={3}>
                    {taskType === 'Create' ? ' Create new task' : 'Update task'}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{width: '600px'}}>
            <Stack direction="column">

                 <Typography component="h6" variant="h6" align="left" marginBottom='1vh'> Title </Typography>
                     <TextField
                        type="text"
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={handleTitleTextChange} 
                        required
                    />

                    <Typography component="h6" variant="h6" align="left" marginTop="2vh" marginBottom='1vh'> Description </Typography>
                    <TextField
                        type="text"
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={handleDescriptionTextChange} 
                        size="medium"
                    />

                    <Stack direction='row'> 
                        <Stack direction='column'> 
                            <Typography component="h6" variant="h6" align="left" marginTop="3vh" flexGrow={1}> 
                                Date and Time 
                            </Typography>

                            <Stack direction='row'> 
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DesktopDatePicker']} sx={{display: 'flex'}}> 
                                        <DemoItem>
                                            <DateTimePicker 
                                                defaultValue={dayjs((new Date()))} 
                                                value={dayjs(dueDate)} 
                                                onChange={handleDateTimeChange}
                                                minDateTime={dayjs(new Date())}
                                                format="DD/MM/YYYY hh:mm A"
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>

                                <Button onClick={handleClear} sx={{color: '#00bf63'}}> 
                                    Clear
                                </Button>
                            </Stack>
                        </Stack>

                        <Stack direction='column' marginTop="3vh" marginLeft='3vh'>
                            <Typography variant='h6'>
                                Type of the task
                            </Typography>

                            <SortTaskFilter searchType={type} handleChangeSelect={handleChangeSelect} />
                        </Stack>
                    </Stack>

                    <Typography display='flex' flexGrow={0.5} fontSize='1.5vh'> 
                        The year selected must be within 
                        <br/>current year to 2099 (inclusive) 
                    </Typography>
                    

                </Stack>

                <Stack direction='row' sx={{justifyContent: 'right'}}> 
                    <Button sx={{position: "relative", top: "1px", right: "1px", marginTop: '5vh', color: '#00bf63'}} 
                            onClick={reset}
                            disabled={isDisabled}
                    > 
                        close 
                    </Button>
                    <Button sx={{position: "relative", top: "1px", right: "1px", marginTop: '5vh', color: '#00bf63'}} 
                            disabled={isDisabled}
                            onClick={submitTask}
                    >
                        {taskType}
                    </Button>
                </Stack>
                 
            </DialogContent>
        </Dialog> 
            
    );
}