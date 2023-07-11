import { EditorState, convertToRaw } from 'draft-js';

// @ts-ignore
import draftToHtml from 'draftjs-to-html';
// @ts-ignore
import draftToMarkdown from 'draftjs-to-markdown';
// @ts-ignore
import prettify from 'html-prettify';

import { jsPDF } from 'jspdf';

export function exportAsHTML(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return prettify(draftToHtml(rawContentState)) as string;  
}

export function exportAsMarkdown(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return draftToMarkdown(rawContentState) as string;
}

export function exportAsPDF(editorState : EditorState, exportFilename : string) : void {
  const htmlContent = exportAsHTML(editorState);
  const doc = new jsPDF();
  doc.html(
    htmlContent,
    {
      callback: (doc) => {
        doc.save(exportFilename);
      },
      x: 10,
      y: 10,
    }
  );
}