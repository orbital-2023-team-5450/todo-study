import { EditorState, RawDraftContentState, SelectionState, convertToRaw } from "draft-js";
import supabase from "../supabase";

/**
 * A type representing the users' settings for the Notes application, as
 * reflected in Supabase table users_notes_config.
 */
export type NotesSettings = {
    user_id: string,
    autosave: boolean,
}

/**
 * Default value for the NotesSettings.
 */
export const DEFAULT_NOTES_SETTINGS = {
    user_id: "",
    autosave: false,
}

/**
 * Generates a default note based on the ID.
 * @param id The note ID for the default note (usually 0).
 * @returns A default note.
 */
export const DEFAULT_NOTE = (id : number = 0) : Note => {
    return {
        note_id: id,
        user_id: "",
        title: "",
        html_content: "",
        created_at: "",
        last_modified: "",
        content_state: convertToRaw(EditorState.createEmpty().getCurrentContent()),
    }
}

/**
 * A type representing the details of an individual note, as reflected
 * in Supabase table notes.
 */
export type Note = {
    note_id: number,
    user_id: string,
    title: string,
    html_content: string,
    created_at: string,    // date expressed as a string
    last_modified: string, // date expressed as a string
    content_state: RawDraftContentState,
}

/**
 * Truncates a HTML document using its content to 30 characters.
 * @param htmlContent A HTML document, as a string.
 * @returns A truncated string containing the main text of the HTML document, cutting at
 *          30 characters.
 */
export function truncateHTML(htmlContent: string) : string {
    const parser = new DOMParser();
    const parsedHTML = parser.parseFromString(htmlContent, 'text/html');
    const resultText = parsedHTML.body.innerText.trim();
    return resultText;
    // return (resultText.length > 25) ? resultText.substring(0, 22) + "..." : resultText;
}

export async function fetchNotes(setNoteList : React.Dispatch<React.SetStateAction<any>>) {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id : string = (user === null) ? "" : user.id;

    supabase.from('notes').select().eq("user_id", user_id).order("last_modified", { ascending: false }).then(async (result) => {
        if (result.data === null || result.data === undefined || result.error) {
            console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
        } else if (result.data[0] === null || result.data[0] === undefined) {
            setNoteList([]);
        } else {
            setNoteList(result.data);
        }
    });
}

export async function fetchNoteInfoFromId( id : number, setNoteInfo : React.Dispatch<React.SetStateAction<any>> ) {
    return supabase.from('notes').select().eq("note_id", id).then((result) => {
        if (result.data === null || result.data === undefined || result.error) {
            console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
            return DEFAULT_NOTE(0);
        } else if (result.data[0] === null || result.data[0] === undefined) {
            const newNoteInfo = DEFAULT_NOTE(id);
            setNoteInfo(newNoteInfo);
            return newNoteInfo;
        } else {
            setNoteInfo(result.data[0]);
            return result.data[0];
        }
    });
}

export async function deleteNote( id : number ) {
    const { error } = await supabase.from('notes').delete().eq("note_id", id);
    if ( error !== null ) {
        console.log("Cannot delete note! Error: " + JSON.stringify(error));
    }
}

/**
 * An async function that fetches the current user's notes settings and stores them as a
 * NotesSettings variable in a specified React state object.
 * 
 * @param setData The setter for the React state object to store the current user's notes
 *                settings as a NotesSettings variable.
 */
export async function fetchNotesSettings(setData : React.Dispatch<React.SetStateAction<any>>) {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id : string = (user === null) ? "" : user.id;
      
    supabase.from('users_notes_config').select().eq("user_id", user_id).then(async (result) => {
        if (result.data === null || result.data === undefined || result.error) {
            console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
        } else if (result.data[0] === null || result.data[0] === undefined) {
            // user has not set up timer data yet. insert default timer settings.
            const submitInfo : NotesSettings = {
                ...DEFAULT_NOTES_SETTINGS,
                user_id: user_id,
            }

            const { error } = await supabase.from('users_notes_config').insert(submitInfo);
            
            console.log(submitInfo);
            console.log(result.data);

            setData(submitInfo);
        } else {
            // user has set up notes data.
            setData(result.data[0]);
        }
    });
}