import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import supabase from "../../supabase";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function TaskPopUp({ open, onClose, taskType, id } : 
                                  { open: boolean, onClose: () => void, taskType: string, id : number}) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState((new Date()).toISOString());
    const [type, setType] = useState();
    const [completed, setCompleted] = useState(false);
    const [expired, setExpired] = useState(false);
    const [taskCollectionId, setTaskCollectionId] = useState();
    const [loading, setLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);

    const fetchInfo = async () => {

        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;

        if (id !== -1) {
            supabase.from('tasks').select().eq('userId', user_id).eq("id", id).then((result) => {
            
                console.log(result.data);
                if (result.data === null || result.data === undefined || result.error) {
                    console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
                } else if (result.data[0] === null || result.data[0] === undefined) {
                    // setLoading(false);
                    
                } else if (loading) {
                    
                    console.log("try")
                    setLoading(false);
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
    }, [fetchInfo]);

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
                    if (taskType == 'Create') {
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
    }

    // reset the form 
    const reset = () => {

        onClose();
        setTitle("");
        setDescription("");
        setDueDate(new Date().toISOString());
        setIsDisabled(false);
    }

    const handleTitleTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {

        event.preventDefault();
        setTitle(event.currentTarget.value);
    }

    const handleDescriptionTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {

        event.preventDefault();
        setDescription(event.currentTarget.value);
    }

    return ( open ? 
        <Box sx={{position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", backgroundColor: "rgba(50, 50, 50, 0.9)", 
                  display: "flex", justifyContent: "center", alignItems: "center", filter: "blur"}} 
             component="div" 
             onClick={reset}
        >
             <Box sx={{position: "relative", padding: "32px", width: "100%", maxWidth: "640px", backgroundColor: "white"}}
                  component="form"
                  onSubmit={submitTask} 
                  onClick={(e) => e.stopPropagation()}
             >
                <Stack direction="column">
                    <Typography component="h4" variant="h4" marginBottom={3}>
                        {taskType} new task
                    </Typography>

                    <Typography component="h6" variant="h6" align="left"> Title </Typography>
                    <TextField
                        type="text"
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={handleTitleTextChange} 
                        required
                    />

                    <Typography component="h6" variant="h6" align="left" marginTop="2vh"> Description </Typography>
                    <TextField
                        type="text"
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={handleDescriptionTextChange} 
                        size="medium"
                    />

                    <Stack direction='row'> 
                        <Typography component="h6" variant="h6" align="left" marginTop="3vh" flexGrow={0.5}> 
                            Date and Time 
                        </Typography>
                    </Stack>

                    <Stack direction='row'> 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DesktopDatePicker']} sx={{display: 'flex', flexGrow: '0.5'}}> 
                                <DemoItem>
                                    <DateTimePicker 
                                        defaultValue={dayjs((new Date()))} 
                                        value={dayjs(dueDate)} 
                                        onChange={(value) => {  
                                            if (value == null) {
                                            } else {
                                                setDueDate(value.toISOString());
                                            }
                                        }}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                    </Stack>
                    
                </Stack>

                 <Button sx={{position: "relative", top: "1px", right: "1px", marginTop: '5vh'}} 
                         onClick={reset}
                         disabled={isDisabled}
                 > 
                    close 
                 </Button>
                 <Button sx={{position: "relative", top: "1px", right: "1px", marginTop: '5vh'}} 
                         disabled={isDisabled}
                         type='submit'
                 >
                    {taskType}
                 </Button>
             </Box>
        </Box> : null
    );
}