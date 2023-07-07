import React, { useState } from 'react';
import { Note } from '../../utils/noteUtils';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material';
import NoteEntry from './NoteEntry';

/**
 * Displays a sidebar containing the list of all notes created by the user.
 * @param {Object.<Note[]>} props The props that can be passed in. There is only one prop,
 *                                noteList.
 * @param {Note[]} props.noteList An array of Note entries to be displayed in the sidebar.
 * @param {number} props.width The width of the given sidebar to be displayed.
 * @returns A React component representing a sidebar to appear in the left side of the Notes
 *          app.
 */
export default function NoteNavigation( { noteList, width, edit, onNoteDelete } : { noteList : Note[], width: (string | number), edit : ( noteId : number ) => void, onNoteDelete : (id : number) => void } ) {
    
    const [ isBlurred, setIsBlurred ] = useState(false);
    
    return (
        <Box
            sx={{ width: '100%', maxWidth: width, bgcolor: 'background.paper' }}
            >
            <Box sx={{backgroundColor: "#1976D2EE", color: "white"}}>
                <Typography component="h1" variant="h6" fontWeight="bold" paddingTop=".5rem" paddingBottom=".5rem">Notes</Typography>
            </Box>
            <Divider />
            <List onClick={ () => { if (isBlurred) { edit(-1); setIsBlurred(false) } } } sx={{overflow: 'auto', height: 'calc(100vh - 120px)' }}>
                {
                    noteList.map((note : Note) => {
                        return (
                            <>
                                <ListItem key={note.note_id}>
                                    <ListItemButton onFocus={ () => setIsBlurred(false) } onBlur={ () => setIsBlurred(true) } onClick={ () => { edit(note.note_id); } }>
                                        <NoteEntry note={note} handleNoteDelete={ () => onNoteDelete(note.note_id) } />
                                    </ListItemButton>
                                </ListItem> 
                                <Divider />
                            </>
                        );
                    })
                }
            </List>
        </Box>
    );
}