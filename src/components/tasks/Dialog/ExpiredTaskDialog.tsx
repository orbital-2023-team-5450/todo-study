import React from 'react';
import { Task } from '../../../utils/taskUtils';
import { Clear } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, Stack, Typography, Button } from '@mui/material';
import TaskCard from '../TaskCard';
import EmptyState from '../EmptyState';
import supabase from '../../../supabase';

export default function ExpiredTaskDialog({ open, onClose, expired, setExpiredTask, setPopUpUpdate, setWhichTask, fetchTasks } : 
                                          { open : boolean, onClose : (arg : boolean) => void, expired : Task[],
                                            setExpiredTask : (arg : Task[]) => void, setPopUpUpdate : (arg : boolean) => void, 
                                            setWhichTask : (arg : number) => void, fetchTasks : () => void }) {

    const handleDeleteExpired = (event: React.MouseEvent<HTMLButtonElement>) => {
        
        event.preventDefault();
        setExpiredTask([]);
        expired.map((task : Task) => { 
            handleTaskDelete(task.id)
        })
    }

    /* 
      Handle the change of status of completed of the task in the database.
    */
      const handleTaskChange = (id : number) => {
      
        const task = expired.find((task : Task) => task.id === id);
        if (task === undefined) {
          alert("There is no such task. It might not exist or it is deleted");
        } else {
          supabase.from("tasks").update({ completed: !task.completed }).eq("id", id)
            .then((result) => {
              if (result.error !== null) {
                alert("Failed to update task!");
              } else {
                fetchTasks();
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
                fetchTasks();
              }
            });
      };

    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
          <DialogTitle>
            <Stack direction='row'>
                <Typography variant='h5' flexGrow={1}> Expired tasks </Typography> 
                <Button variant="contained" color="error" onClick={handleDeleteExpired}>
                          <Stack direction="row" spacing={1}>
                              <Clear />
                              <Typography variant="button"> Delete all </Typography>
                          </Stack>
                </Button>
            </Stack>          
          </DialogTitle>
          <DialogContent>                          
            {expired.length !== 0 ? expired.map((task : Task) => {
                                              return <TaskCard 
                                                        task={task} 
                                                        popUpUpdate={setPopUpUpdate} 
                                                        setWhichTask={setWhichTask}
                                                        onTaskChange={ handleTaskChange }
                                                        onTaskDelete={ handleTaskDelete }
                                                      />;
                                            })
                                    : <EmptyState />
            }                                                                                     
          </DialogContent>
      </Dialog>
    );
}