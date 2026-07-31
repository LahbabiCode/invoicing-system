import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../lib/types';
import { exportInvoiceToHTML, exportInvoiceToPDF, exportInvoiceToDOCX, exportInvoicePDFDirect } from '../lib/export-utils';
import { Search, Filter, Plus, FileText, Download, Eye, Edit, Trash2, Copy, CheckCircle2, Clock, AlertTriangle, Sparkles, Code, FileCode } from 'lucide-react';

interface InvoicesListProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onCloneInvoice: (invoice: Invoice) => void;
  onCreateNew: () => void;
  onOpenAIModal: () => void;
}

export const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  onSelectInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onCloneInvoice,
  onCreateNew,
  onOpenAIModal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.companyName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            مدفوعة
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="h-3 w-3" />
            متأخرة عن الدفع
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3" />
            تم الإرسال
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            مسودة
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>سجل الفواتير والمستندات المالية</span>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 font-mono font-bold">
              {filteredInvoices.length} فاتورة
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            إدارة وتصدير كافة الفواتير الرسمية الخاصة بـ Zakariae Lahbabi (درهم مغربي MAD)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>توليد بالذكاء الاصطناعي</span>
          </button>

          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>إنشاء فاتورة يدويًا</span>
          </button>
        </div>
      </div>

      {/* Quick PDF Export Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-50 via-indigo-50 to-white p-4 border border-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-xs shrink-0">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">📄 تصدير الفواتير بصيغة PDF عالية الدقة جاهزة للطباعة</h4>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              يمكنك تصدير أي فاتورة كملف PDF مباشر بكبسة زر واحدة من عمود الإجراءات أدناه (الزر الأحمر 📄 PDF)، أو فتح الفاتورة وتنزيلها مع المعاينة الحية.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 pr-9 pl-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'paid', 'sent', 'overdue', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition capitalize cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {st === 'all' ? 'الكل' : st === 'paid' ? 'مدفوعة' : st === 'sent' ? 'مرسلة' : st === 'overdue' ? 'متأخرة' : 'مسودة'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">رقم الفاتورة</th>
              <th className="py-3.5 px-4">العميل / الشركة</th>
              <th className="py-3.5 px-4">تاريخ التحرير</th>
              <th className="py-3.5 px-4">تاريخ الاستحقاق</th>
              <th className="py-3.5 px-4">الحالة</th>
              <th className="py-3.5 px-4 text-left">المبلغ الإجمالي</th>
              <th className="py-3.5 px-4 text-center">التصدير والإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 text-sm font-medium">
                  لا توجد فواتير مطابقة للبحث
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-indigo-600">
                    {inv.number}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{inv.client.companyName || inv.client.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{inv.client.name}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{inv.createdAt}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{inv.dueDate}</td>
                  <td className="py-4 px-4">{getStatusBadge(inv.status)}</td>
                  <td className="py-4 px-4 text-left font-bold text-slate-900 font-mono text-sm">
                    {inv.totalAmount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Direct PDF Export */}
                      <button
                        onClick={() => exportInvoicePDFDirect(inv)}
                        className="rounded-lg bg-rose-600 p-1.5 text-white hover:bg-rose-700 transition cursor-pointer shadow-xs font-bold flex items-center gap-1"
                        title="تنزيل مباشر بصيغة PDF"
                      >
                        <FileCode className="h-4 w-4" />
                        <span className="text-[10px] hidden xl:inline">PDF</span>
                      </button>

                      {/* View & Export Preview */}
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="rounded-lg bg-indigo-50 p-1.5 text-indigo-700 hover:bg-indigo-600 hover:text-white transition cursor-pointer border border-indigo-100"
                        title="معاينة وتصدير"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Quick Export HTML */}
                      <button
                        onClick={() => exportInvoiceToHTML(inv)}
                        className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-600 hover:text-white transition cursor-pointer border border-emerald-100"
                        title="تنزيل ملف HTML"
                      >
                        <Code className="h-4 w-4" />
                      </button>

                      {/* Quick Export DOCX */}
                      <button
                        onClick={() => exportInvoiceToDOCX(inv)}
                        className="rounded-lg bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-600 hover:text-white transition cursor-pointer border border-blue-100"
                        title="تنزيل مستند Word (.docx)"
                      >
                        <FileText className="h-4 w-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEditInvoice(inv)}
                        className="rounded-lg bg-slate-100 p-1.5 text-slate-700 hover:bg-slate-200 transition cursor-pointer border border-slate-200"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* Clone */}
                      <button
                        onClick={() => onCloneInvoice(inv)}
                        className="rounded-lg bg-slate-100 p-1.5 text-slate-700 hover:bg-slate-200 transition cursor-pointer border border-slate-200"
                        title="نسخ الفاتورة"
                      >
                        <Copy className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="rounded-lg bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer border border-rose-100"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
