import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Paper, InputBase, Divider, IconButton } from '@mui/material';

export default function SearchBar({ value, onChange, onSubmit } : { value : string, onChange : React.ChangeEventHandler<HTMLInputElement>, onSubmit : React.FormEventHandler<HTMLFormElement> }) {
  return (
    <Paper 
      component="form"
      onSubmit={ onSubmit }
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
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