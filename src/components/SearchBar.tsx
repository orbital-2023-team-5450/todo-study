import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Paper, InputBase, Divider, IconButton } from '@mui/material';

export default function SearchBar({ value, onChange } : { value : string, onChange : React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <Paper 
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "95%" }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        value={ value }
        onChange={onChange}
      />
    </Paper>
  );
}