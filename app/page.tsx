'use client';

import React, { useState, useEffect } from 'react';
import { Invoice, Client, CompanyProfile, PaymentReminder } from '../lib/types';
import { defaultCompanyProfile } from '../lib/initial-data';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DashboardOverview } from '../components/DashboardOverview';
import { InvoicesList } from '../components/InvoicesList';
import { InvoiceEditor } from '../components/InvoiceEditor';
import { ClientsManager } from '../components/ClientsManager';
import { PaymentReminders } from '../components/PaymentReminders';
import { FinancialReports } from '../components/FinancialReports';
import { ApiHub } from '../components/ApiHub';
import { SettingsManager } from '../components/SettingsManager';
import { AIInvoiceModal } from '../components/AIInvoiceModal';
import { InvoicePreview } from '../components/InvoicePreview';

export default function Home() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);

  // App Data State initialized with empty defaults, populated from DB APIs on mount
  const [profile, setProfile] = useState<CompanyProfile>(defaultCompanyProfile);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);

  // Selected Invoice for editing or viewing preview
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // AI Modal
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Load all data from API/DB on mount
  useEffect(() => {
    async function loadAllData() {
      try {
        const [profileRes, clientsRes, invoicesRes, remindersRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/clients'),
          fetch('/api/invoices'),
          fetch('/api/reminders')
        ]);

        const profileData = await profileRes.json();
        const clientsData = await clientsRes.json();
        const invoicesData = await invoicesRes.json();
        const remindersData = await remindersRes.json();

        if (!profileData.error) setProfile(profileData);
        if (!clientsData.error) setClients(clientsData);
        if (!invoicesData.error) setInvoices(invoicesData);
        if (!remindersData.error) setReminders(remindersData);
      } catch (err) {
        console.error('Failed to load database data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  // Save/Update Profile to database
  const updateProfile = async (newProfile: CompanyProfile) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });
      const savedProfile = await res.json();
      if (!savedProfile.error) {
        setProfile(savedProfile);
      }
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  // Client CRUD
  const handleAddClient = async (c: Client) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
      const newClient = await res.json();
      if (!newClient.error) {
        setClients((prev) => [...prev, newClient]);
      }
    } catch (e) {
      console.error('Error adding client:', e);
    }
  };

  const handleUpdateClient = async (c: Client) => {
    try {
      const res = await fetch(`/api/clients/${c.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
      const updatedClient = await res.json();
      if (!updatedClient.error) {
        setClients((prev) => prev.map((cli) => (cli.id === updatedClient.id ? updatedClient : cli)));
      }
    } catch (e) {
      console.error('Error updating client:', e);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setClients((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error('Error deleting client:', e);
    }
  };

  // Invoice CRUD
  const handleSaveInvoice = async (savedInv: Invoice) => {
    try {
      const exists = invoices.some((i) => i.id === savedInv.id);
      let resultInv: Invoice & { error?: string };

      if (exists) {
        const res = await fetch(`/api/invoices/${savedInv.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedInv),
        });
        resultInv = await res.json();
      } else {
        const res = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedInv),
        });
        resultInv = await res.json();
      }

      if (resultInv && !resultInv.error) {
        if (exists) {
          setInvoices((prev) => prev.map((i) => (i.id === resultInv.id ? resultInv : i)));
        } else {
          setInvoices((prev) => [resultInv, ...prev]);
        }
        setSelectedInvoice(resultInv);
        setActiveView('preview');
      }
    } catch (e) {
      console.error('Error saving invoice:', e);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setInvoices((prev) => prev.filter((i) => i.id !== id));
        if (selectedInvoice?.id === id) {
          setSelectedInvoice(null);
        }
      }
    } catch (e) {
      console.error('Error deleting invoice:', e);
    }
  };

  const handleCloneInvoice = async (inv: Invoice) => {
    try {
      const cloned: Invoice = {
        ...inv,
        id: `inv-${Date.now()}`,
        number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'draft',
      };

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cloned),
      });
      const saved = await res.json();
      if (saved && !saved.error) {
        setInvoices((prev) => [saved, ...prev]);
        setSelectedInvoice(saved);
        setActiveView('editor');
      }
    } catch (e) {
      console.error('Error cloning invoice:', e);
    }
  };

  // Reminders CRUD
  const handleAddReminder = async (r: PaymentReminder) => {
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(r),
      });
      const newReminder = await res.json();
      if (newReminder && !newReminder.error) {
        setReminders((prev) => [newReminder, ...prev]);
      }
    } catch (e) {
      console.error('Error adding payment reminder:', e);
    }
  };

  const handleAIGenerated = (aiData: any) => {
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      client: clients[0] || {
        id: 'c1',
        name: aiData.clientName || 'العميل',
        companyName: aiData.clientCompany || aiData.clientName || 'المؤسسة',
        email: 'client@example.com',
        phone: '',
        address: '',
        country: '',
        currency: aiData.currency || 'MAD',
      },
      profile: profile,
      items: aiData.items,
      subtotal: aiData.items.reduce((acc: number, it: any) => acc + it.total, 0),
      taxPercentage: aiData.taxPercentage || 20,
      taxAmount: (aiData.items.reduce((acc: number, it: any) => acc + it.total, 0) * (aiData.taxPercentage || 20)) / 100,
      discountPercentage: 0,
      discountAmount: 0,
      totalAmount:
        aiData.items.reduce((acc: number, it: any) => acc + it.total, 0) +
        (aiData.items.reduce((acc: number, it: any) => acc + it.total, 0) * (aiData.taxPercentage || 20)) / 100,
      paidAmount: 0,
      currency: aiData.currency || 'MAD',
      notes: aiData.notes || 'فاتورة معتمدة إلكترونياً ومولدة بمساعدة الذكاء الاصطناعي.',
      terms: aiData.terms || 'سداد المستحقات خلال 15 يوماً من تاريخ الفاتورة.',
      language: 'ar',
      paymentMethod: 'Bank Transfer',
    };

    setSelectedInvoice(newInv);
    setActiveView('editor');
  };

  const overdueCount = invoices.filter((i) => i.status === 'overdue').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-slate-800 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">جاري تحميل قواعد البيانات الفورية والربط المستقر...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans dir-rtl">
      {/* Navbar */}
      <Navbar
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onCreateNew={() => {
          setSelectedInvoice(null);
          setActiveView('editor');
        }}
        activeView={activeView}
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => {
            if (view === 'editor') setSelectedInvoice(null);
            setActiveView(view);
          }}
          onOpenAIModal={() => setIsAIModalOpen(true)}
          overdueCount={overdueCount}
        />

        {/* Main View Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeView === 'dashboard' && (
            <DashboardOverview
              invoices={invoices}
              clients={clients}
              onNavigate={(v) => setActiveView(v)}
              onSelectInvoice={(inv) => {
                setSelectedInvoice(inv);
                setActiveView('preview');
              }}
              onOpenAIModal={() => setIsAIModalOpen(true)}
              onCreateNew={() => {
                setSelectedInvoice(null);
                setActiveView('editor');
              }}
            />
          )}

          {activeView === 'invoices' && (
            <InvoicesList
              invoices={invoices}
              onSelectInvoice={(inv) => {
                setSelectedInvoice(inv);
                setActiveView('preview');
              }}
              onEditInvoice={(inv) => {
                setSelectedInvoice(inv);
                setActiveView('editor');
              }}
              onDeleteInvoice={handleDeleteInvoice}
              onCloneInvoice={handleCloneInvoice}
              onCreateNew={() => {
                setSelectedInvoice(null);
                setActiveView('editor');
              }}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          )}

          {activeView === 'editor' && (
            <InvoiceEditor
              initialInvoice={selectedInvoice || undefined}
              clients={clients}
              profile={profile}
              onSave={handleSaveInvoice}
              onCancel={() => setActiveView('invoices')}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          )}

          {activeView === 'preview' && selectedInvoice && (
            <div className="space-y-4">
              <button
                onClick={() => setActiveView('invoices')}
                className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition cursor-pointer"
              >
                ← العودة إلى سجل الفواتير
              </button>
              <InvoicePreview invoice={selectedInvoice} />
            </div>
          )}

          {activeView === 'clients' && (
            <ClientsManager
              clients={clients}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
            />
          )}

          {activeView === 'reminders' && (
            <PaymentReminders
              invoices={invoices}
              reminders={reminders}
              onAddReminder={handleAddReminder}
            />
          )}

          {activeView === 'reports' && <FinancialReports invoices={invoices} />}

          {activeView === 'apihub' && <ApiHub />}

          {activeView === 'settings' && (
            <SettingsManager profile={profile} onSaveProfile={updateProfile} />
          )}
        </main>
      </div>

      {/* AI Invoice Generation Modal */}
      <AIInvoiceModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerated={handleAIGenerated}
      />
    </div>
  );
}
