import React from 'react';
import { Card, Stack, Typography, } from '@mui/material';
import { Task } from '../../utils/taskUtils';
import { format, formatDistance } from "date-fns";

export default function TaskCard({ task, popUpUpdate, setWhichTask } : 
                                 { task : Task, popUpUpdate : (arg : boolean) => void, setWhichTask : (arg : number) => void}) {

    return (
        <Card 
            key={task.id} 
            sx={{ marginLeft: 3, marginRight: 5, marginBottom: 2, marginTop: 0.7,
            '&:hover': {backgroundColor: !task.expired ? task.completed ? '#00cc00' : '#d9d9d9' : '#ff6680', 
            opacity: [0.9, 0.8, 0.7] }, borderRadius: '10px', height: '70px', 
            backgroundColor: !task.expired ? task.completed ? 'lightGreen' : '#f2f2f2' : 'pink', 
            cursor: 'pointer'}} 
        >
            <Stack direction="row" alignItems="center">

                <Stack direction="column" 
                    component="div" 
                    onClick={() => {popUpUpdate(true);
                                    setWhichTask(task.id);}} 
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
                        {task.dueDate !== null ? format(new Date(task.dueDate), 'dd/MMM/yyyy, hh:mm a, eee') 
                                                : "No due date"}
                    </Typography>
                </Stack>
            </Stack>
        </Card>
    );
}