import { Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import React, { useState } from "react";
import EmptyState from "./emptystate";
import TaskList from "./tasklist";
import supabase from "../supabase";
import { Scrollbars } from 'react-custom-scrollbars';

type Task = {id : number, title : string, description : string, dueDate : Date, 
             type : number, completed: boolean, userId: number, expired: boolean, deadline: string,
             taskCollectionId: number};

export default function TaskManager({ taskType, tasks, fetchTask } : 
                                    { taskType : number, 
                                      tasks : {id : number, title : string, description : string, 
                                               dueDate : Date, type : number, completed: boolean, 
                                               userId: number, expired: boolean, deadline: string,
                                               taskCollectionId: number}[], 
                                      fetchTask : () => void}) {

    const [error, setError] = useState(false);
  
    const handleTaskChange = (id : number) => {

      const task = tasks.find((task : Task) => task.id === id);
      if (task === undefined) {
        alert("There is no such task. It might not exist or it is deleted");
        setError(true);
      } else {
        supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", id)
        .then((result) => {
          if (result.error !== null) {
            alert("Failed to update task!");
            setError(true);
          } else {
            fetchTask();
          }
        });
      }  
    };
  
    const handleTaskDelete = (id : number) => {
      supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .then((result) => {
          if (result.error) {
            alert("Failed to delete task!");
            setError(true);
          } else {
            fetchTask();
          }
        });
    };

    const handleTaskEdit = (id : number) => {
      // 
    }
  
    return (
        <Stack component="main" gap={2} marginTop={2} direction='column'>
          
            <Typography variant="h4" component="h2" marginTop={7}>
              {taskType === 0 ? "Due Soon" : "Future Assignment"}
            </Typography> 
            
            <Stack direction='column' component='div'> 
                <Box component='div' 
                     sx={{bgcolor: "grey", borderRadius: '16px', height: '59.5vh', overflowY: 'auto'}} 
                     marginLeft={4} 
                     marginRight={4} 
                     marginTop={2}
                > 
                  {tasks.length !== 0 ? <TaskList 
                                            tasks={tasks} 
                                            onTaskChange={handleTaskChange} 
                                            onTaskDelete={handleTaskDelete} 
                                            onTaskEdit={handleTaskEdit}
                                            fetchTask={fetchTask}
                                        /> 
                                      : <EmptyState /> 
                    }
                </Box>
            </Stack>
            
        </Stack>   
    );
}