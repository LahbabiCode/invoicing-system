# Zakariae Lahbabi — Automated Billing & Invoicing Platform 🚀

> **منصة مفتوحة المصدر ومتقدمة لإدارة وتوليد وتصدير الفواتير الاحترافية المعتمدة للمستقلين ومطوري البرمجيات.**  
> *Professional Open-Source Billing & Invoicing System built for Freelance Engineers & Consultants.*

---

## 📌 نبذة عن المنصة (Overview)

تم تصميم وتطوير هذه المنصة خصيصاً لتلبية احتياجات **المطورين المستقلين (Freelance Full-Stack & AI Engineers)** لتوفير بيئة متكاملة وسريعة لإصدار وتصنيف وتصدير الفواتير الرسمية بأعلى جودة بدعم كامل للعملات المحلية والعالمية، وفي مقدمتها **الدرهم المغربي (MAD)** واللغتين **العربية (RTL)** و **الإنكليزية (LTR)**.

تتميز المنصة ببنيتها مفتوحة المصدر، وتكاملها المباشر مع **الذكاء الاصطناعي (Google Gemini AI)** لتوليد الفواتير من النصوص الطبيعية، بالإضافة إلى دعم تصدير ملفات متعددة الصيغ بضغطة زر واحدة.

---

## ✨ المميزات الرئيسية (Key Features)

### 📄 1. محرك التصدير متعدد الصيغ (Multi-Format Export Engine)
- **📄 تصدير PDF مباشر وعالي الدقة (Direct High-Res PDF)**: طباعة وتصحيح بصري ممتاز يدعم الخطوط العربية الرسمية (`Cairo`).
- **💻 تصدير ملف HTML مستقل (Standalone HTML)**: مستند تفاعلي ملون ومكتمل الأنساق يعمل دون الحاجة إلى إنترنت.
- **📝 تصدير Microsoft Word (.docx)**: فتح وتعديل الفاتورة مباشرة عبر برنامَج Word.
- **📊 تصدير بيانات Excel / CSV**: للتحليل المالي والمحاسبي المباشر.
- **JSON Data**: أرشفة واسترجاع البيانات المجهزة برمجياً.

### 🤖 2. التوليد الذكي بواسطة الذكاء الاصطناعي (AI Generation Engine)
- مدعوم بواسطة نموذج **Google Gemini AI 2.5 Flash**.
- تحويل الوصف النصي الطبيعي (مثل: *"فاتورة لتطوير تطبيق ويب وتكامل بوابة الدفع بقيمة 45,000 درهم مغربي"*) إلى فاتورة تفصيلية تشمل البنود، الأسعار، الضرائب، والملاحظات تلقائياً.

### 🛡️ 3. التوثيق ورمز التحقق QR Code
- توليد رمز **QR Code** تلقائي لكل فاتورة يتضمن بيانات المصادقة والتحقق الفوري عند التوثيق والأرشفة الذاتية.

### 👥 4. إدارة العملاء والسجلات (Full CRUD Client Management)
- إضافة، تعديل، حذف، واستعراض بيانات العملاء والشركات.
- تخصيص العملة المعتمدة لكل عميل مع التخزين الدائم.

### 🔔 5. التنبيهات وإدارة المستحقات المتأخرة
- تتبع حالة سداد الفواتير (مدفوعة، متأخرة، مرسلة، مسودة).
- توليد رسائل تنبيهية وتذكير بالدفعات صالحة للإرسال عبر البريد أو واتساب بكبسة زر.

### 📊 6. التقارير والتحليلات المالية
- لوحة تحكم تفاعلية توضح إجمالي الدخل، المبالغ المحصلة، والمستحقات المعلقة.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

| المكون | التقنية المستعملة |
| :--- | :--- |
| **الإطار الأساسي (Framework)** | [Next.js 15+](https://nextjs.org/) (App Router & TypeScript) |
| **التصميم والواجهات (UI & Styling)** | [Tailwind CSS v4](https://tailwindcss.com/) & Lucide Icons |
| **الذكاء الاصطناعي (AI Engine)** | `@google/genai` (Google Gemini 2.5 Flash API) |
| **توليد الـ PDF** | `html2canvas` & `jspdf` |
| **توليد الـ DOCX** | `docx` & `file-saver` |
| **رمز التوثيق QR** | `qrcode` |

---

## 🚀 التثبيت والتشغيل المحلي (Installation & Setup)

### 1. استنساخ المستودع (Clone Repository)
```bash
git clone https://github.com/zakariaelahbabi/billing-invoicing-system.git
cd billing-invoicing-system
```

### 2. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 3. إعداد متغيرات البيئة (Environment Variables)
قم بإنشاء ملف `.env.local` وأضف المفتاح الخاص بالذكاء الاصطناعي:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. تشغيل خادم التطوير (Run Dev Server)
```bash
npm run dev
```
افتح المتصفح على العنوان: `http://localhost:3000`

---

## 📂 هيكلة المشروع (Project Structure)

```text
├── app/
│   ├── api/ai/invoice-generator/   # API Route لتوليد الفواتير بـ Gemini
│   ├── globals.css                 # التنسيقات العامة و Tailwind
│   ├── layout.tsx                  # الهيكل الرئيسي والإعدادات و SEO
│   └── page.tsx                    # الصفحة الرئيسية والملاحة بين الأجزاء
├── components/
│   ├── AIInvoiceModal.tsx          # نافذة الذكاء الاصطناعي
│   ├── ApiHub.tsx                  # توثيق الـ APIs ووسائل الربط
│   ├── ClientsManager.tsx          # إدارة بيانات العملاء (CRUD)
│   ├── DashboardOverview.tsx       # لوحة التحكم والإحصائيات
│   ├── FinancialReports.tsx        # التقارير والرسوم البيانية
│   ├── InvoiceEditor.tsx           # محرر الفواتير البصري
│   ├── InvoicePreview.tsx          # معاينة الفاتورة القابلة للطباعة
│   ├── InvoicesList.tsx            # قائمة الفواتير والإجراءات السريعة
│   └── PaymentReminders.tsx        # التذكير بالدفعات المتأخرة
├── lib/
│   ├── export-utils.ts             # محركات تصدير PDF, HTML, DOCX, CSV
│   ├── initial-data.ts             # البيانات الافتراضية الأولية
│   └── types.ts                    # التعريفات النمطية TypeScript Types
├── metadata.json                   # إعدادات المنصة في AI Studio
└── README.md                       # التوثيق الشامل للمشروع
```

---

## 📜 الترخيص والفتح المصدري (License & Open Source)

هذا المشروع مفتوح المصدر ومتاح مجاناً للاستخدام والتطوير والتحسين تحت ترخيص **MIT License**.  
تطوير وتصميم **Zakariae Lahbabi**.

---
*Zakariae Lahbabi — Full-Stack & AI Solutions Specialist*
