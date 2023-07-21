import React from 'react';
import { Task } from '../../../utils/taskUtils';
import { Clear } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, Stack, Typography, Button } from '@mui/material';
import TaskCard from '../TaskCard';
import EmptyState from '../EmptyState';

export default function CompletedTaskDialog({ open, onClose, completed, setCompletedTask, setPopUpUpdate, setWhichTask } : 
                                            { open : boolean, onClose : (arg : boolean) => void, completed : Task[],
                                              setCompletedTask : (arg : Task[]) => void, setPopUpUpdate : (arg : boolean) => void, 
                                              setWhichTask : (arg : number) => void}) {

    const handleDeleteCompleted = (event: React.MouseEvent<HTMLButtonElement>) => {
        
        event.preventDefault();
        setCompletedTask([]);
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Completed tasks                     
            </DialogTitle>
            <DialogContent>
                                            
                <Stack direction='column'> 
                    <Stack direction='row'>
                        <Button variant="contained" color="error" onClick={handleDeleteCompleted}>
                            <Stack direction="row" spacing={1}>
                                <Clear />
                                <Typography variant="button"> Delete all </Typography>
                            </Stack>
                        </Button>
                    </Stack>
                                            
                    {completed.length !== 0 ? completed.map((task : Task) => {
                                                return <TaskCard 
                                                        task={task} 
                                                        popUpUpdate={setPopUpUpdate} 
                                                        setWhichTask={setWhichTask}
                                                        />;
                                                })
                                            : <EmptyState />
                    }
                </Stack>                                                                                     
            </DialogContent>
        </Dialog>
    );
}