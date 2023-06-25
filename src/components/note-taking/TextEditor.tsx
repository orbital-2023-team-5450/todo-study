import React, { useEffect, useRef, useState } from "react";
import { ContentBlock, ContentState, DraftBlockType, DraftStyleMap, EditorState, RichUtils, convertFromHTML, convertToRaw } from "draft-js";
import { Box, Button, Divider, IconButton, Popover, Stack, Typography } from "@mui/material";
import "./textEditor.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// @ts-ignore
import { Editor } from "react-draft-wysiwyg";

// @ts-ignore
import htmltoDraft from 'html-to-draftjs';
import SaveIcon from '@mui/icons-material/Save';

export default function TextEditor({ onSave, initContent, toSave, onDoneSaving } : { onSave : ( editorState : EditorState ) => void, initContent : string, toSave : boolean, onDoneSaving: () => void } ) {

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleKeyDown = (event : React.KeyboardEvent<HTMLElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      onSave(editorState);
    }
  }

  useEffect(() => {
    if (initContent === "" || initContent === null || initContent === undefined) { 
      console.log("done");
      setEditorState(EditorState.createEmpty());
    } else {
      const contentBlock = htmltoDraft(initContent);
      const initState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
        contentBlock.entityMap,
      );
      setEditorState(EditorState.createWithContent(initState));
    }
  }, [initContent]);

  useEffect(() => {
    if (toSave) {
      onSave(editorState);
      onDoneSaving();
    }
  }, [toSave]);

  return (
    <Stack onKeyDown={handleKeyDown} direction='column' display='flex' sx={{marginLeft: 0, marginTop: 0, marginRight: '2rem', height: 'calc(100vh - 240px)'}}>
        <Button onClick={() => onSave(editorState)} sx={{color: "rgba(0, 0, 0, 0.7)"}}>
          <SaveIcon /> Save
        </Button>
        <Divider sx={{marginTop: '1vh', marginBottom: '1vh'}} />
        <Box sx={{ width: '100%', textAlign: 'left', marginTop: '1vh', marginLeft: '3vh', overflow: 'auto'}}>
          <Editor editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={setEditorState}
                />
        </Box> 
    </Stack>
  );  
}