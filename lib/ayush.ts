/**
 * Ministry of AYUSH — Specialized Ayurvedic Clinical Framework
 * Comprehensive Ayurvedic clinical intake, Tridosha assessment (Vata, Pitta, Kapha),
 * Agni assessment, Ahara/Vihara (Diet & Lifestyle), and traditional pharmacopoeia.
 */

export interface DoshaAssessment {
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  dominant_prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';
  agni_type: 'Mandagni (Low/Slow)' | 'Tikshnagni (Intense/Sharp)' | 'Vishamagni (Irregular)' | 'Samagni (Balanced)';
  koshta_type: 'Mrudu (Soft)' | 'Madhyama (Medium)' | 'Krura (Hard/Constipated)';
  bala: 'Pravara (High)' | 'Madhyama (Medium)' | 'Avara (Low)';
  recommendations: string[];
}

export const AYUSH_PASSWORD = 'Ayurveda';

export const AYUSH_INTAKE_QUESTIONS = [
  {
    id: 'ayush_dosha_body',
    section: 'ayush_prakriti',
    field_name: 'body_physique_dosha',
    question_localized: {
      en: 'What best describes your body build and weight tendency?',
      hi: 'आपके शरीर की बनावट और वजन की प्रवृत्ति क्या है?',
      bn: 'আপনার শরীরের গঠন এবং ওজনের ধরণ কোনটি?',
      mr: 'तुमच्या शरीराची रचना आणि वजनाची प्रवृत्ती कोणती आहे?',
      te: 'మీ శరీర నిర్మాణం మరియు బరువు లక్షణం ఏమిటి?',
      ta: 'உங்கள் உடல் அமைப்பு மற்றும் எடை பண்பு என்ன?',
      gu: 'તમારા શરીરનું બંધારણ અને વજનની પ્રવૃત્તિ શું છે?',
      kn: 'ನಿಮ್ಮ ದೇಹ ರಚನೆ ಮತ್ತು ತೂಕದ ಲಕ್ಷಣ ಯಾವುದು?',
      ml: 'നിങ്ങളുടെ ശരീരഘടനയും ഭാരപ്രവണതയും ഏതാണ്?',
      pa: 'ਤੁਹਾਡੇ ਸਰੀਰ ਦੀ ਬਣਤਰ ਅਤੇ ਭਾਰ ਦੀ ਪ੍ਰਵਿਰਤੀ ਕੀ ਹੈ?'
    },
    question_en: 'What best describes your body build and weight tendency?',
    options_by_lang: {
      en: [
        'Lean / Slender, difficult to gain weight (Vata)',
        'Medium build, athletic, moderate weight (Pitta)',
        'Solid / Broad build, easily gains weight (Kapha)',
        'Mixed / Not sure'
      ],
      hi: [
        'दुबला-पतला, वजन बढ़ना कठिन (वात / Vata)',
        'मध्यम शरीर, आसानी से पसीना (पित्त / Pitta)',
        'मजबूत-भारी शरीर, वजन जल्दी बढ़ता है (कफ / Kapha)',
        'मिश्रित / निश्चित नहीं'
      ]
    }
  },
  {
    id: 'ayush_agni_digestion',
    section: 'ayush_agni',
    field_name: 'digestive_fire_agni',
    question_localized: {
      en: 'How is your digestion and appetite (Agni)?',
      hi: 'आपकी पाचन शक्ति और भूख (अग्नि) कैसी रहती है?',
      bn: 'আপনার হজম শক্তি এবং ক্ষুধা কেমন?',
      mr: 'तुमची पचनशक्ती आणि भूक (अग्नि) कशी आहे?',
      te: 'మీ జీర్ణశక్తి మరియు ఆకలి ఎలా ఉంటుంది?',
      ta: 'உங்கள் செரிமான சக்தி மற்றும் பசி எவ்வாறு உள்ளது?',
      gu: 'તમારી પાચનશક્તિ અને ભૂખ (અગ્નિ) કેવી રહે છે?',
      kn: 'ನಿಮ್ಮ ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಹಸಿವು ಹೇಗಿದೆ?',
      ml: 'നിങ്ങളുടെ ദഹനവും വിശപ്പും എങ്ങനെയാണ്?',
      pa: 'ਤੁਹਾਡੀ ਪਾਚਨ ਸ਼ਕਤੀ ਅਤੇ ਭੁੱਖ ਕਿਵੇਂ ਰਹਿੰਦੀ ਹੈ?'
    },
    question_en: 'How is your digestion and appetite (Agni)?',
    options_by_lang: {
      en: [
        'Irregular / Bloating & gas after meals (Vishamagni)',
        'Sharp / Cannot tolerate hunger, acidity (Tikshnagni)',
        'Slow / Sluggish, heavy feeling after food (Mandagni)',
        'Balanced / Good appetite & easy digestion (Samagni)'
      ],
      hi: [
        'अनियमित भूख, गैस या पेट फूलना (विषमाग्नि / Vishamagni)',
        'तीव्र भूख, एसिडिटी या जलन (तीक्ष्णाग्नि / Tikshnagni)',
        'धीमी पाचन शक्ति, भारीपन लगना (मंदाग्नि / Mandagni)',
        'संतुलित व सामान्य पाचन (समाग्नि / Samagni)'
      ]
    }
  },
  {
    id: 'ayush_sleep_nidra',
    section: 'ayush_vihara',
    field_name: 'sleep_quality_nidra',
    question_localized: {
      en: 'How is your sleep pattern and mental relaxation (Nidra & Manas)?',
      hi: 'आपकी नींद और मानसिक शांति (निद्रा व मानस) कैसी है?',
      bn: 'আপনার ঘুম এবং মানসিক শান্তি কেমন?',
      mr: 'तुमची झोप आणि मानसिक शांतता कशी आहे?',
      te: 'మీ నిద్ర మరియు మానసిక ప్రశాంతత ఎలా ఉంది?',
      ta: 'உங்கள் தூக்கம் மற்றும் மன அமைதி எவ்வாறு உள்ளது?',
      gu: 'તમારી ઊંઘ અને માનસિક શાંતિ કેવી છે?',
      kn: 'ನಿಮ್ಮ ನಿದ್ರೆ ಮತ್ತು ಮಾನಸಿಕ ಶಾಂತಿ ಹೇಗಿದೆ?',
      ml: 'നിങ്ങളുടെ ഉറക്കവും മനസ്സിന്റെ സമാധാനവും എങ്ങനെ?',
      pa: 'ਤੁਹਾਡੀ ਨੀਂਦ ਅਤੇ ਮਾਨਸਿਕ ਸ਼ਾਂਤੀ ਕਿਵੇਂ ਹੈ?'
    },
    question_en: 'How is your sleep pattern and mental relaxation (Nidra & Manas)?',
    options_by_lang: {
      en: [
        'Light / Broken sleep, active thinking (Vata)',
        'Moderate sleep (6-7 hrs), vivid dreams (Pitta)',
        'Deep / Heavy sleep, hard to wake up (Kapha)',
        'Insomnia / Disturbed sleep'
      ],
      hi: [
        'हल्की नींद, बार-बार टूटना, चिंता (वात / Vata)',
        'मध्यम नींद (6-7 घंटे), गर्मी लगना (पित्त / Pitta)',
        'गहरी व लंबी नींद, सुबह सुस्ती (कफ / Kapha)',
        'अनिद्रा या अत्यधिक बेचैनी'
      ]
    }
  },
  {
    id: 'ayush_traditional_meds',
    section: 'ayush_aushadhi',
    field_name: 'traditional_home_remedies',
    question_localized: {
      en: 'Are you taking any Ayurvedic medicines, herbal teas, or home remedies (Aushadhi / Kashayam / Kadha)?',
      hi: 'क्या आप कोई आयुर्वेदिक दवा, काढ़ा, चूर्ण या घरेलू उपचार ले रहे हैं?',
      bn: 'আপনি কি কোনো আয়ুর্বেদিক ওষুধ, ক্বাথ বা ঘরোয়া প্রতিকার নিচ্ছেন?',
      mr: 'तुम्ही कोणतेही आयुर्वेदिक औषध, काढा, चूर्ण किंवा घरगुती उपाय घेत आहात का?',
      te: 'మీరు ఏవైనా ఆయుర్వేద మందులు, కషాయాలు లేదా ఇంటి చిట్కాలు వాడుతున్నారా?',
      ta: 'நீங்கள் ஏதேனும் ஆயுர்வேத மருந்து, கஷாயம் அல்லது வீட்டு வைத்தியம் எடுத்துக்கொள்கிறீர்களா?',
      gu: 'શું તમે કોઈ આયુર્વેદિક દવા, ઉકાળો કે ઘરગથ્થુ ઉપચાર લઈ રહ્યા છો?',
      kn: 'ನೀವು ಯಾವುದೇ ಆಯುರ್ವೇದ ಔಷಧಿ, ಕಷಾಯ ಅಥವಾ ಮನೆಮದ್ದು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      ml: 'നിങ്ങൾ എന്തെങ്കിലും ആയുർവേദ മരുന്നുകളോ കഷായങ്ങളോ കഴിക്കുന്നുണ്ടോ?',
      pa: 'ਕੀ ਤੁਸੀਂ ਕੋਈ ਆਯੁਰਵੈਦਿਕ ਦਵਾਈ, ਕਾੜ੍ਹਾ ਜਾਂ ਘਰੇਲੂ ਨੁਸਖਾ ਲੈ ਰਹੇ ਹੋ?'
    },
    question_en: 'Are you taking any Ayurvedic medicines, herbal teas, or home remedies?',
    options_by_lang: {
      en: [
        'Ashwagandha / Brahmi / Giloy preparations',
        'Triphala / Isabgol / Digestive Churna',
        'Herbal Kadha / Tulsi-Ginger tea / Golden Milk',
        'Ayurvedic prescription from Vaidya',
        'None currently'
      ],
      hi: [
        'अश्वगंधा / गिलोय / ब्राह्मी का सेवन',
        'त्रिफला / ईसबगोल / पाचक चूर्ण',
        'हर्बल काढ़ा / तुलसी-अदरक चाय / हल्दी दूध',
        'वैद्य द्वारा निर्धारित आयुर्वेदिक दवा',
        'वर्तमान में कुछ नहीं'
      ]
    }
  }
];

export function computeDoshaScore(history: any[]): DoshaAssessment {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  let agni: DoshaAssessment['agni_type'] = 'Samagni (Balanced)';
  let koshta: DoshaAssessment['koshta_type'] = 'Madhyama (Medium)';
  let bala: DoshaAssessment['bala'] = 'Madhyama (Medium)';
  const recommendations: string[] = [];

  for (const item of history) {
    const val = (item.value || '').toLowerCase();
    
    // Vata indicators
    if (val.includes('vata') || val.includes('वात') || val.includes('lean') || val.includes('gas') || val.includes('bloat') || val.includes('light') || val.includes('broken')) {
      vata += 2;
    }
    // Pitta indicators
    if (val.includes('pitta') || val.includes('पित्त') || val.includes('acid') || val.includes('sharp') || val.includes('sweat') || val.includes('intense')) {
      pitta += 2;
    }
    // Kapha indicators
    if (val.includes('kapha') || val.includes('कफ') || val.includes('heavy') || val.includes('solid') || val.includes('slow') || val.includes('deep')) {
      kapha += 2;
    }

    // Agni classification
    if (val.includes('vishamagni') || val.includes('विषमाग्नि') || val.includes('irregular')) {
      agni = 'Vishamagni (Irregular)';
      recommendations.push('Deepana-Pachana therapy: Trikatu churna / warm ginger water before meals.');
    } else if (val.includes('tikshnagni') || val.includes('तीक्ष्णाग्नि') || val.includes('acidity') || val.includes('जलन')) {
      agni = 'Tikshnagni (Intense/Sharp)';
      recommendations.push('Pitta Shamana: Amla juice, Coconut water, avoid spicy and sour foods.');
    } else if (val.includes('mandagni') || val.includes('मंदाग्नि') || val.includes('sluggish')) {
      agni = 'Mandagni (Low/Slow)';
      recommendations.push('Agni Deepana: Hingwashtak churna, light freshly cooked meals, Takra (buttermilk).');
    }
  }

  // Dominant Prakriti Determination
  let dominant: DoshaAssessment['dominant_prakriti'] = 'Vata-Pitta';
  const maxScore = Math.max(vata, pitta, kapha);

  if (vata > pitta && vata > kapha) {
    dominant = 'Vata';
    recommendations.push('Vata pacifying diet: Warm, unctuous foods, sesame oil abhyanga, regular routine.');
  } else if (pitta > vata && pitta > kapha) {
    dominant = 'Pitta';
    recommendations.push('Pitta pacifying diet: Cool, sweet, bitter foods, ghee, avoid excessive heat.');
  } else if (kapha > vata && kapha > pitta) {
    dominant = 'Kapha';
    recommendations.push('Kapha pacifying diet: Warm, light, pungent, dry foods, regular active exercise.');
  } else if (vata === pitta && vata >= kapha) {
    dominant = 'Vata-Pitta';
  } else if (pitta === kapha && pitta >= vata) {
    dominant = 'Pitta-Kapha';
  } else if (vata === kapha && vata >= pitta) {
    dominant = 'Vata-Kapha';
  } else {
    dominant = 'Tridoshic';
  }

  return {
    vata_score: vata || 1,
    pitta_score: pitta || 1,
    kapha_score: kapha || 1,
    dominant_prakriti: dominant,
    agni_type: agni,
    koshta_type: koshta,
    bala: bala,
    recommendations: recommendations.length > 0 ? recommendations : ['Follow seasonal Ritucharya and Dinacharya.']
  };
}
