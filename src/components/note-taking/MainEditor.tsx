import React, { useEffect, useState } from 'react';
import { Stack, TextField } from '@mui/material';
import TextEditor from './TextEditor';
import { Note, fetchNoteInfoFromId } from '../../utils/noteUtils';
import { EditorState, convertToRaw } from 'draft-js';
import _ from "lodash";

// @ts-ignore
import draftToHtml from 'draftjs-to-html';

import supabase from '../../supabase';
import { useWindowParams } from '../../hooks/useWindowParams';

export default function MainEditor( { noteId, width, onNoteChange, toSave, toCheck, onDoneChecking, onStartSaving, beforeDoneSaving, onDoneSaving, onOpenSettings, onExit } : { noteId : number, width: (string | number), onNoteChange: () => void, toSave: boolean, toCheck: boolean, onDoneChecking: (trigger : boolean) => void, onStartSaving : () => void, beforeDoneSaving : () => void, onDoneSaving : () => void, onOpenSettings : () => void, onExit : () => void } ) {

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
    const [ windowHeight ] = useWindowParams(false, true);

    const handleTitleTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setNoteInfo({...noteInfo, title: event.currentTarget.value});
    }

    function check( editorState : EditorState ) {
        console.log("check");
        // Lodash's static isEqual method recursively compares values in a JavaScript object,
        // allowing for comparing JavaScript objects by value. 

        // if both content and title are equal, don't update information to database for efficiency reasons.
        if (_.isEqual(noteInfo.content_state, convertToRaw(editorState.getCurrentContent()))
            && noteInfo.title === origTitle
        ) {
            onDoneChecking(false);
        } else {
            onDoneChecking(true);
        }
    }

    async function save( editorState : EditorState ) {
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
            console.log("fetch");
            setOrigTitle(result.title);
            onDoneSaving();
        });
    }, [ noteId, onDoneSaving ]);

    return (
        <Stack sx={{ overflow: 'auto', height: 'calc(' + windowHeight + 'px - 120px)' }} component="form" gap={5} padding="1rem" pb={0} width={width} onSubmit={handleSubmit}>
            <TextField type="text" sx={{width:"100%", fontSize: "1.6rem", fontWeight: "bold"}} label="Title" variant="outlined" value={noteInfo.title} onChange={handleTitleTextChange} />
            <TextEditor initContentState={ noteInfo.content_state } toSave={toSave} onSave={save} onCheck={check} toCheck={toCheck} beforeDoneSaving={beforeDoneSaving} onDoneSaving={onDoneSaving} onOpenSettings={ onOpenSettings } onExit={ onExit } />
        </Stack>
    );
}
