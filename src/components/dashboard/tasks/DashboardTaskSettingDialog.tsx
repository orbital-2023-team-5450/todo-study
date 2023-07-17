import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { createNumericTextEventHandler } from '../../../utils/textInputUtils';

const sortSettings = [
  { label: "Due soonest (excl. expired tasks)", value: "dsee" },
  { label: "Due soonest (incl. expired tasks)", value: "dsie" },
  { label: "Expired tasks", value: "exp" },
  { label: "Tasks with no due date", value: "ndd" },
  { label: "Alphabetical order (A-Z)", value: "abc" },
  { label: "Reverse alphabetical order (Z-A)", value: "zyx" },
]

export type DashboardTaskSettings = {
  sort: string,
  taskCount : number,
}

export default function DashboardTaskSettingsDialog({ open, handleClose, value, onChange } : { open : boolean, handleClose : () => void, value : DashboardTaskSettings, onChange : ( settings : DashboardTaskSettings ) => void }) {
  
  const handleSortChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    onChange({...value, sort : event.target.value});
  };
  const handleTaskCountChange = createNumericTextEventHandler((num) => onChange({...value, taskCount : num}), 1, 10);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="notes-config-dialog-title">
        Sort tasks by...
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
          <TextField type="text" label="Number of tasks to show" variant="outlined" value={ value.taskCount } onChange={ handleTaskCountChange } inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>OK</Button>
      </DialogActions>
    </Dialog>
  );
}