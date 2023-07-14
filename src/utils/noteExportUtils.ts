import { EditorState, convertToRaw } from 'draft-js';

// @ts-ignore
import draftToHtml from 'draftjs-to-html';
// @ts-ignore
import draftToMarkdown from 'draftjs-to-markdown';
// @ts-ignore
import prettify from 'html-prettify';

// utility function to open content in new window for debugging
function openInNewWindow(obj : string | Object) {
  if (typeof obj === 'string') {
    window.open(URL.createObjectURL(new Blob([obj])));
  } else {
    window.open(URL.createObjectURL(new Blob(JSON.stringify(obj).split("\n"))));
  }
}

const HEADER = ( title : string, font? : string, fontSize? : number ) => {
  const fontStyle = (font === "" || font === null || font === undefined) ? "" : `font-family: ${font};`;
  const fontSizeStyle = (fontSize === null || fontSize === undefined || fontSize === 0) ? "" : `font-size: ${fontSize}px; `;
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8" />
      <style type="text/css">
        body {
          ${fontStyle}
          ${fontSizeStyle}
        }
      </style></head><body>`;
}

const FOOTER = `</body></html>`

export function exportAsHTML(editorState : EditorState, title : string, font? : string, fontSize? : number) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  const header = HEADER(title, font, fontSize);
  return prettify(header + draftToHtml(rawContentState) + FOOTER) as string;  
}

export function exportAsMarkdown(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return draftToMarkdown(rawContentState) as string;
}

export function exportAsPDF(editorState : EditorState, title : string, font? : string, fontSize? : number) {
  const htmlContent = exportAsHTML(editorState, title, font, fontSize);
  var disp_setting="toolbar=yes,location=no,";
  disp_setting+="directories=yes,menubar=yes,";
  disp_setting+="scrollbars=yes,width=650, height=600, left=100, top=25";
  const docPrint = window.open("", "", disp_setting);
  docPrint?.document.open();
  docPrint?.document.write(htmlContent);
  docPrint?.document.close();
  docPrint?.focus();
  docPrint?.print();
  if (docPrint !== null) docPrint.onafterprint = () => docPrint.close();

  /*
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  const pri = iframe.contentWindow as Window;
  pri.document.open();
  pri.document.write(htmlContent);
  pri.document.close();
  pri.focus();
  pri.print();
  pri.onafterprint = () => { document.body.removeChild(iframe); }
*/
}