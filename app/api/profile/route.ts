import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { defaultCompanyProfile } from '../../../lib/initial-data';

export async function GET() {
  try {
    let profile = await prisma.companyProfile.findUnique({
      where: { id: 'profile' },
    });

    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: {
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
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const updated = await prisma.companyProfile.upsert({
      where: { id: 'profile' },
      update: {
        name: data.name,
        title: data.title,
        email: data.email,
        phone: data.phone,
        address: data.address,
        website: data.website,
        taxNumber: data.taxNumber,
        commercialReg: data.commercialReg,
        bankName: data.bankName,
        bankIBAN: data.bankIBAN,
        bankSwift: data.bankSwift,
        logoUrl: data.logoUrl || '',
        signatureUrl: data.signatureUrl || '',
        primaryColor: data.primaryColor,
        templateTheme: data.templateTheme,
      },
      create: {
        id: 'profile',
        name: data.name,
        title: data.title,
        email: data.email,
        phone: data.phone,
        address: data.address,
        website: data.website,
        taxNumber: data.taxNumber,
        commercialReg: data.commercialReg,
        bankName: data.bankName,
        bankIBAN: data.bankIBAN,
        bankSwift: data.bankSwift,
        logoUrl: data.logoUrl || '',
        signatureUrl: data.signatureUrl || '',
        primaryColor: data.primaryColor,
        templateTheme: data.templateTheme,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
