import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zakariae Lahbabi — نظام إدارة وتوليد الفواتير للمستقلين',
  description: 'منصة مفتوحة المصدر لإدارة وتوليد وتصدير الفواتير الاحترافية بصيغ PDF و HTML و DOCX والمستندات الذكية مع الدعم الكامل للغة العربية والعملات (MAD)',
  keywords: ['Zakariae Lahbabi', 'فواتير', 'توليد فواتير', 'PDF', 'Moroccan Dirham', 'MAD', 'Next.js', 'Invoice Generator', 'المستقلين', 'Freelance Billing'],
  authors: [{ name: 'Zakariae Lahbabi', url: 'https://zakariaelahbabi.com' }],
  creator: 'Zakariae Lahbabi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning className="antialiased bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
