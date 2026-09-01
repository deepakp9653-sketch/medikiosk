/**
 * Ministry of AYUSH — Specialized Ayurvedic Clinical Framework
 * Comprehensive Ayurvedic clinical intake based on classical Dashavidha Pariksha (दशविध परीक्षा),
 * Tridosha assessment (Vata, Pitta, Kapha), Agni classification, Ahara/Vihara, and traditional pharmacopoeia.
 *
 * Classical Reference: Charaka Samhita Vimana Sthana 8/94:
 * "दूष्यं देशं बलं कालं अनलं प्रकृतिं वयः। सत्त्वं सात्म्यं तथाऽऽहारं अवस्थाश्च पृथग्विधाः॥"
 */

export interface DashavidhaPariksha {
  dushya: string;         // 1. Tissues/Dhatus & Malas afflicted (Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra, Mala)
  desha: string;          // 2. Habitat & Climate (Anupa / Humid, Jangala / Arid, Sadharana / Moderate)
  bala: string;           // 3. Physical Strength & Immunity (Pravara / High, Madhyama / Medium, Avara / Low)
  kala: string;           // 4. Chronobiology & Seasonal Influence (Ritu, Diurnal peak, Avastha)
  anala_agni: string;     // 5. Digestive Fire Status (Samagni, Vishamagni, Tikshnagni, Mandagni)
  prakriti: string;       // 6. Constitutional Baseline (Vata, Pitta, Kapha, Dwandvaja, Tridoshic)
  vayas: string;          // 7. Life Stage / Age (Balya <16, Madhyama 16-60, Vriddha >60)
  sattva: string;         // 8. Mental Temperament & Resilience (Pravara / Strong, Madhyama, Avara / Sensitive)
  satmya: string;         // 9. Habituation & Dietary Compatibility (Oka-satmya, Food sensitivities)
  ahara_shakti: string;   // 10. Ingestion & Digestion Power (Abhyavaharana & Jarana Shakti)
  recommendations: string[];
}

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
    dashavidha_dimension: 'Prakriti',
    question_localized: {
      en: 'What best describes your body build and weight tendency (Prakriti)?',
      hi: 'आपके शरीर की स्वाभाविक बनावट और वजन की प्रवृत्ति क्या है (प्रकृति)?',
      bn: 'আপনার শরীরের গঠন এবং ওজনের ধরণ কোনটি (প্রকৃতি)?',
      mr: 'तुमच्या शरीराची रचना आणि वजनाची प्रवृत्ती कोणती आहे (प्रकृती)?',
      te: 'మీ శరీర నిర్మాణం మరియు బరువు లక్షణం ఏమిటి (ప్రకృతి)?',
      ta: 'உங்கள் உடல் அமைப்பு மற்றும் எடை பண்பு என்ன (பிரகிருதி)?',
      gu: 'તમારા શરીરનું બંધારણ અને વજનની પ્રવૃત્તિ શું છે (પ્રકૃતિ)?',
      kn: 'ನಿಮ್ಮ ದೇಹ ರಚನೆ ಮತ್ತು ತೂಕದ ಲಕ್ಷಣ ಯಾವುದು (ಪ್ರಕೃತಿ)?',
      ml: 'നിങ്ങളുടെ ശരീരഘടനയും ഭാരപ്രവണതയും ഏതാണ് (പ്രകൃതി)?',
      pa: 'ਤੁਹਾਡੇ ਸਰੀਰ ਦੀ ਬਣਤਰ ਅਤੇ ਭਾਰ ਦੀ ਪ੍ਰਵਿਰਤੀ ਕੀ ਹੈ (ਪ੍ਰਕਿਰਤੀ)?'
    },
    question_en: 'What best describes your body build and weight tendency (Prakriti)?',
    options_by_lang: {
      en: [
        'Lean / Slender, dry skin, quick movements (Vata)',
        'Medium build, athletic, easily perspires, warm body (Pitta)',
        'Broad / Heavy build, smooth skin, calm temperament (Kapha)',
        'Dual / Mixed characteristics'
      ],
      hi: [
        'दुबला-पतला, सूखी त्वचा, चंचल स्वभाव (वात / Vata)',
        'मध्यम शरीर, आसानी से पसीना, गर्मी लगना (पित्त / Pitta)',
        'मजबूत-भारी शरीर, चिकनी त्वचा, शांत स्वभाव (कफ / Kapha)',
        'द्विदोषज / मिश्रित लक्षण'
      ]
    }
  },
  {
    id: 'ayush_agni_digestion',
    section: 'ayush_agni',
    field_name: 'digestive_fire_agni',
    dashavidha_dimension: 'Anala / Agni',
    question_localized: {
      en: 'How is your digestive fire and appetite (Agni & Ahara Shakti)?',
      hi: 'आपकी पाचन शक्ति और भूख कैसी रहती है (अग्नि व आहार शक्ति)?',
      bn: 'আপনার হজম শক্তি এবং ক্ষুধা কেমন (অগ্নি ও আহার শক্তি)?',
      mr: 'तुमची पचनशक्ती आणि भूक कशी आहे (अग्नि व आहार शक्ती)?',
      te: 'మీ జీర్ణశక్తి మరియు ఆకలి ఎలా ఉంటుంది (అగ్ని & ఆహార శక్తి)?',
      ta: 'உங்கள் செரிமான சக்தி மற்றும் பசி எவ்வாறு உள்ளது (அக்னி & ஆகார சக்தி)?',
      gu: 'તમારી પાચનશક્તિ અને ભૂખ કેવી રહે છે (અગ્નિ અને આહાર શક્તિ)?',
      kn: 'ನಿಮ್ಮ ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಹಸಿವು ಹೇಗಿದೆ (ಅಗ್ನಿ & ಆಹಾರ ಶಕ್ತಿ)?',
      ml: 'നിങ്ങളുടെ ദഹനവും വിശപ്പും എങ്ങനെയാണ് (അഗ്നി & ആഹാര ശക്തി)?',
      pa: 'ਤੁਹਾਡੀ ਪਾਚਨ ਸ਼ਕਤੀ ਅਤੇ ਭੁੱਖ ਕਿਵੇਂ ਰਹਿੰਦੀ ਹੈ (ਅਗਨੀ ਤੇ ਆਹਾਰ ਸ਼ਕਤੀ)?'
    },
    question_en: 'How is your digestive fire and appetite (Agni & Ahara Shakti)?',
    options_by_lang: {
      en: [
        'Irregular appetite / Bloating & gas after meals (Vishamagni)',
        'Intense hunger / Cannot skip meals, acidity & heartburn (Tikshnagni)',
        'Slow digestion / Sluggish feeling, heaviness after food (Mandagni)',
        'Balanced appetite & easy digestion (Samagni)'
      ],
      hi: [
        'अनियमित भूख, गैस या पेट फूलना (विषमाग्नि / Vishamagni)',
        'तीव्र भूख, खाली पेट न रह पाना, जलन/एसिडिटी (तीक्ष्णाग्नि / Tikshnagni)',
        'धीमी पाचन शक्ति, भोजन के बाद भारीपन (मंदाग्नि / Mandagni)',
        'संतुलित भूख और समय पर पाचन (समाग्नि / Samagni)'
      ]
    }
  },
  {
    id: 'ayush_desha_habitat',
    section: 'ayush_desha',
    field_name: 'habitat_climate_desha',
    dashavidha_dimension: 'Desha',
    question_localized: {
      en: 'What is the climate and environment of the place you live in (Desha)?',
      hi: 'आप जिस क्षेत्र या शहर में रहते हैं, वहां का वातावरण कैसा है (देश)?',
      bn: 'আপনি যে অঞ্চলে থাকেন তার পরিবেশ ও আবহাওয়া কেমন (দেশ)?',
      mr: 'तुम्ही ज्या भागात राहता तेथील हवामान कसे आहे (देश)?',
      te: 'మీరు నివసించే ప్రాంత వాతావరణం ఎలా ఉంటుంది (దేశ)?',
      ta: 'நீங்கள் வாழும் பகுதியின் தட்பவெப்பநிலை எப்படி உள்ளது (தேசம்)?',
      gu: 'તમે જ્યાં રહો છો તે વિસ્તારનું વાતાવરણ કેવું છે (દેશ)?',
      kn: 'ನೀವು ವಾಸಿಸುವ ಸ್ಥಳದ ಹವಾಮಾನ ಹೇಗಿದೆ (ದೇಶ)?',
      ml: 'നിങ്ങൾ താമസിക്കുന്ന സ്ഥലത്തെ കാലാവസ്ഥ എങ്ങനെയാണ് (ദേശം)?',
      pa: 'ਤੁਸੀਂ ਜਿਸ ਇਲਾਕੇ ਵਿੱਚ ਰਹਿੰਦੇ ਹੋ ਉੱਥੋਂ ਦਾ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਹੈ (ਦੇਸ਼)?'
    },
    question_en: 'What is the climate and environment of the place you live in (Desha)?',
    options_by_lang: {
      en: [
        'Humid / Marshy / Coastal with high moisture (Anupa Desha)',
        'Arid / Dry / Hot plains with less water (Jangala Desha)',
        'Moderate / Mixed temperate climate (Sadharana Desha)',
        'Cold hilly / Mountainous region'
      ],
      hi: [
        'नमी वाला, तटीय या दलदली क्षेत्र (अनूप देश / Anupa)',
        'गर्म, शुष्क या रेतीला सूखा मैदान (जांगल देश / Jangala)',
        'मध्यम व सामान्य जलवायु वाला क्षेत्र (साधारण देश / Sadharana)',
        'पहाड़ी या अधिक ठंडा क्षेत्र'
      ]
    }
  },
  {
    id: 'ayush_bala_sattva',
    section: 'ayush_bala',
    field_name: 'strength_mental_resilience',
    dashavidha_dimension: 'Bala & Sattva',
    question_localized: {
      en: 'How is your physical endurance and mental stress tolerance (Bala & Sattva)?',
      hi: 'आपकी शारीरिक सहनशक्ति और मानसिक तनाव सहने की क्षमता कैसी है (बल व सत्त्व)?',
      bn: 'আপনার শারীরিক শক্তি এবং মানসিক চাপ সহ্য করার ক্ষমতা কেমন (বল ও সত্ত্ব)?',
      mr: 'तुमची शारीरिक सहनशीलता आणि मानसिक ताण सहन करण्याची क्षमता कशी आहे (बल व सत्त्व)?',
      te: 'మీ శారీరక బలం మరియు మానసిక ఒత్తిడిని తట్టుకునే శక్తి ఎలా ఉంది (బల & సత్త్వ)?',
      ta: 'உங்கள் உடல் பலம் மற்றும் மன அமைதி / மனோதைரியம் எவ்வாறு உள்ளது (பலம் & சத்துவம்)?',
      gu: 'તમારી શારીરિક સહનશક્તિ અને માનસિક તણાવ સહન કરવાની ક્ષમતા કેવી છે (બળ અને સત્ત્વ)?',
      kn: 'ನಿಮ್ಮ ದೈಹಿಕ ಶಕ್ತಿ ಮತ್ತು ಮಾನಸಿಕ ಒತ್ತಡ ತಡೆದುಕೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯ ಹೇಗಿದೆ (ಬಲ & ಸತ್ತ್ವ)?',
      ml: 'നിങ്ങളുടെ ശാരീരിക കരുത്തും മാനസിക ക്ഷമതയും എങ്ങനെയാണ് (ബലം & സത്വം)?',
      pa: 'ਤੁਹਾਡੀ ਸਰੀਰਕ ਸਹਿਣਸ਼ਕਤੀ ਅਤੇ ਮਾਨਸਿਕ ਤਣਾਅ ਸਹਿਣ ਦੀ ਤਾਕਤ ਕਿਵੇਂ ਹੈ (ਬਲ ਤੇ ਸੱਤਵ)?'
    },
    question_en: 'How is your physical endurance and mental stress tolerance (Bala & Sattva)?',
    options_by_lang: {
      en: [
        'High stamina, calm mind, easily handles pain (Pravara Bala/Sattva)',
        'Moderate stamina, manageable stress (Madhyama Bala/Sattva)',
        'Easily fatigued, prone to worry, low tolerance to pain (Avara Bala/Sattva)',
        'Constantly stressed or fatigued'
      ],
      hi: [
        'उत्तम सहनशक्ति, शांत मन, दर्द सहने में सक्षम (प्रवर बल व सत्त्व)',
        'मध्यम सहनशक्ति, सामान्य तनाव (मध्यम बल व सत्त्व)',
        'जल्दी थकान, चिंता/घबराहट, कम सहनशीलता (अवर बल व सत्त्व)',
        'अत्यधिक मानसिक तनाव या निरंतर कमजोरी'
      ]
    }
  },
  {
    id: 'ayush_traditional_meds',
    section: 'ayush_aushadhi',
    field_name: 'traditional_home_remedies',
    dashavidha_dimension: 'Satmya & Aushadhi',
    question_localized: {
      en: 'Are you taking any Ayurvedic medicines, herbal teas, or home remedies (Aushadhi / Kashayam / Kadha)?',
      hi: 'क्या आप कोई आयुर्वेदिक दवा, काढ़ा, चूर्ण या घरेलू उपचार ले रहे हैं (औषधि/सात्म्य)?',
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

/**
 * Compute Complete 10-Fold Dashavidha Pariksha (दशविध परीक्षा)
 */
export function computeDashavidhaPariksha(history: any[] = [], sessionInfo: any = {}): DashavidhaPariksha {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  let dushya = 'Rasa Dhatu (Lymph/Plasma), Rakta Dhatu (Blood circulation)';
  let desha = 'Sadharana Desha (Moderate temperate habitat)';
  let bala = 'Madhyama Bala (Moderate physical stamina & immunity)';
  let kala = 'Sharad / Varsha Ritu (Current seasonal and diurnal stage)';
  let anala_agni = 'Samagni (Balanced digestion & metabolism)';
  let prakriti = 'Vata-Pitta Prakriti';
  let vayas = 'Madhyama Vayas (Adult 16-60 yrs)';
  let sattva = 'Madhyama Sattva (Moderate psychological resilience)';
  let satmya = 'Oka-satmya (Habituated to seasonal home-cooked Indian diet)';
  let ahara_shakti = 'Madhyama Abhyavaharana Shakti & Jarana Shakti (Moderate intake & digestion)';
  const recommendations: string[] = [];

  // Inspect patient age for Vayas
  const ageNum = parseInt(String(sessionInfo?.age || '35'), 10);
  if (!isNaN(ageNum)) {
    if (ageNum < 16) {
      vayas = 'Balya Vayas (Childhood / Kapha predominant phase of growth)';
    } else if (ageNum > 60) {
      vayas = 'Vriddha Vayas (Geriatric / Vata predominant phase, requires nourishing Rasayana)';
    } else {
      vayas = 'Madhyama Vayas (Adult 16-60 yrs / Pitta predominant phase of life)';
    }
  }

  // Parse structured history items
  for (const item of history) {
    const val = (item.value || '').toLowerCase();
    const field = (item.field_name || '').toLowerCase();

    // Dushya analysis
    if (val.includes('fever') || val.includes('ताप') || val.includes('ज्वर')) {
      dushya = 'Rasa Dhatu (Rasa-gata Jwara), Sweda Vaha Srotas';
    } else if (val.includes('chest') || val.includes('छाती') || val.includes('pain') || val.includes('heart')) {
      dushya = 'Rasa-Rakta Dhatu, Hridaya / Pranavaha Srotas';
    } else if (val.includes('stomach') || val.includes('पेट') || val.includes('gas') || val.includes('acidity')) {
      dushya = 'Annavaha & Purishavaha Srotas, Koshta';
    } else if (val.includes('joint') || val.includes('कमर') || val.includes('जोड़ों') || val.includes('back')) {
      dushya = 'Asthi & Majja Dhatu, Sandhi (Sandhigata Vata / Amavata)';
    }

    // Desha analysis
    if (val.includes('anupa') || val.includes('अनूप') || val.includes('humid') || val.includes('coastal') || val.includes('नमी')) {
      desha = 'Anupa Desha (Humid / Marshy coastal terrain — Kapha-Vata aggravation potential)';
      recommendations.push('Desha Adaptation: In humid/coastal areas, consume dry, warm spices (Trikatu, Shunthi) to counter Kapha dampness.');
    } else if (val.includes('jangala') || val.includes('जांगल') || val.includes('arid') || val.includes('dry') || val.includes('शुष्क')) {
      desha = 'Jangala Desha (Arid / Dry terrain — Vata-Pitta aggravation potential)';
      recommendations.push('Desha Adaptation: In dry/arid climates, use unctuous sneha (pure cow ghee, milk) and hydration.');
    } else if (val.includes('sadharana') || val.includes('साधारण') || val.includes('moderate')) {
      desha = 'Sadharana Desha (Balanced temperate habitat with moderate seasonal variations)';
    }

    // Agni analysis
    if (val.includes('vishamagni') || val.includes('विषमाग्नि') || val.includes('bloat') || val.includes('irregular')) {
      anala_agni = 'Vishamagni (Irregular digestive fire — Vata aggravation)';
      ahara_shakti = 'Vishamahara Shakti (Fluctuating ingestion and slow gas-forming digestion)';
      recommendations.push('Deepana-Pachana: Warm ginger water, Hingwashtak churna before food to stabilize Vishamagni.');
      vata += 2;
    } else if (val.includes('tikshnagni') || val.includes('तीक्ष्णाग्नि') || val.includes('acid') || val.includes('intense') || val.includes('जलन')) {
      anala_agni = 'Tikshnagni (Intense / Acidic digestive fire — Pitta aggravation)';
      ahara_shakti = 'Tikshna Ahara Shakti (Rapid digestion with hyperacidity and burning)';
      recommendations.push('Pitta Shamana: Amla, Dhania-Jeera water, avoid excessively pungent/fermented foods.');
      pitta += 2;
    } else if (val.includes('mandagni') || val.includes('मंदाग्नि') || val.includes('slow') || val.includes('sluggish') || val.includes('भारीपन')) {
      anala_agni = 'Mandagni (Sluggish digestive fire — Kapha aggravation & Ama formation)';
      ahara_shakti = 'Mandahara Shakti (Delayed gastric emptying, post-meal heaviness)';
      recommendations.push('Agni Deepana: Trikatu churna, light freshly cooked Laghu Ahara, avoid cold/heavy dairy.');
      kapha += 2;
    } else if (val.includes('samagni') || val.includes('समाग्नि') || val.includes('balanced')) {
      anala_agni = 'Samagni (Equilibrium of digestive fire & enzymatic metabolic strength)';
      ahara_shakti = 'Pravara Ahara Shakti (Healthy appetite and optimal assimilation)';
    }

    // Bala & Sattva
    if (val.includes('pravara') || val.includes('प्रवर') || val.includes('high') || val.includes('stamina')) {
      bala = 'Pravara Bala (Robust immune resilience & high physical vitality / Sahaja Bala)';
      sattva = 'Pravara Sattva (Strong mental resilience, patient, positive coping capacity)';
    } else if (val.includes('avara') || val.includes('अवर') || val.includes('fatigue') || val.includes('कमजोरी') || val.includes('चिंता')) {
      bala = 'Avara Bala (Diminished vitality, low physical reserve, easily exhausted)';
      sattva = 'Avara Sattva (Sensitive temperament, anxious, low pain tolerance, needs reassurance)';
      recommendations.push('Sattvavajaya & Rasayana: Ashwagandha / Brahmi preparations for mental tranquility and Ojas rejuvenation.');
      vata += 1;
    }

    // Prakriti markers
    if (val.includes('lean') || val.includes('वात') || val.includes('dry') || val.includes('broken')) {
      vata += 2;
    }
    if (val.includes('athletic') || val.includes('पित्त') || val.includes('sweat') || val.includes('warm')) {
      pitta += 2;
    }
    if (val.includes('heavy') || val.includes('कफ') || val.includes('smooth') || val.includes('calm')) {
      kapha += 2;
    }
  }

  // Determine dominant Prakriti
  if (vata > pitta && vata > kapha) {
    prakriti = 'Vataja Prakriti (Dominant Vata dosha)';
  } else if (pitta > vata && pitta > kapha) {
    prakriti = 'Pittaja Prakriti (Dominant Pitta dosha)';
  } else if (kapha > vata && kapha > pitta) {
    prakriti = 'Kaphaja Prakriti (Dominant Kapha dosha)';
  } else if (vata >= 2 && pitta >= 2) {
    prakriti = 'Vata-Pitta Dwandvaja Prakriti';
  } else if (pitta >= 2 && kapha >= 2) {
    prakriti = 'Pitta-Kapha Dwandvaja Prakriti';
  } else if (vata >= 2 && kapha >= 2) {
    prakriti = 'Vata-Kapha Dwandvaja Prakriti';
  } else {
    prakriti = 'Sama-Tridoshaja Prakriti (Balanced Tri-Dosha)';
  }

  if (recommendations.length === 0) {
    recommendations.push('Follow Ayurvedic Dinacharya (daily regimen), seasonal Ritucharya, and mindful diet (Pathya-Apathya).');
  }

  return {
    dushya,
    desha,
    bala,
    kala,
    anala_agni,
    prakriti,
    vayas,
    sattva,
    satmya,
    ahara_shakti,
    recommendations
  };
}

export function computeDoshaScore(history: any[]): DoshaAssessment {
  const dashavidha = computeDashavidhaPariksha(history);
  
  let vata = 1;
  let pitta = 1;
  let kapha = 1;

  for (const item of history) {
    const val = (item.value || '').toLowerCase();
    if (val.includes('vata') || val.includes('वात') || val.includes('lean') || val.includes('gas') || val.includes('bloat')) vata += 2;
    if (val.includes('pitta') || val.includes('पित्त') || val.includes('acid') || val.includes('sharp') || val.includes('sweat')) pitta += 2;
    if (val.includes('kapha') || val.includes('कफ') || val.includes('heavy') || val.includes('solid') || val.includes('slow')) kapha += 2;
  }

  let dominant: DoshaAssessment['dominant_prakriti'] = 'Vata-Pitta';
  if (vata > pitta && vata > kapha) dominant = 'Vata';
  else if (pitta > vata && pitta > kapha) dominant = 'Pitta';
  else if (kapha > vata && kapha > pitta) dominant = 'Kapha';
  else if (vata === pitta) dominant = 'Vata-Pitta';
  else if (pitta === kapha) dominant = 'Pitta-Kapha';
  else dominant = 'Tridoshic';

  let agniType: DoshaAssessment['agni_type'] = 'Samagni (Balanced)';
  if (dashavidha.anala_agni.includes('Visham')) agniType = 'Vishamagni (Irregular)';
  else if (dashavidha.anala_agni.includes('Tikshn')) agniType = 'Tikshnagni (Intense/Sharp)';
  else if (dashavidha.anala_agni.includes('Mand')) agniType = 'Mandagni (Low/Slow)';

  return {
    vata_score: vata,
    pitta_score: pitta,
    kapha_score: kapha,
    dominant_prakriti: dominant,
    agni_type: agniType,
    koshta_type: 'Madhyama (Medium)',
    bala: dashavidha.bala.includes('Pravara') ? 'Pravara (High)' : dashavidha.bala.includes('Avara') ? 'Avara (Low)' : 'Madhyama (Medium)',
    recommendations: dashavidha.recommendations
  };
}
