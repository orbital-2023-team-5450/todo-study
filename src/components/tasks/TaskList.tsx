import React from "react";
import { Card, Checkbox, Typography, Stack, IconButton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { Task } from "../../utils/taskUtils";
import { format, formatDistance } from "date-fns";
import TaskCard from "./TaskCard";

/**
 * A component that displays the list of tasks in the todo-list.
 * @param tasks A list of task objects.
 * @param onTaskChange A function that handles the task when it is completed.
 * @param onTaskDelete A function that handles the task when it is deleted.
 * @param onTaskEdit A function that handles the task when it is editted.
 * @returns The list of the tasks
 */
export default function TaskList({ tasks, onTaskChange, onTaskDelete, onTaskEdit } : 
                                 { tasks : Task[], onTaskChange : (i : number) => void, onTaskDelete : (i : number) => void,
                                   onTaskEdit : (i : number) => void }) {

    /* 
      Event handler for the checkbox. 
    */
    const handleTaskChange = (id : number) => () => {
        onTaskChange(id);
    };
    
    /* 
      Event handler for the Icon button - delete icon. 
    */
    const handleTaskDelete = (id : number) => () => {
        onTaskDelete(id);
    };
    
    /* 
      Event handler for text of the task. 
    */
    const handleTaskEdit = (id : number) => () => {
        onTaskEdit(id);
    }

    return (    
        <>
          <Stack marginTop={3} direction='column'>
            
              {tasks.map((task) => {
                  return (
                    <>
                      <Card 
                        key={task.id} 
                        sx={{ marginLeft: 3, marginRight: 5, marginBottom: 2, marginTop: 0.7,
                              '&:hover': { opacity: [0.9, 0.8, 0.7] }, borderRadius: '10px', height: '70px', borderWidth: '1px',  
                              cursor: 'pointer'}} 
                      >
                          <Stack direction="row" alignItems="center">
                              <Checkbox
                                checked={task.completed}
                                onChange={handleTaskChange(task.id)}
                                sx={{marginTop: '5px'}}
                              />

                              <Stack direction="column" 
                                    component="div" 
                                    onClick={handleTaskEdit(task.id)} 
                                    flexGrow={1} 
                                    display='flex'
                                    marginTop={'5px'} 
                              >
                                  {task.title.length > 30 ? <Typography variant='h5'> 
                                                                {task.title.slice(0, 30) + "..."}
                                                            </Typography>
                                                          : <Typography variant="h5" component='h5'>
                                                                {task.title}
                                                            </Typography>}

                                  <Typography> 
                                      {task.dueDate !== null ? format(new Date(task.dueDate), 'dd MMM yyyy, eee, hh:mm a') 
                                                             : "No due date"}
                                  </Typography>
                              </Stack>

                              <IconButton color="error" onClick={handleTaskDelete(task.id)} sx={{marginTop: '5px'}}>
                                  <DeleteOutline />
                              </IconButton>
                          </Stack>
                      </Card>
                    </>
                  );
                })} 
          </Stack> 
        </>
      );
}