import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, MenuItem, Stack, TextField, Button } from "@mui/material";

export default function MenuSortDialog({ menuSortOpen, setMenuSortOpen, sortType, setSortType } : 
                                       { menuSortOpen : boolean, setMenuSortOpen : (arg : boolean) => void, 
                                         sortType : string, setSortType : (arg : string) => void }) {
    
    const sortSettings = [
        { label: "Due soonest (excl. expired tasks and completed)", value: "dsee" },
        { label: "The type of the task", value: "type" },
        { label: "Alphabetical order (A-Z)", value: "abc" },
        { label: "Reverse alphabetical order (Z-A)", value: "zyx" },
    ]

    const handleSortChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        
        event.preventDefault();
        setSortType(event.target.value);
    }

    const handleSortOk = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        setMenuSortOpen(false);
    }

    return (
        <Dialog open={menuSortOpen} onClose={() => setMenuSortOpen(false)}> 
            <DialogTitle>
                <Typography variant="h5" sx={{marginBottom: '1vh'}}> Sort task</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack pt={2} gap={5} component="main" direction= 'column'>
                    <TextField
                        select
                        label="Sort by..."
                        value={ sortType }
                        onChange={ handleSortChange }
                    >
                        { sortSettings.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                        ))}
                    </TextField>

                    <Button onClick={handleSortOk}> 
                        ok
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}