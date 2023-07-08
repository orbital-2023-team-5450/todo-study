import { EditorState, RawDraftContentState, SelectionState, convertToRaw } from "draft-js";
import supabase from "../supabase";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../components/note-taking/textEditor.css';
import { Theme } from "@mui/material";

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

/**
 * The toolbar properties used in the text editor.
 * 
 * View https://jpuri.github.io/react-draft-wysiwyg/#/docs?_k=jjqinp
 * for details on how the toolbar buttons are configured.
 */
export const toolbar = (dark : boolean) => { 
  
  const defaultButtonStyle = (dark) ? 'editor-button-dark' : 'editor-button';
  const defaultPopupStyle = (dark) ? 'editor-popup-dark' : 'editor-popup';

  return {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
    inline: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
      bold: { className: defaultButtonStyle },
      italic: { className: defaultButtonStyle },
      underline: { className: defaultButtonStyle },
      strikethrough: { className: defaultButtonStyle },
      monospace: { className: defaultButtonStyle },
      superscript: { className: defaultButtonStyle },
      subscript: { className: defaultButtonStyle },
    },
    blockType: {
      inDropdown: true,
      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
      className: defaultButtonStyle,
      component: undefined,
      dropdownClassName: defaultButtonStyle,
    },
    fontSize: {
      icon: 'fontSize',
      options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
      className: defaultButtonStyle,
      component: undefined,
      dropdownClassName: defaultButtonStyle,
    },
    fontFamily: {
      options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
      className: defaultButtonStyle,
      component: undefined,
      dropdownClassName: defaultButtonStyle,
    },
    list: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['unordered', 'ordered', 'indent', 'outdent'],
      unordered: { className: defaultButtonStyle },
      ordered: { className: defaultButtonStyle },
      indent: { className: defaultButtonStyle },
      outdent: { className: defaultButtonStyle },
    },
    textAlign: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['left', 'center', 'right', 'justify'],
      left: { className: defaultButtonStyle },
      center: { className: defaultButtonStyle },
      right: { className: defaultButtonStyle },
      justify: { className: defaultButtonStyle },
    },
    colorPicker: {
      className: defaultButtonStyle,
      component: undefined,
      popupClassName: defaultPopupStyle,
      colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
        'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
        'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
        'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
        'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
        'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
    },
    link: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      popupClassName: defaultPopupStyle,
      dropdownClassName: undefined,
      showOpenOptionOnHover: true,
      defaultTargetOption: '_self',
      options: ['link', 'unlink'],
      link: { className: defaultButtonStyle },
      unlink: { className: defaultButtonStyle },
      linkCallback: undefined
    },
    emoji: {
      className: defaultButtonStyle,
      component: undefined,
      popupClassName: defaultPopupStyle,
      emojis: [
        '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
        '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
        '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
        '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
        '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
        '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
        '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
        '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
        '✅', '❎', '💯',
      ],
    },
    embedded: {
      className: defaultButtonStyle,
      component: undefined,
      popupClassName: defaultPopupStyle,
      embedCallback: undefined,
      defaultSize: {
        height: 'auto',
        width: 'auto',
      },
    },
    image: {
      className: defaultButtonStyle,
      component: undefined,
      popupClassName: defaultPopupStyle,
      urlEnabled: true,
      uploadEnabled: true,
      alignmentEnabled: true,
      uploadCallback: undefined,
      previewImage: false,
      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
      alt: { present: false, mandatory: false },
      defaultSize: {
        height: 'auto',
        width: 'auto',
      },
    },
    remove: { className: defaultButtonStyle, component: undefined },
    history: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['undo', 'redo'],
      undo: { className: defaultButtonStyle },
      redo: { className: defaultButtonStyle },
    },
  };
}