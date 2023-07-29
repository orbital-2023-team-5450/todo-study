import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Note, fetchNoteInfoFromId } from '../utils/noteUtils';
import { DEFAULT_NOTE } from '../utils/noteUtils';
import LoadingScreen from '../components/LoadingScreen';
import { exportAsHTML, exportAsMarkdown, exportAsPDF } from '../utils/noteExportUtils';
import { EditorState, convertFromRaw } from 'draft-js';
import ErrorPage from './errorpage';

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function download( noteInfo : Note, format : string, font : string, size : number ) {
    
  const exportFilename = (noteInfo.title === "" ? 'Untitled' : noteInfo.title) + '.' + format;
  const editorState = (noteInfo.content_state !== null) ? 
    EditorState.createWithContent(convertFromRaw(noteInfo.content_state)) :
    EditorState.createEmpty();

  if (format === 'md') {
    const exportedContent = exportAsMarkdown(editorState).split("\n");
    const fileObj = new Blob(exportedContent, { type: "text/markdown" });

    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(fileObj);
    anchor.download = exportFilename;

    document.body.appendChild(anchor);
    anchor.click();
  } else if (format === 'pdf') {
    exportAsPDF(editorState, noteInfo.title, font, size);
  } else {
    // default: html export
    const exportedContent = exportAsHTML(editorState, noteInfo.title, font, size).split("\n");
    const fileObj = new Blob(exportedContent, { type: "text/html" });

    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(fileObj);
    anchor.download = exportFilename;

    document.body.appendChild(anchor);
    anchor.click();
  }
}

export default function NotesExport() {
  const params = useParams();
  const query = useQuery();
  const [ noteInfo, setNoteInfo ] = useState(DEFAULT_NOTE);
  const [ loading, setLoading ] = useState(true);
  const [ valid, setValid ] = useState(true);

  useEffect(() => {
    const id = parseInt(params.id ?? "0");
    fetchNoteInfoFromId(id, setNoteInfo).then((info) => {
      setLoading(false);
      return info as Note;
    }).then((info) => {
      if (info.user_id !== "") {
        const format = query.get('format') ?? "html";
        const font   = query.get('font') ?? "Times New Roman";
        const size   = parseInt(query.get('size') ?? '14');

        download(info, format, font, size);
      } else {
        setValid(false);
      }
    })
  }, []);

  const font   = query.get('font') ?? "Times New Roman";
  const size   = parseInt(query.get('size') ?? '14');

  const editorState = (noteInfo.content_state !== null) ? 
    EditorState.createWithContent(convertFromRaw(noteInfo.content_state)) :
    EditorState.createEmpty();
  const htmlContent = exportAsHTML(editorState, noteInfo.title, font, size);

  return (loading) ? (
    <LoadingScreen /> 
  ) : (valid) ? (
    <div dangerouslySetInnerHTML={{__html: htmlContent}}></div>
  ) : (
    <ErrorPage error="Cannot export note" errorDesc="The note requested could not be found." />
  )
}