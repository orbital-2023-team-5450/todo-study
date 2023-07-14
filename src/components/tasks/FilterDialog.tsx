import React from 'react';
import { Dialog, DialogContent, DialogTitle, Stack, Typography, } from '@mui/material';

export default function FilterDialog({ filterOpen, filterClose } : 
                                     { filterOpen : boolean, filterClose : (arg : boolean) => void}) {

    return (
        <Dialog open={filterOpen} onClose={filterClose}>
            <DialogTitle>
                Filter by...
            </DialogTitle>
            <DialogContent>
                <Stack direction="column">
                    <Typography>
                        Due Date of the task
                    </Typography>
                    put dialog filter in menu dilter
                </Stack>
            </DialogContent>
        </Dialog>
    );
}