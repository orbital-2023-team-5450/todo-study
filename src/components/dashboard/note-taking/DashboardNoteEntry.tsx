import React from 'react';
import { Note, truncateHTML } from '../../../utils/noteUtils';
import { Stack, Box, Typography, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * Displays an individual note as displayed in the sidebar.
 * @param {Object<Note>} props The props that can be passed in. There is only one prop,
 *                             note.
 * @param {Note} note Represents the individual Note to be displayed.
 * @returns A React component representing each note entry that is displayed in the sidebar
 *          of the notes app.
 */
export default function DashboardNoteEntry( { note } : { note : Note } ) {

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
            <IconButton sx={{display: 'flex', padding: 0}} target="_blank" rel="noopener" href={ "/preview/" + note.note_id.toString() }>
              <Tooltip title="Opens a preview of the note in a new tab.">
                <VisibilityIcon />
              </Tooltip>
            </IconButton>
          </Stack>
        </Box>
    );
}