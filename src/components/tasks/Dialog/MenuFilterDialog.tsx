import React, { useState, useEffect } from "react";
import { Button, Card, Dialog, DialogContent, DialogTitle, Divider, ListItem, ListItemButton, 
        Paper, Stack, Typography, } from "@mui/material";
import { Task } from "../../../utils/taskUtils"
import { createTextEventHandler } from '../../../utils/textInputUtils';
import SearchBar from "../../SearchBar";
import TaskCard from "../TaskCard";
import FilterDialog from "./FilterDialog";

export default function MenuFilterDialog({ menuFilterOpen, setMenuFilterOpen, openMenu, tasks, popUpUpdate, setWhichTask,
                                            } : 
                                         { menuFilterOpen : boolean, 
                                          setMenuFilterOpen : (arg : boolean) => void, 
                                          openMenu : (arg : null | HTMLElement) => void, tasks : Task[], 
                                          popUpUpdate : (arg : boolean) => void, setWhichTask : (arg : number) => void, 
                                            }) {

    const [searchValue, setSearchValue] = useState("");
    const [searchDateFrom, setSearchDateFrom] = useState("");
    const [searchDateTill, setSearchDateTill] = useState("");
    const [searchType, setSearchType] = useState("none");
    const [isBlurred, setIsBlurred] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [switchDueDate, setSwitchDueDate] = useState(false);

    const handleSearchBarChange = createTextEventHandler(setSearchValue);
    const handleSearchBarSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    const tasksFilterPredicate = (task : Task) => {

        const contain = (task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchValue.toLowerCase()));
        const type = task.type === searchType;
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
                                    <TaskCard task={task} popUpUpdate={popUpUpdate} setWhichTask={setWhichTask}/>
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
            />
        </>
    );
}