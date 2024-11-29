import { jsPDF } from "jspdf";

export const generatePDF = async (metrics: any[]) => {
  try {
    const pdf = new jsPDF();

    const marginX = 15;
    const marginY = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let yOffset = marginY;

    const logoUrl = "https://raw.githubusercontent.com/RayssaGM21/Img/refs/heads/main/Captura%20de%20tela%202024-11-28%20225204.png";
    const logoWidth = 33;
    const logoHeight = 8;
    pdf.addImage(logoUrl, "PNG", marginX, yOffset, logoWidth, logoHeight);

    yOffset += logoHeight + 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(18);
    pdf.text("Relatório de Métricas dos Produtos", marginX, yOffset);

    yOffset += 10;

    pdf.setLineWidth(0.5);
    pdf.line(marginX, yOffset, pageWidth - marginX, yOffset);
    yOffset += 10;

    const addProductInfo = (metric: any) => {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Produto: ${metric.name}`, marginX, yOffset);

      yOffset += 8;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`- Preço Médio: R$ ${metric.media.toFixed(2).replace(".", ",")}`, marginX, yOffset);
      yOffset += 8;

      pdf.text(`- Amplitude de Preço: R$ ${metric.priceIncrease.toFixed(2).replace(".", ",")}`, marginX, yOffset);
      yOffset += 8;

      pdf.text(`- Preço Máximo: R$ ${metric.maxPrice.toFixed(2).replace(".", ",")}`, marginX, yOffset);
      yOffset += 8;

      pdf.text(`- Preço Mínimo: R$ ${metric.minPrice.toFixed(2).replace(".", ",")}`, marginX, yOffset);
      yOffset += 12;

      pdf.setLineWidth(0.5);
      pdf.line(marginX, yOffset, pageWidth - marginX, yOffset);
      yOffset += 10;
    };

    metrics.forEach((metric, index) => {
      if (yOffset > pageHeight - 50) {
        pdf.addPage();
        yOffset = marginY;
      }

      addProductInfo(metric);
    });

    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return pdfUrl;
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    return null;
  }
};