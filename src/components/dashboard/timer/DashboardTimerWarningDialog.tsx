import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, DialogContentText, Button } from '@mui/material';

export default function DashboardTimerWarningDialog( { open, onClose } : { open : boolean, onClose : () => void } ) {
  
  return (
    <Dialog
      open={ open }
      onClose={ onClose }
    >
      <DialogTitle>
        Warning
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Timer template cannot be changed while the timer is running or paused. To change the timer template, ensure the timer is not running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={ onClose }>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}