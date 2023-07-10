import React, { useState } from 'react';
import { Note } from '../../utils/noteUtils';
import { Box, Divider, List, ListItem, ListItemButton, Typography } from '@mui/material';
import NoteEntry from './NoteEntry';
import { useWindowParams } from '../../hooks/useWindowParams';
import SearchBar from '../SearchBar';
import { createTextEventHandler } from '../../utils/textInputUtils';

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
    const [ windowWidth, minimumDesktopWidth, windowHeight ] = useWindowParams(true, true);
    const [ searchValue, setSearchValue ] = useState("");
    const listHeight = (windowWidth >= minimumDesktopWidth)
        ? 'calc(' + windowHeight + 'px - 120px)'
        : 'calc(' + windowHeight + 'px - 110px - 4em)';

    const handleSearchBarChange = createTextEventHandler(setSearchValue);
    const handleSearchBarSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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

    return (
        <Box
            sx={{ width: '100%', maxWidth: width, bgcolor: 'background.paper' }}
            >
            <Box sx={{backgroundColor: "#1976D2EE", color: "white"}}>
                <Typography component="h1" variant="h6" fontWeight="bold" paddingTop=".5rem" paddingBottom=".5rem">Notes</Typography>
            </Box>
            <Divider />
            <List onClick={ () => { if (isBlurred) { edit(-1); setIsBlurred(false) } } } sx={{overflow: 'auto', height: listHeight }}>
                <ListItem key="search">
                    <SearchBar value={searchValue} onChange={handleSearchBarChange} onSubmit={handleSearchBarSubmit} />
                </ListItem>
                {
                    (filteredNoteList.length !== 0) ? filteredNoteList.map(
                        (note : Note) => {
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