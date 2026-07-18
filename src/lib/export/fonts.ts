let fontData: string | null = null;

export async function loadInterFont(doc: import("jspdf").jsPDF, fontUrl: string): Promise<void> {
  if (!fontData) {
    const response = await fetch(fontUrl);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    fontData = binary;
  }
  doc.addFileToVFS("Inter-Regular.ttf", fontData);
  doc.addFont("Inter-Regular.ttf", "Inter", "normal");
  doc.setFont("Inter");
}
