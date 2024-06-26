import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Search, Sort } from "@mui/icons-material"
import React from "react";
import EmptyState from "./EmptyState";
import TaskList from "./TaskList";
import supabase from "../../supabase";
import { Task } from "../../utils/taskUtils";

/**
 * A component that displays the todo-list of the feature. 
 * 
 * @param taskType The purpose of the task.
 * @param tasks The list of task object.
 * @param fetchTask A function thats is called whenever there is any change to any task to update the shown page.
 * @param popUpUpdate A useState setter to set the existence of the dialog of the task.
 * @param setWhichTask A useState setter to set the task that is required to be updated with its id.
 * @returns The todo-list of the feature
 */
export default function TaskManager({ taskType, tasks, fetchTask, popUpUpdate, setWhichTask, setMenuSortOpen } : 
                                    { taskType : number, tasks : Task[], 
                                      fetchTask : () => void, popUpUpdate: React.Dispatch<React.SetStateAction<boolean>>
                                      setWhichTask: React.Dispatch<React.SetStateAction<number>>,
                                      setMenuSortOpen : (arg : boolean) => void}) {
  
    /* 
      Handle the change of status of completed of the task in the database.
    */
    const handleTaskChange = (id : number) => {
      
      const task = tasks.find((task : Task) => task.id === id);
      if (task === undefined) {
        alert("There is no such task. It might not exist or it is deleted");
      } else {
        supabase.from("tasks").update({ completed: !task.completed }).eq("id", id)
          .then((result) => {
            if (result.error !== null) {
              alert("Failed to update task!");
            } else {
              fetchTask();
            }
          });
      }  
    };
  
    /* 
      Handle the deletion of the task in the database.
    */
    const handleTaskDelete = (id : number) => {

      supabase.from("tasks").delete().eq("id", id)
          .then((result) => {
            if (result.error) {
              alert("Failed to delete task!");
            } else {
              fetchTask();
            }
          });
    };

    /* 
      Handle the change of a task in the database.
    */
    const handleTaskEdit = (id : number) => {
      
        popUpUpdate(true);
        setWhichTask(id);
        fetchTask();
    } 
  
    return (
        <Stack component="main" gap={2} marginTop={2} direction='column' sx={{border: '1px solid', borderRadius: '20px'}}>
            <Stack direction='row' marginLeft='3vh' display="flex" alignItems="center"> 
                <Typography variant="h4" component="h2" marginTop={7} display='flex' flexGrow='0.95'>
                    {taskType === 0 ? "Due in a Day" : "Due soon"}
                </Typography> 
            </Stack>
            
            <Stack direction='column' component='div'> 
                <Box component='div' 
                     sx={{borderRadius: '16px', height: '59.5vh', overflowY: 'auto'}} 
                     marginLeft={4} 
                     marginRight={4} 
                     marginTop={2}
                > 
                  {tasks.length !== 0 ? <TaskList 
                                            tasks={tasks} 
                                            onTaskChange={handleTaskChange} 
                                            onTaskDelete={handleTaskDelete} 
                                            onTaskEdit={handleTaskEdit}
                                        /> 
                                      : <EmptyState /> 
                    }
                </Box>
            </Stack>
            
        </Stack>   
    );
}
