import { Card, Divider, Link, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DashboardNoteEntry from './note-taking/DashboardNoteEntry';
import { Link as RouterLink } from 'react-router-dom';
import { Note, fetchNotes } from '../../utils/noteUtils';
import { DashboardNoteSettings } from './note-taking/DashboardNoteSortDialog';

export default function NotesPanel({ settings } : { settings : DashboardNoteSettings }) {

  const [ noteList, setNoteList ] = useState<Note[]>([]);

  const processNoteList = () => {
    const { noteCount, sort } = settings;
    switch (sort) {
      case 'mrm':
        return noteList.sort((a, b) => b.last_modified.localeCompare(a.last_modified)).slice(0, noteCount);
      case 'lrm':
        return noteList.sort((a, b) => a.last_modified.localeCompare(b.last_modified)).slice(0, noteCount);
      case 'mrc':
        return noteList.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, noteCount);
      case 'lrc':
        return noteList.sort((a, b) => a.created_at.localeCompare(b.created_at)).slice(0, noteCount);
      case 'abc':
        // need to filter off untitled notes so that notes with an actual title shows up  
        return noteList.filter((note) => note.title !== "").sort((a, b) => a.title.localeCompare(b.title)).slice(0, noteCount);
      case 'zyx':
        return noteList.sort((a, b) => b.title.localeCompare(a.title)).slice(0, noteCount);
      default:
        return noteList.slice(0, noteCount);
    }
  }

  const sortStr : Map<string, string> = new Map([
    [ "mrm", "Most recently modified notes" ],
    [ "lrm", "Least recently modified notes"],
    [ "mrc", "Newest created notes" ],
    [ "lrc", "Oldest created notes" ],
    [ "abc", "Notes in alphabetical order" ],
    [ "zyx", "Notes in reverse alphabetical order" ],
  ])

  useEffect(() => {
    fetchNotes(setNoteList);
  }, []);

  return (
    <Stack gap={3}>
      <Typography fontSize="1.1em" component="h2" textAlign="center">
        { sortStr.get(settings.sort) }
      </Typography>
      {
        (processNoteList().length !== 0) ? processNoteList().map(
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