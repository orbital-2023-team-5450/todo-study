import React, { useEffect, useRef, useState } from "react";
import { ContentBlock, ContentState, DraftBlockType, DraftStyleMap, EditorState, RawDraftContentState, RichUtils, convertFromHTML, convertFromRaw, convertToRaw } from "draft-js";
import { Box, Button, Divider, Grid, IconButton, Popover, Stack, Typography, useTheme } from "@mui/material";
import "./textEditor.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// @ts-ignore
import { Editor } from "react-draft-wysiwyg";

// @ts-ignore
import htmltoDraft from 'html-to-draftjs';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import NotesConfigDialog from "./dialogs/NotesConfigDialog";
import { DEFAULT_NOTES_SETTINGS, NotesSettings, fetchNotesSettings, toolbar } from "../../utils/noteUtils";
import { usePrompt } from "../../hooks/usePrompt";
import NotesLeavePageDialog from "./dialogs/NotesLeavePageDialog";

export default function TextEditor({ onSave, onCheck, toCheck, initContentState, toSave, beforeDoneSaving, onDoneSaving, onOpenSettings } : { onSave : ( editorState : EditorState ) => Promise<void>, onCheck:(editorState : EditorState) => void, toCheck: boolean, initContentState : RawDraftContentState, toSave : boolean, beforeDoneSaving : () => void, onDoneSaving: () => void, onOpenSettings : () => void } ) {

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [ showLeavePageDialog, setShowLeavePageDialog ] = useState<boolean>(false);
  const [ showPrompt, confirmNavigation, cancelNavigation ] = usePrompt(showLeavePageDialog, true, handleLeaveSave);

  const handleKeyDown = (event : React.KeyboardEvent<HTMLElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      handleSave();
    }
  }

  const handleEditorStateChange = (newEditorState : EditorState) => {
    setEditorState(newEditorState);
    setShowLeavePageDialog(true);
  }

  async function handleLeaveSave() {
    return await onSave(editorState);
  }

  function handleSave() {
    setShowLeavePageDialog(false);
    onSave(editorState).then(() => beforeDoneSaving());
  }

  function handleCheck() {
    onCheck(editorState);
  }

  useEffect(() => {
    if (initContentState === null || initContentState === undefined) { 
      console.log("done");
      setEditorState(EditorState.createEmpty());
    } else {
      setEditorState(EditorState.createWithContent(convertFromRaw(initContentState)));
      /*
      const contentBlock = htmltoDraft(initContent);
      const initState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
        contentBlock.entityMap,
      );
      setEditorState(EditorState.createWithContent(initState));
      */
    }
  }, [initContentState]);

  useEffect(() => {
    if (toSave) {
      handleSave();
      onDoneSaving();
    }
  }, [toSave]);

  useEffect(() => {
    if (toCheck) {
      handleCheck();
    }
  }, [toCheck]);
  
  return (
    <Stack onKeyDown={handleKeyDown} direction='column' display='flex' sx={{marginLeft: 0, marginTop: 0, height: 'calc(100vh - 240px)'}}>
      <Grid container spacing={{ xs: 2, sm: 2, md: 5 }}>
        <Grid item xs={12} sm={4}>
          <Button sx={{ width: '100%' }} variant="contained" onClick={handleSave}>
            <Stack spacing={1} direction="row">
              <SaveIcon />
              <Typography variant="button">Save</Typography>
            </Stack>          
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button sx={{ width: '100%' }} variant="contained" onClick={ onOpenSettings }>
            <Stack spacing={1} direction="row">
              <SettingsIcon />
              <Typography variant="button">Settings</Typography>
            </Stack>
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button sx={{ width: '100%' }} variant="contained" onClick={ onOpenSettings }>
            <Stack spacing={1} direction="row">
              <FileDownloadIcon />
              <Typography variant="button">Export</Typography>
            </Stack>
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{marginTop: '1vh', marginBottom: '1vh'}} />
      <Box sx={{ width: '100%', textAlign: 'left', marginTop: '1vh', marginRight: '2rem', height: 'calc(98vh - 400px)'}}>
        <Editor editorState={editorState}
                placeholder="Edit text here..."
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={handleEditorStateChange}
                toolbarStyle={{
                  backgroundColor: 'inherit',
                  border: 'none',
                }}
                editorStyle={{
                  borderRadius: 10,
                  padding: '.2rem 1rem',
                  border: '1px solid',  
                  height: 'calc(98vh - 400px)'
                }}
                toolbar={toolbar(useTheme().palette.mode === 'dark')}
              />
        <NotesLeavePageDialog open={showPrompt as boolean} id={-1} handleConfirm={confirmNavigation as () => void} handleCancel={cancelNavigation as () => void} />
      </Box>
    </Stack>
  );  
}