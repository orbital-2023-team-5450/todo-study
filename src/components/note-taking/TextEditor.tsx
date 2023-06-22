import React, { useEffect, useRef, useState } from "react";
import { ContentBlock, ContentState, DraftBlockType, DraftStyleMap, Editor, EditorState, RichUtils, convertFromHTML } from "draft-js";
import { Box, Divider, IconButton, Popover, Stack, Typography } from "@mui/material";
import Toolbar from "./ToolBar";
import "./textEditor.css";

// @ts-ignore
import { convertToHTML } from 'draft-convert';

// @ts-ignore
import ColorPicker from 'material-ui-color-picker';

export default function TextEditor({ onSave, initContent } : { onSave : ( editorState : EditorState ) => void, initContent : string }) {

  const [colorPicker, setColorPicker] = useState('#FF0000');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleKeyCommand = (command: string, editorState: EditorState) => {

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
        setEditorState(newState);
        return 'handled';
    }
    return 'not-handled';
  }

  const styleMap = {
    
    'CODE': {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2, 
    },
    'HIGHLIGHT': {
      backgroundColor: colorPicker,
    },
    'UPPERCASE': {
      textTransform: "uppercase",
    },
    'LOWERCASE': {
      textTransform: "lowercase",
    },
    'CODEBLOCK': {
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: "0.2rem",
    },
    'SUPERSCRIPT': {
      verticalAlign: "super",
      fontSize: "80%",
    },
    'SUBSCRIPT': {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };

  const myBlockStyleFn = (contentBlock: ContentBlock) => {

    const type = contentBlock.getType();
    switch (type) {
      case "blockQuote":
        return "superFancyBlockquote";
      case "leftAlign":
        return "leftAlign";
      case "rightAlign":
        return "rightAlign";
      case "centerAlign":
        return "centerAlign";
      case "justifyAlign":
        return "justifyAlign";
      default:
        break;
    }
  };

  useEffect(() => {
    if (initContent === "" || initContent === null || initContent === undefined) { 
      console.log("done");
      setEditorState(EditorState.createEmpty());
    } else {
      console.log("doner" + initContent);
      const blocksFromHTML = convertFromHTML(initContent);
      const initState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      setEditorState(EditorState.createWithContent(initState));
    }
  }, [initContent]);

  return (
    <Stack direction='column' display='flex' sx={{marginTop: '1vh', marginLeft: '2vh', marginRight: '2vh', height: '85vh'}}>
        <Toolbar editorState={editorState} setEditorState={setEditorState} onSave={() => onSave(editorState)} /> 
        <ColorPicker
                      name='color'
                      defaultValue="ColorPicker"
                      value={colorPicker} 
                      onChange={(color : string) => setColorPicker(color)}
                      style={{width: '12vh', marginLeft: '3vh'}}
        />
        <Typography>
          {convertToHTML(editorState.getCurrentContent())}
        </Typography>
        <Divider sx={{marginTop: '1vh', marginBottom: '1vh'}} />
        <Box sx={{ width: '100%', textAlign: 'left', marginTop: '1vh', marginLeft: '3vh'}}> 
            <Editor editorState={editorState} 
                    onChange={setEditorState} 
                    placeholder='Write something here'
                    handleKeyCommand={handleKeyCommand}
                    customStyleMap={styleMap as DraftStyleMap}
                    blockStyleFn={myBlockStyleFn as (cb: ContentBlock) => string}
            />
        </Box> 
    </Stack>
  );  
}