import React, { useState, useEffect } from "react";
import { Button, Card, Dialog, DialogContent, DialogTitle, Divider, ListItem, ListItemButton, 
        Paper, Stack, Typography, } from "@mui/material";
import { Task } from "../../../utils/taskUtils"
import { createTextEventHandler } from '../../../utils/textInputUtils';
import SearchBar from "../../SearchBar";
import TaskCard from "../TaskCard";
import FilterDialog from "./FilterDialog";
import supabase from "../../../supabase";

export default function MenuFilterDialog({ menuFilterOpen, setMenuFilterOpen, openMenu, tasks, popUpUpdate, setWhichTask,
                                           switchIncludeTask, setSwitchIncludeTask, fetchTasks } : 
                                         { menuFilterOpen : boolean, 
                                          setMenuFilterOpen : (arg : boolean) => void, 
                                          openMenu : (arg : null | HTMLElement) => void, tasks : Task[], 
                                          popUpUpdate : (arg : boolean) => void, setWhichTask : (arg : number) => void, 
                                          switchIncludeTask : boolean, setSwitchIncludeTask : (arg : boolean) => void,
                                          fetchTasks : () => void }) {

    const [searchValue, setSearchValue] = useState("");
    const [searchDateFrom, setSearchDateFrom] = useState("");
    const [searchDateTill, setSearchDateTill] = useState("");
    const [searchType, setSearchType] = useState("none");
    const [isBlurred, setIsBlurred] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [switchDueDate, setSwitchDueDate] = useState(true);

    const handleSearchBarChange = createTextEventHandler(setSearchValue);
    const handleSearchBarSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    const tasksFilterPredicate = (task : Task) => {

        const contain = (task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchValue.toLowerCase()));
        const type = task.type === searchType || searchType === "all";
        let range: boolean;

        if (switchDueDate) {

            if (searchDateFrom !== "" && searchDateTill !== "") {
                range = new Date(task.dueDate) >= new Date(searchDateFrom) && new Date(task.dueDate) <= new Date(searchDateTill);
            } else if (searchDateFrom !== "" && searchDateTill === "") {
                range = new Date(task.dueDate) >= new Date(searchDateFrom);
            } else if (searchDateFrom === "" && searchDateTill !== "") {
                range = new Date(task.dueDate) <= new Date(searchDateTill);
            } else {
                range = true;
            }
        } else {
            range = task.dueDate === null;
        }
        
        return contain && range && type;
    }

    const filteredTaskList = tasks.filter(tasksFilterPredicate);

    /* 
      Handle the change of status of completed of the task in the database.
    */
      const handleTaskChange = (id : number) => {
      
        const task = tasks.find((task : Task) => task.id === id);
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

    const handleCloseDialog = () => {

        setMenuFilterOpen(false);
        openMenu(null);
    }

    return (
        <>
            <Dialog open={menuFilterOpen} onClose={handleCloseDialog}> 
                <DialogTitle> 
                    <Stack direction='column'>
                        <Typography variant="h5" sx={{marginBottom: '1vh'}}> Search task</Typography>
                        <Stack direction='row'>
                            <SearchBar 
                                value={searchValue} 
                                onChange={handleSearchBarChange} 
                                onSubmit={handleSearchBarSubmit}
                                onClear={() => setSearchValue("")}
                            />
                            <Button sx={{marginLeft: '1vh'}} onClick={() => setFilterOpen(true)}>
                                filter
                            </Button>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    {(filteredTaskList.length !== 0) ? filteredTaskList.map(
                        (task : Task) => {
                            return (
                                <>
                                    <TaskCard 
                                        onTaskChange={ handleTaskChange }
                                        onTaskDelete={ handleTaskDelete }
                                        task={task}
                                        popUpUpdate={popUpUpdate}
                                        setWhichTask={setWhichTask}
                                    />
                                    <Divider />
                                </>
                            );
                        }
                    ) : (
                        <Typography width="100%" textAlign="center"> No matching task found. </Typography>)}
                </DialogContent>
            </Dialog>

            <FilterDialog 
                filterOpen={filterOpen} 
                filterClose={() => setFilterOpen(false)}
                searchDateFrom={searchDateFrom}
                searchDateTill={searchDateTill}
                setSearchDateFrom={setSearchDateFrom}
                setSearchDateTill={setSearchDateTill}
                searchType={searchType}
                setSearchType={setSearchType}
                switchDueDate={switchDueDate}
                setSwitchDueDate={setSwitchDueDate}
                switchIncludeTask={switchIncludeTask}
                setSwitchIncludeTask={setSwitchIncludeTask}
            />
        </>
    );
}