import React, {useState} from "react";
import {Editor, EditorState, RichUtils} from "draft-js";
import {Stack} from "@mui/material";
import Toolbar from "./ToolBar";
import "draft-js/dist/Draft.css";

export default function TextEditor() {

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const handleKeyCommand = (command: string, editorState: EditorState) => {

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
        setEditorState(newState);
        return 'handled';
    }
    return 'not-handled';
  }

  return (
    <Stack direction='column' display='flex' sx={{marginTop: '1vh', marginLeft: '2vh', marginRight: '2vh'}}>
        <Toolbar editorState={editorState} setEditorState={setEditorState}/> 
        <Stack sx={{width: '100%', border: '1px solid grey', padding: '1rem'}} component='div'> 
            <Editor editorState={editorState} 
                    onChange={setEditorState} 
                    placeholder='Write something here'
                    handleKeyCommand={handleKeyCommand}/>
        </Stack>
        
    </Stack>
  );  
}