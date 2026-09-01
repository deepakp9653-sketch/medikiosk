import { Mistral } from '@mistralai/mistralai';

const mistralApiKey = process.env.MISTRAL_API_KEY || 'd9xYz8Z7MIeg2GhmP4CtW45kqKUkBKFP';
export const mistralClient = new Mistral({ apiKey: mistralApiKey });

export const MISTRAL_MODELS = {
  TEXT_SMALL: 'mistral-small-latest',
  TEXT_LARGE: 'mistral-large-latest',
  VISION_OCR: 'pixtral-12b-2409',
};

export const SUPPORTED_LANGUAGES: Record<string, { 
  name: string; 
  native: string; 
  bcp47: string; 
  welcome: string; 
  consent: string; 
  complete: string; 
  name_q: string;
  gender_q: string;
  gender_options: string[];
  age_q: string;
  age_options: string[];
  initial_q: string;
  initial_options: string[];
  fallback_q: string;
  fallback_options: string[];
}> = {
  hi: { 
    name: 'Hindi', 
    native: 'हिन्दी', 
    bcp47: 'hi-IN',
    welcome: 'कृपया डेटा सहमति को ध्यान से सुनें और स्वीकार करें।',
    consent: 'आपकी चिकित्सा जानकारी केवल आपके डॉक्टर के परामर्श के लिए सुरक्षित रूप से ली जा रही है।',
    complete: 'आपकी जानकारी सुरक्षित रूप से दर्ज कर ली गई है। धन्यवाद!',
    name_q: 'कृपया अपना पूरा नाम बताएं या लिखें:',
    gender_q: 'आपका लिंग (जेंडर) क्या है?',
    gender_options: ['पुरुष / Male', 'महिला / Female', 'अन्य / Other'],
    age_q: 'आपकी उम्र कितनी है (वर्षों में)?',
    age_options: ['18 वर्ष से कम', '18 - 30 वर्ष', '31 - 45 वर्ष', '46 - 60 वर्ष', '60 वर्ष से अधिक'],
    initial_q: 'आज आप अस्पताल किस मुख्य बीमारी या तकलीफ के लिए आए हैं?',
    initial_options: ['छाती में दर्द या भारीपन', 'तेज बुखार या कंपकंपी', 'पेट दर्द या अपच', 'खांसी व सांस लेने में तकलीफ', 'सिरदर्द या चक्कर आना', 'कमर या जोड़ों में तेज दर्द', 'अन्य कोई तकलीफ'],
    fallback_q: 'क्या आपको कोई अन्य लक्षण या दर्द महसूस हो रहा है?',
    fallback_options: ['हाँ / Yes', 'नहीं / No', 'पता नहीं / Not sure']
  },
  en: { 
    name: 'English', 
    native: 'English', 
    bcp47: 'en-IN',
    welcome: 'Please listen carefully to the data consent notice.',
    consent: 'Your health data is collected solely for clinical consultation and is fully protected under DPDP rules.',
    complete: 'Your intake information has been safely recorded. Thank you!',
    name_q: 'Please state or enter your full name:',
    gender_q: 'What is your gender?',
    gender_options: ['Male', 'Female', 'Other / Prefer not to say'],
    age_q: 'What is your age in years?',
    age_options: ['Under 18', '18 - 30 years', '31 - 45 years', '46 - 60 years', 'Over 60 years'],
    initial_q: 'What primary symptom or health complaint brings you to the clinic today?',
    initial_options: ['Chest pain or tightness', 'High fever or chills', 'Stomach ache or acidity', 'Cough & difficulty breathing', 'Severe headache or dizziness', 'Joint or back pain', 'Other health concern'],
    fallback_q: 'Do you feel any other symptoms, discomfort, or pain?',
    fallback_options: ['Yes', 'No', 'Not sure']
  },
  bn: { 
    name: 'Bengali', 
    native: 'বাংলা', 
    bcp47: 'bn-IN',
    welcome: 'অনুগ্রহ করে ডেটা সম্মতির বিজ্ঞপ্তিটি মনোযোগ দিয়ে শুনুন এবং গ্রহণ করুন।',
    consent: 'আপনার স্বাস্থ্য তথ্য শুধুমাত্র ডাক্তারের পরামর্শের জন্য নিরাপদে সংগ্রহ করা হচ্ছে।',
    complete: 'আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে। ধন্যবাদ!',
    name_q: 'অনুগ্রহ করে আপনার পুরো নাম বলুন বা লিখুন:',
    gender_q: 'আপনার লিঙ্গ কী?',
    gender_options: ['পুরুষ / Male', 'মহিলা / Female', 'অন্যান্য / Other'],
    age_q: 'আপনার বয়স কত (বছরে)?',
    age_options: ['১৮ বছরের নিচে', '১৮ - ৩০ বছর', '৩১ - ৪৫ বছর', '৪৬ - ৬০ বছর', '৬০ বছরের বেশি'],
    initial_q: 'আজ আপনি প্রধানত কী শারীরিক সমস্যা বা অসুস্থতার জন্য হাসপাতালে এসেছেন?',
    initial_options: ['বুকে ব্যথা বা চাপ', 'তীব্র জ্বর বা কাঁপুনি', 'পেটে ব্যথা বা বদহজম', 'কাশি ও শ্বাসকষ্ট', 'মাথাব্যথা বা মাথা ঘোরা', 'কোমর বা অস্থিসন্ধিতে ব্যথা', 'অন্যান্য সমস্যা'],
    fallback_q: 'আপনার কি অন্য কোনো লক্ষণ বা শারীরিক কষ্ট হচ্ছে?',
    fallback_options: ['হ্যাঁ / Yes', 'না / No', 'নিশ্চিত নই / Not sure']
  },
  mr: { 
    name: 'Marathi', 
    native: 'मराठी', 
    bcp47: 'mr-IN',
    welcome: 'कृपया डेटा संमती काळजीपूर्वक ऐका आणि स्वीकारा.',
    consent: 'तुमची आरोग्य माहिती केवळ डॉक्टरांच्या सल्ल्यासाठी सुरक्षितपणे घेतली जात आहे.',
    complete: 'तुमची माहिती सुरक्षितपणे नोंदवली गेली आहे. धन्यवाद!',
    name_q: 'कृपया आपले पूर्ण नाव सांगा किंवा लिहा:',
    gender_q: 'आपले लिंग (जेंडर) काय आहे?',
    gender_options: ['पुरुष / Male', 'स्त्री / Female', 'इतर / Other'],
    age_q: 'आपले वय किती आहे (वर्षे)?',
    age_options: ['१८ वर्षांपेक्षा कमी', '१८ - ३० वर्षे', '३१ - ४५ वर्षे', '४६ - ६० वर्षे', '६० वर्षांपेक्षा जास्त'],
    initial_q: 'आज तुम्ही दवाखान्यात कोणत्या मुख्य त्रासासाठी किंवा आजारासाठी आला आहात?',
    initial_options: ['छातीत दुखणे किंवा जड वाटणे', 'तीव्र ताप किंवा थंडी', 'पोटात दुखणे किंवा गॅसेस', 'खोकला व श्वास घेण्यास त्रास', 'डोकेदुखी किंवा चक्कर', 'कंबर किंवा सांधेदुखी', 'इतर कोणताही त्रास'],
    fallback_q: 'तुम्हाला इतर कोणती लक्षणे किंवा वेदना जाणवत आहेत का?',
    fallback_options: ['होय / Yes', 'नाही / No', 'माहित नाही / Not sure']
  },
  te: { 
    name: 'Telugu', 
    native: 'తెలుగు', 
    bcp47: 'te-IN',
    welcome: 'దయచేసి డేటా సమ్మతి నోటీసును జాగ్రత్తగా విని అంగీకరించండి.',
    consent: 'మీ ఆరోగ్య సమాచారం కేవలం వైద్యుల సంప్రదింపుల కోసం మాత్రమే సురక్షితంగా నమోదు చేయబడుతుంది.',
    complete: 'మీ సమాచారం విజయవంతంగా నమోదైంది. ధన్యవాదాలు!',
    name_q: 'దయచేసి మీ పూర్తి పేరు చెప్పండి లేదా వ్రాయండి:',
    gender_q: 'మీ లింగం (జెండర్) ఏమిటి?',
    gender_options: ['పురుషుడు / Male', 'స్త్రీ / Female', 'ఇతర / Other'],
    age_q: 'మీ వయస్సు ఎంత (సంవత్సరాలలో)?',
    age_options: ['18 సంవత్సరాల కంటే తక్కువ', '18 - 30 సంవత్సరాలు', '31 - 45 సంవత్సరాలు', '46 - 60 సంవత్సరాలు', '60 సంవత్సరాల పైబడిన'],
    initial_q: 'ఈ రోజు మీరు ఆసుపత్రికి ఏ ప్రధాన సమస్య లేదా అనారోగ్యం కోసం వచ్చారు?',
    initial_options: ['ఛాతీ నొప్పి లేదా బరువుగా ఉండటం', 'తీవ్ర జ్వరం లేదా వణుకు', 'కడుపు నొప్పి లేదా అజీర్ణం', 'దగ్గు మరియు శ్వాస తీసుకోవడంలో ఇబ్బంది', 'తలనొప్పి లేదా తలతిరగడం', 'నడుము లేదా కీళ్ల నొప్పి', 'ఇతర సమస్య'],
    fallback_q: 'మీకు ఇంకా ఏవైనా ఇతర లక్షణాలు లేదా నొప్పి ఉన్నాయా?',
    fallback_options: ['అవును / Yes', 'కాదు / No', 'తెలియదు / Not sure']
  },
  ta: { 
    name: 'Tamil', 
    native: 'தமிழ்', 
    bcp47: 'ta-IN',
    welcome: 'தயவுசெய்து தரவு ஒப்புதல் அறிவிப்பை கவனமாகக் கேட்டு ஏற்கவும்.',
    consent: 'உங்கள் மருத்துவத் தகவல் மருத்துவரின் ஆலோசனைக்காக மட்டுமே பாதுகாப்பாக சேகரிக்கப்படுகிறது.',
    complete: 'உங்கள் தகவல் வெற்றிகரமாக பதிவு செய்யப்பட்டது. நன்றி!',
    name_q: 'தயவுசெய்து உங்கள் முழுப் பெயரைச் சொல்லுங்கள் அல்லது உள்ளிடுங்கள்:',
    gender_q: 'உங்கள் பாலினம் என்ன?',
    gender_options: ['ஆண் / Male', 'பெண் / Female', 'மற்றவை / Other'],
    age_q: 'உங்கள் வயது என்ன (ஆண்டுகளில்)?',
    age_options: ['18 வயதுக்குட்பட்டவர்கள்', '18 - 30 ஆண்டுகள்', '31 - 45 ஆண்டுகள்', '46 - 60 ஆண்டுகள்', '60 வயதுக்கு மேற்பட்டவர்கள்'],
    initial_q: 'இன்று நீங்கள் என்ன பிரதான உடல்நலப் பிரச்சனைக்காக மருத்துவமனைக்கு வந்துள்ளீர்கள்?',
    initial_options: ['நெஞ்சு வலி அல்லது இறுக்கம்', 'கடுமையான காய்ச்சல் அல்லது நடுக்கம்', 'வயிற்று வலி அல்லது அஜீரணம்', 'இருமல் மற்றும் மூச்சுத்திணறல்', 'தலைவலி அல்லது தலைச்சுற்றல்', 'இடுப்பு அல்லது மூட்டு வலி', 'மற்ற பிரச்சனைகள்'],
    fallback_q: 'உங்களுக்கு வேறு ஏதேனும் அறிகுறிகள் அல்லது அசௌகரியம் உள்ளதா?',
    fallback_options: ['ஆம் / Yes', 'இல்லை / No', 'தெரியவில்லை / Not sure']
  },
  gu: { 
    name: 'Gujarati', 
    native: 'ગુજરાતી', 
    bcp47: 'gu-IN',
    welcome: 'કૃપા કરીને ડેટા સંમતિ સૂચના ધ્યાનથી સાંભળો અને સ્વીકારો.',
    consent: 'તમારી આરોગ્ય વિગતો ફક્ત ડૉક્ટરની સલાહ માટે સુરક્ષિત રીતે લેવામાં આવી રહી છે.',
    complete: 'તમારી માહિતી સુરક્ષિત રીતે નોંધાઈ ગઈ છે. આભાર!',
    name_q: 'કૃપા કરીને તમારું પૂરું નામ જણાવો અથવા લખો:',
    gender_q: 'તમારું લિંગ (જેન્ડર) શું છે?',
    gender_options: ['પુરુષ / Male', 'સ્ત્રી / Female', 'અન્ય / Other'],
    age_q: 'તમારી ઉંમર કેટલી છે (વર્ષોમાં)?',
    age_options: ['18 વર્ષથી ઓછી', '18 - 30 વર્ષ', '31 - 45 વર્ષ', '46 - 60 વર્ષ', '60 વર્ષથી વધુ'],
    initial_q: 'આજે તમે કઈ મુખ્ય તકલીફ અથવા સમસ્યા માટે હૉસ્પિટલ આવ્યા છો?',
    initial_options: ['છાતીમાં દુખાવો અથવા દબાણ', 'તીવ્ર તાવ અથવા ધ્રુજારી', 'પેટમાં દુખાવો અથવા અપચો', 'ખાંસી અને શ્વાસ લેવામાં તકલીફ', 'માથાનો દુખાવો અથવા ચક્કર', 'કમર અથવા સાંધાનો દુખાવો', 'અન્ય કોઈ સમસ્યા'],
    fallback_q: 'શું તમને અન્ય કોઈ લક્ષણ કે દુખાવો થઈ રહ્યો છે?',
    fallback_options: ['હા / Yes', 'ના / No', 'ખબર નથી / Not sure']
  },
  kn: { 
    name: 'Kannada', 
    native: 'ಕನ್ನಡ', 
    bcp47: 'kn-IN',
    welcome: 'ದಯವಿಟ್ಟು ಡೇಟಾ ಸಮ್ಮತಿ ಸೂಚನೆಯನ್ನು ಗಮನವಿಟ್ಟು ಕೇಳಿ ಸ್ವೀಕರಿಸಿ.',
    consent: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಕೇವಲ ವೈದ್ಯರ ಸಮಾಲೋಚನೆಗಾಗಿ ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ.',
    complete: 'ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು!',
    name_q: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ತಿಳಿಸಿ ಅಥವಾ ಬರೆಯಿರಿ:',
    gender_q: 'ನಿಮ್ಮ ಲಿಂಗ (ಜೆಂಡರ್) ಯಾವುದು?',
    gender_options: ['ಪುರುಷ / Male', 'ಮಹಿಳೆ / Female', 'ಇತರ / Other'],
    age_q: 'ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು (ವರ್ಷಗಳಲ್ಲಿ)?',
    age_options: ['18 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', '18 - 30 ವರ್ಷಗಳು', '31 - 45 ವರ್ಷಗಳು', '46 - 60 ವರ್ಷಗಳು', '60 ವರ್ಷಕ್ಕಿಂತ ಮೇಲ್ಪಟ್ಟ'],
    initial_q: 'ಇಂದು ನೀವು ಆಸ್ಪತ್ರೆಗೆ ಯಾವ ಮುಖ್ಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಯಿಂದ ಬಂದಿದ್ದೀರಿ?',
    initial_options: ['ಎದೆ ನೋವು ಅಥವಾ ಭಾರ', 'ತೀವ್ರ ಜ್ವರ ಅಥವಾ ನಡುಕ', 'ಹೊಟ್ಟೆ ನೋವು ಅಥವಾ ಅಜೀರ್ಣ', 'ಕೆಮ್ಮು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ', 'ತಲೆನೋವು ಅಥವಾ ತಲೆಸುತ್ತು', 'ಬೆನ್ನು ಅಥವಾ ಕೀಲು ನೋವು', 'ಇತರ ತೊಂದರೆ'],
    fallback_q: 'ನಿಮಗೆ ಇನ್ನಾವುದಾದರೂ ರೋಗಲಕ್ಷಣಗಳು ಅಥವಾ ತೊಂದರೆಗಳಿವೆಯೇ?',
    fallback_options: ['ಹೌದು / Yes', 'ಇಲ್ಲ / No', 'ಗೊತ್ತಿಲ್ಲ / Not sure']
  },
  ml: { 
    name: 'Malayalam', 
    native: 'മലയാളം', 
    bcp47: 'ml-IN',
    welcome: 'ദയവായി ഡാറ്റാ സമ്മത അറിയിപ്പ് ശ്രദ്ധാപൂർവ്വം കേട്ട് അംഗീകരിക്കുക.',
    consent: 'നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ ഡോക്ടറുടെ പരിശോധനയ്ക്കായി മാത്രം സുരക്ഷിതമായി ശേഖരിക്കുന്നു.',
    complete: 'നിങ്ങളുടെ വിവരങ്ങൾ വിജയകരമായി രേഖപ്പെടുത്തി. നന്ദി!',
    name_q: 'ദയവായി നിങ്ങളുടെ മുഴുവൻ പേര് പറയുക അല്ലെങ്കിൽ എഴുതുക:',
    gender_q: 'നിങ്ങളുടെ ലിംഗം (ജെൻഡർ) ഏതാണ്?',
    gender_options: ['പുരുഷൻ / Male', 'സ്ത്രീ / Female', 'മറ്റുള്ളവ / Other'],
    age_q: 'നിങ്ങളുടെ പ്രായം എത്രയാണ് (വർഷങ്ങളിൽ)?',
    age_options: ['18 വയസ്സിന് താഴെ', '18 - 30 വയസ്സ്', '31 - 45 വയസ്സ്', '46 - 60 വയസ്സ്', '60 വയസ്സിന് മുകളിൽ'],
    initial_q: 'ഇന്ന് നിങ്ങൾ എന്തൊക്കെ പ്രധാന അസുഖങ്ങൾക്കാണ് ആശുപത്രിയിൽ എത്തിയത്?',
    initial_options: ['നെഞ്ചുവേദന അല്ലെങ്കിൽ ഭാരം', 'കടുത്ത പനി അല്ലെങ്കിൽ വിറയൽ', 'വയറുവേദന അല്ലെങ്കിൽ ദഹനക്കേട്', 'ചുമയും ശ്വാസംമുട്ടലും', 'തലവേദന അല്ലെങ്കിൽ തലകറക്കം', 'നടുവേദന അല്ലെങ്കിൽ സന്ധിവേദന', 'മറ്റ് അസുഖങ്ങൾ'],
    fallback_q: 'നിങ്ങൾക്ക് മറ്റ് എന്തെങ്കിലും ബുദ്ധിമുട്ടുകളോ ലക്ഷണങ്ങളോ ഉണ്ടോ?',
    fallback_options: ['ഉണ്ട് / Yes', 'ഇല്ല / No', 'ഉറപ്പില്ല / Not sure']
  },
  pa: { 
    name: 'Punjabi', 
    native: 'ਪੰਜਾਬੀ', 
    bcp47: 'pa-IN',
    welcome: 'ਕਿਰਪਾ ਕਰਕੇ ਡਾਟਾ ਸਹਿਮਤੀ ਨੋਟਿਸ ਨੂੰ ਧਿਆਨ ਨਾਲ ਸੁਣੋ ਅਤੇ ਸਵੀਕਾਰ ਕਰੋ।',
    consent: 'ਤੁਹਾਡੀ ਸਿਹਤ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਈ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਦਰਜ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।',
    complete: 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕਰ ਲਈ ਗਈ ਹੈ। ਧੰਨਵਾਦ!',
    name_q: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦੱਸੋ ਜਾਂ ਲਿਖੋ:',
    gender_q: 'ਤੁਹਾਡਾ ਲਿੰਗ ਕੀ ਹੈ?',
    gender_options: ['ਮਰਦ / Male', 'ਔਰਤ / Female', 'ਹੋਰ / Other'],
    age_q: 'ਤੁਹਾਡੀ ਉਮਰ ਕਿੰਨੀ ਹੈ (ਸਾਲਾਂ ਵਿੱਚ)?',
    age_options: ['18 ਸਾਲ ਤੋਂ ਘੱਟ', '18 - 30 ਸਾਲ', '31 - 45 ਸਾਲ', '46 - 60 ਸਾਲ', '60 ਸਾਲ ਤੋਂ ਵੱਧ'],
    initial_q: 'ਅੱਜ ਤੁਸੀਂ ਹਸਪਤਾਲ ਕਿਸ ਮੁੱਖ ਤਕਲੀਫ਼ ਜਾਂ ਬਿਮਾਰੀ ਲਈ ਆਏ ਹੋ?',
    initial_options: ['ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਜਾਂ ਭਾਰਾਪਣ', 'ਤੇਜ਼ ਬੁਖ਼ਾਰ ਜਾਂ ਕੰਬਣੀ', 'ਪੇਟ ਦਰਦ ਜਾਂ ਬਦਹਜ਼ਮੀ', 'ਖੰਘ ਅਤੇ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼', 'ਸਿਰਦਰਦ ਜਾਂ ਚੱਕਰ ਆਉਣਾ', 'ਕਮਰ ਜਾਂ ਜੋੜਾਂ ਦਾ ਦਰਦ', 'ਹੋਰ ਕੋਈ ਸਮੱਸਿਆ'],
    fallback_q: 'ਕੀ ਤੁਹਾਨੂੰ ਕੋਈ ਹੋਰ ਲੱਛਣ ਜਾਂ ਤਕਲੀਫ਼ ਮਹਿਸੂਸ ਹੋ ਰਹੀ ਹੈ?',
    fallback_options: ['ਹਾਂ / Yes', 'ਨਹੀਂ / No', 'ਪਤਾ ਨਹੀਂ / Not sure']
  }
};

/**
 * Helper to safely parse JSON from LLM output, handling markdown blocks if present
 */
function safeParseJson(raw: any): any {
  if (typeof raw !== 'string') return raw;
  let clean = raw.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(clean);
}

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
  const langConfig = SUPPORTED_LANGUAGES[patientLangCode] || SUPPORTED_LANGUAGES.en;
  const isEnglish = patientLangCode === 'en';
  const isAyurveda = clinicalMode === 'ayurveda';

  try {
    const prompt = `
    You are MediKiosk's empathetic, clinical conversational intake agent for ${isAyurveda ? 'an AYUSH (Ayurvedic) Outpatient Clinic' : 'an Outpatient Clinic'}.
    Your job is to conduct a natural, intelligent conversational medical history interview with the patient in their chosen language.
    
    CLINICAL MODE: ${isAyurveda ? 'MINISTRY OF AYUSH / AYURVEDIC CLINIC (Focus on Chief complaint, Dosha symptoms, Agni/Digestion, Nidra/Sleep, Ahara/Diet, traditional remedies)' : 'STANDARD ALLOPATHIC CLINIC'}
    PATIENT CONVERSATION HISTORY SO FAR:
    ${JSON.stringify(history, null, 2)}
    
    CURRENT CLINICAL TURN: ${turnCount} / 6
    PATIENT CHOSEN LANGUAGE: ${langConfig.name} (${langConfig.native}) [Code: ${patientLangCode}]
    ${patientName ? `PATIENT NAME: "${patientName}". You MUST address the patient respectfully by name (e.g. "${patientName} जी," or "${patientName} garu," or "Hello ${patientName}," or "${patientName} avargale,") in "question_localized" and "question_en".` : ''}

    STRICT LANGUAGE ENFORCEMENT RULES (CRITICAL):
    ${isEnglish ? `
    - The user selected ENGLISH.
    - Output EVERYTHING in 100% natural, standard English.
    - DO NOT include ANY Hindi or Devanagari words or letters anywhere.
    - "question_localized" must be in English.
    - "question_en" must be in English.
    - "options" must be in pure English only.
    ` : `
    - The user selected ${langConfig.name} (${langConfig.native}).
    - "question_localized" MUST be in ${langConfig.name} native script (${langConfig.native}).
    - NEVER switch to Hindi if the chosen language is not Hindi.
    - "question_en" must be in clear English.
    - Provide 4 to 6 smart quick-tap options formatted as: "Option in ${langConfig.name} / English".
    `}

    CLINICAL OBJECTIVES:
    1. Chief Complaint & Onset
    2. Severity & Quality of Symptoms
    3. Associated factors & digestion/triggers (${isAyurveda ? 'Tridosha, Agni, Ahara' : 'Radiation, Triggers, Relieving factors'})
    4. Past history & current medications/herbal remedies

    INSTRUCTIONS:
    - Based on what the patient answered, dynamically formulate the next logical, intelligent clinical follow-up question.
    - Tailor the question specifically to the symptom they stated.
    ${patientName ? `- Address the patient respectfully by name "${patientName}".` : ''}
    - If ${turnCount} >= 5, or if sufficient details are collected, set "is_intake_complete": true.
    
    CRITICAL SAFETY RULE:
    - NEVER diagnose the patient or prescribe medication.
    - Keep tone respectful, comforting, and clear.

    Output strictly valid JSON with no markdown:
    {
      "is_intake_complete": false,
      "question_localized": "Next question in ${isEnglish ? 'English' : langConfig.name}",
      "question_en": "Next question in English",
      "section": "hpi" | "medications" | "allergies" | "past_history" | "review_of_systems" | "ayush_profile",
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
    const parsed = safeParseJson(content);
    return parsed;
  } catch (err: any) {
    console.error('Error generating conversational follow up:', err);
    return {
      is_intake_complete: turnCount >= 5,
      question_localized: langConfig.fallback_q,
      question_en: 'Do you feel any other symptoms or pain?',
      section: 'hpi',
      field_name: 'associated_symptoms',
      options: langConfig.fallback_options,
      clinical_summary_note: 'Associated symptoms'
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
    You are an expert medical document extraction AI with specialized clinical knowledge of Indian healthcare prescriptions, doctor handwriting, diagnostic abbreviations, AYUSH formulations, and lab reports.
    
    ${contextSummary}

    INSTRUCTIONS:
    1. Read and decipher the document in the image (prescription, lab test, discharge summary, or diagnostic report).
    2. Leverage the patient's spoken intake context above to help disambiguate doctor handwriting, abbreviations, or partial medicine names (e.g. Rx abbreviations like 'Tab PCM 650mg TDS', 'Cap Amox-Clav 625', 'Tab Pantocid 40 OD', 'HbA1c', 'LFT/KFT', 'CBC', 'Ashwagandha Churna', 'Triphala Kwath').
    3. Evaluate document quality: if the document is legible or partially legible, extract all identifiable entities.
    4. Provide confidence scores (0.0 to 1.0) for every extracted item.

    Output strictly valid JSON with NO extra commentary or markdown:
    {
      "document_type": "prescription" | "lab_report" | "discharge_summary" | "diagnostic_report" | "clinical_note" | "other",
      "document_date": "YYYY-MM-DD" or null,
      "quality_assessment": "good" | "acceptable" | "poor_legibility",
      "is_readable": true,
      "doctor_or_hospital": "Name of Doctor / Clinic / Hospital if visible",
      "diagnoses": [
        {"name": "Diagnosis Name / Clinical Impression", "confidence": 0.95}
      ],
      "medications": [
        {"name": "Medicine Name", "dose": "500mg", "route": "Oral", "frequency": "BD / Twice daily", "duration": "5 days", "confidence": 0.90}
      ],
      "lab_values": [
        {"name": "Test Name (e.g. Hemoglobin / Fasting Sugar)", "value": "12.5", "unit": "g/dL", "reference_range": "12.0 - 15.0", "confidence": 0.92}
      ],
      "ayush_remedies": [
        {"name": "Ayurvedic Formulation / Home Remedy", "dosage": "1 tsp with warm water", "confidence": 0.90}
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
    const parsed = safeParseJson(content);

    if (parsed) {
      if (typeof parsed.doctor_or_hospital === 'object' && parsed.doctor_or_hospital !== null) {
        parsed.doctor_or_hospital = Object.entries(parsed.doctor_or_hospital)
          .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
          .filter(Boolean)
          .join(' • ');
      }
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

  // Sanitize extracted entities into clean, readable strings for the LLM
  const sanitizedMedications = extractedEntities
    .filter(e => e.entity_type === 'medication')
    .map(e => {
      const f = e.fields || {};
      const parts = [f.name || e.raw_text];
      if (f.dose) parts.push(`(${f.dose})`);
      if (f.frequency) parts.push(`- ${f.frequency}`);
      if (f.duration) parts.push(`for ${f.duration}`);
      return parts.join(' ');
    });

  const sanitizedDiagnoses = extractedEntities
    .filter(e => e.entity_type === 'diagnosis')
    .map(e => e.fields?.name || e.raw_text);

  const sanitizedLabs = extractedEntities
    .filter(e => e.entity_type === 'lab_result')
    .map(e => {
      const f = e.fields || {};
      return `${f.name || e.raw_text}: ${f.value || ''} ${f.unit || ''} ${f.reference_range ? `(Ref: ${f.reference_range})` : ''}`.trim();
    });

  const sanitizedNotes = extractedEntities
    .filter(e => e.entity_type === 'clinical_note')
    .map(e => e.fields?.note || e.raw_text);

  try {
    const prompt = `
    You are MediKiosk's Clinical Summarizer. You summarize patient-reported interview answers and document-extracted data into a structured clinical summary for doctors.
    
    CLINICAL MODE: ${isAyurveda ? 'MINISTRY OF AYUSH / AYURVEDIC CLINIC (Include Dosha, Agni, Ahara & Ayurvedic formulation details)' : 'STANDARD ALLOPATHIC CLINIC'}
    
    CRITICAL SAFETY BOUNDARY:
    - You must NEVER make a diagnosis, suggest a differential, or recommend a treatment/medication.
    - Every section must be labelled as DRAFT / UNVERIFIED for physician review.
    - IMPORTANT: Every value in "clinician_summary" MUST be a string (NOT a nested object or dictionary).

    INPUT DATA:
    Patient Spoken Answers: ${JSON.stringify(structuredHistory)}
    Document Extracted Medications: ${JSON.stringify(sanitizedMedications)}
    Document Extracted Diagnoses: ${JSON.stringify(sanitizedDiagnoses)}
    Document Extracted Lab Results: ${JSON.stringify(sanitizedLabs)}
    Document Clinical Notes: ${JSON.stringify(sanitizedNotes)}

    Output strictly JSON matching this structure:
    {
      "patient_summary_bilingual": "Plain language confirmation text in ${langConfig.name} (${langConfig.native}) for patient recap.",
      "clinician_summary": {
        "chief_complaint": "Chief complaint summary string",
        "hpi": "History of Present Illness (SOCRATES breakdown in coherent narrative string)",
        "past_medical_surgical": "Past illnesses or surgeries string",
        "medications": "Current medications from spoken answers and scanned prescriptions (with dosage/frequency) string",
        "allergies": "Allergies reported or documented string",
        "ayush_profile": "Patient self-reported AYUSH profile (Prakriti, Agni, Ahara, traditional remedies) string",
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
    const parsed = safeParseJson(content);

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
    const meds = sanitizedMedications.length > 0 ? sanitizedMedications.join(', ') : 'None recorded';
    const allergies = structuredHistory.find(h => h.section === 'allergies')?.value || 'None reported';
    const ayushItems = structuredHistory.filter(h => (h.section || '').includes('ayush')).map(h => `${h.field_name?.replace(/_/g, ' ')}: ${h.value}`).join('; ');

    return {
      patient_summary_bilingual: langConfig.complete,
      clinician_summary: {
        chief_complaint: String(cc),
        hpi: hpiItems || 'Structured interview recorded.',
        past_medical_surgical: 'None reported',
        medications: meds,
        allergies: String(allergies),
        ayush_profile: ayushItems || (isAyurveda ? 'Ayurvedic intake recorded.' : 'Standard'),
        review_of_systems: 'Completed',
        prior_investigations: sanitizedLabs.length > 0 ? sanitizedLabs.join('; ') : 'Uploaded documents processed'
      }
    };
  }
}
