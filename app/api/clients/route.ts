import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany();
    return NextResponse.json(clients);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const client = await prisma.client.create({
      data: {
        id: data.id || undefined,
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        country: data.country,
        taxNumber: data.taxNumber || '',
        currency: data.currency,
      },
    });

    return NextResponse.json(client);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
