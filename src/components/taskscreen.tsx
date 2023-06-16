import React, { useEffect, useState} from "react";
import {Box, Button, CssBaseline, Stack, Typography} from "@mui/material";
import supabase from "../supabase";
import TaskManager from "./taskmanager";
import splitTask from "./../utils/splitTask";
import TaskPopUp from "./taskpopup";

type Task = {id : number, title : string, description : string, 
             dueDate : Date, type : number, completed: boolean, 
             userId: number, expired: boolean, taskCollectionId: number};

enum task_type { DUE_SOON, FUTURE_ASSIGNMENT };

export default function TaskScreen() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [futureTasks, setFutureTasks] = useState<Task[]>([]);
    const [isPopUp, setPopUp] = useState(false);
    
    const handleNewTaskSubmit = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        setPopUp(true);
    };

    const fetchTasks = async () => {

      const { data: { user } } = await supabase.auth.getUser();
      const user_id : string = (user === null) ? "" : user.id;

        supabase
          .from("tasks")
          .select()
          .eq("userId", user_id)
          .order("id")
          .then((result) => {
            if (result.data === null || result.data === undefined) {

            } else {
                const [now, later, expired] = splitTask(result.data as {id : number, title : string, description : string, 
                                                dueDate : Date, type : number, completed: boolean, 
                                                userId: number, expired: boolean, taskCollectionId: number}[]);
                setFutureTasks(later);
                setTasks(now.concat(expired));
            }  
          })};
      
      useEffect(() => {
        fetchTasks();
      }, [fetchTasks]);

    return (

        <Stack direction='column'> 
            <Stack direction="row" marginTop='10px' marginLeft='20vh' marginRight='20vh'>
                <CssBaseline />
                    <Box sx={{ bgcolor: '#cfe8fc', height: '75vh', borderRadius: '16px', width: "80vh", marginRight: '10px'}}> 
                        <TaskManager 
                            taskType={task_type.DUE_SOON} 
                            tasks={tasks}
                            fetchTask={fetchTasks} 
                        />
                    </Box>

                    <Box sx={{ bgcolor: '#cfe8ff', height: '75vh', borderRadius: '16px', width: "80vh", marginLeft: '10px' }}> 
                        <TaskManager // cover the add button
                            taskType={task_type.FUTURE_ASSIGNMENT} 
                            tasks={futureTasks}
                            fetchTask={fetchTasks}
                        />
                    </Box>
            </Stack>

            <Button
                type="submit"
                variant="contained"
                size="medium"
                onClick={handleNewTaskSubmit}
                sx={{marginLeft: "20vh", marginRight: "21vh", marginTop: '2vh', height: '9vh', borderRadius: '10px'}}
            >
                 <Typography variant='h6'> + Add new task </Typography>
            </Button>

            {isPopUp && <TaskPopUp onClose={() => setPopUp(false)} insert fetchTask={fetchTasks} id={0}/> }
        </Stack>
            

    );
}