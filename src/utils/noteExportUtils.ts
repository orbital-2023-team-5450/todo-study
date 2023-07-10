import { EditorState, convertToRaw } from 'draft-js';

// @ts-ignore
import draftToHtml from 'draftjs-to-html';
// @ts-ignore
import draftToMarkdown from 'draftjs-to-markdown';

import prettify from 'html-prettify';

export function exportAsHTML(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return prettify(draftToHtml(rawContentState)) as string;  
}

export function exportAsMarkdown(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return draftToMarkdown(rawContentState) as string;
}