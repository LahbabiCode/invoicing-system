import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, language = 'ar' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an expert AI billing and invoicing assistant for Software Architect & Engineer "Zakariae Lahbabi".
Given a natural language input describing work, services, or a client request, extract and generate a complete structured invoice JSON object.
Always return ONLY valid JSON without markdown fences or extra explanations.

JSON format expected:
{
  "clientName": "Client Name or Company",
  "clientCompany": "Company Name",
  "clientEmail": "email@example.com",
  "currency": "USD" | "EUR" | "MAD" | "SAR" | "AED",
  "taxPercentage": number (e.g. 15, 20, 0),
  "discountPercentage": number,
  "items": [
    {
      "description": "Clear service description in requested language",
      "quantity": number,
      "unitPrice": number,
      "total": number
    }
  ],
  "notes": "Thank you note or work summary",
  "terms": "Payment terms (e.g., Payment due within 15 days)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: systemInstruction },
        { text: `Language: ${language}. Natural prompt: "${prompt}"` }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from AI model');
    }

    const parsedJson = JSON.parse(responseText);
    return NextResponse.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error('AI Invoice Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI invoice' },
      { status: 500 }
    );
  }
}
