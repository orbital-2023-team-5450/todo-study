/**
 * A dialog showing when there are unsaved changes and you want to leave
 * the notes page. Triggers only when the autosave when leaving page
 * option is turned off.
 */
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from "@mui/material";

export default function NotesLeavePageDialog( { open, id, handleConfirm, handleCancel } : { open : boolean, id : number, handleConfirm : (id : number) => void, handleCancel : () => void }) {

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="notesleavepage-dialog-title"
            aria-describedby="notesleavepage-dialog-description"
        >
            <DialogTitle id="notesleavepage-dialog-title">
                Leave this page?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="notesleavepage-dialog-description">
                    Changes that you made may not be saved.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} autoFocus>Cancel</Button>
                <Button onClick={() => handleConfirm(id)} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}