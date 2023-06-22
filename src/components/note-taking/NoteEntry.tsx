import React from 'react';
import { Note, TruncateHTML } from '../../utils/noteUtils';
import { Stack, Typography } from '@mui/material';

/**
 * Displays an individual note as displayed in the sidebar.
 * @param {Object<Note>} props The props that can be passed in. There is only one prop,
 *                             note.
 * @param {Note} note Represents the individual Note to be displayed.
 * @returns A React component representing each note entry that is displayed in the sidebar
 *          of the notes app.
 */
export default function NoteEntry( { note } : { note : Note } ) {
    return (
        <Stack justifyContent="center">
            <Typography fontWeight="bold" variant="h5" fontSize={16} component="h1">
                { note.title }
            </Typography>
            <Typography variant="h6" fontSize={14} component="h2">
                { TruncateHTML(note.html_content) }
            </Typography>
        </Stack>
    );
}