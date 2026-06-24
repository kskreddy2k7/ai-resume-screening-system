import { useResumeStore } from '../store/resumeStore';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export function exportResumeToPdf() {
  setTimeout(() => {
    window.print();
  }, 100);
}

export async function exportResumeToDocx() {
  const data = useResumeStore.getState().data;
  
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: data.personalInfo.fullName,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun(`${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}`),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Professional Summary",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: data.summary,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.role, bold: true }),
                new TextRun(` at ${exp.company} `),
                new TextRun({ text: `(${exp.startDate} - ${exp.endDate})`, italics: true }),
              ],
            }),
            new Paragraph({ text: exp.description }),
            new Paragraph({ text: "" })
          ]),
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun(` from ${edu.school} `),
                new TextRun({ text: `(${edu.endDate})`, italics: true }),
              ],
            }),
            new Paragraph({ text: "" })
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
}
