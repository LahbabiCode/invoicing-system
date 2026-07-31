import React, { useState } from 'react';
import { Invoice, PaymentReminder } from '../lib/types';
import { Bell, Sparkles, Send, Copy, Check, AlertTriangle, ShieldAlert, Mail, Clock, RefreshCw } from 'lucide-react';

interface PaymentRemindersProps {
  invoices: Invoice[];
  reminders: PaymentReminder[];
  onAddReminder: (reminder: PaymentReminder) => void;
}

export const PaymentReminders: React.FC<PaymentRemindersProps> = ({
  invoices,
  reminders,
  onAddReminder,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
    invoices.find((inv) => inv.status === 'overdue') || invoices[0] || null
  );
  const [tone, setTone] = useState<'gentle' | 'standard' | 'firm' | 'legal'>('standard');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue' || inv.status === 'sent');

  const handleGenerateAI = async () => {
    if (!selectedInvoice) return;
    setLoading(true);
    setSentSuccess(false);

    try {
      const res = await fetch('/api/ai/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice: selectedInvoice,
          tone: tone,
          language: selectedInvoice.language || 'ar',
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setGeneratedText(json.text);
      } else {
        throw new Error(json.error || 'Failed to generate reminder');
      }
    } catch (err) {
      console.error(err);
      // Fallback draft template
      setGeneratedText(`الموضوع: تذكير بموعد سداد الفاتورة رقم ${selectedInvoice.number}

عزيزنا العميل ${selectedInvoice.client.name} / ${selectedInvoice.client.companyName}،

نحيطكم علماً بأن الفاتورة رقم ${selectedInvoice.number} البالغة ${selectedInvoice.totalAmount} ${selectedInvoice.currency} قد تجاوزت تاريخ الاستحقاق المحدد بتاريخ ${selectedInvoice.dueDate}.

يرجى إتمام التحويل البنكي إلى الحساب التالي:
- البنك: ${selectedInvoice.profile.bankName}
- IBAN: ${selectedInvoice.profile.bankIBAN}

مع خالص التقدير والتحية،
Zakariae Lahbabi
info@zakariaelahbabi.com`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSend = () => {
    if (!selectedInvoice) return;
    setSentSuccess(true);

    const newRem: PaymentReminder = {
      id: `rem-${Date.now()}`,
      invoiceId: selectedInvoice.id,
      invoiceNumber: selectedInvoice.number,
      clientName: selectedInvoice.client.name,
      clientEmail: selectedInvoice.client.email,
      amount: selectedInvoice.totalAmount,
      currency: selectedInvoice.currency,
      dueDate: selectedInvoice.dueDate,
      daysOverdue: 7,
      status: 'sent',
      tone: tone,
      generatedText: generatedText,
      lastSentAt: new Date().toISOString(),
    };

    onAddReminder(newRem);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-600 animate-bounce" />
          <span>نظام التنبيهات والتذكير الآلي بالدفعات المتأخرة</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          متابعة مستحقات العمل والتوليد الذكي لخطابات التذكير بحسب درجة التأخير والعميل
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overdue Invoices List */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>الفواتير المستحقة والمحتمل تأخيرها</span>
            <span className="text-xs text-rose-700 font-mono font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              {overdueInvoices.length} فواتير
            </span>
          </h3>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {overdueInvoices.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500 font-medium">لا توجد فواتير متأخرة حالياً 🎉</p>
            ) : (
              overdueInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => {
                    setSelectedInvoice(inv);
                    setGeneratedText('');
                    setSentSuccess(false);
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col gap-2 ${
                    selectedInvoice?.id === inv.id
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-600">{inv.number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      inv.status === 'overdue' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {inv.status === 'overdue' ? 'متأخرة' : 'في الانتظار'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{inv.client.companyName || inv.client.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{inv.client.email}</p>
                    </div>
                    <p className="font-mono font-bold text-slate-900 text-sm">
                      {inv.totalAmount.toLocaleString()} {inv.currency}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-medium">
                    <Clock className="h-3 w-3 text-rose-500" />
                    <span>تاريخ الاستحقاق: {inv.dueDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Reminder Composer */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>توليد نص التذكير المخصص (AI Reminder Writer)</span>
              </h3>
              {selectedInvoice && (
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  موجه إلى: <strong className="text-slate-900">{selectedInvoice.client.name}</strong> ({selectedInvoice.number})
                </p>
              )}
            </div>

            {/* Tone Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setTone('gentle')}
                className={`px-2.5 py-1 rounded-lg transition ${tone === 'gentle' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ودّي لطيف
              </button>
              <button
                onClick={() => setTone('standard')}
                className={`px-2.5 py-1 rounded-lg transition ${tone === 'standard' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                قياسي رسمي
              </button>
              <button
                onClick={() => setTone('firm')}
                className={`px-2.5 py-1 rounded-lg transition ${tone === 'firm' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                حازم
              </button>
              <button
                onClick={() => setTone('legal')}
                className={`px-2.5 py-1 rounded-lg transition ${tone === 'legal' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                إشعار قانوني
              </button>
            </div>
          </div>

          {!selectedInvoice ? (
            <div className="py-16 text-center text-slate-500 text-sm font-medium">
              الرجاء تحديد فاتورة من القائمة للبدء بتوليد التذكير
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleGenerateAI}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{loading ? 'جاري صياغة الخطاب...' : 'توليد الرسالة بالذكاء الاصطناعي'}</span>
                </button>

                {generatedText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyText}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-700 font-bold hover:bg-slate-200 transition cursor-pointer border border-slate-200"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'تم النسخ!' : 'نسخ الرسالة'}</span>
                    </button>

                    <button
                      onClick={handleSimulateSend}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>إرسال إشعار آلي</span>
                    </button>
                  </div>
                )}
              </div>

              {sentSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200 font-medium">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>تم إرسال التنبيه التلقائي بنجاح إلى البريد الإلكتروني وسجل الـ Webhooks!</span>
                </div>
              )}

              {/* Text Area Output */}
              <div>
                <textarea
                  rows={10}
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  placeholder="انقر على زر 'توليد الرسالة بالذكاء الاصطناعي' لصياغة الخطاب الاحترافي تلقائياً..."
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs leading-relaxed text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none font-sans font-medium"
                />
              </div>

              {/* Reminders History Log */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  سجل التنبيهات المرسلة سابقاً
                </h4>
                <div className="space-y-2">
                  {reminders.length === 0 ? (
                    <p className="text-[11px] text-slate-400 font-medium">لا يوجد سجل إشعارات سابق</p>
                  ) : (
                    reminders.map((rem) => (
                      <div key={rem.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs border border-slate-200/60 font-medium">
                        <div>
                          <span className="font-bold text-slate-900">{rem.clientName}</span>
                          <span className="text-slate-500 mr-2">({rem.invoiceNumber})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-600 font-mono font-bold text-[11px]">{rem.amount} {rem.currency}</span>
                          <span className="text-slate-500 text-[10px]">{rem.lastSentAt ? new Date(rem.lastSentAt).toLocaleTimeString() : 'الآن'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
