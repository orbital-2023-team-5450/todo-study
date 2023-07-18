import { Menu, MenuItem } from '@mui/material';
import React from 'react';

const sortSettings = [
  { label: "Most recently modified", value: "mrm" },
  { label: "Newest created", value: "mrc" },
  { label: "Oldest modified", value: "lrm" },
  { label: "Oldest created", value: "lrc" },
  { label: "Alphabetical order (A-Z)", value: "abc" },
  { label: "Reverse alphabetical order (Z-A)", value: "zyx" },
]

export default function NotesSortSettingsMenu( { open, handleClose, value, onChange, anchorEl } : { open : boolean, handleClose : () => void, value : string, onChange : ( settings : string ) => void, anchorEl : HTMLElement | null }) {
  
  function handleMenuItemClick(settings : string) {
    onChange(settings);
    handleClose();
  }
  
  return (
    <Menu
      anchorEl={ anchorEl }
      open={open}
      onClose={handleClose}
    >
      { sortSettings.map((option) => (
        <MenuItem onClick={ () => handleMenuItemClick(option.value) } key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Menu> 
  );
}