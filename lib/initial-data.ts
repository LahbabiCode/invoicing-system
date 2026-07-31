import { CompanyProfile, Client, Invoice, PaymentReminder } from './types';

export const defaultCompanyProfile: CompanyProfile = {
  name: 'Zakariae Lahbabi',
  title: 'Senior Software Architect & Full-Stack Engineer',
  email: 'info@zakariaelahbabi.com',
  phone: '+212 600-123456',
  address: 'Casablanca & Global Digital Services',
  website: 'https://zakariaelahbabi.com',
  taxNumber: 'MA-98451234',
  commercialReg: 'RC-542109',
  bankName: 'Attijariwafa Bank / International Wire',
  bankIBAN: 'MA64 0077 8000 0123 4567 8901 2345',
  bankSwift: 'BCMAMAMCxxx',
  primaryColor: '#2563eb', // Rich Modern Blue
  templateTheme: 'executive',
  logoUrl: '',
};

export const sampleClients: Client[] = [
  {
    id: 'cli-001',
    name: 'أحمد بن علي',
    companyName: 'شركة الأفق الرقمي للتكنولوجيا',
    email: 'ahmed@alofoq-tech.com',
    phone: '+212 600 123456',
    address: 'شارع الجيش الملكي، الدار البيضاء، المغرب',
    country: 'المغرب',
    taxNumber: 'MA-31012345',
    currency: 'MAD',
  },
  {
    id: 'cli-002',
    name: 'Sarah Connor',
    companyName: 'Apex Cloud Solutions LLC',
    email: 'billing@apexcloud.io',
    phone: '+1 (555) 349-8201',
    address: '100 Montgomery St, Suite 1400, San Francisco, CA 94104',
    country: 'United States',
    taxNumber: 'US-9841203',
    currency: 'MAD',
  },
  {
    id: 'cli-003',
    name: 'كريم التازي',
    companyName: 'مجموعة الأمل للاستثمارات المالية',
    email: 'k.tazi@alamalgroup.ma',
    phone: '+212 522 998877',
    address: 'شارع المسيرة الخضراء، الدار البيضاء، المغرب',
    country: 'المغرب',
    taxNumber: 'MA-77441100',
    currency: 'MAD',
  },
];

export const sampleInvoices: Invoice[] = [
  {
    id: 'inv-1001',
    number: 'INV-2026-001',
    createdAt: '2026-07-15',
    dueDate: '2026-08-15',
    status: 'paid',
    client: sampleClients[0],
    profile: defaultCompanyProfile,
    items: [
      {
        id: 'item-1',
        description: 'تطوير وتصميم منصة الذكاء الاصطناعي مع لوحة التحكم وتحليلات البيانات',
        quantity: 1,
        unitPrice: 45000,
        total: 45000,
      },
      {
        id: 'item-2',
        description: 'تكامل بوابة الدفع البنكي الإلكتروني مع اختبار الأمان Webhooks',
        quantity: 1,
        unitPrice: 12000,
        total: 12000,
      },
      {
        id: 'item-3',
        description: 'إعداد الخوادم السحابية ونشر التطبيق على Cloud Run مع شهادات SSL',
        quantity: 1,
        unitPrice: 8000,
        total: 8000,
      },
    ],
    subtotal: 65000,
    taxPercentage: 20,
    taxAmount: 13000,
    discountPercentage: 5,
    discountAmount: 3250,
    totalAmount: 74750,
    paidAmount: 74750,
    currency: 'MAD',
    notes: 'شكراً لتعاملكم معنا. تم استلام المبلغ بنجاح (بالدرهم المغربي MAD) مع ضمان الصيانة والتحسينات لـ 6 أشهر.',
    terms: 'تعتبر هذه الفاتورة مدفوعة ومكتملة الرسوم وفق الاتفاق المبرم.',
    language: 'ar',
    paymentMethod: 'Attijariwafa Bank Transfer (MAD)',
  },
  {
    id: 'inv-1002',
    number: 'INV-2026-002',
    createdAt: '2026-07-01',
    dueDate: '2026-07-25',
    status: 'overdue',
    client: sampleClients[1],
    profile: defaultCompanyProfile,
    items: [
      {
        id: 'item-1',
        description: 'Enterprise API Microservices Architecture & GraphQL Integration',
        quantity: 40,
        unitPrice: 1250,
        total: 50000,
      },
      {
        id: 'item-2',
        description: 'Automated CI/CD Pipeline & Infrastructure as Code Deployment',
        quantity: 1,
        unitPrice: 20000,
        total: 20000,
      },
    ],
    subtotal: 70000,
    taxPercentage: 20,
    taxAmount: 14000,
    discountPercentage: 0,
    discountAmount: 0,
    totalAmount: 84000,
    paidAmount: 0,
    currency: 'MAD',
    notes: 'Payment overdue by 5 days. Please settle payment as per contractual terms in Moroccan Dirhams (MAD).',
    terms: 'Net 20 days. Late payment charges of 1.5% per month apply to overdue balances.',
    language: 'en',
    paymentMethod: 'Bank Wire Transfer (MAD)',
  },
  {
    id: 'inv-1003',
    number: 'INV-2026-003',
    createdAt: '2026-07-28',
    dueDate: '2026-08-28',
    status: 'sent',
    client: sampleClients[2],
    profile: defaultCompanyProfile,
    items: [
      {
        id: 'item-1',
        description: 'استشارات تقنية وتصميم معماري لنظام إدارة الفواتير والمخزون',
        quantity: 1,
        unitPrice: 32000,
        total: 32000,
      },
      {
        id: 'item-2',
        description: 'دعم وتخصيص الواجهات بما يناسب الهوية التجارية للشركة',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
    ],
    subtotal: 47000,
    taxPercentage: 20,
    taxAmount: 9400,
    discountPercentage: 0,
    discountAmount: 0,
    totalAmount: 56400,
    paidAmount: 0,
    currency: 'MAD',
    notes: 'فاتورة رسمية صادرة لصالح مجموعة الأمل للاستثمارات (بالدرهم المغربي MAD).',
    terms: 'الدفع خلال 30 يوماً من تاريخ التحرير.',
    language: 'ar',
    paymentMethod: 'تحويل بنكي مباشر (MAD)',
  },
];

export const initialReminders: PaymentReminder[] = [
  {
    id: 'rem-1',
    invoiceId: 'inv-1002',
    invoiceNumber: 'INV-2026-002',
    clientName: 'Apex Cloud Solutions LLC',
    clientEmail: 'billing@apexcloud.io',
    amount: 84000,
    currency: 'MAD',
    dueDate: '2026-07-25',
    daysOverdue: 5,
    status: 'pending',
    tone: 'standard',
    generatedText: `Subject: Friendly Reminder: Invoice INV-2026-002 Payment Overdue

Dear Apex Cloud Solutions Team,

We hope this message finds you well. 

This is a polite notice regarding invoice INV-2026-002 for 84,000 MAD, which was due on July 25, 2026. 

Please kindly confirm when we might expect the payment transfer to our bank account in Morocco (MAD), or let us know if you require another copy of the invoice documentation.

Warm regards,
Zakariae Lahbabi
info@zakariaelahbabi.com`,
  },
];
