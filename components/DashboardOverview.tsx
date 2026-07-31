import React from 'react';
import { Invoice, Client } from '../lib/types';
import { FileText, CheckCircle2, Clock, AlertTriangle, Sparkles, Plus, Download, ArrowUpRight, Code, Users, Bell, FileCode } from 'lucide-react';
import { exportInvoiceToHTML, exportInvoiceToPDF, exportInvoiceToDOCX, exportInvoicePDFDirect } from '../lib/export-utils';

interface DashboardOverviewProps {
  invoices: Invoice[];
  clients: Client[];
  onNavigate: (view: string) => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onOpenAIModal: () => void;
  onCreateNew: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  invoices,
  clients,
  onNavigate,
  onSelectInvoice,
  onOpenAIModal,
  onCreateNew,
}) => {
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((acc, i) => acc + i.totalAmount, 0);
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-400/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>مرحباً بك، Zakariae Lahbabi (بالدرهم المغربي MAD)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              نظام توليد الفواتير الآلي وتصدير ملفات PDF & HTML & DOCX
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              منصة ذكية متكاملة لإدارة المستحقات، التنبيهات بالدفعات المتأخرة، وتوليد الفواتير الاحترافية المعتمدة بالدرهم المغربي (MAD / DHs) وباللغتين العربية والإنجليزية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>إنشاء بالذكاء الاصطناعي</span>
            </button>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 text-xs font-bold transition active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <Plus className="h-4 w-4" />
              <span>فاتورة جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الفواتير الصادرة</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalBilled.toLocaleString()} <span className="text-xs font-sans text-slate-500">MAD</span></p>
          <span className="text-[11px] text-slate-500 font-medium block">{invoices.length} فواتير مسجلة</span>
        </div>

        {/* Total Paid */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">المبالغ المحصلة</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">{totalPaid.toLocaleString()} <span className="text-xs font-sans text-emerald-700">MAD</span></p>
          <span className="text-[11px] text-emerald-700 font-medium block">تم السداد بالكامل</span>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">دفعات متأخرة</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 font-mono">{totalOverdue.toLocaleString()} <span className="text-xs font-sans text-rose-700">MAD</span></p>
          <button
            onClick={() => onNavigate('reminders')}
            className="text-[11px] text-rose-600 hover:underline font-bold"
          >
            إرسال تذكير آلي ({overdueInvoices.length}) ←
          </button>
        </div>

        {/* Total Clients */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">العملاء والشركات</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{clients.length}</p>
          <button
            onClick={() => onNavigate('clients')}
            className="text-[11px] text-indigo-600 hover:underline font-bold"
          >
            إدارة الدليل ←
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Invoices & Export Formats Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">أحدث الفواتير والتصدير السريع</h3>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              عرض الكل ({invoices.length}) ←
            </button>
          </div>

          <div className="space-y-3">
            {recentInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-xl bg-slate-50/70 p-4 border border-slate-200/60 hover:border-slate-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 text-xs">{inv.number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      inv.status === 'overdue' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'overdue' ? 'متأخرة' : 'مرسلة'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs">{inv.client.companyName || inv.client.name}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {inv.totalAmount.toLocaleString()} {inv.currency}
                  </span>

                  {/* Quick Export Downloads */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => exportInvoicePDFDirect(inv)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-xs font-bold"
                      title="تنزيل PDF مباشر"
                    >
                      <FileCode className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => exportInvoiceToHTML(inv)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition cursor-pointer border border-emerald-100"
                      title="تنزيل HTML"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => exportInvoiceToDOCX(inv)}
                      className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition cursor-pointer border border-indigo-100"
                      title="تنزيل Word (.docx)"
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectInvoice(inv)}
                      className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer shadow-xs"
                      title="معاينة"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Export Formats Box */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            مكتبات وصيغ التصدير الاحترافية
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            يدعم النظام التصدير المباشر بترميز مكتمل يدعم اللغة العربية والعملات (MAD / DHs):
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-600" />
                <span className="font-extrabold text-slate-900">PDF (High-Resolution)</span>
              </div>
              <span className="text-rose-700 font-bold text-[10px]">Direct PDF Export</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-900">HTML Standalone</span>
              </div>
              <span className="text-slate-500 text-[10px] font-medium">Embedded Cairo Font</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-indigo-500" />
                <span className="font-bold text-slate-900">MS Word (.docx)</span>
              </div>
              <span className="text-slate-500 text-[10px] font-medium">docx Packer Engine</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="font-bold text-slate-900">Excel CSV / JSON</span>
              </div>
              <span className="text-slate-500 text-[10px] font-medium">Data Accounting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
