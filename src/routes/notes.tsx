import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Divider, Fab, Stack, Typography } from "@mui/material";
import NavigationBar from "../components/navigation/NavigationBar";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import { Note } from "../utils/noteUtils";
import AddIcon from "@mui/icons-material/Add";
import NoteNavigation from "../components/note-taking/NoteNavigation";
import TextEditor from "../components/note-taking/TextEditor";

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

export default function Notes() {

    document.title = "Notes // TODO Study";

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
    }, [loading, navigate]);

    return loading ? (
            <LoadingScreen />
        ) : (
            <Box height="100vh" display="flex" flexDirection="column">
                <CssBaseline />
                <Box flex={0}>
                    <NavigationBar title="Notes" />
                </Box>
                <Stack width="100vw" flex={4} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                    <NoteNavigation noteList={ TEST_NOTES } width={drawerWidth} />
                    <Stack gap={5} width={"calc(100vw - " + drawerWidth + "px)"}>
                        <TextEditor />
                    </Stack>
                </Stack>
                <Fab color="primary" aria-label="add-note" sx={{position: 'absolute', bottom: 16, right: 16}}>
                    <AddIcon />
                </Fab>
            </Box>
        );
}