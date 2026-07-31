import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { invoice, tone = 'standard', language = 'ar' } = await req.json();

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice data is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Write a professional payment reminder email/message for an invoice.
Details:
- Sender Name: Zakariae Lahbabi (info@zakariaelahbabi.com)
- Client Name: ${invoice.client?.name || 'Valued Client'}
- Client Company: ${invoice.client?.companyName || ''}
- Invoice Number: ${invoice.number}
- Invoice Total: ${invoice.totalAmount} ${invoice.currency}
- Due Date: ${invoice.dueDate}
- Tone required: ${tone} (Options: gentle, standard, firm, legal)
- Language required: ${language === 'ar' ? 'Arabic (اللغة العربية الفصحى والمهنية)' : 'English'}

Make the message polite yet firm according to tone, including subject line, clear payment instructions, bank IBAN reference (${invoice.profile?.bankIBAN || 'MA64 0077 8000...'}) and contact details.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('AI Reminder Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate reminder' },
      { status: 500 }
    );
  }
}
