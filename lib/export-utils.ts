import { saveAs } from 'file-saver';
import { Invoice } from './types';
import { 
  Document, 
  Packer, 
  Paragraph, 
  Table, 
  TableRow, 
  TableCell, 
  TextRun, 
  WidthType, 
  AlignmentType, 
  BorderStyle,
  ShadingType,
  HeadingLevel
} from 'docx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * 1. Export Invoice to standalone HTML with full styling & Arabic Cairo font
 */
export function exportInvoiceToHTML(invoice: Invoice) {
  const isRTL = invoice.language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const fontFam = isRTL ? `'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` : `'Plus Jakarta Sans', Arial, sans-serif`;

  const htmlContent = `<!DOCTYPE html>
<html lang="${invoice.language}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isRTL ? 'فاتورة' : 'Invoice'} - ${invoice.number}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${fontFam};
      background-color: #f8fafc;
      color: #1e293b;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .invoice-card {
      max-width: 850px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      padding: 48px;
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .company-brand h1 {
      font-size: 26px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: -0.5px;
    }
    .company-brand p {
      font-size: 14px;
      color: #475569;
    }
    .invoice-title-block {
      text-align: ${isRTL ? 'left' : 'right'};
    }
    .invoice-title-block h2 {
      font-size: 32px;
      font-weight: 800;
      color: #2563eb;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .invoice-meta {
      font-size: 14px;
      color: #64748b;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .status-paid { background-color: #dcfce7; color: #15803d; }
    .status-pending { background-color: #fef9c3; color: #a16207; }
    .status-overdue { background-color: #fee2e2; color: #b91c1c; }
    .status-sent { background-color: #dbeafe; color: #1d4ed8; }
    
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 36px;
    }
    .party-box {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border-right: ${isRTL ? '4px solid #2563eb' : 'none'};
      border-left: ${!isRTL ? '4px solid #2563eb' : 'none'};
    }
    .party-box h3 {
      font-size: 13px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .party-name {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .party-detail {
      font-size: 14px;
      color: #475569;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    th {
      background: #1e293b;
      color: #ffffff;
      padding: 12px 16px;
      text-align: ${isRTL ? 'right' : 'left'};
      font-size: 14px;
      font-weight: 600;
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    tr:nth-child(even) { background-color: #f8fafc; }

    .totals-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }
    .bank-info {
      max-width: 50%;
      background: #eff6ff;
      border: 1px dashed #bfdbfe;
      padding: 16px;
      border-radius: 8px;
      font-size: 13px;
    }
    .bank-info h4 {
      color: #1e40af;
      margin-bottom: 6px;
      font-size: 14px;
    }
    .totals-table {
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
      color: #475569;
    }
    .totals-row.grand-total {
      border-top: 2px solid #0f172a;
      padding-top: 10px;
      margin-top: 4px;
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
    }

    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
      text-align: center;
      font-size: 13px;
      color: #94a3b8;
    }
    .footer strong { color: #475569; }

    @media print {
      body { background: white; padding: 0; }
      .invoice-card { box-shadow: none; border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div class="company-brand">
        <h1>${invoice.profile.name}</h1>
        <p><strong>${invoice.profile.title}</strong></p>
        <p>${invoice.profile.email} | ${invoice.profile.phone}</p>
        <p>${invoice.profile.address}</p>
      </div>
      <div class="invoice-title-block">
        <h2>${isRTL ? 'فاتورة' : 'INVOICE'}</h2>
        <div class="invoice-meta">
          <p><strong># ${invoice.number}</strong></p>
          <p>${isRTL ? 'التاريخ' : 'Date'}: ${invoice.createdAt}</p>
          <p>${isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}: ${invoice.dueDate}</p>
          <span class="status-badge status-${invoice.status}">
            ${isRTL 
              ? (invoice.status === 'paid' ? 'مدفوعة' : invoice.status === 'overdue' ? 'متأخرة' : invoice.status === 'sent' ? 'مرسلة' : 'مسودة') 
              : invoice.status}
          </span>
        </div>
      </div>
    </div>

    <div class="parties-grid">
      <div class="party-box">
        <h3>${isRTL ? 'صادرة من' : 'BILLED BY'}</h3>
        <div class="party-name">${invoice.profile.name}</div>
        <div class="party-detail">${invoice.profile.email}</div>
        <div class="party-detail">${invoice.profile.address}</div>
        <div class="party-detail">${invoice.profile.website}</div>
      </div>

      <div class="party-box">
        <h3>${isRTL ? 'صادرة إلى (العميل)' : 'BILLED TO'}</h3>
        <div class="party-name">${invoice.client.companyName || invoice.client.name}</div>
        <div class="party-detail">${invoice.client.name}</div>
        <div class="party-detail">${invoice.client.email}</div>
        <div class="party-detail">${invoice.client.address}</div>
        ${invoice.client.taxNumber ? `<div class="party-detail">${isRTL ? 'الرقم الضريبي' : 'Tax ID'}: ${invoice.client.taxNumber}</div>` : ''}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>${isRTL ? 'وصف الخدمة / المنتج' : 'Description'}</th>
          <th style="text-align: center">${isRTL ? 'الكمية' : 'Qty'}</th>
          <th style="text-align: ${isRTL ? 'left' : 'right'}">${isRTL ? 'سعر الوحدة' : 'Unit Price'}</th>
          <th style="text-align: ${isRTL ? 'left' : 'right'}">${isRTL ? 'الإجمالي' : 'Total'}</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items.map((item, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${item.description}</strong></td>
            <td style="text-align: center">${item.quantity}</td>
            <td style="text-align: ${isRTL ? 'left' : 'right'}">${item.unitPrice.toLocaleString()} ${invoice.currency}</td>
            <td style="text-align: ${isRTL ? 'left' : 'right'}"><strong>${item.total.toLocaleString()} ${invoice.currency}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals-container">
      <div class="bank-info" style="background: #f8fafc; border: 1px solid #e2e8f0;">
        <h4 style="color: #0f172a; margin-bottom: 4px; font-weight: 700;">🛡️ ${isRTL ? 'رمز التوثيق والتحقق الرقمي' : 'Verification QR Code'}</h4>
        <p style="color: #64748b;">${isRTL ? 'وثيقة فاتورة رقمية محفوظة ومصادق عليها.' : 'Cryptographically signed invoice document.'}</p>
        <p style="color: #94a3b8; font-family: monospace; font-size: 11px; margin-top: 4px;">Ref ID: ${invoice.id}</p>
      </div>

      <div class="totals-table">
        <div class="totals-row">
          <span>${isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
          <span>${invoice.subtotal.toLocaleString()} ${invoice.currency}</span>
        </div>
        ${invoice.discountAmount > 0 ? `
          <div class="totals-row" style="color: #059669;">
            <span>${isRTL ? 'الخصم' : 'Discount'} (${invoice.discountPercentage}%)</span>
            <span>-${invoice.discountAmount.toLocaleString()} ${invoice.currency}</span>
          </div>
        ` : ''}
        ${invoice.taxAmount > 0 ? `
          <div class="totals-row">
            <span>${isRTL ? 'الضريبة (VAT/TVA)' : 'Tax'} (${invoice.taxPercentage}%)</span>
            <span>+${invoice.taxAmount.toLocaleString()} ${invoice.currency}</span>
          </div>
        ` : ''}
        <div class="totals-row grand-total">
          <span>${isRTL ? 'الإجمالي المستحق' : 'Total Due'}</span>
          <span>${invoice.totalAmount.toLocaleString()} ${invoice.currency}</span>
        </div>
      </div>
    </div>

    ${invoice.notes ? `
      <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px;">
        <strong style="color: #334155;">${isRTL ? 'ملاحظات' : 'Notes'}:</strong> ${invoice.notes}
      </div>
    ` : ''}

    <div class="footer">
      <p>${isRTL ? 'تم إنشاء هذه الفاتورة بواسطة نظام' : 'Generated by'} <strong>${invoice.profile.name} - Invoicing System</strong></p>
      <p>${invoice.profile.email} | ${invoice.profile.website}</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `Invoice_${invoice.number}.html`);
}

/**
 * 2. Export Invoice to Microsoft Word DOCX format
 */
export async function exportInvoiceToDOCX(invoice: Invoice) {
  const isRTL = invoice.language === 'ar';

  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          shading: { fill: '1E293B', type: ShadingType.CLEAR, color: 'auto' },
          children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true, color: 'FFFFFF' })] })],
          width: { size: 5, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          shading: { fill: '1E293B', type: ShadingType.CLEAR, color: 'auto' },
          children: [new Paragraph({ children: [new TextRun({ text: isRTL ? 'وصف الخدمة' : 'Description', bold: true, color: 'FFFFFF' })] })],
          width: { size: 50, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          shading: { fill: '1E293B', type: ShadingType.CLEAR, color: 'auto' },
          children: [new Paragraph({ children: [new TextRun({ text: isRTL ? 'الكمية' : 'Qty', bold: true, color: 'FFFFFF' })] })],
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          shading: { fill: '1E293B', type: ShadingType.CLEAR, color: 'auto' },
          children: [new Paragraph({ children: [new TextRun({ text: isRTL ? 'السعر' : 'Unit Price', bold: true, color: 'FFFFFF' })] })],
          width: { size: 17, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          shading: { fill: '1E293B', type: ShadingType.CLEAR, color: 'auto' },
          children: [new Paragraph({ children: [new TextRun({ text: isRTL ? 'الإجمالي' : 'Total', bold: true, color: 'FFFFFF' })] })],
          width: { size: 18, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
  ];

  invoice.items.forEach((item, index) => {
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(`${index + 1}`)] }),
          new TableCell({ children: [new Paragraph(item.description)] }),
          new TableCell({ children: [new Paragraph(`${item.quantity}`)] }),
          new TableCell({ children: [new Paragraph(`${item.unitPrice} ${invoice.currency}`)] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${item.total} ${invoice.currency}`, bold: true })] })] }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: invoice.profile.name,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: `${invoice.profile.title} | ${invoice.profile.email}`,
          }),
          new Paragraph({
            text: `${invoice.profile.address}`,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: `${isRTL ? 'فاتورة رقم' : 'INVOICE'}: ${invoice.number}`,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: `${isRTL ? 'تاريخ الإصدار' : 'Date'}: ${invoice.createdAt} | ${isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}: ${invoice.dueDate}`,
          }),
          new Paragraph({
            text: `${isRTL ? 'الحالة' : 'Status'}: ${invoice.status.toUpperCase()}`,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: `${isRTL ? 'صادرة إلى العميل' : 'BILLED TO'}: ${invoice.client.companyName || invoice.client.name}`,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: `${invoice.client.name} - ${invoice.client.email} - ${invoice.client.address}`,
          }),
          new Paragraph({ text: '' }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: rows,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: `${isRTL ? 'المجموع الفرعي' : 'Subtotal'}: ${invoice.subtotal} ${invoice.currency}\n` }),
              invoice.taxAmount > 0 ? new TextRun({ text: `${isRTL ? 'الضريبة' : 'Tax'} (${invoice.taxPercentage}%): +${invoice.taxAmount} ${invoice.currency}\n` }) : new TextRun(''),
              new TextRun({ text: `${isRTL ? 'الإجمالي المستحق' : 'Total Due'}: ${invoice.totalAmount} ${invoice.currency}`, bold: true, size: 28 }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: `${isRTL ? 'التوثيق الرقمي' : 'Verification'}:`,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: `Ref ID: ${invoice.id} | ${isRTL ? 'فاتورة معتمدة إلكترونياً' : 'Archived Digital Invoice'}`,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: `Zakariae Lahbabi Invoicing Platform | info@zakariaelahbabi.com`,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Invoice_${invoice.number}.docx`);
}

/**
 * 3. Export Invoice to High-Resolution PDF canvas
 */
export async function exportInvoiceToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    // Fallback to print dialog
    window.print();
  }
}

/**
 * Direct PDF exporter for table action buttons without needing pre-rendered visible DOM node
 */
export async function exportInvoicePDFDirect(invoice: Invoice) {
  const existingElement = document.getElementById(`invoice-printable-${invoice.id}`);
  if (existingElement) {
    return exportInvoiceToPDF(`invoice-printable-${invoice.id}`, `Invoice_${invoice.number}`);
  }

  const tempDiv = document.createElement('div');
  tempDiv.id = `temp-pdf-${invoice.id}`;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '800px';
  tempDiv.style.backgroundColor = '#ffffff';
  
  const isRTL = invoice.language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  tempDiv.innerHTML = `
    <div style="padding: 40px; font-family: 'Cairo', 'Segoe UI', sans-serif; background: #ffffff; color: #0f172a;" dir="${dir}">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 25px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #1e3a8a; margin: 0;">${invoice.profile.name}</h1>
          <p style="font-size: 13px; color: #475569; margin: 2px 0;">${invoice.profile.title}</p>
          <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${invoice.profile.email} | ${invoice.profile.phone}</p>
          <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${invoice.profile.address}</p>
        </div>
        <div style="text-align: ${isRTL ? 'left' : 'right'};">
          <h2 style="font-size: 28px; font-weight: 800; color: #2563eb; margin: 0;">${isRTL ? 'فاتورة' : 'INVOICE'}</h2>
          <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 4px 0;"># ${invoice.number}</p>
          <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${isRTL ? 'التاريخ' : 'Date'}: ${invoice.createdAt}</p>
          <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}: ${invoice.dueDate}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-right: 4px solid #2563eb;">
          <p style="font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 4px; font-weight: 700;">${isRTL ? 'صادرة من' : 'BILLED BY'}</p>
          <p style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0;">${invoice.profile.name}</p>
          <p style="font-size: 12px; color: #475569; margin: 2px 0;">${invoice.profile.email}</p>
          <p style="font-size: 12px; color: #475569; margin: 2px 0;">${invoice.profile.address}</p>
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-right: 4px solid #4f46e5;">
          <p style="font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 4px; font-weight: 700;">${isRTL ? 'صادرة إلى (العميل)' : 'BILLED TO'}</p>
          <p style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0;">${invoice.client.companyName || invoice.client.name}</p>
          <p style="font-size: 12px; color: #475569; margin: 2px 0;">${invoice.client.name}</p>
          <p style="font-size: 12px; color: #475569; margin: 2px 0;">${invoice.client.email}</p>
          <p style="font-size: 12px; color: #475569; margin: 2px 0;">${invoice.client.address}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff; text-align: ${isRTL ? 'right' : 'left'};">
            <th style="padding: 10px; font-size: 12px;">#</th>
            <th style="padding: 10px; font-size: 12px;">${isRTL ? 'وصف الخدمة' : 'Description'}</th>
            <th style="padding: 10px; font-size: 12px; text-align: center;">${isRTL ? 'الكمية' : 'Qty'}</th>
            <th style="padding: 10px; font-size: 12px; text-align: ${isRTL ? 'left' : 'right'};">${isRTL ? 'سعر الوحدة' : 'Unit Price'}</th>
            <th style="padding: 10px; font-size: 12px; text-align: ${isRTL ? 'left' : 'right'};">${isRTL ? 'الإجمالي' : 'Total'}</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, idx) => `
            <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
              <td style="padding: 10px;">${idx + 1}</td>
              <td style="padding: 10px; font-weight: 600;">${item.description}</td>
              <td style="padding: 10px; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'};">${item.unitPrice.toLocaleString()} ${invoice.currency}</td>
              <td style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-weight: 700;">${item.total.toLocaleString()} ${invoice.currency}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 11px; width: 45%;">
          <p style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">🛡️ ${isRTL ? 'رمز التوثيق والتحقق الرقمي' : 'Verification QR Code'}</p>
          <p style="color: #64748b; margin: 2px 0;">${isRTL ? 'فاتورة معتمدة محفوطة وموثقة إلكترونياً.' : 'Digital invoice archived with verification.'}</p>
          <p style="color: #94a3b8; font-family: monospace; font-size: 10px; margin-top: 4px;">Ref ID: ${invoice.id}</p>
        </div>
        <div style="width: 45%; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #475569;">
            <span>${isRTL ? 'المجموع الفرعي' : 'Subtotal'}:</span>
            <span>${invoice.subtotal.toLocaleString()} ${invoice.currency}</span>
          </div>
          ${invoice.taxAmount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #475569;">
              <span>${isRTL ? 'الضريبة' : 'Tax'} (${invoice.taxPercentage}%):</span>
              <span>+${invoice.taxAmount.toLocaleString()} ${invoice.currency}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #0f172a; font-weight: 800; font-size: 16px; color: #0f172a; margin-top: 4px;">
            <span>${isRTL ? 'الإجمالي' : 'Total Due'}:</span>
            <span>${invoice.totalAmount.toLocaleString()} ${invoice.currency}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);
  try {
    const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, logging: false });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Invoice_${invoice.number}.pdf`);
  } catch (err) {
    console.error('Direct PDF export error:', err);
    window.print();
  } finally {
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
    }
  }
}

/**
 * 4. Export Invoice to CSV format for accounting
 */
export function exportInvoiceToCSV(invoice: Invoice) {
  const isRTL = invoice.language === 'ar';
  let csvContent = `Invoice Number,Date,Due Date,Status,Client,Email,Subtotal,Tax,Total,Currency\n`;
  csvContent += `"${invoice.number}","${invoice.createdAt}","${invoice.dueDate}","${invoice.status}","${invoice.client.companyName || invoice.client.name}","${invoice.client.email}",${invoice.subtotal},${invoice.taxAmount},${invoice.totalAmount},"${invoice.currency}"\n\n`;

  csvContent += `Item #,Description,Quantity,Unit Price,Total\n`;
  invoice.items.forEach((item, idx) => {
    csvContent += `${idx + 1},"${item.description.replace(/"/g, '""')}",${item.quantity},${item.unitPrice},${item.total}\n`;
  });

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `Invoice_${invoice.number}.csv`);
}

/**
 * 5. Export Invoice to JSON format
 */
export function exportInvoiceToJSON(invoice: Invoice) {
  const jsonStr = JSON.stringify(invoice, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  saveAs(blob, `Invoice_${invoice.number}.json`);
}
