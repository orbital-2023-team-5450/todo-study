import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNoteInfoFromId } from '../utils/noteUtils';
import { DEFAULT_NOTE } from '../utils/noteUtils';

export default function NotesPreview() {
    const params = useParams();
    const [ noteInfo, setNoteInfo ] = useState(DEFAULT_NOTE);

    useEffect(() => {
        const id = parseInt(params.id ?? "0");
        fetchNoteInfoFromId(id, setNoteInfo);
    }, [params]);

    return (
        <div className="notes-preview-container" dangerouslySetInnerHTML={{ __html: noteInfo.html_content }}></div>
    );
}