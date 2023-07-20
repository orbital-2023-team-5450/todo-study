import React, { useEffect, useState} from "react";
import {Box, Button, CssBaseline, Menu, MenuItem, Stack, Typography} from "@mui/material";
import supabase from "../../supabase";
import TaskManager from "./TaskManager";
import { sortTask } from "../../utils/splitTask";
import TaskPopUp from "./Dialog/TaskPopup";
import { Task } from "../../utils/taskUtils";
import MenuFilterDialog from "./Dialog/MenuFilterDialog";
import MenuSortDialog from "./Dialog/MenuSortDialog";

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
    
    /*
        Handle the event of submitting new task.
    */
    const handleNewTaskSubmit = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        setPopUpCreate(true);
    }; 

    const handleMenuItemFilter = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault()
        setMenuFilterOpen(true);
    }

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
                        
                        const [now, later, expired] = sortTask(result.data as Task[], sortType);
                        setFutureTasks(later);
                        setTasks(now.concat(expired));
                    }  
                })
    };
      
      useEffect(() => {
        fetchTasks();
      }, [sortType]);

    return (

        <Stack direction='column'> 
            <Stack direction="row" marginTop='10px' marginLeft='20vh' marginRight='20vh' display='flex'>
                <CssBaseline />
                    <Box sx={{ height: '75vh', borderRadius: '16px', width: "80vh", marginRight: '10px'}}> 
                        <TaskManager 
                            taskType={task_type.DUE_SOON} 
                            tasks={tasks}
                            fetchTask={fetchTasks} 
                            popUpUpdate={setPopUpUpdate}
                            setWhichTask={setWhichTask}
                            setAnchorEl={setAnchorMenu}
                        />
                    </Box>

                    <Box sx={{ height: '75vh', borderRadius: '16px', width: "80vh", marginLeft: '0.6vh' }}> 
                        <TaskManager 
                            taskType={task_type.FUTURE_ASSIGNMENT} 
                            tasks={futureTasks}
                            fetchTask={fetchTasks}
                            popUpUpdate={setPopUpUpdate}
                            setWhichTask={setWhichTask}
                            setAnchorEl={setAnchorMenu}
                        />
                    </Box>

            </Stack>
 
            <Button
                type="submit"
                variant="contained"
                size="medium"
                onClick={handleNewTaskSubmit}
                sx={{marginLeft: "20vh", marginRight: "21vh", marginTop: '1vh', height: '9vh', borderRadius: '10px', 
                     backgroundColor: '#00bf63', '&:hover': { backgroundColor: '#018547', opacity: [0.9, 0.8, 0.7]}}}
            >
                 <Typography variant='h6'> + Add new task </Typography>
            </Button>
            
            <Menu open={Boolean(anchorMenu)} onClose={() => setAnchorMenu(null)} anchorEl={anchorMenu}>
                <MenuItem onClick={handleMenuItemFilter}> Search </MenuItem>
                <MenuItem onClick={handleMenuItemSort} sx={{width: '100px', }}> Sort </MenuItem>
            </Menu>

            <MenuFilterDialog 
                menuFilterOpen={menuFilterOpen} 
                setMenuFilterOpen={setMenuFilterOpen} 
                openMenu={setAnchorMenu}
                tasks={tasks.concat(futureTasks)} //watch out
                popUpUpdate={setPopUpUpdate}
                setWhichTask={setWhichTask}
            />
            <MenuSortDialog 
                menuSortOpen={menuSortOpen} 
                setMenuSortOpen={setMenuSortOpen} 
                sortType={sortType} 
                setSortType={setSortType} 
            />

            <TaskPopUp open={isPopUpUpdate} 
                       onClose={() => setPopUpUpdate(false)} 
                       fetchTask={fetchTasks} 
                       taskType={'Update'} 
                       id={whichTask}/>
            <TaskPopUp open={isPopUpCreate} 
                       onClose={() => setPopUpCreate(false)} 
                       fetchTask={fetchTasks} 
                       taskType={'Create'} 
                       id={-1}/>
        </Stack>
    );
}