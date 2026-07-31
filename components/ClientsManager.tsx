import React, { useState } from 'react';
import { Client } from '../lib/types';
import { Users, Plus, Mail, Phone, MapPin, Building, Globe, Edit, Trash2, X, Save } from 'lucide-react';

interface ClientsManagerProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    country: 'المغرب',
    taxNumber: '',
    currency: 'MAD',
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        address: '',
        country: 'المغرب',
        taxNumber: '',
        currency: 'MAD',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingClient) {
      onUpdateClient({
        ...editingClient,
        ...formData,
      } as Client);
    } else {
      onAddClient({
        id: `cli-${Date.now()}`,
        name: formData.name || '',
        companyName: formData.companyName || formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        country: formData.country || '',
        taxNumber: formData.taxNumber,
        currency: formData.currency || 'USD',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>دليل العملاء والشركات</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            إدارة بيانات العملاء والجهات المستفيدة من خدمات Zakariae Lahbabi
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة عميل جديد</span>
        </button>
      </div>

      {/* Grid of Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((cli) => (
          <div
            key={cli.id}
            className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs relative group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black text-base shadow-xs">
                    {(cli.companyName || cli.name).charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {cli.companyName || cli.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{cli.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleOpenModal(cli)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer border border-slate-200"
                    title="تعديل العميل"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteClient(cli.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer border border-rose-100"
                    title="حذف العميل"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="truncate">{cli.email}</span>
                </div>
                {cli.phone && (
                  <div className="flex items-center gap-2 font-medium">
                    <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{cli.phone}</span>
                  </div>
                )}
                {cli.address && (
                  <div className="flex items-start gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{cli.address}</span>
                  </div>
                )}
                {cli.taxNumber && (
                  <div className="flex items-center gap-2 text-slate-500 pt-1 font-medium">
                    <Building className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>الرقم الضريبي: <strong className="text-slate-800">{cli.taxNumber}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">العملة المفضلة:</span>
              <span className="font-bold text-indigo-700 font-mono bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                {cli.currency || 'USD'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingClient ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">اسم العميل / مسؤول الاتصال *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">اسم الشركة / المؤسسة</label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">العنوان الكامل</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">الرقم الضريبي</label>
                  <input
                    type="text"
                    value={formData.taxNumber || ''}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">العملة الافتراضية</label>
                  <select
                    value={formData.currency || 'MAD'}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                  >
                    <option value="MAD">MAD (درهم مغربي / DHs)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="SAR">SAR (ر.س)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 font-bold text-white shadow-sm transition cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>حفظ البيانات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
