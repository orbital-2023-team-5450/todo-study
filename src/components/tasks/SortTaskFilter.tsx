import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React from "react";

export default function SortTaskMenu({ searchType, handleChangeSelect } : 
                                     { searchType : string, handleChangeSelect : (event: SelectChangeEvent) => void 
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