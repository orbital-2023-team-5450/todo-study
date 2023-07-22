import React, { useState } from 'react';
import { Note } from '../../utils/noteUtils';
import { Box, Divider, IconButton, List, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material';
import NoteEntry from './NoteEntry';
import { useWindowParams } from '../../hooks/useWindowParams';
import SearchBar from '../SearchBar';
import { createTextEventHandler } from '../../utils/textInputUtils';
import SortIcon from '@mui/icons-material/Sort';
import NotesSortSettingsMenu from './dialogs/NotesSortSettingsMenu';

/**
 * Displays a sidebar containing the list of all notes created by the user.
 * @param {Object.<Note[]>} props The props that can be passed in. There is only one prop,
 *                                noteList.
 * @param {Note[]} props.noteList An array of Note entries to be displayed in the sidebar.
 * @param {string | number} props.width The width of the given sidebar to be displayed.
 * @param {(noteId : number) => void} props.edit The handler when a note is edited.
 * @param {(id : number) => void} props.onNoteDelete The handler when a note is deleted.
 * @param {number} props.selectedNote The current Note loaded in the editor.
 * @returns A React component representing a sidebar to appear in the left side of the Notes
 *          app.
 */
export default function NoteNavigation( { noteList, width, edit, onNoteDelete, selectedNote } : { noteList : Note[], width: (string | number), edit : ( noteId : number ) => void, onNoteDelete : (id : number) => void, selectedNote : number } ) {
    
    const [ isBlurred, setIsBlurred ] = useState(false);
    const [ windowWidth, minimumDesktopWidth, windowHeight ] = useWindowParams(true, true);
    const [ searchValue, setSearchValue ] = useState("");

    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const [ noteSortSettingsOpen, setNoteSortSettingsOpen ] = useState(false);
    const [ sortSettings, setSortSettings ] = useState("mrm");

    const listHeight = (windowWidth >= minimumDesktopWidth)
        ? 'calc(' + windowHeight + 'px - 120px)'
        : 'calc(' + windowHeight + 'px - 110px - 4em)';

    const handleSearchBarChange = createTextEventHandler(setSearchValue);
    const handleSearchBarSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    const handleSortMenuOpen = (event : React.MouseEvent<HTMLButtonElement>) => {
        if (noteSortSettingsOpen) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
        setNoteSortSettingsOpen(!noteSortSettingsOpen);
    }

    const handleSortMenuClose = () => {
        setNoteSortSettingsOpen(false);
        setAnchorEl(null);
    }

    const notesFilterPredicate = (note : Note) => {
        return (note.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          note.html_content.toLowerCase().includes(searchValue.toLowerCase()) ||
          note.note_id === parseInt(searchValue.toLowerCase()) ||
          (searchValue.startsWith("#") && note.note_id === parseInt(searchValue.toLowerCase().substring(1))) ||
          (searchValue.toLowerCase() === "untitled" && note.title === "")
        );
    }

    const filteredNoteList = noteList.filter(notesFilterPredicate);

    const processNoteList = () => {
        switch (sortSettings) {
          case 'mrm':
            return filteredNoteList.sort((a, b) => b.last_modified.localeCompare(a.last_modified));
          case 'lrm':
            return filteredNoteList.sort((a, b) => a.last_modified.localeCompare(b.last_modified));
          case 'mrc':
            return filteredNoteList.sort((a, b) => b.created_at.localeCompare(a.created_at));
          case 'lrc':
            return filteredNoteList.sort((a, b) => a.created_at.localeCompare(b.created_at));
          case 'abc':
            // need to filter off untitled notes so that notes with an actual title shows up  
            return filteredNoteList.filter((note) => note.title !== "").sort((a, b) => a.title.localeCompare(b.title));
          case 'zyx':
            return filteredNoteList.sort((a, b) => b.title.localeCompare(a.title));
          default:
            return filteredNoteList;
        }
    }

    return (
        <Box
            sx={{ width: '100%', maxWidth: width, bgcolor: 'background.paper' }}
            >
            <Box sx={{backgroundColor: "#1976D2EE", color: "white"}}>
                <Typography textAlign="center" component="h1" variant="h6" fontWeight="bold" paddingTop=".5rem" paddingBottom=".5rem">Notes</Typography>
            </Box>
            <Divider />
            <List onClick={ () => { if (isBlurred) { edit(-1); setIsBlurred(false) } } } sx={{overflow: 'auto', height: listHeight }}>
                <ListItem key="search">
                    <SearchBar value={searchValue} onChange={handleSearchBarChange} onSubmit={handleSearchBarSubmit} onClear={ () => setSearchValue("") } />
                    <Tooltip title="Sort notes by...">
                        <IconButton onClick={ handleSortMenuOpen }>
                            <SortIcon />
                        </IconButton>
                    </Tooltip>
                    <NotesSortSettingsMenu anchorEl={anchorEl} open={ noteSortSettingsOpen } handleClose={ handleSortMenuClose } value={ sortSettings } onChange={ setSortSettings } />
                </ListItem>
                {
                    (processNoteList().length !== 0) ? processNoteList().map(
                        (note : Note) => {
                            return (
                                <>
                                    <ListItem sx={{padding: 0}} key={note.note_id}>
                                        <ListItemButton sx={{padding: '1em 2em'}} selected={note.note_id === selectedNote} onFocus={ () => setIsBlurred(false) } onBlur={ () => setIsBlurred(true) } onClick={ () => { edit(note.note_id); } }>
                                            <NoteEntry note={note} handleNoteDelete={ () => onNoteDelete(note.note_id) } />
                                        </ListItemButton>
                                    </ListItem> 
                                    <Divider />
                                </>
                            );
                        }
                    ) : (
                        <ListItem key="empty">
                            <Typography width="100%" textAlign="center">No matching note found.</Typography>
                        </ListItem>
                    )
                }
            </List>
        </Box>
    );
}