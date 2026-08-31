import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const lang = searchParams.get('lang') || 'hi';

    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    // Google Translate TTS endpoint supporting all Indian languages with authentic accents
    // Languages: hi, bn, mr, te, ta, gu, kn, ml, pa, en
    const langCodeMap: Record<string, string> = {
      hi: 'hi',
      en: 'en-IN',
      bn: 'bn',
      mr: 'mr',
      te: 'te',
      ta: 'ta',
      gu: 'gu',
      kn: 'kn',
      ml: 'ml',
      pa: 'pa'
    };

    const targetLang = langCodeMap[lang] || lang;
    const truncatedText = text.substring(0, 200); // Safe length for single TTS query
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${targetLang}&q=${encodeURIComponent(truncatedText)}`;

    const audioRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!audioRes.ok) {
      return NextResponse.json({ error: 'TTS audio fetch failed' }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
      }
    });
  } catch (err: any) {
    console.error('TTS API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
