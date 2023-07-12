import { EditorState, convertToRaw } from 'draft-js';

// @ts-ignore
import draftToHtml from 'draftjs-to-html';
// @ts-ignore
import draftToMarkdown from 'draftjs-to-markdown';
// @ts-ignore
import prettify from 'html-prettify';
// @ts-ignore
import StateToPdfMake from "draft-js-export-pdfmake";
// @ts-ignore
import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};

export function exportAsHTML(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return prettify(draftToHtml(rawContentState)) as string;  
}

export function exportAsMarkdown(editorState : EditorState) : string {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return draftToMarkdown(rawContentState) as string;
}

export function exportAsPDF(editorState : EditorState, exportFilename : string) {
  const rawContent = convertToRaw(editorState.getCurrentContent());
  const stateToPdfMake = new StateToPdfMake(rawContent);
  const docDefinition = {
    ...stateToPdfMake.generate(),
    defaultStyle: {
      font: 'Helvetica',
    }
  };
  console.log(stateToPdfMake.generate());
  pdfMake.createPdf(docDefinition).download(exportFilename);
}