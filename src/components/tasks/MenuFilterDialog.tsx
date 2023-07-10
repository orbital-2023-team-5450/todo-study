import React, { useState, useEffect } from "react";
import { Card, Dialog, DialogContent, DialogTitle, Divider, IconButton, InputBase, ListItem, ListItemButton, Paper, Typography, } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Task } from "../../utils/taskUtils"
import { createTextEventHandler } from '../../utils/textInputUtils';
import { set } from "date-fns";

export default function MenuFilterDialog({menuFilterOpen, setMenuFilterOpen, openMenu, tasks, popUpUpdate, setWhichTask} : 
                                         {menuFilterOpen : boolean, 
                                          setMenuFilterOpen : (arg : boolean) => void, 
                                          openMenu : (arg : null | HTMLElement) => void, tasks : Task[], popUpUpdate : (arg : boolean) => void, setWhichTask : (arg : number) => void}) {

    const [ searchValue, setSearchValue ] = useState("");
    const [ isBlurred, setIsBlurred ] = useState(false);

    const handleSearchBarChange = createTextEventHandler(setSearchValue);
    const handleSearchBarSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    const tasksFilterPredicate = (task : Task) => {
        return (task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.id === parseInt(searchValue.toLowerCase()) ||
        (searchValue.startsWith("#") && task.id === parseInt(searchValue.toLowerCase().substring(1))) ||
        (searchValue.toLowerCase() === "untitled" && task.title === "")
      );
    }

    const filteredTaskList = tasks.filter(tasksFilterPredicate);

    const handleCloseDialog = () => {

        setMenuFilterOpen(false);
        openMenu(null);
    }

    return (
        <Dialog open={menuFilterOpen} onClose={handleCloseDialog}> 
            <DialogTitle> Search task </DialogTitle>
            <DialogContent>
                <Paper 
                    component="form"
                    onSubmit={ handleSearchBarSubmit }
                    elevation={4}
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
                >
                <IconButton sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchBarChange}
                />
                    { (() => setSearchValue("") !== undefined) ? (
                        <IconButton type="button" sx={{ p: '10px', opacity: '0.50' }} aria-label="clear" onClick={ () => setSearchValue("")}>
                            <ClearIcon />
                        </IconButton>
                        ) : (
                            <></>) 
                    }
                </Paper>
                
                <Paper> 
                    {filteredTaskList.length}
                {(filteredTaskList.length !== 0) ? filteredTaskList.map(
                        (task : Task) => {
                            return (
                                <>
                                    <ListItem key={task.id}>
                                        <ListItemButton onFocus={ () => setIsBlurred(false) } onBlur={ () => setIsBlurred(true) } onClick={ () => { popUpUpdate(true)
                                                                                                                                                     setWhichTask(task.id); } }>
                                            {task.title}
                                        </ListItemButton>
                                    </ListItem> 
                                    <Divider />
                                </>
                            );
                        }
                    ) : (
                        <Typography width="100%" textAlign="center">No matching note found.</Typography>)}
                </Paper>
            </DialogContent>
        </Dialog>
    );
}