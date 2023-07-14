import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, TextField, MenuItem } from "@mui/material";
import { EditorState } from "draft-js";
import { exportAsHTML, exportAsMarkdown, exportAsPDF } from "../../../utils/noteExportUtils";
import { createNumericTextEventHandler, createTextEventHandler } from "../../../utils/textInputUtils";

export default function NotesExportDialog( { open, onClose, editorState, title } : { open : boolean, onClose : () => void, editorState : EditorState, title : string }) {

  const [ exportState, setExportState ] = useState("pdf");
  const [ defaultFont, setDefaultFont ] = useState("Times New Roman");
  const [ defaultSize, setDefaultSize ] = useState(14);

  const exportTypes = [
    { value: 'md', label: 'Markdown', },
    { value: 'html', label: 'HTML', },
    { value: 'pdf', label: 'PDF / Print (uses browser print dialog)', },
  ]

  const handleExportChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setExportState(event.target.value);
  }

  const dummy = (editorState : EditorState) => { return "" }

  // latter exportFn type to change to Blob if needed
  type exportFormat = {
    exportFn : ((editorState : EditorState) => string),
    mimeType : string,
  }

  const handleDefaultFontChange = createTextEventHandler(setDefaultFont);
  const handleDefaultSizeChange = createNumericTextEventHandler(setDefaultSize, 1, Infinity);

  const handleExport = () => {
    console.log("something");
    const exportFunctions = new Map<string, exportFormat>([
      ['md', { exportFn: exportAsMarkdown, mimeType: "text/markdown" }],
      ['html', { exportFn: (editorState) => exportAsHTML(editorState, title, defaultFont, defaultSize), mimeType: "text/html" }],
    ]);

    const exportFilename = (title === "" ? 'Untitled' : title) + '.' + exportState;
    if (exportState === 'md' || exportState === 'html') {
      const exportType = exportFunctions.get(exportState) ?? { exportFn: dummy, mimeType: "text/plain" };
      const exportedContent = exportType.exportFn(editorState).split("\n");
      const fileObj = new Blob(exportedContent, { type: exportType.mimeType });
      
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(fileObj);
      anchor.download = exportFilename;

      document.body.appendChild(anchor);
      anchor.click();
    } else if (exportState === 'pdf') {
      exportAsPDF(editorState, title, defaultFont, defaultSize);
    }

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
          <Typography variant="h6" component="h2">Export as</Typography>
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
          {
            (exportState === 'pdf' || exportState === 'html') ? (
              <>
                <Typography variant="h6" component="h2">Export settings</Typography>
                <TextField label="Default font" value={defaultFont} onChange={handleDefaultFontChange} />
                <TextField label="Default font size" value={defaultSize} onChange={handleDefaultSizeChange} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
              </>
            ) : <></>
          }
          {
            (exportState === 'pdf') ? (
              <Typography><strong>Note: </strong>For iOS devices (iPhone/iPad), you can save as PDF by tapping on the Share icon right beside the Print button.</Typography>
            ) : <></>
          }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExport} autoFocus>Export</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
  </Dialog>
);
}