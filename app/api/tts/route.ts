import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawText = searchParams.get('text');
    const lang = searchParams.get('lang') || 'hi';

    if (!rawText) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    // 1. Clean and normalize text:
    // If text contains a bilingual separator '/', pick the first native part for regional languages
    let cleanText = rawText.trim();
    if (cleanText.includes('/') && lang !== 'en') {
      const parts = cleanText.split('/');
      cleanText = parts[0].trim();
    }
    // Strip emojis, markdown, and extra whitespace
    cleanText = cleanText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    cleanText = cleanText.replace(/[*_#`~]/g, '').trim();

    if (!cleanText) {
      cleanText = rawText.substring(0, 150);
    }

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
    const truncatedText = cleanText.substring(0, 200);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${targetLang}&q=${encodeURIComponent(truncatedText)}`;

    const audioRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!audioRes.ok) {
      console.warn(`TTS fetch returned status ${audioRes.status}`);
      return NextResponse.json({ error: 'TTS audio fetch failed' }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();

    return new Response(Buffer.from(audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.byteLength),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
      }
    });
  } catch (err: any) {
    console.error('TTS API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
