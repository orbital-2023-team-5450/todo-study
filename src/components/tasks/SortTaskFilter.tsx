import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React from "react";

export default function SortTaskFilter({ searchType, handleChangeSelect, showAllTasks = true } : 
                                     { searchType : string, handleChangeSelect : (event: SelectChangeEvent) => void,
                                        showAllTasks? : boolean,
                                        }) {
    
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label"> Type </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchType}
                        label="Type"
                        onChange={handleChangeSelect}
                    >
                        { showAllTasks ? <MenuItem value={"all"}> All types </MenuItem> : <></> }
                        <MenuItem value={"assignment"}> Assignment </MenuItem>
                        <MenuItem value={"house chore"}> House work </MenuItem>
                        <MenuItem value={"sport"}> Sport </MenuItem>
                        <MenuItem value={"general"}> General </MenuItem>
                        <MenuItem value={"none"}> None </MenuItem>
                    </Select>
            </FormControl>
        </Box>
    );

}