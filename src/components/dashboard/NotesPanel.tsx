import { Card, Divider, Link, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DashboardNoteEntry from './note-taking/DashboardNoteEntry';
import { Link as RouterLink } from 'react-router-dom';
import { Note, fetchNotes } from '../../utils/noteUtils';

export default function NotesPanel() {

  const [ noteList, setNoteList ] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes(setNoteList);
  }, []);

  return (
    <Stack gap={3}>
      <Typography variant="h6" component="h2" textAlign="center">
        Most recently modified notes
      </Typography>
      {
        (noteList.length !== 0) ? noteList.slice(0, 3).map(
          (note : Note) => {
            return (
              <Card key={note.note_id}>
                <ListItemButton href={ "/notes/" + note.note_id.toString() }>
                  <DashboardNoteEntry note={note} />
                </ListItemButton>
              </Card> 
            );
          }
        ) : (
          <Card key="empty">
            <Typography width="100%" textAlign="center">No note found. Create your first note <Link component={RouterLink} to="/notes">here</Link>!</Typography>
          </Card>
        )
      }
    </Stack>
  )
}