import React, { useState } from 'react';
import { CompanyProfile } from '../lib/types';
import { Settings, Save, Building2, Mail, Phone, Globe, CreditCard, Palette, ShieldCheck, Check } from 'lucide-react';

interface SettingsManagerProps {
  profile: CompanyProfile;
  onSaveProfile: (updated: CompanyProfile) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<CompanyProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-600" />
          <span>إعدادات الهوية التجارية والحساب البنكي</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          تخصيص البيانات الرسمية وشعار Zakariae Lahbabi والحسابات البنكية الظاهرة في الفواتير والتصديرات
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700 border border-emerald-200">
            <Check className="h-4 w-4 shrink-0" />
            <span>تم حفظ التغييرات وتحديث بيانات الفواتير الرسمية بنجاح!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Identity & Contact Card */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <span>معلومات الهوية الرسمية والاتصال</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">الاسم الكامل / اسم العلامة التجارية</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">المسمى المهني / الوظيفي</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">البريد الإلكتروني الرسمي</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-mono font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">العنوان / المقر الرئيسي</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">الموقع الإلكتروني</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">الرقم الضريبي (Tax ID / ICE)</label>
                  <input
                    type="text"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-mono font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banking Details & Theme Customization */}
          <div className="space-y-6">
            {/* Bank Card */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                <span>تفاصيل الحساب البنكي والتحويلات</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">اسم البنك</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">رقم الحساب الدولي IBAN</label>
                  <input
                    type="text"
                    value={formData.bankIBAN}
                    onChange={(e) => setFormData({ ...formData, bankIBAN: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-mono font-bold focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">رمز السويفت SWIFT / BIC</label>
                  <input
                    type="text"
                    value={formData.bankSwift}
                    onChange={(e) => setFormData({ ...formData, bankSwift: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-mono font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Styling Accent */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-600" />
                <span>اللون الأساسي وقالب الفاتورة</span>
              </h3>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">لون التمييز الأساسي</label>
                  <input
                    type="color"
                    value={formData.primaryColor || '#4f46e5'}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="h-10 w-20 rounded-xl bg-slate-50 border border-slate-200 p-1 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-slate-700 font-semibold block mb-1">نمط القالب الأساسي</span>
                  <select
                    value={formData.templateTheme}
                    onChange={(e) => setFormData({ ...formData, templateTheme: e.target.value as any })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-indigo-500"
                  >
                    <option value="executive">Executive Modern (تنسيق احترافي رصين)</option>
                    <option value="minimal">Minimal Tech (تنسيق تقني مبسط)</option>
                    <option value="corporate">Classic Corporate (تنسيق المؤسسات التقليدي)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Storage & Database Reset */}
            <div className="rounded-2xl bg-slate-900 text-white p-6 border border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldCheck className="h-4 w-4 text-rose-400" />
                <span>إدارة وحفظ البيانات المحفوظة دائمياً</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                تُحفظ كافة الفواتير والعملاء بشكل دائم ومستقر عبر التخزين الإلكتروني المستمر. يمكنك تفريغ كافة البيانات المؤقتة والبدء بنسخة فارغة ونظيفة تماماً بكبسة زر.
              </p>
              <button
                type="button"
                onClick={async () => {
                  if (confirm('هل أنت متأكد من مسح كافة السجلات والفواتير والبدء بقاعدة بيانات فارغة؟')) {
                    try {
                      const res = await fetch('/api/reset', { method: 'POST' });
                      const data = await res.json();
                      if (data.success) {
                        localStorage.removeItem('zl_invoices');
                        localStorage.removeItem('zl_clients');
                        localStorage.removeItem('zl_reminders');
                        window.location.reload();
                      } else {
                        alert('حدث خطأ أثناء مسح قاعدة البيانات.');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('حدث خطأ في الاتصال بالخادم.');
                    }
                  }
                }}
                className="rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-4 py-2 text-xs font-bold transition cursor-pointer"
              >
                🗑️ مسح وإعادة تهيئة قاعدة البيانات بالكامل
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-xs font-bold text-white shadow-sm transition cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>حفظ الإعدادات كاملة</span>
          </button>
        </div>
      </form>
    </div>
  );
};
