import React, { useEffect, useState } from 'react';
import { createTextEventHandler } from '../../utils/textInputUtils';
import { Stack, TextField } from '@mui/material';
import TextEditor from './TextEditor';
import AccountSettings from '../AccountSettings';
import { Note, NotesSettings, fetchNoteInfoFromId, fetchNotes } from '../../utils/noteUtils';
import { EditorState, convertToRaw } from 'draft-js';
import _ from "lodash";

// @ts-ignore
import draftToHtml from 'draftjs-to-html';

import supabase from '../../supabase';

export default function MainEditor( { noteId, width, onNoteChange, toSave, onStartSaving, beforeDoneSaving, onDoneSaving, onOpenSettings } : { noteId : number, width: (string | number), onNoteChange: () => void, toSave: boolean, onStartSaving : () => void, beforeDoneSaving : () => void, onDoneSaving : () => void, onOpenSettings : () => void } ) {

    const [ noteInfo, setNoteInfo ] = useState<Note>({
        note_id: 0,
        user_id: "",
        title: "",
        html_content: "",
        created_at: "",
        last_modified: "",
        content_state: convertToRaw(EditorState.createEmpty().getCurrentContent()),
    });
    const [ origTitle, setOrigTitle ] = useState("");

    const handleTitleTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setNoteInfo({...noteInfo, title: event.currentTarget.value});
    }

    async function save( editorState : EditorState ) {
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;

        // Lodash's static isEqual method recursively compares values in a JavaScript object,
        // allowing for comparing JavaScript objects by value. 

        // if both content and title are equal, don't update information to database for efficiency reasons.
        if (_.isEqual(noteInfo.content_state, convertToRaw(editorState.getCurrentContent()))
            && noteInfo.title === origTitle
        ) {
            return;
        }
        
        const newNoteInfo : Note = { 
            ...noteInfo,
            content_state: convertToRaw(editorState.getCurrentContent()),
            html_content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            last_modified: ((new Date()).toISOString()),
        }
        setNoteInfo(newNoteInfo);
        
        async function performUpdate() {
            const { error } = await supabase.from('notes').update(newNoteInfo).eq("note_id", newNoteInfo.note_id);
            onNoteChange();
            console.log(error);
        }

        performUpdate();
    }

    const handleSubmit = ( event : React.SyntheticEvent<HTMLElement> ) => {
        event.preventDefault();
        onStartSaving();
    }

    useEffect(() => {
        fetchNoteInfoFromId( noteId, setNoteInfo ).then((result) => {
            setOrigTitle(result.title);
            onDoneSaving();
        });
    }, [ noteId ]);

    return (
        <Stack sx={{height: 'calc(100% - 240px)'}} component="form" gap={5} padding="1rem" width={width} onSubmit={handleSubmit}>
            <TextField type="text" sx={{width:"100%", fontSize: "1.6rem", fontWeight: "bold"}} label="Title" variant="outlined" value={noteInfo.title} onChange={handleTitleTextChange} />
            <TextEditor initContentState={ noteInfo.content_state } toSave={toSave} onSave={save} beforeDoneSaving={beforeDoneSaving} onDoneSaving={onDoneSaving} onOpenSettings={ onOpenSettings } />
        </Stack>
    );
}
