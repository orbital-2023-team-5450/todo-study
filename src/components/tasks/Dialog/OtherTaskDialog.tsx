import { Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React from 'react';
import { Task } from '../../../utils/taskUtils';
import TaskCard from '../TaskCard';

export default function OtherTaskDialog({ open, onClose, completed, expired, setPopUpUpdate, setWhichTask } : 
                                        { open : boolean, onClose : (arg : boolean) => void, completed : Task[], expired : Task[],
                                          setPopUpUpdate : (arg : boolean) => void, 
                                          setWhichTask : (arg : number) => void}) {

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>

            </DialogTitle>
            <DialogContent>
                <Stack direction='column'>
                    <Typography> Completed task </Typography>

                    {completed.map((task : Task) => {
                        return <TaskCard task={task} popUpUpdate={setPopUpUpdate} setWhichTask={setWhichTask}/>;
                    })}

                    <Typography> Expired task </Typography>

                    {expired.map((task : Task) => {
                        return <TaskCard task={task} popUpUpdate={setPopUpUpdate} setWhichTask={setWhichTask}/>;
                    })}
                </Stack>
            </DialogContent>
        </Dialog>
    );
}