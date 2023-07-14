import React, { useState, useEffect } from "react";
import { Button, Card, Dialog, DialogContent, DialogTitle, Divider, ListItem, ListItemButton, 
        Paper, Stack, Typography, } from "@mui/material";
import { Task } from "../../utils/taskUtils"
import { createTextEventHandler } from '../../utils/textInputUtils';
import SearchBar from "../SearchBar";
import TaskCard from "./TaskCard";

export default function MenuFilterDialog({ menuFilterOpen, setMenuFilterOpen, openMenu, tasks, popUpUpdate, setWhichTask,
                                          setFilterOpen } : 
                                         { menuFilterOpen : boolean, 
                                          setMenuFilterOpen : (arg : boolean) => void, 
                                          openMenu : (arg : null | HTMLElement) => void, tasks : Task[], 
                                          popUpUpdate : (arg : boolean) => void, setWhichTask : (arg : number) => void, 
                                          setFilterOpen : (arg : boolean) => void }) {

    const [searchValue, setSearchValue] = useState("");
    const [searchDate, setSearchDate] = useState();
    const [searchType, setSearchType] = useState();
    const [isBlurred, setIsBlurred] = useState(false);

    const handleSearchBarChange = createTextEventHandler(setSearchValue);
    const handleSearchBarSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    const tasksFilterPredicate = (task : Task) => {

        return (task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.description.toLowerCase().includes(searchValue.toLowerCase()) 
      );
    }

    const filteredTaskList = tasks.filter(tasksFilterPredicate);

    const handleCloseDialog = () => {

        setMenuFilterOpen(false);
        openMenu(null);
    }

    return (
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
                        <Button onClick={() => setFilterOpen(true)}>
                            filter
                        </Button>
                        <Button> 
                            cancel
                        </Button>
                    </Stack>
                </Stack>
            </DialogTitle>
            <DialogContent>
                {(filteredTaskList.length !== 0) ? filteredTaskList.map(
                    (task : Task) => {
                        return (
                            <>
                                <TaskCard task={task} popUpUpdate={popUpUpdate} setWhichTask={setWhichTask}/>
                                <Divider />
                            </>
                        );
                    }
                ) : (
                    <Typography width="100%" textAlign="center">No matching task found.</Typography>)}
            </DialogContent>
        </Dialog>
    );
}