import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Divider, Fab, Stack, TextField, Typography } from "@mui/material";
import NavigationBar from "../components/navigation/NavigationBar";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import { Note, deleteNote, fetchNotes } from "../utils/noteUtils";
import AddIcon from "@mui/icons-material/Add";
import NoteNavigation from "../components/note-taking/NoteNavigation";
import TextEditor from "../components/note-taking/TextEditor";
import MainEditor from "../components/note-taking/MainEditor";
import supabase from "../supabase";
import { Editor, EditorState } from "draft-js";
import EmptyNoteState from "../components/note-taking/EmptyNoteState";

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
]

const drawerWidth = 260;
const widthStyle = "calc(100vw - " + drawerWidth + "px)";

export default function Notes() {

    document.title = "Notes // TODO Study";

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ noteList, setNoteList ] = useState<Note[]>([]);
    const [ mainEditorId, setMainEditorId ] = useState(-1);
    const [ loading, setLoading ] = useState(true);
    const [ toSave, setToSave ] = useState(false);
    const navigate = useNavigate();

    const addNote = async () => {
        const submitInfo = {
            user_id: userData.user_id,
            title: "",
            html_content: "",
            created_at: ((new Date()).toISOString()),
            last_modified: ((new Date()).toISOString()),
        }

        const { error } = await supabase.from('notes').insert(submitInfo);
        console.log(error);

        fetchNotes(setNoteList);
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

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
        fetchNotes(setNoteList);
    }, [loading, navigate]);

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
                        <NoteNavigation noteList={ noteList } width={drawerWidth} edit={ setMainEditorId } onNoteDelete={ deleteNoteHandler } />
                        { (mainEditorId !== -1) ? 
                            <MainEditor width={widthStyle} toSave={toSave} onStartSaving={() => setToSave(true)} onDoneSaving={() => setToSave(false)} noteId={ mainEditorId } onNoteChange={() => fetchNotes(setNoteList)} /> :
                            <EmptyNoteState width={widthStyle} />
                        }
                    </Stack>
                    <Fab onClick={addNote} color="primary" aria-label="add-note" sx={{position: 'absolute', bottom: 16, right: 16}}>
                        <AddIcon />
                    </Fab>
                </Box>
            </>
        );
}