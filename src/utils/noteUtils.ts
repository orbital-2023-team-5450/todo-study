import supabase from "../supabase";

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
}

/**
 * Truncates a HTML document using its content to 30 characters.
 * @param htmlContent A HTML document, as a string.
 * @returns A truncated string containing the main text of the HTML document, cutting at
 *          30 characters.
 */
export function TruncateHTML(htmlContent: string) : string {
    const parser = new DOMParser();
    const parsedHTML = parser.parseFromString(htmlContent, 'text/html');
    const resultText = parsedHTML.body.innerText.trim();
    return (resultText.length > 30) ? resultText.substring(0, 27) + "..." : resultText;
}

export async function fetchNotes(setNoteList : React.Dispatch<React.SetStateAction<any>>) {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id : string = (user === null) ? "" : user.id;

    supabase.from('notes').select().eq("user_id", user_id).then(async (result) => {
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
    supabase.from('notes').select().eq("note_id", id).then(async (result) => {
        if (result.data === null || result.data === undefined || result.error) {
            console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
        } else if (result.data[0] === null || result.data[0] === undefined) {
            setNoteInfo({
                note_id: id,
                user_id: "",
                title: "",
                html_content: "",
                created_at: "",
                last_modified: "",
            });
        } else {
            setNoteInfo(result.data[0]);
        }
    });
}