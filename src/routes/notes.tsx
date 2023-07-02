import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Divider, Fab, Stack, TextField, Typography } from "@mui/material";
import NavigationBar from "../components/navigation/NavigationBar";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import { DEFAULT_NOTES_SETTINGS, Note, NotesSettings, deleteNote, fetchNotes, fetchNotesSettings } from "../utils/noteUtils";
import AddIcon from "@mui/icons-material/Add";
import NoteNavigation from "../components/note-taking/NoteNavigation";
import TextEditor from "../components/note-taking/TextEditor";
import MainEditor from "../components/note-taking/MainEditor";
import supabase from "../supabase";
import { Editor, EditorState } from "draft-js";
import EmptyNoteState from "../components/note-taking/EmptyNoteState";
import NotesConfigDialog from "../components/note-taking/dialogs/NotesConfigDialog";
import { usePrompt } from "../hooks/usePrompt";
import NotesLeavePageDialog from "../components/note-taking/dialogs/NotesLeavePageDialog";
/*
const TEST_NOTES : Note[] = [
    {
        note_id: 1,
        user_id: "",
        title: "first note",
        html_content: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
        </head>
        <body>
            Hello world! <b>This is some bolded text. <i>This is some bold and italic text.</i></b>
        </body>
        </html>`,
        created_at: "",
        last_modified: "",
    }, 
    {
        note_id: 2,
        user_id: "",
        title: "2nd best note",
        html_content: "<b>this is a <pre>test</pre></b>",
        created_at: "",
        last_modified: "",
    }
]*/

const drawerWidth = 260;
const widthStyle = "calc(100vw - " + drawerWidth + "px)";

export default function Notes() {

    document.title = "Notes // TODO: Study";

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ noteList, setNoteList ] = useState<Note[]>([]);
    const [ mainEditorId, setMainEditorId ] = useState(-1);
    const [ loading, setLoading ] = useState(true);
    const [ toSave, setToSave ] = useState(false);
    const [ nextId, setNextId ] = useState(-2);
    const [notesConfigOpen, setNotesConfigOpen] = useState(false);
    const [ notesSettings, setNotesSettings ] = useState<NotesSettings>(DEFAULT_NOTES_SETTINGS);
    const [ showLeavePageDialog, setShowLeavePageDialog ] = useState<boolean>(false);
    const navigate = useNavigate();

    const addNote = async () => {
        const submitInfo = {
            user_id: userData.user_id,
            title: "",
            html_content: "",
            created_at: ((new Date()).toISOString()),
            last_modified: ((new Date()).toISOString()),
        }

        const { data, error } = await supabase.from('notes').insert(submitInfo).select();
        console.log(error);

        if (!error) {
            if (data !== null && data[0] !== null) {
                setMainEditorId(data[0].note_id);
            }
            fetchNotes(setNoteList);
        }
    }

    const deleteNoteHandler = (id : number) => {
        deleteNote(id).then(() => {
            fetchNotes(setNoteList);
            if (id === mainEditorId) {
                setMainEditorId(-1);
            }
        });
    }

    const handleKeyDown = (event : React.KeyboardEvent<HTMLElement>) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            setToSave(true);
        }
    }

    const handleEdit = ( id : number ) => {
        // new ID is different from what is in the editor
        if (id !== mainEditorId && mainEditorId !== -1) {
            if (notesSettings.autosave) {
                setToSave(true);
                setNextId(id);
            } else {
                setNextId(id);
                setShowLeavePageDialog(true);
            }
            // remaining will be handled by handleDoneSaving
        } else {
            setMainEditorId(id);
            // do nothing...
        }
        fetchNotes(setNoteList);
    }

    const handleConfirm = ( id : number ) => {
        setMainEditorId(id);
        setNextId(-2);
        setShowLeavePageDialog(false);
    }

    const handleCancel = () => {
        setShowLeavePageDialog(false);
    }

    const beforeDoneSaving = () => {
        if (nextId !== -2) {
            console.log(mainEditorId + " " + nextId);
            setNextId(-2);
            setMainEditorId(nextId);
        }
    }

    const handleDoneSaving = () => {
        setToSave(false);
    }

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
        fetchNotes(setNoteList);
    }, [loading, navigate]);

    useEffect(() => {
      fetchNotesSettings(setNotesSettings);
    }, []);

    return loading ? (
            <LoadingScreen />
        ) : (
            <>
                <CssBaseline />
                <Box sx={{overflow: 'hidden'}} onKeyDown={handleKeyDown} height="100vh" display="flex" flexDirection="column">
                    <Box flex={0}>
                        <NavigationBar title="Notes" />
                    </Box>
                    <Stack width="100%" flex={4} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                        <NoteNavigation noteList={ noteList } width={drawerWidth} edit={ handleEdit } onNoteDelete={ deleteNoteHandler } />
                        { (mainEditorId !== -1) ? 
                            <MainEditor width={widthStyle} toSave={toSave} onStartSaving={() => setToSave(true)} beforeDoneSaving={ beforeDoneSaving } onDoneSaving={ handleDoneSaving } noteId={ mainEditorId } onNoteChange={() => fetchNotes(setNoteList)} onOpenSettings={ () => setNotesConfigOpen(true) }/> :
                            <EmptyNoteState width={widthStyle} onLinkClick={addNote} />
                        }
                    </Stack>
                    <Fab onClick={addNote} color="primary" aria-label="add-note" sx={{position: 'absolute', bottom: 16, right: 16}}>
                        <AddIcon />
                    </Fab>
                </Box>
                <NotesConfigDialog open={notesConfigOpen} handleClose={() => setNotesConfigOpen(false)} onChange={ () => fetchNotesSettings(setNotesSettings) } /> 
                <NotesLeavePageDialog open={showLeavePageDialog as boolean} id={nextId} handleConfirm={ handleConfirm } handleCancel={ handleCancel } />
            </>
        );
}