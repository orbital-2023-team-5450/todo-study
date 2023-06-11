import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Box, Button, Container, Stack, TextField, Typography,} from "@mui/material";
import supabase from "../supabase";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

type Task = {id : number, title : string, description : string, dueDate : Date, 
    type : number, completed: boolean, userId: number, expired: boolean, deadline: string,
    taskCollectionId: number};

export default function TaskPopUp({open, onClose, insert, fetchTask, id} : 
                                  {open: boolean, id : number
                                   onClose: () => void, insert: boolean, fetchTask: () => void}) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState((new Date()).toISOString());
    const [type, setType] = useState();
    const [completed, setCompleted] = useState(false);
    const [expired, setExpired] = useState(false);
    const [deadline, setDeadline] = useState((new Date()).toISOString());
    const [taskCollectionId, setTaskCollectionId] = useState();
    const [loading, setLoading] = useState(true);

    const fetchInfo = async (id : number) => {

        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;

        supabase.from('tasks').select().eq("id", id).then((result) => {
            
            console.log(result.data);
            if (result.data === null || result.data === undefined || result.error) {
                console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
            } else if (result.data[0] === null || result.data[0] === undefined) {
                // user has not created account yet
                setLoading(false);
            } else if (loading) {
                // user has created account. ensure images do not reload unless
                // the page has been refreshed.
                console.log("pls work");
                setLoading(false);
                setTitle(result.data[0].title);
                setDescription(result.data[0].description);
                setDueDate(result.data[0].dueDate);
                setType(result.data[0].type);
                setCompleted(result.data[0].completed);
            }
        });
    }

    useEffect(() => {
        fetchInfo(id);
    }, [fetchInfo]);

    const submitTask = (event : React.MouseEvent<HTMLElement>) => { // make enter works as well 

        event.preventDefault();
        const getUserID = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const user_id : string = (user === null) ? "" : user.id;
            return user_id;
        }

        getUserID().then((id : string) => {

            if (title == "") {
                alert("Please set a name for the title.")
            } else {
                reset();
                const submitInfo = {
                    "title": title,
                    "description": description,
                    "dueDate": dueDate,
                    "type": type,
                    "completed": completed,
                    "expired": expired,
                    "deadline": deadline,
                    "taskCollectionId": taskCollectionId,
                    "userId": id
                };

                const upsertion = async () => {
                    console.log(submitInfo);
                    if (insert) {
                        const { error } = await supabase.from('tasks').insert(submitInfo);
                        if (error !== null) {
                            alert("Error adding user: " + JSON.stringify(error));
                        } else {}
                    } else {
                        const { error } = await supabase.from('tasks').update(submitInfo).eq('user_id', id);
                        if (error !== null) {
                            alert("Error updating user: " + JSON.stringify(error));
                        } else {}
                    }
                }
                upsertion();
            }
        });        
    }

    // reset the form 
    const reset = () => {

        setTitle("");
        setDescription("");
        setDueDate(new Date().toISOString());
        onClose();
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
        (<Box sx={{position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", backgroundColor: "rgba(50, 50, 50, 0.9)", display: "flex",
                    justifyContent: "center", alignItems: "center", filter: "blur"}} component="div" onClick={reset}>
             <Box sx={{postition: "relative", padding: "32px", width: "100%", maxWidth: "640px", backgroundColor: "white"}}
                  component="div" onClick={(e) => e.stopPropagation()}>

                <Stack direction="column">
                    <Typography component="h4" variant="h4" marginBottom={3}>
                        Create new task
                    </Typography>

                    <Typography component="h6" variant="h6" align="left"> Title </Typography>
                    <TextField
                        type="text"
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={handleTitleTextChange} 
                        required
                        // helperText
                        //error
                    />

                    <Typography component="h6" variant="h6" align="left" marginTop="2vh"> Description </Typography>
                    <TextField
                        type="text"
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={handleDescriptionTextChange} 
                        size="medium"
                        required
                        //helperText
                        //error
                    />

                    <Stack direction='row'> 
                        <Typography component="h6" variant="h6" align="left" marginTop="3vh" flexGrow={0.5}> Date </Typography>
                        <Typography component="h6" variant="h6" align="right" marginTop="3vh"> Time </Typography>
                    </Stack>

                    <Stack direction='row'> 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DesktopDatePicker']} sx={{display: 'flex', flexGrow: '0.5'}}> 
                                <DemoItem>
                                    <DesktopDatePicker 
                                        defaultValue={dayjs((new Date()).toISOString())} 
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

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DesktopTimePicker']} sx={{display: 'flex'}}>
                                <DesktopTimePicker />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Stack>
                    
                </Stack>

                 <Button sx={{position: "relative", top: "1px", right: "1px", marginTop: '5vh'}} onClick={reset}> close </Button>
                 <Button sx={{position: "relative", top: "1px", right: "1px", marginTop: '5vh'}} onClick={submitTask}>submit</Button>
             </Box>
        </Box>)
        : null

    );
}