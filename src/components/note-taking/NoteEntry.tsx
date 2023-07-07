import React from 'react';
import { Note, truncateHTML } from '../../utils/noteUtils';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Displays an individual note as displayed in the sidebar.
 * @param {Object<Note>} props The props that can be passed in. There is only one prop,
 *                             note.
 * @param {Note} note Represents the individual Note to be displayed.
 * @returns A React component representing each note entry that is displayed in the sidebar
 *          of the notes app.
 */
export default function NoteEntry( { note, handleNoteDelete } : { note : Note, handleNoteDelete : () => void } ) {

    return (
        <Box width="100%" component="div" display="flex" justifyContent="space-between" alignItems="center">
            <Stack width="80%" justifyContent="center">
                <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} fontWeight="bold" component="h1">
                    { note.title === "" ? <em>Untitled</em> : note.title }
                </Typography>
                <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} component="h2">
                    { truncateHTML(note.html_content) }
                </Typography>
            </Stack>
            <Stack display="flex" width="18%" textAlign="center">
                <Typography variant="subtitle2">{"#" + note.note_id}</Typography>
                <IconButton sx={{display: 'flex', padding: 0}} color="error" onClick={ handleNoteDelete }>
                    <DeleteIcon />
                </IconButton>
            </Stack>
        </Box>
    );
}