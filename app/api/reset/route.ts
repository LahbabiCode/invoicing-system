import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { defaultCompanyProfile } from '../../../lib/initial-data';

export async function POST() {
  try {
    // Delete all invoices, clients, reminders
    await prisma.paymentReminder.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.client.deleteMany({});
    
    // Reset profile
    await prisma.companyProfile.upsert({
      where: { id: 'profile' },
      update: {
        name: defaultCompanyProfile.name,
        title: defaultCompanyProfile.title,
        email: defaultCompanyProfile.email,
        phone: defaultCompanyProfile.phone,
        address: defaultCompanyProfile.address,
        website: defaultCompanyProfile.website,
        taxNumber: defaultCompanyProfile.taxNumber,
        commercialReg: defaultCompanyProfile.commercialReg,
        bankName: defaultCompanyProfile.bankName,
        bankIBAN: defaultCompanyProfile.bankIBAN,
        bankSwift: defaultCompanyProfile.bankSwift,
        logoUrl: defaultCompanyProfile.logoUrl || '',
        signatureUrl: defaultCompanyProfile.signatureUrl || '',
        primaryColor: defaultCompanyProfile.primaryColor,
        templateTheme: defaultCompanyProfile.templateTheme,
      },
      create: {
        id: 'profile',
        name: defaultCompanyProfile.name,
        title: defaultCompanyProfile.title,
        email: defaultCompanyProfile.email,
        phone: defaultCompanyProfile.phone,
        address: defaultCompanyProfile.address,
        website: defaultCompanyProfile.website,
        taxNumber: defaultCompanyProfile.taxNumber,
        commercialReg: defaultCompanyProfile.commercialReg,
        bankName: defaultCompanyProfile.bankName,
        bankIBAN: defaultCompanyProfile.bankIBAN,
        bankSwift: defaultCompanyProfile.bankSwift,
        logoUrl: defaultCompanyProfile.logoUrl || '',
        signatureUrl: defaultCompanyProfile.signatureUrl || '',
        primaryColor: defaultCompanyProfile.primaryColor,
        templateTheme: defaultCompanyProfile.templateTheme,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
