import React from 'react';
import { LayoutDashboard, FileText, PlusCircle, Users, Bell, TrendingUp, Code2, Settings, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAIModal: () => void;
  overdueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onOpenAIModal,
  overdueCount,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم الرئيسية', icon: LayoutDashboard },
    { id: 'invoices', label: 'سجل الفواتير والتصدير', icon: FileText },
    { id: 'editor', label: 'محرر الفواتير الحية', icon: PlusCircle },
    { id: 'clients', label: 'دليل العملاء والشركات', icon: Users },
    { id: 'reminders', label: 'تنبيهات الدفع المتأخرة', icon: Bell, badge: overdueCount > 0 ? overdueCount : undefined },
    { id: 'reports', label: 'التقارير المالية والتحليلات', icon: TrendingUp },
    { id: 'apihub', label: 'مركز API والبوابات البنكية', icon: Code2 },
    { id: 'settings', label: 'إعدادات الهوية والتخصيص', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-slate-100/70 border-b lg:border-b-0 lg:border-l border-slate-200/80 p-4 space-y-6">
      {/* AI Quick Banner */}
      <div
        onClick={onOpenAIModal}
        className="group relative overflow-hidden rounded-2xl bg-indigo-50/80 p-4 border border-indigo-100 shadow-xs cursor-pointer transition hover:bg-indigo-100/60"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">مساعد الذكاء الاصطناعي</span>
            <span className="text-[10px] text-indigo-700 font-medium">توليد الفواتير بنقرة واحدة</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-3 block mb-2">
          القائمة الرئيسية
        </span>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white animate-bounce">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="pt-6 border-t border-slate-200 text-center">
        <p className="text-[11px] font-bold text-slate-800">Zakariae Lahbabi</p>
        <p className="text-[10px] text-slate-500 font-medium">Billing Engine v2.5 Enterprise</p>
      </div>
    </aside>
  );
};
