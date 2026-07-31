import React, { useState } from 'react';
import { Invoice, InvoiceItem, Client, CompanyProfile, Language } from '../lib/types';
import { Plus, Trash2, Eye, Edit3, Sparkles, Save, ArrowLeft, RefreshCw } from 'lucide-react';
import { InvoicePreview } from './InvoicePreview';

interface InvoiceEditorProps {
  initialInvoice?: Invoice;
  clients: Client[];
  profile: CompanyProfile;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  onOpenAIModal?: () => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  initialInvoice,
  clients,
  profile,
  onSave,
  onCancel,
  onOpenAIModal,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const [invoice, setInvoice] = useState<Invoice>(() => {
    if (initialInvoice) return initialInvoice;
    const now = Date.now();
    const randomNum = Math.floor(100 + Math.random() * 900);
    return {
      id: `inv-${now}`,
      number: `INV-2026-${randomNum}`,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(now + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      client: clients[0] || {
        id: 'new',
        name: 'عميل جديد',
        companyName: 'شركة العميل',
        email: 'client@example.com',
        phone: '',
        address: '',
        country: 'المغرب',
        taxNumber: '',
        currency: 'MAD',
      },
      profile: profile,
      items: [
        {
          id: 'item-1',
          description: 'تطوير وتصميم التطبيق الإلكتروني والواجهات البرمجية',
          quantity: 1,
          unitPrice: 25000,
          total: 25000,
        },
      ],
      subtotal: 25000,
      taxPercentage: 20,
      taxAmount: 5000,
      discountPercentage: 0,
      discountAmount: 0,
      totalAmount: 30000,
      paidAmount: 0,
      currency: 'MAD',
      notes: 'شكراً لتعاملكم معنا. الرجاء سداد المستحقات بالدرهم المغربي (MAD) حسب الموعد المضي بالاتفاق.',
      terms: 'الدفع خلال 15 يوماً من تاريخ الفاتورة.',
      language: 'ar',
      paymentMethod: 'Bank Wire Transfer (MAD)',
    };
  });

  // Recalculate Totals
  const recalculate = (updatedItems: InvoiceItem[], taxPct: number, discPct: number) => {
    const sub = updatedItems.reduce((acc, item) => acc + item.total, 0);
    const discAmt = (sub * discPct) / 100;
    const afterDisc = sub - discAmt;
    const taxAmt = (afterDisc * taxPct) / 100;
    const grandTotal = afterDisc + taxAmt;

    setInvoice((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal: sub,
      discountPercentage: discPct,
      discountAmount: discAmt,
      taxPercentage: taxPct,
      taxAmount: taxAmt,
      totalAmount: grandTotal,
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoice.items];
    const current = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : current.quantity;
      const p = field === 'unitPrice' ? Number(value) : current.unitPrice;
      current.total = q * p;
    }
    
    newItems[index] = current;
    recalculate(newItems, invoice.taxPercentage, invoice.discountPercentage);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    const updated = [...invoice.items, newItem];
    recalculate(updated, invoice.taxPercentage, invoice.discountPercentage);
  };

  const removeItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    const updated = invoice.items.filter((_, i) => i !== index);
    recalculate(updated, invoice.taxPercentage, invoice.discountPercentage);
  };

  const handleClientSelect = (clientId: string) => {
    const selected = clients.find((c) => c.id === clientId);
    if (selected) {
      setInvoice((prev) => ({
        ...prev,
        client: selected,
        currency: selected.currency || prev.currency,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900 p-4 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{initialInvoice ? 'محرر الفاتورة' : 'إنشاء فاتورة احترافية جديدة'}</span>
              <span className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-mono">
                {invoice.number}
              </span>
            </h2>
            <p className="text-xs text-slate-400">تعديل العناصر والتفاصيل مع معاينة التصدير الحية</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* AI Invoice Generator Trigger Button */}
          {onOpenAIModal && (
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:opacity-90 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>توليد ذكي بالذكاء الاصطناعي</span>
            </button>
          )}

          {/* Tab Switcher */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>محرر التفاصيل</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>معاينة وتصدير الفاتورة</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={() => onSave(invoice)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition active:scale-95 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>حفظ الفاتورة</span>
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <InvoicePreview invoice={invoice} />
      ) : (
        /* Form Editor View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Meta Info Card */}
            <div className="rounded-xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>معلومات الفاتورة والعميل</span>
                <span className="text-xs text-slate-400 font-normal">Zakariae Lahbabi Profile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">رقم الفاتورة</label>
                  <input
                    type="text"
                    value={invoice.number}
                    onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">تاريخ الإصدار</label>
                  <input
                    type="date"
                    value={invoice.createdAt}
                    onChange={(e) => setInvoice({ ...invoice, createdAt: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Client Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">اختر العميل</label>
                  <select
                    value={invoice.client.id}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    {clients.map((cli) => (
                      <option key={cli.id} value={cli.id}>
                        {cli.companyName || cli.name} ({cli.currency})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">حالة الفاتورة</label>
                  <select
                    value={invoice.status}
                    onChange={(e) => setInvoice({ ...invoice, status: e.target.value as any })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none capitalize"
                  >
                    <option value="draft">مسودة (Draft)</option>
                    <option value="sent">تم الإرسال (Sent)</option>
                    <option value="paid">مدفوعة (Paid)</option>
                    <option value="overdue">متأخرة عن الدفع (Overdue)</option>
                    <option value="cancelled">ملغاة (Cancelled)</option>
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">العملة</label>
                  <select
                    value={invoice.currency}
                    onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none font-bold"
                  >
                    <option value="MAD">MAD (درهم مغربي / DHs)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="SAR">SAR (ر.س)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Line Items Builder Card */}
            <div className="rounded-xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  عناصر الخدمات والمنتجات
                </h3>
                <button
                  onClick={addItem}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة بند جديد</span>
                </button>
              </div>

              <div className="space-y-3">
                {invoice.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="grid grid-cols-12 gap-3 items-center rounded-lg bg-slate-950 p-3 border border-slate-800/80"
                  >
                    <div className="col-span-12 md:col-span-6">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">الوصف</label>
                      <input
                        type="text"
                        placeholder="وصف الخدمة أو المشروع..."
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">الكمية</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-2 py-1.5 text-sm text-white text-center focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="col-span-5 md:col-span-3">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">سعر الوحدة ({invoice.currency})</label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="col-span-3 md:col-span-1 flex justify-end">
                      <button
                        onClick={() => removeItem(index)}
                        disabled={invoice.items.length <= 1}
                        className="p-2 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 disabled:opacity-30 transition cursor-pointer"
                        title="حذف البند"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="rounded-xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
                ملاحظات وشروط الفاتورة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">ملاحظات موجهة للعميل</label>
                  <textarea
                    rows={3}
                    value={invoice.notes}
                    onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">الشروط والأحكام</label>
                  <textarea
                    rows={3}
                    value={invoice.terms}
                    onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary & Branding Options */}
          <div className="space-y-6">
            {/* Totals Summary Card */}
            <div className="rounded-xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
                ملخص الحسابات
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold text-white">{invoice.subtotal.toLocaleString()} {invoice.currency}</span>
                </div>

                {/* Discount input */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>نسبة الخصم (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={invoice.discountPercentage}
                      onChange={(e) => recalculate(invoice.items, invoice.taxPercentage, Number(e.target.value))}
                      className="w-20 rounded bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-white text-right font-bold"
                    />
                  </div>
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 text-xs">
                      <span>قيمة الخصم:</span>
                      <span>-{invoice.discountAmount.toLocaleString()} {invoice.currency}</span>
                    </div>
                  )}
                </div>

                {/* Tax input */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>ضريبة القيمة المضافة VAT (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={invoice.taxPercentage}
                      onChange={(e) => recalculate(invoice.items, Number(e.target.value), invoice.discountPercentage)}
                      className="w-20 rounded bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-white text-right font-bold"
                    />
                  </div>
                  {invoice.taxAmount > 0 && (
                    <div className="flex justify-between text-blue-400 text-xs">
                      <span>قيمة الضريبة:</span>
                      <span>+{invoice.taxAmount.toLocaleString()} {invoice.currency}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-extrabold text-white">
                  <span>الإجمالي المستحق:</span>
                  <span className="text-blue-400 font-mono text-lg">
                    {invoice.totalAmount.toLocaleString()} {invoice.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Language & Export Customization */}
            <div className="rounded-xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
                تنسيق الفاتورة والتصدير
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">لغة الفاتورة والتوجيه</label>
                  <select
                    value={invoice.language}
                    onChange={(e) => setInvoice({ ...invoice, language: e.target.value as Language })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="ar">العربية (RTL - خط القاهرة)</option>
                    <option value="en">English (LTR - Plus Jakarta Sans)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">طريقة الدفع المحددة</label>
                  <input
                    type="text"
                    value={invoice.paymentMethod}
                    onChange={(e) => setInvoice({ ...invoice, paymentMethod: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    <span>الانتقال لشاشة التصدير والتنزيل</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
