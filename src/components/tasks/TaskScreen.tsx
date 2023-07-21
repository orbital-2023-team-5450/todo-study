import React, { useEffect, useState} from "react";
import {Box, Button, Container, CssBaseline, Grid, IconButton, Menu, MenuItem, Stack, Typography} from "@mui/material";
import supabase from "../../supabase";
import TaskManager from "./TaskManager";
import { sortTask } from "../../utils/splitTask";
import TaskPopUp from "./Dialog/TaskPopup";
import { Task } from "../../utils/taskUtils";
import MenuFilterDialog from "./Dialog/MenuFilterDialog";
import MenuSortDialog from "./Dialog/MenuSortDialog";
import { Search, Sort } from "@mui/icons-material";
import CompletedTaskDialog from "./Dialog/CompletedTaskDialog";
import ExpiredTaskDialog from "./Dialog/ExpiredTaskDialog";

/*
    The enum for the type of the tasks.
*/
enum task_type { DUE_SOON, FUTURE_ASSIGNMENT };

/**
 * A component that displays the whole page of todo-list feature.
 * 
 * @returns A todo-list page.
 */
export default function TaskScreen() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [futureTasks, setFutureTasks] = useState<Task[]>([]);
    const [isPopUpCreate, setPopUpCreate] = useState<boolean>(false);
    const [isPopUpUpdate, setPopUpUpdate] = useState<boolean>(false);
    const [whichTask, setWhichTask] = useState<number>(-1);
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const [menuFilterOpen, setMenuFilterOpen] = useState(false);
    const [menuSortOpen, setMenuSortOpen] = useState(false);
    const [sortType, setSortType] = useState("");
    const [expiredTask, setExpiredTask] = useState<Task[]>([]);
    const [completedTask, setCompletedTask] = useState<Task[]>([]);
    const [anchorOtherTask, setAnchorOtherTask] = React.useState<null | HTMLElement>(null);
    const [switchIncludeTask, setSwitchIncludeTask] = useState(true);
    const [completedDialog, setCompletedDialog] = useState(false);
    const [expiredDialog, setExpiredDialog] = useState(false);
    
    /*
        Handle the event of submitting new task.
    */
    const handleNewTaskSubmit = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        setPopUpCreate(true);
    }; 

    const handleExpiredDialog = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        setExpiredDialog(true);
    }

    const handleCompleteDialog = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        setCompletedDialog(true);
    }

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorOtherTask(event.currentTarget);
    };

    const handleMenuItemSort = (event : React.MouseEvent<HTMLElement>) => {
      
        event.preventDefault();
        setMenuSortOpen(true);
    }

    /* 
        Fetch info of the tasks from the database and sort it based on date and completed.
    */
    const fetchTasks = async () => {

      const { data: { user } } = await supabase.auth.getUser();
      const user_id : string = (user === null) ? "" : user.id;

        supabase.from("tasks").select().eq("userId", user_id).order("id")
                .then((result) => {
                    if (result.data === null || result.data === undefined) {
                    } else {
                        
                        const [now, later, expired, completed] = sortTask(result.data as Task[], sortType);
                        setFutureTasks(later);
                        setTasks(now);
                        setCompletedTask(completed);
                        setExpiredTask(expired);
                    }  
                })
    };
      
      useEffect(() => {
        fetchTasks();
      }, [sortType]);

    return (
        <Container>
            <Stack direction='column'> 
                <Stack mt={3} direction='row' sx={{display: "flex", justifyContent: 'flex-end'}} >
                    <Button onClick={handleMenuClick}> 
                        other tasks 
                    </Button>
                    <IconButton onClick={() => setMenuFilterOpen(true)}>
                        <Search />
                    </IconButton>
                    <IconButton onClick={handleMenuItemSort}>
                        <Sort />
                    </IconButton>
                </Stack>
                
                <Grid container direction="row" spacing={5} width="100%" pl='1em' pr='1em' display='flex'>
                    <CssBaseline />
                        <Grid item xs={12} sm={6} sx={{ height: '75vh', borderRadius: '16px'}}> 
                            <TaskManager 
                                taskType={task_type.DUE_SOON} 
                                tasks={tasks}
                                fetchTask={fetchTasks} 
                                popUpUpdate={setPopUpUpdate}
                                setWhichTask={setWhichTask}
                                setMenuSortOpen={setMenuSortOpen}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ height: '75vh', borderRadius: '16px' }}> 
                            <TaskManager 
                                taskType={task_type.FUTURE_ASSIGNMENT} 
                                tasks={futureTasks}
                                fetchTask={fetchTasks}
                                popUpUpdate={setPopUpUpdate}
                                setWhichTask={setWhichTask}
                                setMenuSortOpen={setMenuSortOpen}
                            />
                        </Grid>
                </Grid>
    
                <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    onClick={handleNewTaskSubmit}
                    sx={{ width: '50%', margin: '1vh auto', height: '7vh', borderRadius: '10px', 
                        backgroundColor: '#00bf63', '&:hover': { backgroundColor: '#018547', opacity: [0.9, 0.8, 0.7]}}}
                >
                    <Typography variant='h6'> + Add new task </Typography>
                </Button>

                <MenuFilterDialog 
                    menuFilterOpen={menuFilterOpen} 
                    setMenuFilterOpen={setMenuFilterOpen} 
                    openMenu={setAnchorMenu}
                    tasks={switchIncludeTask ? tasks.concat(futureTasks).concat(completedTask).concat(expiredTask)
                                            : tasks.concat(futureTasks)} 
                    popUpUpdate={setPopUpUpdate}
                    setWhichTask={setWhichTask}
                    switchIncludeTask={switchIncludeTask}
                    setSwitchIncludeTask={setSwitchIncludeTask}
                    fetchTasks={fetchTasks}
                />
                <MenuSortDialog 
                    menuSortOpen={menuSortOpen} 
                    setMenuSortOpen={setMenuSortOpen} 
                    sortType={sortType} 
                    setSortType={setSortType} 
                />

                <Menu
                    id="basic-menu"
                    anchorEl={anchorOtherTask}
                    open={Boolean(anchorOtherTask)}
                    onClose={() => setAnchorOtherTask(null)}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleExpiredDialog}>Expired tasks</MenuItem>
                    <MenuItem onClick={handleCompleteDialog}>Completed tasks</MenuItem>
                </Menu>

                <ExpiredTaskDialog 
                    open={expiredDialog}
                    onClose={() => setExpiredDialog(false)}
                    expired={expiredTask}
                    setExpiredTask={setExpiredTask}
                    setPopUpUpdate={setPopUpUpdate}
                    setWhichTask={setWhichTask}
                    fetchTasks={fetchTasks}
                />
                <CompletedTaskDialog 
                    open={completedDialog}
                    onClose={() => setCompletedDialog(false)}
                    completed={completedTask}
                    setCompletedTask={setCompletedTask}
                    setPopUpUpdate={setPopUpUpdate}
                    setWhichTask={setWhichTask}
                    fetchTasks={fetchTasks}
                />

                <TaskPopUp open={isPopUpUpdate} 
                        onClose={() => setPopUpUpdate(false)} 
                        fetchTask={fetchTasks} 
                        taskType={'Update'} 
                        id={whichTask}
                />
                <TaskPopUp open={isPopUpCreate} 
                        onClose={() => setPopUpCreate(false)} 
                        fetchTask={fetchTasks} 
                        taskType={'Create'} 
                        id={-1}
                />
            </Stack>
        </Container>
    );
}