import React, { useEffect, useState} from "react";
import {Box, Container, CssBaseline, Stack, Typography} from "@mui/material";
import supabase from "../supabase";
import TaskManager from "./taskmanager";

type Task = {id : number, title : string, description : string, 
             dueDate : Date, type : number, completed: boolean, 
             userId: number, expired: boolean, deadline: string,
             taskCollectionId: number};

enum task_type { DUE_SOON, FUTURE_ASSIGNMENT };

export default function TaskScreen() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [futureTasks, setFutureTasks] = useState<Task[]>([]);
    const [expiredTasks, setExpiredTasks] = useState<Task[]>([]);
    const [error, setError] = useState(false);
    
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

                setTasks(result.data as {id : number, title : string, description : string, 
                                                        dueDate : Date, type : number, completed: boolean, 
                                                        userId: number, expired: boolean, deadline: string,
                                                        taskCollectionId: number}[])
            //     const [now, later, expired] = splitTask(result.data as {id : number, title : string, description : string, 
            //                                     dueDate : Date, type : number, completed: boolean, 
            //                                     userId: number, expired: boolean, deadline: string,
            //                                     taskCollectionId: number}[]);
            //     setFutureTasks(later);
            //     setTasks(now);
            //     setExpiredTasks(expired);
            }
            
          })};
      
      useEffect(() => {
        fetchTasks();
      }, [fetchTasks]);

    const splitTask = (tasks : Task[]) => {

        const now : Task[] = [];
        const later : Task[] = [];
        const expired : Task[] = [];

        let tdy = new Date();
        tasks.map((task) => {

            
            console.log(task.dueDate)

            if (task.dueDate > tdy && getDayDifference(task.dueDate, tdy) <= 1){
                now.push(task);
            } else if (task.dueDate > tdy && getDayDifference(task.dueDate, tdy) > 1) {
                later.push(task);
            } else {
                expired.push(task);
            }
        });

        return [now, later, expired];
    }

    const getDayDifference = (date1 : Date, date2 : Date) => {
        const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
      
        // Convert the dates to milliseconds
        const time1 = date1.getTime();
        const time2 = date2.getTime();
      
        // Calculate the difference in days
        const diffDays = Math.round(Math.abs((time1 - time2) / oneDay));
      
        return diffDays;
    }

    return (
        <Stack direction="row" marginTop={1}>
            <CssBaseline />
            <Container maxWidth="md">
                <Box sx={{ bgcolor: '#cfe8fc', height: '85vh', borderRadius: '16px', ":hover": "white"}}> 
                    <TaskManager 
                        taskType={task_type.DUE_SOON} 
                        tasks={tasks}
                        fetchTask={fetchTasks} 
                    />
                </Box>
            </Container>

            <Container maxWidth="md">
                <Box sx={{ bgcolor: '#cfe8ff', height: '85vh', borderRadius: '16px' }}> 
                    {/* <TaskManager // cover the add button
                        taskType={task_type.FUTURE_ASSIGNMENT} 
                        tasks={futureTasks}
                        fetchTask={fetchTasks}
                    /> */}
                </Box>
            </Container>

        {/* {error && "Error! Failed to load tasks"}
        {!tasks && !error && "Loading..."} */}
        </Stack>

    );
}