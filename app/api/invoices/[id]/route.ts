import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { Invoice } from '../../../../lib/types';

function mapInvoice(dbInvoice: any): Invoice {
  return {
    id: dbInvoice.id,
    number: dbInvoice.number,
    createdAt: dbInvoice.createdAt,
    dueDate: dbInvoice.dueDate,
    status: dbInvoice.status as any,
    client: dbInvoice.client,
    profile: JSON.parse(dbInvoice.profileData),
    items: JSON.parse(dbInvoice.itemsData),
    subtotal: dbInvoice.subtotal,
    taxPercentage: dbInvoice.taxPercentage,
    taxAmount: dbInvoice.taxAmount,
    discountPercentage: dbInvoice.discountPercentage,
    discountAmount: dbInvoice.discountAmount,
    totalAmount: dbInvoice.totalAmount,
    paidAmount: dbInvoice.paidAmount,
    currency: dbInvoice.currency,
    notes: dbInvoice.notes,
    terms: dbInvoice.terms,
    language: dbInvoice.language as any,
    paymentMethod: dbInvoice.paymentMethod || undefined,
    qrCodeData: dbInvoice.qrCodeData || undefined,
  };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    // Ensure client exists or is updated
    let clientId = data.client?.id;
    if (clientId) {
      await prisma.client.upsert({
        where: { id: clientId },
        update: {
          name: data.client.name,
          companyName: data.client.companyName || '',
          email: data.client.email || '',
          phone: data.client.phone || '',
          address: data.client.address || '',
          country: data.client.country || '',
          taxNumber: data.client.taxNumber || '',
          currency: data.client.currency || 'MAD',
        },
        create: {
          id: clientId,
          name: data.client.name,
          companyName: data.client.companyName || '',
          email: data.client.email || '',
          phone: data.client.phone || '',
          address: data.client.address || '',
          country: data.client.country || '',
          taxNumber: data.client.taxNumber || '',
          currency: data.client.currency || 'MAD',
        },
      });
    }

    const dbInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        number: data.number,
        createdAt: data.createdAt,
        dueDate: data.dueDate,
        status: data.status,
        clientId: clientId,
        profileData: JSON.stringify(data.profile),
        itemsData: JSON.stringify(data.items),
        subtotal: data.subtotal,
        taxPercentage: data.taxPercentage,
        taxAmount: data.taxAmount,
        discountPercentage: data.discountPercentage,
        discountAmount: data.discountAmount,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        currency: data.currency,
        notes: data.notes,
        terms: data.terms,
        language: data.language,
        paymentMethod: data.paymentMethod || '',
        qrCodeData: data.qrCodeData || '',
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(mapInvoice(dbInvoice));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
