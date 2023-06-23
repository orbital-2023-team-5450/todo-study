import React, { useEffect, useState } from 'react';
import { createTextEventHandler } from '../../utils/textInputUtils';
import { Stack, TextField } from '@mui/material';
import TextEditor from './TextEditor';
import AccountSettings from '../AccountSettings';
import { Note, fetchNoteInfoFromId, fetchNotes } from '../../utils/noteUtils';
import { EditorState } from 'draft-js';

// @ts-ignore
import { Options, stateToHTML } from 'draft-js-export-html';

import supabase from '../../supabase';

export default function MainEditor( { noteId, onNoteChange } : { noteId : number, onNoteChange: () => void }) {

    const [ noteInfo, setNoteInfo ] = useState({
        note_id: 0,
        user_id: "",
        title: "",
        html_content: "",
        created_at: "",
        last_modified: ""
    });

    const handleTitleTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setNoteInfo({...noteInfo, title: event.currentTarget.value});
    }

    async function save( editorState : EditorState, options : Options ) {
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
        
        const newNoteInfo : Note = {...noteInfo, html_content: stateToHTML(editorState.getCurrentContent(), options ), last_modified: ((new Date()).toISOString()),}
        setNoteInfo(newNoteInfo);
        
        async function performUpdate() {
            const { error } = await supabase.from('notes').update(newNoteInfo).eq("note_id", newNoteInfo.note_id);
            onNoteChange();
            console.log(error);
        }

        performUpdate();
    }

    useEffect(() => {
        fetchNoteInfoFromId( noteId, setNoteInfo );
    }, [ noteId ])

    return (
        <>
            <TextField type="text" sx={{width:"calc(100% - 2rem)", fontSize: "1.6rem", fontWeight: "bold"}} label="Title" variant="outlined" value={noteInfo.title} onChange={handleTitleTextChange} />
            <TextEditor initContent={ noteInfo.html_content } onSave={save}/>
        </>
    );
}
