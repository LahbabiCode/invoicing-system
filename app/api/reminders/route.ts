import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const reminders = await prisma.paymentReminder.findMany({
      orderBy: {
        lastSentAt: 'desc',
      },
    });
    return NextResponse.json(reminders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const reminder = await prisma.paymentReminder.create({
      data: {
        id: data.id || undefined,
        invoiceId: data.invoiceId,
        invoiceNumber: data.invoiceNumber,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        amount: data.amount,
        currency: data.currency,
        dueDate: data.dueDate,
        daysOverdue: data.daysOverdue,
        status: data.status,
        tone: data.tone,
        generatedText: data.generatedText,
        lastSentAt: data.lastSentAt || new Date().toISOString(),
      },
    });

    return NextResponse.json(reminder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
