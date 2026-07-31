-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'profile',
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "commercialReg" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankIBAN" TEXT NOT NULL,
    "bankSwift" TEXT NOT NULL,
    "logoUrl" TEXT,
    "signatureUrl" TEXT,
    "primaryColor" TEXT NOT NULL,
    "templateTheme" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "taxNumber" TEXT,
    "currency" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "profileData" TEXT NOT NULL,
    "itemsData" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "taxPercentage" REAL NOT NULL,
    "taxAmount" REAL NOT NULL,
    "discountPercentage" REAL NOT NULL,
    "discountAmount" REAL NOT NULL,
    "totalAmount" REAL NOT NULL,
    "paidAmount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "qrCodeData" TEXT,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentReminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "daysOverdue" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "generatedText" TEXT NOT NULL,
    "lastSentAt" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");
