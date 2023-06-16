import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from "@mui/material";

export default function TimeUpDialog( { open, handleClose } : { open : boolean, handleClose : () => void }) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="timeup-dialog-title"
            aria-describedby="timeup-dialog-description"
        >
            <DialogTitle id="timeup-dialog-title">
                Time's up!
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="timeup-dialog-description">
                    Time has ended.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}