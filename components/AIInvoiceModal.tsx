import React, { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { InvoiceItem } from '../lib/types';

interface AIInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (data: {
    clientName?: string;
    clientCompany?: string;
    currency?: string;
    taxPercentage?: number;
    items: InvoiceItem[];
    notes?: string;
    terms?: string;
  }) => void;
}

export const AIInvoiceModal: React.FC<AIInvoiceModalProps> = ({ isOpen, onClose, onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/invoice-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language: 'ar' }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'فشل التوليد بواسطة الذكاء الاصطناعي');
      }

      const generated = json.data;
      
      onGenerated({
        clientName: generated.clientName,
        clientCompany: generated.clientCompany,
        currency: generated.currency || 'MAD',
        taxPercentage: generated.taxPercentage || 20,
        items: generated.items.map((it: any, idx: number) => ({
          id: `item-ai-${idx}`,
          description: it.description || 'خدمة برمجية ومشاركة تطوير',
          quantity: it.quantity || 1,
          unitPrice: it.unitPrice || 0,
          total: (it.quantity || 1) * (it.unitPrice || 0),
        })),
        notes: generated.notes,
        terms: generated.terms,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'فاتورة لتطوير تطبيق ويب كامل وواجهات برمجية للعميل شركة الأفق الرقمية بقيمة 45,000 درهم مغربي MAD',
    'Create a full-stack website architecture invoice for Apex Cloud LLC for 84,000 MAD',
    'فاتورة استشارات تقنية ودعم فني لمجلس الإدارة بقيمة 15,000 درهم مغربي MAD',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 via-blue-50 to-white p-5 border-b border-indigo-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">توليد الفاتورة بالذكاء الاصطناعي</h3>
              <p className="text-xs text-indigo-700 font-medium">مساعد Zakariae Lahbabi الذكي لتحويل النصوص إلى فواتير</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              صف تفاصيل الخدمات أو المخرجات والأسعار والعميل بلغة طبيعية:
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: قم بإعداد فاتورة برمجية لتطوير منصة التجارة الإلكترونية وتكامل بوابة الدفع للعميل شركة الخليج بقيمة 4500 دولار شاملة الصيانة لمدة سنة..."
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 font-medium"
              disabled={loading}
            />
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500">أمثلة سريعة للتجربة:</span>
            <div className="flex flex-col gap-1.5">
              {samplePrompts.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(s)}
                  className="text-right text-xs text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 px-3 py-2 rounded-xl border border-slate-200/80 transition truncate cursor-pointer font-medium"
                >
                  ⚡ {`"${s}"`}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري التحليل والتوليد...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>إنشاء الفاتورة</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
