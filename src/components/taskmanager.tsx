import { Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import React, { ChangeEvent, SetStateAction, useState } from "react";
import EmptyState from "./emptystate";
import TaskList from "./tasklist";
import supabase from "../supabase";
import TaskPopUp from "./taskpopup";

type Task = {id : number, title : string, description : string, dueDate : Date, 
             type : number, completed: boolean, userId: number, expired: boolean, deadline: string,
             taskCollectionId: number};

export default function TaskManager({ taskType, tasks, fetchTask } : 
                                    { taskType : number, 
                                      tasks : {id : number, title : string, description : string, 
                                               dueDate : Date, type : number, completed: boolean, 
                                               userId: number, expired: boolean, deadline: string,
                                               taskCollectionId: number}[], 
                                      fetchTask : () => void}) {

    const [error, setError] = useState(false);
    const [isPopUp, setPopUp] = useState(false);
  
    const handleNewTaskSubmit = (event : React.MouseEvent<HTMLElement>) => {

      event.preventDefault();
      setPopUp(true);
    };
  
    const handleTaskChange = (id : number) => {

      const task = tasks.find((task : Task) => task.id === id);
      if (task === undefined) {
        alert("There is no such task. It might not exist or it is deleted");
        setError(true);
      } else {
        supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", id)
        .then((result) => {
          if (result.error !== null) {
            alert("Failed to update task!");
            setError(true);
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
            setError(true);
          } else {
            fetchTask();
          }
        });
    };

    const handleTaskEdit = (id : number) => {
      setPopUp(true);
      <TaskPopUp open={isPopUp} onClose={() => setPopUp(false)} insert fetchTask={fetchTask} id={id}/>
    }
  
    return (
        <Stack component="main" gap={2} marginTop={2}>
            <Typography variant="h4" component="h2" marginTop={5}>
              {taskType === 0 ? "Due Soon" : "Future Assignment"}
            </Typography>
                  
            {tasks.length === 0 ? <EmptyState /> 
                              : <TaskList 
                                    tasks={tasks} 
                                    onTaskChange={handleTaskChange} 
                                    onTaskDelete={handleTaskDelete} 
                                    onTaskEdit={handleTaskEdit}
                                    fetchTask={fetchTask}
                                /> 
          }

            <Stack component="form" direction="column" gap={1} flexGrow={1}>
                <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    onClick={handleNewTaskSubmit}
                    sx={{marginLeft: "1.8vh", marginRight: "1.8vh"}}
                >
                    Add
                </Button>

                <TaskPopUp open={isPopUp} onClose={() => setPopUp(false)} insert fetchTask={fetchTask} id={0}/>
            </Stack>
          </Stack>   
    );
}