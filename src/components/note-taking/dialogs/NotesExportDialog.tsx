import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, TextField, MenuItem } from "@mui/material";
import { EditorState } from "draft-js";
import { exportAsHTML, exportAsMarkdown } from "../../../utils/noteExportUtils";

export default function NotesExportDialog( { open, onClose, editorState, title } : { open : boolean, onClose : () => void, editorState : EditorState, title : string }) {

  const [ exportState, setExportState ] = useState("md");

  const exportTypes = [
    { value: 'md', label: 'Markdown', },
    { value: 'html', label: 'HTML', },
    { value: 'pdf', label: 'PDF', },
    { value: 'word', label: 'Microsoft Word', },
  ]

  const handleExportChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setExportState(event.target.value);
  }

  const dummy = (editorState : EditorState) => { return "" }

  // latter exportFn type to change to Blob if needed
  type exportFormat = {
    exportFn : ((editorState : EditorState) => string) | ((editorState : EditorState) => string),
    mimeType : string,
    isText   : boolean,
  }

  const handleExport = () => {
    console.log("something");
    const exportFunctions = new Map<string, exportFormat>([
      ['md', { exportFn: exportAsMarkdown, mimeType: "text/markdown", isText : true }],
      ['html', { exportFn: exportAsHTML, mimeType: "text/html", isText : true }],
      ['pdf', { exportFn: dummy, mimeType: "application/pdf", isText : false }],
      ['word', { exportFn: dummy, mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", isText : false }]
    ]);

    const exportFunction = exportFunctions.get(exportState) ?? { exportFn: dummy, mimeType: "text/plain", isText: true };
    const exportedContent = exportFunction.exportFn(editorState).split("\n");

    const fileObj = new Blob(exportedContent, { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(fileObj);
    anchor.download = (title === "" ? 'Untitled' : title) + '.' + exportState;

    document.body.appendChild(anchor);
    anchor.click();

    console.log(exportedContent);

    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="notes-export-dialog-title"
    >
      <DialogTitle id="notes-export-dialog-title">
        Export Settings
      </DialogTitle>
      <DialogContent>
        <Stack gap={5} component="main">
          <Typography>Export as:</Typography>
          <TextField
            id="select-export-type"
            select
            value={ exportState }
            onChange={ handleExportChange }
            variant="outlined"
          >
            { exportTypes.map((exportType) => (
              <MenuItem value={exportType.value} key={exportType.value}>
                {exportType.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExport} autoFocus>Export</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
  </Dialog>
);
}