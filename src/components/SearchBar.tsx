import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Paper, InputBase, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export default function SearchBar({ value, onChange, onSubmit, onClear } : { value : string, onChange : React.ChangeEventHandler<HTMLInputElement>, onSubmit : React.FormEventHandler<HTMLFormElement>, onClear? : React.MouseEventHandler<HTMLButtonElement> }) {

  return (
    <Paper 
      component="form"
      onSubmit={ onSubmit }
      elevation={4}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
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
      { (onClear !== undefined) ? (
        <IconButton type="button" sx={{ p: '10px', opacity: '0.50' }} aria-label="clear" onClick={ onClear }>
          <ClearIcon />
        </IconButton>
      ) : (
        <></>
      ) }
    </Paper>
  );
}