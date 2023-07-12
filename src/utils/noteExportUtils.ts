import { EditorState, convertToRaw } from 'draft-js';

// @ts-ignore
import draftToHtml from 'draftjs-to-html';
// @ts-ignore
import draftToMarkdown from 'draftjs-to-markdown';
// @ts-ignore
import prettify from 'html-prettify';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export function exportAsHTML(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return prettify(draftToHtml(rawContentState)) as string;  
}

export function exportAsMarkdown(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return draftToMarkdown(rawContentState) as string;
}

/*
export function exportAsPDF(editorState : EditorState, exportFilename : string) {
  const htmlContent = exportAsHTML(editorState);
  
  const el = document.createElement("div");
  el.style.color = "black";
  el.style.width = "2970mm";
  el.style.height = "2100mm";
  el.innerHTML = htmlContent;
  document.body.appendChild(el);

  html2canvas(el).then(function (canvas) {
    var img = canvas.toDataURL("image/png");
    var doc = new jsPDF();
    var imgWidth =  canvas.width;
    var imgHeight = canvas.height;
    doc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
    doc.save(exportFilename);
  });

  document.body.removeChild(el);
}*/