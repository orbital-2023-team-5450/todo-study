import { TextField } from "@mui/material";
import { title } from "process";
import React from "react";

export default function FieldInDialog({ name, handleNameChange, type } :
                                      { name : string, type : string,
                                        handleNameChange : (event : React.ChangeEvent<HTMLInputElement>) => void }) {

    return (
        <TextField
            type="text"
            label={type}
            variant="outlined"
            value={name}
            onChange={handleNameChange} 
            required={type === 'Title'}
            size={type === 'Description' ? 'medium' : 'small'}
        />
    );
}