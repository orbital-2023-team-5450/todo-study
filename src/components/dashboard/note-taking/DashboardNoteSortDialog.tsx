import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React from 'react';

const sortSettings = [
  { label: "Most recently modified", value: "mrm" },
  { label: "Newest created", value: "mrc" },
  { label: "Oldest modified", value: "lrm" },
  { label: "Oldest created", value: "lrc" },
  { label: "Alphabetical order (A-Z)", value: "abc" },
  { label: "Reverse alphabetical order (Z-A)", value: "zyx" },
]

export default function DashboardNoteSortDialog( { open, handleClose } : { open : boolean, handleClose : () => void }) {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="notes-config-dialog-title">
        Sort notes by...
      </DialogTitle>
      <DialogContent>
        <Stack gap={5} component="main">
          <Typography variant="h6" component="h1">Configuration Settings</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>OK</Button>
      </DialogActions>
    </Dialog>
  );
}