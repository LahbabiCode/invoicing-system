import React, { useState } from 'react';
import { ApiKey, WebhookEvent } from '../lib/types';
import { Code2, Key, CreditCard, Send, Check, Copy, Play, Terminal, Shield, Globe, Layers } from 'lucide-react';

export const ApiHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'playground' | 'keys' | 'gateways' | 'webhooks'>('playground');

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'key-1',
      name: 'Production Live API Key',
      key: 'zl_live_98a4f102c98d4001aef39201',
      createdAt: '2026-06-01',
      lastUsed: 'Just now',
    },
    {
      id: 'key-2',
      name: 'Development Sandbox Key',
      key: 'zl_test_33b8a109e201401fba990200',
      createdAt: '2026-07-10',
      lastUsed: '2 hours ago',
    },
  ]);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testEndpoint, setTestEndpoint] = useState('/api/v1/invoices');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [responseLog, setResponseLog] = useState<string>('');
  const [loadingTest, setLoadingTest] = useState(false);

  const mockWebhooks: WebhookEvent[] = [
    {
      id: 'evt-001',
      event: 'invoice.paid',
      timestamp: '2026-07-30 14:22:10',
      payload: { invoiceNumber: 'INV-2026-001', amount: 7150, currency: 'USD', gateway: 'Stripe' },
      status: 'success',
    },
    {
      id: 'evt-002',
      event: 'payment.overdue',
      timestamp: '2026-07-25 09:00:00',
      payload: { invoiceNumber: 'INV-2026-002', clientEmail: 'billing@apexcloud.io', overdueDays: 5 },
      status: 'success',
    },
  ];

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(txt);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunApiTest = () => {
    setLoadingTest(true);
    setTimeout(() => {
      setLoadingTest(false);
      setResponseLog(
        JSON.stringify(
          {
            status: 200,
            success: true,
            developer: 'Zakariae Lahbabi',
            endpoint: testEndpoint,
            method: httpMethod,
            timestamp: new Date().toISOString(),
            data: [
              {
                id: 'inv-1001',
                number: 'INV-2026-001',
                status: 'paid',
                amount: 7150,
                currency: 'USD',
                client: 'شركة الأفق الرقمي للتكنولوجيا',
              },
            ],
          },
          null,
          2
        )
      );
    }, 600);
  };

  const codeSnippets = {
    curl: `curl -X POST "${process.env.APP_URL || 'https://zakariaelahbabi.com'}/api/v1/invoices" \\
  -H "Authorization: Bearer zl_live_98a4f102c9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientName": "شركة الأفق",
    "amount": 4500,
    "currency": "USD"
  }'`,
    node: `import { ZakariaeBillingAPI } from '@zakariaelahbabi/sdk';

const api = new ZakariaeBillingAPI({ apiKey: process.env.ZL_API_KEY });

const invoice = await api.invoices.create({
  clientEmail: 'client@example.com',
  items: [{ description: 'Architecture Review', unitPrice: 2500, quantity: 1 }],
  exportFormat: 'pdf'
});`,
    python: `import requests

url = "https://zakariaelahbabi.com/api/v1/invoices"
headers = {"Authorization": "Bearer zl_live_98a4f102c9..."}
data = {
    "clientName": "Apex Cloud LLC",
    "total": 7700,
    "currency": "USD"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`,
  };

  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'node' | 'python'>('curl');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-600" />
            <span>مركز المطورين وتكامل البوابات البنكية (API Hub)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            تكامل وتوليد الفواتير برمجياً، إدارة مفاتيح API، اختبار Webhooks، وبوابات الدفع (Stripe, PayPal, CMI)
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'playground' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            اختبار الـ API
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'keys' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مفاتيح API Keys
          </button>
          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'gateways' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بوابات الدفع البنكي
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'webhooks' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سجل Webhooks
          </button>
        </div>
      </div>

      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Tester Request Form */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-600" />
              <span>مختبر طلبات الـ REST API الحية</span>
            </h3>

            <div className="flex gap-2">
              <select
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value)}
                className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-emerald-600 focus:outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input
                type="text"
                value={testEndpoint}
                onChange={(e) => setTestEndpoint(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 font-mono font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
              />

              <button
                onClick={handleRunApiTest}
                disabled={loadingTest}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shrink-0 cursor-pointer shadow-xs"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>إرسال</span>
              </button>
            </div>

            {/* Code Snippet Switcher */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">كود التكامل البرمجي:</span>
                <div className="flex gap-1">
                  {(['curl', 'node', 'python'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition uppercase ${
                        selectedLanguage === lang ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <pre className="rounded-xl bg-slate-900 p-4 text-xs font-mono text-indigo-300 overflow-x-auto border border-slate-800 leading-relaxed dir-ltr text-left">
                  {codeSnippets[selectedLanguage]}
                </pre>
                <button
                  onClick={() => handleCopy(codeSnippets[selectedLanguage])}
                  className="absolute left-3 top-3 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                  title="نسخ الكود"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Response Console Log */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-600" />
                <span>استجابة السيرفر (Response Console)</span>
              </h3>
              <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">200 OK — 42ms</span>
            </div>

            <pre className="rounded-xl bg-slate-950 p-4 text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 h-80 leading-relaxed">
              {responseLog || `// انقر على "إرسال" لاختبار نقطة الاتصال وحصول الاستجابة الحية...`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-500" />
                <span>مفاتيح السر الخاصة بالمطور (API Authentication Keys)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                تستخدم لمصادقة عمليات التصدير والتوليد الآلي من الأنظمة الخارجية الخاصة بـ Zakariae Lahbabi
              </p>
            </div>
            <button
              onClick={() => {
                const newK: ApiKey = {
                  id: `key-${Date.now()}`,
                  name: 'New Custom Key',
                  key: `zl_live_${Math.random().toString(36).substring(2, 18)}`,
                  createdAt: new Date().toISOString().split('T')[0],
                  lastUsed: 'Never',
                };
                setApiKeys([...apiKeys, newK]);
              }}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
            >
              + إنشاء مفتاح جديد
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div key={k.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{k.name}</h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 mt-1 font-semibold">
                    <span>{k.key}</span>
                    <button
                      onClick={() => handleCopy(k.key)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    >
                      {copiedKey === k.key ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-left text-xs text-slate-500 font-medium">
                  <p>تم التحرير: {k.createdAt}</p>
                  <p>آخر استخدام: {k.lastUsed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'gateways' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gateway 1: Stripe */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Stripe Payments</h3>
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-100">
                نشط 🟢
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">قبول البطاقات الائتمانية العالمية Apple Pay & Google Pay</p>
            <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono font-medium">
              <p>Public Key: pk_live_98a4...</p>
              <p>Webhook Secret: whsec_88f...</p>
            </div>
          </div>

          {/* Gateway 2: CMI / Morocco Direct Wire */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">CMI Bank Gateway</h3>
              <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-indigo-100">
                متصل 🌐
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">بوابة التجارة الإلكترونية والبنوك المغربية والدولية (Attijariwafa)</p>
            <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono font-medium">
              <p>Merchant ID: 600012345</p>
              <p>3D-Secure V2: Activated</p>
            </div>
          </div>

          {/* Gateway 3: PayPal Enterprise */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">PayPal Business</h3>
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-100">
                نشط 🟢
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">تحويلات PayPal الفورية مع إصدار إيصال التوريد الآلي</p>
            <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono font-medium">
              <p>Client ID: A21_paypal_live...</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            سجل أحداث الـ Webhooks المباشرة
          </h3>

          <div className="space-y-3">
            {mockWebhooks.map((w) => (
              <div key={w.id} className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-600">{w.event}</span>
                  <span className="text-slate-500 font-medium">{w.timestamp}</span>
                </div>
                <pre className="rounded-lg bg-slate-900 p-3 font-mono text-emerald-400 text-[11px] dir-ltr text-left">
                  {JSON.stringify(w.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
