import React from 'react';
import { Card, Checkbox, IconButton, Stack, Typography, } from '@mui/material';
import { Task } from '../../utils/taskUtils';
import { format, formatDistance } from "date-fns";
import { DeleteOutline } from '@mui/icons-material';

export default function TaskCard({ task, popUpUpdate, setWhichTask, onTaskChange, onTaskDelete } : 
                                 { task : Task, popUpUpdate : (arg : boolean) => void, setWhichTask : (arg : number) => void, onTaskChange : (arg : number) => void, onTaskDelete : (arg : number) => void}) {

    return (
        <Card 
            key={task.id} 
            sx={{ marginLeft: 3, marginRight: 5, marginBottom: 2, marginTop: 0.7,
            '&:hover': { opacity: [0.9, 0.8, 0.7] }, borderRadius: '10px', height: '70px', borderWidth: '1px', borderColor: task.expired ? 'red' : task.completed ? 'green' : 'inherit',
            cursor: 'pointer'}} 
        >
            <Stack direction="row" alignItems="center">

            <Checkbox
                        checked={task.completed}
                        onChange={() => { onTaskChange(task.id) } }
                        sx={{marginTop: '5px'}}
                    />
                <Stack direction="column" 
                    component="div" 
                    onClick={() => {popUpUpdate(true);
                                    setWhichTask(task.id);}} 
                    flexGrow={1} 
                    display='flex'
                    marginTop={'5px'} 
                >
                    <Typography variant='h5' sx={{color: (task.expired ? 'red' : task.completed ? 'green' : 'inherit')}}> 
                        {task.title.length > 30 ? task.title.slice(0, 30) + "..."
                                                : task.title
                        }
                    </Typography>
                    <Typography> 
                        {task.dueDate !== null ? format(new Date(task.dueDate), 'eee, dd MMM yyyy, hh:mm a') 
                                                : "No due date"}
                    </Typography>
                </Stack>
                <IconButton color="error" onClick={ () => onTaskDelete(task.id) } sx={{marginTop: '5px'}}>
                    <DeleteOutline />
                </IconButton>
            </Stack>
        </Card>
    );
}