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
import type { Conversation } from "@/app/(pages)/dashboard/(pages)/conversations/types";

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

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function exportAsPDF(conversation: Conversation) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    console.error("Could not access iframe document");
    return;
  }

  const html = `
    <html>
      <head>
        <title>Conversation Transcript</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1f2937;
            line-height: 1.5;
            margin: 0;
            padding: 0;
          }
          .print-container {
            width: 100%;
            border-collapse: collapse;
          }
          .page-header-space {
            height: 20mm;
          }
          .page-footer-space {
            height: 20mm;
          }
          .print-content {
            padding-left: 20mm;
            padding-right: 20mm;
          }
          h1 {
            font-size: 24px;
            color: #111827;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 12px;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .metadata {
            margin-bottom: 32px;
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: 8px 16px;
            font-size: 14px;
          }
          .metadata-label {
            font-weight: 600;
            color: #4b5563;
          }
          .metadata-value {
            color: #1f2937;
          }
          .messages-title {
            font-size: 18px;
            font-weight: 700;
            margin-top: 36px;
            margin-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
            color: #111827;
          }
          .message {
            margin-bottom: 20px;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .message-header {
            font-weight: 600;
            font-size: 13px;
            color: #4b5563;
            margin-bottom: 6px;
          }
          .message-content {
            font-size: 14px;
            color: #1f2937;
            white-space: pre-wrap;
          }
          .product-card {
            margin-top: 8px;
            padding: 8px 16px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 13px;
            font-style: italic;
            color: #374151;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <table class="print-container">
          <thead>
            <tr>
              <td><div class="page-header-space"></div></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="print-content">
                <h1>Conversation Transcript</h1>
                <div class="metadata">
                  <div class="metadata-label">Visitor:</div>
                  <div class="metadata-value">${escapeHtml(conversation.visitor.name)} (${escapeHtml(conversation.visitor.email)})</div>
                  
                  <div class="metadata-label">Status:</div>
                  <div class="metadata-value">${escapeHtml(conversation.status)}</div>
                  
                  <div class="metadata-label">Started:</div>
                  <div class="metadata-value">${escapeHtml(formatTimestamp(conversation.startedAt))}</div>
                  
                  <div class="metadata-label">Source:</div>
                  <div class="metadata-value">${escapeHtml(conversation.metadata.source || "N/A")}</div>
                </div>

                <div class="messages-title">Messages</div>
                ${conversation.messages
                  .map(
                    (msg) => `
                  <div class="message">
                    <div class="message-header">${escapeHtml(getSenderLabel(msg.sender))} - ${escapeHtml(
                      formatTimestamp(msg.timestamp)
                    )}</div>
                    <div class="message-content">${escapeHtml(msg.content)}</div>
                    ${
                      msg.productCard
                        ? `<div class="product-card">Product: ${escapeHtml(msg.productCard.title)} - $${msg.productCard.price.toFixed(
                            2
                          )}</div>`
                        : ""
                    }
                  </div>
                `
                  )
                  .join("")}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><div class="page-footer-space"></div></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

  doc.open();
  doc.write(html);
  doc.close();

  const triggerPrint = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  if (iframe.contentWindow) {
    iframe.onload = triggerPrint;
  } else {
    setTimeout(triggerPrint, 500);
  }
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
