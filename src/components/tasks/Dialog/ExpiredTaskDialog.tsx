import React from 'react';
import { Task } from '../../../utils/taskUtils';
import { Clear } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, Stack, Typography, Button } from '@mui/material';
import TaskCard from '../TaskCard';
import EmptyState from '../EmptyState';

export default function ExpiredTaskDialog({ open, onClose, expired, setExpiredTask, setPopUpUpdate, setWhichTask } : 
                                          { open : boolean, onClose : (arg : boolean) => void, expired : Task[],
                                            setExpiredTask : (arg : Task[]) => void, setPopUpUpdate : (arg : boolean) => void, 
                                            setWhichTask : (arg : number) => void}) {

    const handleDeleteExpired = (event: React.MouseEvent<HTMLButtonElement>) => {
        
        event.preventDefault();
        setExpiredTask([]);
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Expired Tasks                  
            </DialogTitle>
            <DialogContent>
                                            
                <Stack direction='column'> 
                    <Stack direction='row'>
                        <Button variant="contained" color="error" onClick={handleDeleteExpired}>
                            <Stack direction="row" spacing={1}>
                                <Clear />
                                <Typography variant="button"> Delete all </Typography>
                            </Stack>
                        </Button>
                    </Stack>
                                            
                    {expired.length !== 0 ? expired.map((task : Task) => {
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