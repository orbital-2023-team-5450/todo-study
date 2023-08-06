import React, { useCallback, useEffect, useState } from "react";
import { EditorState, RawDraftContentState, convertFromRaw } from "draft-js";
import { Box, Button, Divider, Grid, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import "./textEditor.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// @ts-ignore
import { Editor } from "react-draft-wysiwyg";

import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { toolbar } from "../../utils/noteUtils";
import { usePrompt } from "../../hooks/usePrompt";
import NotesLeavePageDialog from "./dialogs/NotesLeavePageDialog";
import { useWindowParams } from "../../hooks/useWindowParams";
import NotesExportDialog from "./dialogs/NotesExportDialog";
import GridItemButton from "./GridItemButton";

export default function TextEditor({ onSave, onCheck, toCheck, initContentState, toSave, beforeDoneSaving, onDoneSaving, onOpenSettings, onExit, title, noteId } : { onSave : ( editorState : EditorState ) => Promise<void>, onCheck:(editorState : EditorState) => void, toCheck: boolean, initContentState : RawDraftContentState, toSave : boolean, beforeDoneSaving : () => void, onDoneSaving: () => void, onOpenSettings : () => void, onExit : () => void, title : string, noteId : number } ) {

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [ showLeavePageDialog, setShowLeavePageDialog ] = useState<boolean>(false);
  const [ showExportDialog, setShowExportDialog ] = useState<boolean>(false);
  const [ showPrompt, confirmNavigation, cancelNavigation ] = usePrompt(showLeavePageDialog, true, handleLeaveSave);
  const [ windowWidth, minimumDesktopWidth, windowHeight ] = useWindowParams(true, true);

  const onOpenExport = () => {
    setShowExportDialog(true);
  }

  const handleKeyDown = (event : React.KeyboardEvent<HTMLElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      handleSave();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      setShowExportDialog(true);
    }
  }

  const handleEditorStateChange = (newEditorState : EditorState) => {
    setEditorState(newEditorState);
    setShowLeavePageDialog(true);
  }

  async function handleLeaveSave() {
    return await onSave(editorState);
  }

  const handleSave = useCallback(() => {
    setShowLeavePageDialog(false);
    onSave(editorState).then(() => beforeDoneSaving());
  }, [onSave, editorState, beforeDoneSaving]);

  const handleCheck = useCallback(() => {
    onCheck(editorState);
  }, [onCheck, editorState]);

  useEffect(() => {
    if (initContentState === null || initContentState === undefined) { 
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
  }, [initContentState, noteId]);

  const handlePreview = () => {
    window.open("/preview/" + noteId.toString());
  }

  useEffect(() => {
    if (toSave) {
      handleSave();
      onDoneSaving();
    }
  }, [toSave, handleSave, onDoneSaving]);

  useEffect(() => {
    if (toCheck) {
      handleCheck();
    }
  }, [toCheck, handleCheck]);
  
  return (
    <Stack onKeyDown={handleKeyDown} direction='column' display='flex' sx={{ marginLeft: 0, marginTop: 0 }}>
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
        { (windowWidth >= minimumDesktopWidth) ? (
          <GridItemButton xs={6} sm={6} md={2.4} color="secondary" onClick={ onExit } icon={<CloseIcon />} label="Close" />
        ) : (
          <GridItemButton xs={6} sm={6} md={2.4} color="secondary" onClick={ onExit } icon={<ArrowBackIcon />} label="Back" />
        ) }
        <GridItemButton xs={6} sm={6} md={2.4} onClick={ handleSave } icon={<SaveIcon />} label="Save"
          tooltip="Saves the current working note." />
        <GridItemButton xs={4} sm={4} md={2.4} onClick={ onOpenSettings } icon={<SettingsIcon />} label="Settings" 
          tooltip="Opens the editor's configuration settings."/>
        <GridItemButton xs={4} sm={4} md={2.4} onClick={ onOpenExport } icon={<FileDownloadIcon />} label="Export"
          tooltip="Export current content in Markdown, HTML, or PDF (using browser native print dialog)."/>
        <GridItemButton xs={4} sm={4} md={2.4} onClick={ handlePreview } icon={<VisibilityIcon />} label="Preview" 
          tooltip="Preview (in new tab). Links generated can be used as permalinks."/>
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
                  height: 'calc(' + (0.9 * windowHeight) + 'px - 400px)',
                  minHeight: '10em',
                }}
                toolbar={toolbar(useTheme().palette.mode === 'dark')}
              />
        <NotesLeavePageDialog open={showPrompt as boolean} id={-1} handleConfirm={confirmNavigation as () => void} handleCancel={cancelNavigation as () => void} />
        <NotesExportDialog open={showExportDialog} onClose={() => setShowExportDialog(false)} editorState={editorState} title={ title } />
      </Box>
    </Stack>
  );  
}