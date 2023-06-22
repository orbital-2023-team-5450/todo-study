import React from 'react';
import { Note } from '../../utils/noteUtils';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, Typography } from '@mui/material';
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
export default function NoteNavigation( { noteList, width, edit } : { noteList : Note[], width: number, edit : ( noteId : number ) => void } ) {
    return (
        <Box
            sx={{ overflow: 'auto', width: '100%', maxWidth: width, bgcolor: 'background.paper' }}
            >
            <Typography component="h1" variant="h6" fontWeight="bold" paddingTop=".5rem" paddingBottom=".5rem">Notes</Typography>
            <Divider />
            <List>
                {
                    noteList.map((note : Note) => {
                        return (
                            <>
                                <ListItem key={note.note_id}>
                                    <ListItemButton onClick={ () => edit(note.note_id) }>
                                        <NoteEntry note={note} />
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