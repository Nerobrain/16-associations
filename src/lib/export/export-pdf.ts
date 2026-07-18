import jsPDF from "jspdf";
import { loadInterFont } from "./fonts";

export async function exportPdf(theme: string, treeData: string[], baseUrl: string, fontUrl: string) {
  const doc = new jsPDF("landscape", "mm", "a4");
  await loadInterFont(doc, fontUrl);

  const pw = 297;
  const ph = 210;
  const ml = 15;
  const mr = 15;
  const mt = 35;
  const availW = pw - ml - mr;
  const cols = 5;
  const colW = availW / cols;
  const rows = 16;
  const rowH = (ph - mt - 15) / rows;

  const cellData: { text: string; rowspan: number }[][] = [];
  for (let i = 0; i < rows; i++) {
    cellData[i] = [];
    cellData[i][0] = { text: treeData[i], rowspan: 1 };
    cellData[i][1] = i % 2 === 0 ? { text: treeData[16 + i / 2], rowspan: 2 } : { text: "", rowspan: 1 };
    cellData[i][2] = i % 4 === 0 ? { text: treeData[24 + i / 4], rowspan: 4 } : { text: "", rowspan: 1 };
    cellData[i][3] = i % 8 === 0 ? { text: treeData[28 + i / 8], rowspan: 8 } : { text: "", rowspan: 1 };
    cellData[i][4] = i === 0 ? { text: treeData[30], rowspan: 16 } : { text: "", rowspan: 1 };
  }

  function drawCell(x: number, y: number, w: number, h: number, text: string, rowspan: number) {
    const cellH = h * rowspan;
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.rect(x, y, w, cellH);
    if (text) {
      doc.setFontSize(8);
      const lines = doc.splitTextToSize(text, w - 2);
      const textY = y + (cellH - lines.length * 3.5) / 2 + 3;
      doc.text(lines, x + w / 2, textY, { align: "center" });
    }
  }

  doc.setFontSize(14);
  doc.text("Результаты теста «16 ассоциаций»", pw / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Тема: ${theme}`, pw / 2, 24, { align: "center" });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const { text, rowspan } = cellData[r][c];
      if (!text) continue;
      drawCell(ml + c * colW, mt + r * rowH, colW, rowH, text, rowspan);
    }
  }

  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(`Данные предоставлены сервисом: ${baseUrl}`, pw / 2, ph - 8, { align: "center" });

  doc.save("16-associations-result.pdf");
}
