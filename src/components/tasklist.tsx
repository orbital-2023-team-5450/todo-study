import React from "react";
import { Typography, Card, Stack, Checkbox, IconButton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import TaskPopUp from "./taskpopup";

type Task = {id : number, title : string, description : string, dueDate : Date, 
  type : number, completed: boolean, userId: number, expired: boolean, deadline: string,
  taskCollectionId: number};

export default function TaskList({ tasks, onTaskChange, onTaskDelete, onTaskEdit, fetchTask } : 
                                 { tasks :Task[], 
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
          <Stack marginTop={5}>
            {tasks.map((task) => {
              return (
                <>
                  <Card 
                    key={task.id} 
                    sx={{ marginLeft: 3, marginRight: 3, marginBottom: 3, 
                          '&:hover': {backgroundColor: 'primary.main', opacity: [0.9, 0.8, 0.7]},
                          borderRadius: '10px', }}        
                  >
                    <Stack direction="row" alignItems="center" >
                      <Checkbox
                        checked={task.completed}
                        onChange={handleTaskChange(task.id)}
                      />
                      <Stack direction="column" component="div" onClick={handleTaskEdit(task.id)} flexGrow={1}>
                        <Typography flexGrow={1}>{task.title}</Typography>
                        <Typography> {task.dueDate + ""}</Typography>
                      </Stack>
                      <IconButton color="error" onClick={handleTaskDelete(task.id)}>
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