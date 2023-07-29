import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNoteInfoFromId } from '../utils/noteUtils';
import { DEFAULT_NOTE } from '../utils/noteUtils';
import ErrorPage from './errorpage';

export default function NotesPreview() {
    const params = useParams();
    const [ noteInfo, setNoteInfo ] = useState(DEFAULT_NOTE);
    const [ isValid, setIsValid ] = useState(true);

    useEffect(() => {
        const id = parseInt(params.id ?? "0");
        fetchNoteInfoFromId(id, setNoteInfo).then((info) => {
            if (info.user_id === "") { // note is invalid
                setIsValid(false);
            }
        })
    }, []);

    return (isValid) ? (
        <div className="notes-preview-container" dangerouslySetInnerHTML={{ __html: noteInfo.html_content }}></div>
    ) : (
        <ErrorPage error="Cannot preview note" errorDesc="The note requested could not be found." />
    );
}