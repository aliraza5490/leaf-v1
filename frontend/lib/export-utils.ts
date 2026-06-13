import jsPDF from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import type { Conversation } from "@/types/conversation";

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSenderLabel(sender: string): string {
  switch (sender) {
    case "visitor":
      return "Visitor";
    case "ai":
      return "AI Assistant";
    case "agent":
      return "Agent";
    default:
      return sender;
  }
}

export function exportAsText(conversation: Conversation) {
  const lines: string[] = [];
  lines.push(`Conversation Transcript`);
  lines.push(`========================`);
  lines.push(``);
  lines.push(`Visitor: ${conversation.visitor.name} (${conversation.visitor.email})`);
  lines.push(`Status: ${conversation.status}`);
  lines.push(`Started: ${formatTimestamp(conversation.startedAt)}`);
  lines.push(`Last Activity: ${formatTimestamp(conversation.lastActivity)}`);
  lines.push(`Source: ${conversation.metadata.source}`);
  lines.push(``);
  lines.push(`--- Messages ---`);
  lines.push(``);

  for (const msg of conversation.messages) {
    lines.push(`[${formatTimestamp(msg.timestamp)}] ${getSenderLabel(msg.sender)}:`);
    lines.push(`  ${msg.content}`);
    if (msg.productCard) {
      lines.push(`  [Product: ${msg.productCard.title} - $${msg.productCard.price.toFixed(2)}]`);
    }
    lines.push(``);
  }

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `conversation-${conversation.id}.txt`);
}

export function exportAsPDF(conversation: Conversation) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("Conversation Transcript", 20, y);
  y += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Visitor:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${conversation.visitor.name} (${conversation.visitor.email})`, 50, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Status:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(conversation.status, 50, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Started:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatTimestamp(conversation.startedAt), 50, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Source:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(conversation.metadata.source, 50, y);
  y += 14;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Messages", 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  for (const msg of conversation.messages) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`${getSenderLabel(msg.sender)} - ${formatTimestamp(msg.timestamp)}`, 20, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    const contentLines = doc.splitTextToSize(msg.content, 170);
    doc.text(contentLines, 20, y);
    y += contentLines.length * 5 + 2;

    if (msg.productCard) {
      doc.setFont("helvetica", "italic");
      doc.text(`[Product: ${msg.productCard.title} - $${msg.productCard.price.toFixed(2)}]`, 20, y);
      y += 6;
    }

    y += 4;
  }

  doc.save(`conversation-${conversation.id}.pdf`);
}

export async function exportAsWord(conversation: Conversation) {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      text: "Conversation Transcript",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Visitor: ", bold: true }),
        new TextRun(`${conversation.visitor.name} (${conversation.visitor.email})`),
      ],
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Status: ", bold: true }),
        new TextRun(conversation.status),
      ],
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Started: ", bold: true }),
        new TextRun(formatTimestamp(conversation.startedAt)),
      ],
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Source: ", bold: true }),
        new TextRun(conversation.metadata.source),
      ],
      spacing: { after: 300 },
    })
  );

  children.push(
    new Paragraph({
      text: "Messages",
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 200 },
    })
  );

  for (const msg of conversation.messages) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${getSenderLabel(msg.sender)} - ${formatTimestamp(msg.timestamp)}`,
            bold: true,
          }),
        ],
        spacing: { before: 200, after: 60 },
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun(msg.content)],
        spacing: { after: 60 },
      })
    );

    if (msg.productCard) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Product: ${msg.productCard.title} - $${msg.productCard.price.toFixed(2)}]`,
              italics: true,
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `conversation-${conversation.id}.docx`);
}
