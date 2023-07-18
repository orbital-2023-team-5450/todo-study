import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { createNumericTextEventHandler } from '../../../utils/textInputUtils';

const sortSettings = [
  { label: "Most recently modified", value: "mrm" },
  { label: "Newest created", value: "mrc" },
  { label: "Oldest modified", value: "lrm" },
  { label: "Oldest created", value: "lrc" },
  { label: "Alphabetical order (A-Z)", value: "abc" },
  { label: "Reverse alphabetical order (Z-A)", value: "zyx" },
]

export type DashboardNoteSettings = {
  sort: string,
  noteCount : number,
}

export default function DashboardNoteSortDialog( { open, handleClose, value, onChange } : { open : boolean, handleClose : () => void, value : DashboardNoteSettings, onChange : ( settings : DashboardNoteSettings ) => void }) {

  const handleSortChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    onChange({...value, sort : event.target.value});
  };
  const handleNoteCountChange = createNumericTextEventHandler((num) => onChange({...value, noteCount : num}), 1, 10);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="notes-config-dialog-title">
        Sort notes by...
      </DialogTitle>
      <DialogContent>
        <Stack pt={2} gap={5} component="main">
          <TextField
            select
            label="Sort by..."
            value={ value.sort }
            onChange={ handleSortChange }
          >
            { sortSettings.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField type="text" label="Number of notes to show" variant="outlined" value={ value.noteCount } onChange={ handleNoteCountChange } inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>OK</Button>
      </DialogActions>
    </Dialog>
  );
}