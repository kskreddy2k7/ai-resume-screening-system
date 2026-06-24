import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Setup PDF.js worker using Vite's ?url loader
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPdf(file);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
    return extractTextFromDocx(file);
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return file.text();
  }
  
  throw new Error(`Unsupported file type: ${fileType} (${fileName})`);
}

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + '\n';
  }
  
  return fullText;
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
