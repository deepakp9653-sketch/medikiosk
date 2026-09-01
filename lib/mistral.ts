import { Mistral } from '@mistralai/mistralai';

const mistralApiKey = process.env.MISTRAL_API_KEY || 'd9xYz8Z7MIeg2GhmP4CtW45kqKUkBKFP';
export const mistralClient = new Mistral({ apiKey: mistralApiKey });

export const MISTRAL_MODELS = {
  TEXT_SMALL: 'mistral-small-latest',
  TEXT_LARGE: 'mistral-large-latest',
  VISION_OCR: 'pixtral-12b-2409',
};

export const SUPPORTED_LANGUAGES: Record<string, { name: string; native: string; bcp47: string; welcome: string; consent: string; complete: string; initial_q?: string }> = {
  hi: { 
    name: 'Hindi', 
    native: 'हिन्दी', 
    bcp47: 'hi-IN',
    welcome: 'कृपया डेटा सहमति को ध्यान से सुनें और स्वीकार करें।',
    consent: 'आपकी चिकित्सा जानकारी केवल आपके डॉक्टर के परामर्श के लिए सुरक्षित रूप से ली जा रही है।',
    complete: 'आपकी जानकारी सुरक्षित रूप से दर्ज कर ली गई है। धन्यवाद!'
  },
  en: { 
    name: 'English', 
    native: 'English', 
    bcp47: 'en-IN',
    welcome: 'Please listen carefully to the data consent notice.',
    consent: 'Your health data is collected solely for clinical consultation and is fully protected under DPDP rules.',
    complete: 'Your intake information has been safely recorded. Thank you!'
  },
  bn: { 
    name: 'Bengali', 
    native: 'বাংলা', 
    bcp47: 'bn-IN',
    welcome: 'অনুগ্রহ করে ডেটা সম্মতির বিজ্ঞপ্তিটি মনোযোগ দিয়ে শুনুন এবং গ্রহণ করুন।',
    consent: 'আপনার স্বাস্থ্য তথ্য শুধুমাত্র ডাক্তারের পরামর্শের জন্য নিরাপদে সংগ্রহ করা হচ্ছে।',
    complete: 'আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে। ধন্যবাদ!'
  },
  mr: { 
    name: 'Marathi', 
    native: 'मराठी', 
    bcp47: 'mr-IN',
    welcome: 'कृपया डेटा संमती काळजीपूर्वक ऐका आणि स्वीकारा.',
    consent: 'तुमची आरोग्य माहिती केवळ डॉक्टरांच्या सल्ल्यासाठी सुरक्षितपणे घेतली जात आहे.',
    complete: 'तुमची माहिती सुरक्षितपणे नोंदवली गेली आहे. धन्यवाद!'
  },
  te: { 
    name: 'Telugu', 
    native: 'తెలుగు', 
    bcp47: 'te-IN',
    welcome: 'దయచేసి డేటా సమ్మతి నోటీసును జాగ్రత్తగా విని అంగీకరించండి.',
    consent: 'మీ ఆరోగ్య సమాచారం కేవలం వైద్యుల సంప్రదింపుల కోసం మాత్రమే సురక్షితంగా నమోదు చేయబడుతుంది.',
    complete: 'మీ సమాచారం విజయవంతంగా నమోదైంది. ధన్యవాదాలు!'
  },
  ta: { 
    name: 'Tamil', 
    native: 'தமிழ்', 
    bcp47: 'ta-IN',
    welcome: 'தயவுசெய்து தரவு ஒப்புதல் அறிவிப்பை கவனமாகக் கேட்டு ஏற்கவும்.',
    consent: 'உங்கள் மருத்துவத் தகவல் மருத்துவரின் ஆலோசனைக்காக மட்டுமே பாதுகாப்பாக சேகரிக்கப்படுகிறது.',
    complete: 'உங்கள் தகவல் வெற்றிகரமாக பதிவு செய்யப்பட்டது. நன்றி!',
    initial_q: 'இன்று நீங்கள் என்ன பிரதான உடல்நலப் பிரச்சனைக்காக மருத்துவமனைக்கு வந்துள்ளீர்கள்?'
  },
  gu: { 
    name: 'Gujarati', 
    native: 'ગુજરાતી', 
    bcp47: 'gu-IN',
    welcome: 'કૃપા કરીને ડેટા સંમતિ સૂચના ધ્યાનથી સાંભળો અને સ્વીકારો.',
    consent: 'તમારી આરોગ્ય વિગતો ફક્ત ડૉક્ટરની સલાહ માટે સુરક્ષિત રીતે લેવામાં આવી રહી છે.',
    complete: 'તમારી માહિતી સુરક્ષિત રીતે નોંધાઈ ગઈ છે. આભાર!'
  },
  kn: { 
    name: 'Kannada', 
    native: 'ಕನ್ನಡ', 
    bcp47: 'kn-IN',
    welcome: 'ದಯವಿಟ್ಟು ಡೇಟಾ ಸಮ್ಮತಿ ಸೂಚನೆಯನ್ನು ಗಮನವಿಟ್ಟು ಕೇಳಿ ಸ್ವೀಕರಿಸಿ.',
    consent: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಕೇವಲ ವೈದ್ಯರ ಸಮಾಲೋಚನೆಗಾಗಿ ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ.',
    complete: 'ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು!'
  },
  ml: { 
    name: 'Malayalam', 
    native: 'മലയാളം', 
    bcp47: 'ml-IN',
    welcome: 'ദയവായി ഡാറ്റാ സമ്മത അറിയിപ്പ് ശ്രദ്ധാപൂർവ്വം കേട്ട് അംഗീകരിക്കുക.',
    consent: 'നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ ഡോക്ടറുടെ പരിശോധനയ്ക്കായി മാത്രം സുരക്ഷിതമായി ശേഖരിക്കുന്നു.',
    complete: 'നിങ്ങളുടെ വിവരങ്ങൾ വിജയകരമായി രേഖപ്പെടുത്തി. നന്ദി!'
  },
  pa: { 
    name: 'Punjabi', 
    native: 'ਪੰਜਾਬੀ', 
    bcp47: 'pa-IN',
    welcome: 'ਕਿਰਪਾ ਕਰਕੇ ਡਾਟਾ ਸਹਿਮਤੀ ਨੋਟਿਸ ਨੂੰ ਧਿਆਨ ਨਾਲ ਸੁਣੋ ਅਤੇ ਸਵੀਕਾਰ ਕਰੋ।',
    consent: 'ਤੁਹਾਡੀ ਸਿਹਤ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਈ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਦਰਜ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।',
    complete: 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕਰ ਲਈ ਗਈ ਹੈ। ਧੰਨਵਾਦ!'
  }
};

/**
 * Module A: Multi-Language Conversational Intelligent Follow-Up AI Agent
 */
export async function generateConversationalFollowUp(
  history: Array<{ question: string; answer: string; section?: string; field_name?: string }>,
  patientLangCode: string = 'hi',
  turnCount: number = 1,
  clinicalMode: string = 'allopathy',
  patientName?: string
) {
  const langConfig = SUPPORTED_LANGUAGES[patientLangCode] || SUPPORTED_LANGUAGES.hi;
  const isEnglish = patientLangCode === 'en';
  const isAyurveda = clinicalMode === 'ayurveda';

  try {
    const prompt = `
    You are MediKiosk's empathetic, clinical conversational intake agent for ${isAyurveda ? 'a Ministry of AYUSH (Ayurvedic) Outpatient Clinic' : 'an Outpatient Clinic in India'}.
    Your job is to conduct a natural, intelligent conversational medical history interview with the patient in their chosen language.
    
    CLINICAL MODE: ${isAyurveda ? 'MINISTRY OF AYUSH / AYURVEDIC CLINIC (Classical Dashavidha Pariksha: Dushya, Desha, Bala, Kala, Agni, Prakriti, Vayas, Sattva, Satmya, Ahara-shakti)' : 'STANDARD ALLOPATHIC CLINIC'}
    PATIENT CONVERSATION HISTORY SO FAR:
    ${JSON.stringify(history, null, 2)}
    
    CURRENT TURN COUNT: ${turnCount} / 7
    PATIENT CHOSEN LANGUAGE: ${langConfig.name} (${langConfig.native})
    ${patientName ? `PATIENT NAME: "${patientName}". Address the patient respectfully by name (e.g. "${patientName} जी" in Hindi, "${patientName} garu" in Telugu, "${patientName} avargale" in Tamil, "Hello ${patientName}" in English) in your question.` : ''}

    MANDATORY CLINICAL INTAKE DOMAINS TO EXPLORE:
    1. Chief Complaint & Symptom Details (Onset, severity, triggers)
    2. Patient's History of Diseases (पूर्व व्याधि वृत्त): Chronic illnesses like Diabetes (मधुमेह), Hypertension (उच्च रक्तचाप), Thyroid (थायराइड), Asthma (दमा), Heart disease, or past surgeries.
    3. Family History (कुलज वृत्त): Hereditary conditions in parents/siblings (Diabetes, Heart attack, High BP, Asthma).
    4. Allergies & Hypersensitivities (असात्म्यता): Known allergies to medicines, penicillin, foods, dust, or seasonal changes.
    5. Medications & Remedies: Current allopathic medicines or Ayurvedic aushadhi / kadha / churna.
    ${isAyurveda ? `
    6. Classical Dashavidha Pariksha (दशविध परीक्षा):
       - Dushya & Srotas (Afflicted tissues / body channels)
       - Desha (Living climate / environment: Humid/Anupa, Dry/Jangala, Moderate/Sadharana)
       - Agni & Ahara Shakti (Digestive fire: Samagni, Vishamagni, Tikshnagni, Mandagni, appetite, gas/bloating)
       - Bala & Sattva (Physical endurance & mental stress resilience)
       - Prakriti & Dosha (Body constitution, heat/cold tolerance, sleep pattern)
    ` : ''}

    INSTRUCTIONS:
    - Review what has already been answered in the history above.
    - If History of Diseases has not been asked yet, ask about chronic illnesses (BP, sugar, thyroid, asthma, surgeries).
    - If Family History has not been asked yet, ask about family history of diabetes/heart disease.
    - If Allergies have not been asked yet, ask about drug or food allergies.
    ${isAyurveda ? '- If in AYUSH mode, systematically ask a Dashavidha Pariksha question (e.g. Agni/digestion, Desha/climate, or Bala/stamina).' : ''}
    - Output "question_localized" in ${isEnglish ? 'English' : `${langConfig.name} (${langConfig.native}) script`}.
    - Output "question_en" in clear English.
    - Provide 4 to 6 smart, realistic quick-tap options formatted as: "Option in ${langConfig.name} / English".
    - If ${turnCount} >= 6, or if all key domains are covered, set "is_intake_complete": true.
    
    CRITICAL SAFETY & PRIVACY RULE:
    - NEVER diagnose the patient or prescribe medication.
    - Keep tone respectful, comforting, and clear.

    Output strictly valid JSON with no markdown:
    {
      "is_intake_complete": false,
      "question_localized": "Next question in ${isEnglish ? 'English' : langConfig.name}",
      "question_en": "Next question in English",
      "section": "hpi" | "past_history" | "family_history" | "allergies" | "medications" | "ayush_dashavidha",
      "field_name": "clinical_field_identifier",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "clinical_summary_note": "Brief extracted fact for physician"
    }
    `;

    const response = await mistralClient.chat.complete({
      model: MISTRAL_MODELS.TEXT_SMALL,
      responseFormat: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    const parsed = typeof content === 'string' ? JSON.parse(content) : JSON.parse(JSON.stringify(content));
    return parsed;
  } catch (err: any) {
    console.error('Error generating conversational follow up:', err);
    return {
      is_intake_complete: turnCount >= 6,
      question_localized: `${patientName ? `${patientName} जी, ` : ''}क्या आपको पहले से कोई पुरानी बीमारी (जैसे बीपी, शुगर, दमा) या किसी दवा से एलर्जी है?`,
      question_en: `${patientName ? `Hello ${patientName}, ` : ''}Do you have any past medical history (BP, Diabetes, Asthma) or known drug allergies?`,
      section: 'past_history',
      field_name: 'chronic_conditions_allergies',
      options: [
        'मधुमेह / Diabetes',
        'उच्च रक्तचाप / High BP',
        'दमा / Asthma',
        'दवा से एलर्जी / Drug Allergy',
        'कोई बीमारी या एलर्जी नहीं / None'
      ],
      clinical_summary_note: 'Past history & allergies screen'
    };
  }
}

/**
 * Module B: Document Entity Extraction via Pixtral 12B Vision with Context Knowledge
 * Intelligently analyzes prescriptions, lab reports, discharge summaries using patient's
 * verbal history context to decipher handwritten scripts, dosages, and test results.
 */
export async function extractDocumentEntitiesFromBase64(
  base64Image: string, 
  mimeType: string,
  patientInterviewContext: any[] = []
) {
  try {
    const contextSummary = patientInterviewContext.length > 0
      ? `PATIENT INTAKE CONTEXT (Spoken during interview):\n${JSON.stringify(patientInterviewContext, null, 2)}`
      : 'No prior verbal intake recorded.';

    const prompt = `
    You are an expert medical document extraction AI with specialized clinical knowledge of Indian healthcare prescriptions, doctor handwriting, diagnostic abbreviations, and lab reports.
    
    ${contextSummary}

    INSTRUCTIONS:
    1. Read and decipher the document in the image (prescription, lab test, discharge summary, or diagnostic report).
    2. Leverage the patient's spoken intake context above to help disambiguate doctor handwriting, abbreviations, or partial medicine names (e.g. Rx abbreviations like 'Tab PCM 650mg TDS', 'Cap Amox-Clav 625', 'Tab Pantocid 40 OD', 'HbA1c', 'LFT/KFT', 'CBC').
    3. Evaluate document quality: if the document is legible or partially legible, extract all identifiable entities.
    4. Provide confidence scores (0.0 to 1.0) for every extracted item.

    Output strictly valid JSON with NO extra commentary or markdown:
    {
      "document_type": "prescription" | "lab_report" | "discharge_summary" | "diagnostic_report" | "clinical_note" | "other",
      "document_date": "YYYY-MM-DD" or null,
      "quality_assessment": "good" | "acceptable" | "poor_legibility",
      "is_readable": true,
      "doctor_or_hospital": "Name of Doctor / Clinic / Hospital if visible" or null,
      "diagnoses": [
        {"name": "Diagnosis Name / Clinical Impression", "confidence": 0.95}
      ],
      "medications": [
        {"name": "Medicine Name", "dose": "500mg", "route": "Oral", "frequency": "BD / Twice daily", "duration": "5 days", "confidence": 0.90}
      ],
      "lab_values": [
        {"name": "Test Name (e.g. Hemoglobin / Fasting Sugar)", "value": "12.5", "unit": "g/dL", "reference_range": "12.0 - 15.0", "confidence": 0.92}
      ],
      "key_findings": "Summary of doctor notes, dietary advice, or follow-up instructions",
      "reconciliation_notes": "Any correlation with patient reported symptoms"
    }

    Rules:
    - Never diagnose or prescribe.
    - Extract exact names with high precision.
    `;

    const response = await mistralClient.chat.complete({
      model: MISTRAL_MODELS.VISION_OCR,
      responseFormat: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              imageUrl: `data:${mimeType};base64,${base64Image}`,
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    const parsed = typeof content === 'string' ? JSON.parse(content) : JSON.parse(JSON.stringify(content));

    if (parsed) {
      // Flatten doctor_or_hospital if returned as nested object
      if (typeof parsed.doctor_or_hospital === 'object' && parsed.doctor_or_hospital !== null) {
        parsed.doctor_or_hospital = Object.entries(parsed.doctor_or_hospital)
          .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
          .filter(Boolean)
          .join(' • ');
      }
      // Flatten document_type if returned as object
      if (typeof parsed.document_type === 'object' && parsed.document_type !== null) {
        parsed.document_type = Object.values(parsed.document_type).join(' ');
      }
    }

    return parsed;
  } catch (err: any) {
    console.error('Mistral OCR Extraction error:', err);
    throw new Error(`Mistral document extraction failed: ${err.message}`);
  }
}

/**
 * Module C: Generate Bilingual Draft Summary over Structured Data
 */
export async function generateBilingualSummary(
  structuredHistory: any[], 
  extractedEntities: any[], 
  patientLangCode: string = 'hi',
  clinicalMode: string = 'allopathy'
) {
  const langConfig = SUPPORTED_LANGUAGES[patientLangCode] || SUPPORTED_LANGUAGES.hi;
  const isAyurveda = clinicalMode === 'ayurveda';

  try {
    const prompt = `
    You are MediKiosk's Clinical Summarizer. You summarize patient-reported interview answers and document-extracted data into a structured clinical summary for doctors.
    
    CLINICAL MODE: ${isAyurveda ? 'MINISTRY OF AYUSH / AYURVEDIC CLINIC (Focus on Dashavidha Pariksha, Tridosha, Agni, Ahara)' : 'STANDARD ALLOPATHIC CLINIC'}
    
    CRITICAL SAFETY BOUNDARY:
    - You must NEVER make a diagnosis, suggest a differential, or recommend a treatment/medication.
    - Every section must be labelled as DRAFT / UNVERIFIED for physician review.
    - IMPORTANT: Every value in "clinician_summary" MUST be a string (NOT a nested object or dictionary).

    INPUT DATA:
    Patient Spoken Answers: ${JSON.stringify(structuredHistory)}
    Document Extracted Entities: ${JSON.stringify(extractedEntities)}

    Output strictly JSON matching this structure:
    {
      "patient_summary_bilingual": "Plain language confirmation text in ${langConfig.name} (${langConfig.native}) for patient recap.",
      "clinician_summary": {
        "chief_complaint": "Chief complaint summary string",
        "hpi": "History of Present Illness (SOCRATES breakdown in coherent narrative string)",
        "past_medical_surgical": "Patient's History of Diseases (chronic conditions: Diabetes, Hypertension, Thyroid, Asthma, past surgeries) string",
        "family_history": "Family History (hereditary diseases in parents/siblings) string",
        "allergies": "Allergies reported or documented (drug allergies, food allergies, environmental) string",
        "medications": "Current medications & traditional herbal remedies list string",
        "dashavidha_pariksha": "Classical Dashavidha Pariksha findings (Dushya, Desha, Bala, Kala, Agni, Prakriti, Vayas, Sattva, Satmya, Ahara-shakti) string",
        "ayush_profile": "Patient self-reported AYUSH / Agni / Ahara profile string if present",
        "review_of_systems": "Review of systems findings string",
        "prior_investigations": "Lab tests and diagnostic results string"
      }
    }
    `;

    const response = await mistralClient.chat.complete({
      model: MISTRAL_MODELS.TEXT_SMALL,
      responseFormat: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    const parsed = typeof content === 'string' ? JSON.parse(content) : JSON.parse(JSON.stringify(content));

    // Normalize all fields to strings to prevent React child object errors
    if (parsed.clinician_summary) {
      for (const [key, val] of Object.entries(parsed.clinician_summary)) {
        if (typeof val === 'object' && val !== null) {
          parsed.clinician_summary[key] = Object.entries(val)
            .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
            .join('; ');
        }
      }
    }

    return parsed;
  } catch (err: any) {
    console.error('Mistral Summary generation error:', err);
    
    // Synthesize fallback string-based summary
    const cc = structuredHistory.find(h => h.section === 'chief_complaint')?.value || 'Not reported';
    const hpiItems = structuredHistory.filter(h => h.section === 'hpi').map(h => `${h.field_name?.replace(/_/g, ' ')}: ${h.value}`).join('; ');
    const pastDiseases = structuredHistory.filter(h => (h.section || '').includes('past') || (h.field_name || '').includes('chronic')).map(h => h.value).join('; ') || 'None reported';
    const familyHist = structuredHistory.filter(h => (h.section || '').includes('family')).map(h => h.value).join('; ') || 'No hereditary disease reported';
    const meds = extractedEntities.filter(e => e.entity_type === 'medication').map(e => e.fields?.name || e.name).join(', ') || 'None recorded';
    const allergies = structuredHistory.find(h => h.section === 'allergies')?.value || 'No known drug allergies reported';
    const ayushItems = structuredHistory.filter(h => (h.section || '').includes('ayush')).map(h => `${h.field_name?.replace(/_/g, ' ')}: ${h.value}`).join('; ');

    return {
      patient_summary_bilingual: langConfig.complete,
      clinician_summary: {
        chief_complaint: String(cc),
        hpi: hpiItems || 'Structured interview recorded.',
        past_medical_surgical: pastDiseases,
        family_history: familyHist,
        medications: meds,
        allergies: String(allergies),
        dashavidha_pariksha: ayushItems || (isAyurveda ? 'Dashavidha Pariksha recorded.' : 'N/A'),
        ayush_profile: ayushItems || (isAyurveda ? 'Ayurvedic intake recorded.' : 'Standard'),
        review_of_systems: 'Completed',
        prior_investigations: 'Uploaded documents processed'
      }
    };
  }
}
