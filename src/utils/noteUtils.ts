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