import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import EmptyState from "./EmptyState";
import TaskList from "./TaskList";
import supabase from "../../supabase";

type Task = {id : number, title : string, description : string, dueDate : Date, 
             type : number, completed: boolean, userId: number, expired: boolean, taskCollectionId: number};

export default function TaskManager({ taskType, tasks, fetchTask, popUpUpdate, setWhichTask } : 
                                    { taskType : number, 
                                      tasks : {id : number, title : string, description : string, 
                                               dueDate : Date, type : number, completed: boolean, 
                                               userId: number, expired: boolean, taskCollectionId: number}[], 
                                      fetchTask : () => void, popUpUpdate: React.Dispatch<React.SetStateAction<boolean>>
                                      setWhichTask: React.Dispatch<React.SetStateAction<number>>}) {

    // const [error, setError] = useState(false);
  
    const handleTaskChange = (id : number) => {
      console.log("handleTaskChange");
      const task = tasks.find((task : Task) => task.id === id);
      if (task === undefined) {
        alert("There is no such task. It might not exist or it is deleted");
      } else {
        supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", id)
        .then((result) => {
          if (result.error !== null) {
            alert("Failed to update task!");
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
          } else {
            fetchTask();
          }
        });
    };

    const handleTaskEdit = (id : number) => {
      
        popUpUpdate(true);
        setWhichTask(id);
        fetchTask();
    }
  
    return (
        <Stack component="main" gap={2} marginTop={2} direction='column'>
          
            <Stack direction='row' marginLeft='3vh'> 
                <Typography variant="h4" component="h2" marginTop={7}>
                    {taskType === 0 ? "Due Today" : "Future Assignment"}
                </Typography> 

                {/* <IconButton>
                    <SortIcon />
                </IconButton> */}
            </Stack>
            
            <Stack direction='column' component='div'> 
                <Box component='div' 
                     sx={{bgcolor: "white", borderRadius: '16px', height: '59.5vh', overflowY: 'auto'}} 
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