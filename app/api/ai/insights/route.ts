import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { invoices, language = 'ar' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze the following business financial invoices data for developer Zakariae Lahbabi and provide 3 actionable high-impact AI insights and revenue recommendations in ${language === 'ar' ? 'Arabic' : 'English'}:
Invoices summary: ${JSON.stringify(invoices)}

Return structured JSON with format:
{
  "totalRevenue": number,
  "cashflowForecast": "Forecast string text",
  "insights": [
    { "title": "Insight title", "description": "Detailed tip", "type": "positive" | "warning" | "opportunity" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    return NextResponse.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('AI Insights Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate financial insights' },
      { status: 500 }
    );
  }
}
