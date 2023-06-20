import React from "react";
import { Stack, Typography } from "@mui/material";
import { EditorState } from "draft-js";

export default function ToolBar({ editorState, setEditorState } : 
                                { editorState: EditorState, 
                                  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>}) {

    return (
        <Stack > 
            <Typography>
                This is a toolbar.
            </Typography>
        </Stack>
    );
}