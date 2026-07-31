import React, { useState } from 'react';
import { Invoice } from '../lib/types';
import { TrendingUp, DollarSign, PieChart as PieIcon, Sparkles, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface FinancialReportsProps {
  invoices: Invoice[];
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({ invoices }) => {
  const [aiInsights, setAiInsights] = useState<any | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Compute metrics
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPending = invoices.filter((i) => i.status === 'sent' || i.status === 'draft').reduce((acc, inv) => acc + inv.totalAmount, 0);

  // Chart Data: Status Breakdown
  const statusData = [
    { name: 'مدفوعة (Paid)', value: totalPaid, color: '#10b981' },
    { name: 'في الانتظار (Pending)', value: totalPending, color: '#3b82f6' },
    { name: 'متأخرة (Overdue)', value: totalOverdue, color: '#f43f5e' },
  ];

  // Monthly Revenue breakdown mock/dynamic
  const monthlyData = [
    { month: 'يناير', revenue: 4200, paid: 4200 },
    { month: 'فبراير', revenue: 5800, paid: 5800 },
    { month: 'مارس', revenue: 6400, paid: 6400 },
    { month: 'أبريل', revenue: 7100, paid: 6100 },
    { month: 'مايو', revenue: 8900, paid: 8900 },
    { month: 'يونيو', revenue: 11200, paid: 11200 },
    { month: 'يوليو', revenue: totalBilled, paid: totalPaid },
  ];

  const fetchAIInsights = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoices, language: 'ar' }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAiInsights(json.data);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>التقارير المالية المتقدمة والتحليلات</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            تحليل الإيرادات، التدفقات النقدية، والتوقعات الذكية لـ Zakariae Lahbabi
          </p>
        </div>

        <button
          onClick={fetchAIInsights}
          disabled={loadingAI}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>{loadingAI ? 'جاري تحليل التقرير...' : 'توليد توصيات الذكاء الاصطناعي'}</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">إجمالي الفواتير الصادرة</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">${totalBilled.toLocaleString()}</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">+18% MoM</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">المبالغ المحصلة (Paid)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600 font-mono">${totalPaid.toLocaleString()}</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">فواتير بانتظار التحصيل</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-indigo-600 font-mono">${totalPending.toLocaleString()}</span>
            <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">قيد المعالجة</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">المبالغ المتأخرة (Overdue)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-rose-600 font-mono">${totalOverdue.toLocaleString()}</span>
            <AlertTriangle className="h-5 w-5 text-rose-600 animate-pulse" />
          </div>
        </div>
      </div>

      {/* AI Insights Card if generated */}
      {aiInsights && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-white p-6 border border-indigo-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900">توصيات الذكاء الاصطناعي المالية</h3>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">{aiInsights.cashflowForecast || 'توقع التدفقات النقدية ممتاز بناءً على عقود الاستشارات البرمجية.'}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {aiInsights.insights?.map((ins: any, idx: number) => (
              <div key={idx} className="rounded-xl bg-white p-4 border border-slate-200 text-xs space-y-1 shadow-2xs">
                <span className="font-bold text-slate-900 block">{ins.title}</span>
                <p className="text-slate-600 leading-relaxed font-medium">{ins.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Monthly Revenue */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            نمو الإيرادات الشهرية (Monthly Revenue Growth)
          </h3>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} name="إجمالي الفواتير" />
                <Bar dataKey="paid" fill="#10b981" radius={[6, 6, 0, 0]} name="المبالغ المحصلة" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Status Distribution */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            توزيع حالات الدفع
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {statusData.map((st, i) => (
              <div key={i} className="flex items-center justify-between text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: st.color }} />
                  <span>{st.name}</span>
                </div>
                <span className="font-bold font-mono text-slate-900">${st.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
