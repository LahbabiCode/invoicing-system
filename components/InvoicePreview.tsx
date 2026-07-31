import React, { useEffect, useState } from 'react';
import { Invoice } from '../lib/types';
import { exportInvoiceToHTML, exportInvoiceToDOCX, exportInvoiceToPDF, exportInvoiceToCSV, exportInvoiceToJSON } from '../lib/export-utils';
import { FileText, Download, Code, FileSpreadsheet, Printer, CheckCircle2, ShieldCheck, Globe, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import QRCode from 'qrcode';

interface InvoicePreviewProps {
  invoice: Invoice;
  onEdit?: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const isRTL = invoice.language === 'ar';
  const primaryColor = invoice.profile?.primaryColor || '#2563eb';

  useEffect(() => {
    // Generate QR Code for ZATCA / Standard Invoice Verification
    const qrData = `Seller: ${invoice.profile.name}\nVAT: ${invoice.profile.taxNumber}\nInvoice: ${invoice.number}\nTotal: ${invoice.totalAmount} ${invoice.currency}\nDate: ${invoice.createdAt}`;
    QRCode.toDataURL(qrData, { margin: 1, width: 100 })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('QR code generation failed:', err));
  }, [invoice]);

  const handleDownloadPDF = () => {
    exportInvoiceToPDF(`invoice-printable-${invoice.id}`, `Invoice_${invoice.number}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Bar / Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900/80 p-4 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-slate-200">
            {isRTL ? 'معاينة التصدير الاحترافي' : 'Professional Export Preview'}
          </span>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {invoice.language === 'ar' ? 'العربية (RTL)' : 'English (LTR)'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* PDF Download */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-rose-500 shadow-md shadow-rose-600/30 active:scale-95 cursor-pointer border border-rose-400/30"
            title="تصدير وثيقة PDF عالية الدقة"
          >
            <Download className="h-4 w-4" />
            <span>📄 {isRTL ? 'تصدير PDF (عالي الدقة)' : 'Export PDF'}</span>
          </button>

          {/* HTML Download */}
          <button
            onClick={() => exportInvoiceToHTML(invoice)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
            title="Export Standalone HTML File"
          >
            <Code className="h-4 w-4" />
            <span>HTML {isRTL ? 'تصدير' : 'Export'}</span>
          </button>

          {/* DOCX Download */}
          <button
            onClick={() => exportInvoiceToDOCX(invoice)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
            title="Export Microsoft Word (.docx)"
          >
            <FileText className="h-4 w-4" />
            <span>DOCX (Word)</span>
          </button>

          {/* CSV Download */}
          <button
            onClick={() => exportInvoiceToCSV(invoice)}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white cursor-pointer"
            title="Export Excel / CSV Data"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>CSV</span>
          </button>

          {/* Native Print */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white cursor-pointer"
            title="Print Invoice"
          >
            <Printer className="h-4 w-4" />
            <span>{isRTL ? 'طباعة' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Actual Printable Invoice Card */}
      <div 
        id={`invoice-printable-${invoice.id}`}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`printable-area mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 md:p-12 text-slate-900 shadow-2xl border border-slate-200 transition-all ${
          isRTL ? 'font-cairo' : ''
        }`}
        style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 pb-8 mb-8" style={{ borderColor: primaryColor }}>
          {/* Brand Info */}
          <div className="flex items-start gap-4">
            <div 
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-white font-extrabold text-2xl shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              ZL
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {invoice.profile.name}
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {invoice.profile.title}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                  {invoice.profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-blue-600" />
                  {invoice.profile.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                  {invoice.profile.website}
                </span>
              </div>
              {invoice.profile.taxNumber && (
                <p className="text-xs text-slate-500 mt-1">
                  <strong>{isRTL ? 'الرقم الضريبي' : 'Tax Registration ID'}:</strong> {invoice.profile.taxNumber}
                </p>
              )}
            </div>
          </div>

          {/* Invoice Meta Title & Status */}
          <div className={`mt-6 md:mt-0 ${isRTL ? 'text-right md:text-left' : 'text-left md:text-right'}`}>
            <h2 className="text-3xl font-black tracking-wider uppercase" style={{ color: primaryColor }}>
              {isRTL ? 'فاتورة' : 'INVOICE'}
            </h2>
            <div className="text-sm text-slate-600 mt-2 space-y-1">
              <p className="font-bold text-slate-900 text-lg">#{invoice.number}</p>
              <p>
                <span className="text-slate-500">{isRTL ? 'تاريخ التحرير:' : 'Date:'}</span>{' '}
                <span className="font-medium text-slate-800">{invoice.createdAt}</span>
              </p>
              <p>
                <span className="text-slate-500">{isRTL ? 'تاريخ الاستحقاق:' : 'Due Date:'}</span>{' '}
                <span className="font-medium text-slate-800">{invoice.dueDate}</span>
              </p>
            </div>
            {/* Status Pill */}
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                invoice.status === 'overdue' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                invoice.status === 'sent' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                'bg-slate-100 text-slate-700 border border-slate-300'
              }`}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isRTL ? (
                  invoice.status === 'paid' ? 'مدفوعة' :
                  invoice.status === 'overdue' ? 'متأخرة عن الدفع' :
                  invoice.status === 'sent' ? 'تم الإرسال' : 'مسودة'
                ) : invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Client & Billed Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Billed From Box */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              {isRTL ? 'من (المزود)' : 'BILLED BY'}
            </span>
            <p className="font-bold text-base text-slate-900">{invoice.profile.name}</p>
            <p className="text-xs text-slate-600 mt-1">{invoice.profile.title}</p>
            <p className="text-xs text-slate-600 mt-0.5">{invoice.profile.email}</p>
            <p className="text-xs text-slate-600 mt-0.5">{invoice.profile.address}</p>
          </div>

          {/* Billed To Box */}
          <div className="rounded-xl bg-slate-50 p-5 border-l-4 border-slate-200" style={{ borderColor: primaryColor }}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              {isRTL ? 'إلى (العميل)' : 'BILLED TO'}
            </span>
            <p className="font-bold text-base text-slate-900">{invoice.client.companyName || invoice.client.name}</p>
            <p className="text-xs text-slate-700 font-medium mt-1">{isRTL ? 'جهة الاتصال' : 'Attn'}: {invoice.client.name}</p>
            <p className="text-xs text-slate-600 mt-0.5">{invoice.client.email}</p>
            <p className="text-xs text-slate-600 mt-0.5">{invoice.client.address}</p>
            {invoice.client.taxNumber && (
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {isRTL ? 'الرقم الضريبي للعميل' : 'Client Tax ID'}: {invoice.client.taxNumber}
              </p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto mb-8 rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center w-12">#</th>
                <th className={`py-3 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'بيان الخدمة / المنتج' : 'Item & Description'}</th>
                <th className="py-3 px-4 text-center w-20">{isRTL ? 'الكمية' : 'Qty'}</th>
                <th className={`py-3 px-4 ${isRTL ? 'text-left' : 'text-right'} w-32`}>{isRTL ? 'سعر الوحدة' : 'Unit Price'}</th>
                <th className={`py-3 px-4 ${isRTL ? 'text-left' : 'text-right'} w-36`}>{isRTL ? 'الإجمالي' : 'Total'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {invoice.items.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">{index + 1}</td>
                  <td className={`py-4 px-4 font-semibold text-slate-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {item.description}
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-slate-700">{item.quantity}</td>
                  <td className={`py-4 px-4 text-slate-700 font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {item.unitPrice.toLocaleString()} {invoice.currency}
                  </td>
                  <td className={`py-4 px-4 font-bold text-slate-900 ${isRTL ? 'text-left' : 'text-right'}`}>
                    {item.total.toLocaleString()} {invoice.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & QR Verification Code Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
          {/* QR Verification Box */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-200 flex items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-slate-700">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {isRTL ? 'رمز التحقق والتصديق الرقمي' : 'Verification QR Code'}
              </h4>
              <p className="text-slate-500 text-[11px]">
                {isRTL ? 'فاتورة معتمدة محفوطة وموثقة إلكترونياً.' : 'Digital invoice archived with cryptographic signature.'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Ref: {invoice.id}</p>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="flex flex-col items-center bg-white p-2 rounded-lg border border-slate-200 shadow-xs shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeUrl} alt="QR Code Verification" className="w-20 h-20" />
                <span className="text-[9px] text-slate-500 font-bold mt-1 uppercase">QR Verification</span>
              </div>
            )}
          </div>

          {/* Totals Summary */}
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span className="font-semibold">{invoice.subtotal.toLocaleString()} {invoice.currency}</span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-emerald-700 border-b border-slate-100">
                <span>{isRTL ? 'الخصم المطبق:' : 'Discount:'} ({invoice.discountPercentage}%)</span>
                <span className="font-semibold">-{invoice.discountAmount.toLocaleString()} {invoice.currency}</span>
              </div>
            )}

            {invoice.taxAmount > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>{isRTL ? 'ضريبة القيمة المضافة (VAT):' : 'Tax:'} ({invoice.taxPercentage}%)</span>
                <span className="font-semibold">+{invoice.taxAmount.toLocaleString()} {invoice.currency}</span>
              </div>
            )}

            <div className="flex justify-between py-3 border-t-2 border-slate-900 text-lg font-black text-slate-900">
              <span>{isRTL ? 'الإجمالي المستحق:' : 'Total Amount Due:'}</span>
              <span style={{ color: primaryColor }}>{invoice.totalAmount.toLocaleString()} {invoice.currency}</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {invoice.notes && (
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200/80 mb-6 text-xs text-slate-600">
            <h5 className="font-bold text-slate-800 mb-1">{isRTL ? 'ملاحظات وشروط:' : 'Notes & Payment Terms:'}</h5>
            <p>{invoice.notes}</p>
            {invoice.terms && <p className="mt-1 text-slate-500">{invoice.terms}</p>}
          </div>
        )}

        {/* Signature & Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-end gap-4 text-xs text-slate-500">
          <div>
            <p className="font-medium text-slate-700">Zakariae Lahbabi — Automated AI Billing & Software Architecture System</p>
            <p>Direct Support & Inquiries: <a href="mailto:info@zakariaelahbabi.com" className="text-blue-600 font-bold">info@zakariaelahbabi.com</a></p>
          </div>
          <div className="text-center md:text-right">
            <div className="h-10 border-b border-slate-300 w-40 mb-1 flex items-center justify-center font-serif text-slate-800 italic text-sm">
              Zakariae Lahbabi
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{isRTL ? 'التوقيع الرقمي المعتمد' : 'Authorized Digital Signature'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
