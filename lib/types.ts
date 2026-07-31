export type Language = 'ar' | 'en';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  taxNumber?: string;
  currency: string;
}

export interface CompanyProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  taxNumber: string;
  commercialReg: string;
  bankName: string;
  bankIBAN: string;
  bankSwift: string;
  logoUrl?: string;
  signatureUrl?: string;
  primaryColor: string;
  templateTheme: 'executive' | 'minimal' | 'modern' | 'corporate';
}

export interface Invoice {
  id: string;
  number: string;
  createdAt: string;
  dueDate: string;
  status: InvoiceStatus;
  client: Client;
  profile: CompanyProfile;
  items: InvoiceItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  notes: string;
  terms: string;
  language: Language;
  paymentMethod?: string;
  qrCodeData?: string;
}

export interface PaymentReminder {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  status: 'pending' | 'sent' | 'scheduled' | 'failed';
  tone: 'gentle' | 'standard' | 'firm' | 'legal';
  generatedText: string;
  lastSentAt?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

export interface WebhookEvent {
  id: string;
  event: 'invoice.created' | 'invoice.paid' | 'payment.overdue' | 'reminder.sent';
  timestamp: string;
  payload: Record<string, any>;
  status: 'success' | 'failed';
}
