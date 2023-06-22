import React from "react";
import { Card, Checkbox, Typography, Stack, IconButton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { Task } from "../../utils/taskUtils";

export default function TaskList({ tasks, onTaskChange, onTaskDelete, onTaskEdit, fetchTask } : 
                                 { tasks : Task[], 
                                   onTaskChange : (i : number) => void, onTaskDelete : (i : number) => void,
                                   onTaskEdit : (i : number) => void, fetchTask: () => void}) {

    const handleTaskChange = (id : number) => () => {
        onTaskChange(id);
    };
    
    const handleTaskDelete = (id : number) => () => {
        onTaskDelete(id);
    };
    
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
                        sx={{ marginLeft: 3, marginRight: 5, marginBottom: 3, marginTop: 0.7,
                              '&:hover': {backgroundColor: !task.expired ? task.completed ? 'Green' : 'grey' : 'red', 
                              opacity: [0.9, 0.8, 0.7]}, borderRadius: '10px', height: '70px', 
                              backgroundColor: !task.expired ? task.completed ? 'lightGreen' : 'white' : 'pink'}}        
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
                                      {new Date(task.dueDate).toUTCString() + ""}
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