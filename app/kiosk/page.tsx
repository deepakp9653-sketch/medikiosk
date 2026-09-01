'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Volume2, Mic, MicOff, Camera, Upload, CheckCircle2 as CheckCircle, AlertTriangle, 
  ChevronRight, HeartPulse, User, 
  HelpCircle, FileText, XCircle, Globe, RefreshCw
} from '@/components/Icons';

// Helper function to safely convert any clinical value (string, object, array) into a string
function formatClinicalText(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    return val.map(item => typeof item === 'object' ? formatClinicalText(item) : String(item)).filter(Boolean).join(', ');
  }
  if (typeof val === 'object') {
    return Object.entries(val)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? formatClinicalText(v) : v}`)
      .filter(Boolean)
      .join(' • ');
  }
  return String(val);
}

interface LanguagePack {
  name: string;
  native: string;
  bcp47: string;
  app_title: string;
  change_lang: string;
  human_help: string;
  help_notified: string;
  
  // Language Select Screen
  select_title: string;
  select_subtitle: string;
  select_footer: string;

  // Consent Screen
  consent_title: string;
  consent_body: string;
  consent_guardian: string;
  consent_agree: string;
  consent_decline: string;
  consent_prompt: string;

  // Identify Screen
  identify_title: string;
  identify_subtitle: string;
  scan_qr_title: string;
  scan_qr_desc: string;
  queue_id_label: string;
  abha_id_label: string;
  start_interview_btn: string;
  identify_prompt: string;

  // Interview Screen
  section_label: string;
  mode_badge: string;
  self_report_note: string;
  mic_start_text: string;
  mic_active_text: string;
  mic_tap_stop: string;
  voice_submit_btn: string;
  voice_clear_btn: string;
  unknown_btn: string;
  prefer_not_btn: string;
  initial_q: string;
  initial_options: string[];

  // Emergency Red Flag
  red_flag_title: string;
  red_flag_default: string;
  red_flag_footer: string;

  // Document Scan
  scan_title: string;
  scan_subtitle: string;
  scan_add_btn: string;
  scan_processing: string;
  scan_privacy_note: string;
  uploaded_docs_title: string;
  scan_finish_btn: string;
  scan_prompt: string;

  // Confirmation
  confirm_title: string;
  confirm_desc: string;
  home_btn: string;
  confirm_prompt: string;
}

const LOCALIZED_LANGUAGES: Record<string, LanguagePack> = {
  hi: {
    name: 'Hindi',
    native: 'हिन्दी',
    bcp47: 'hi-IN',
    app_title: 'मेडीकियोस्क रोगी पोर्टल',
    change_lang: 'भाषा बदलें',
    human_help: 'मानव सहायता',
    help_notified: 'सहायक कर्मचारी को सूचित कर दिया गया है।',
    select_title: 'अपनी पसंदीदा भाषा चुनें',
    select_subtitle: 'बोलकर या छूकर आसान सहायता के लिए अपनी भाषा का चयन करें।',
    select_footer: '10 प्रमुख भारतीय भाषाओं में वास्तविक समय वॉइस व टच सुविधा उपलब्ध',
    consent_title: 'डिजिटल स्वास्थ्य डेटा सहमति (DPDP)',
    consent_body: 'आपकी चिकित्सा जानकारी केवल आपके डॉक्टर के परामर्श और पूर्व-जांच सारांश तैयार करने के लिए सुरक्षित रूप से ली जा रही है। यह डेटा पूरी तरह गोपनीय है और किसी तीसरे पक्ष के साथ साझा नहीं किया जाएगा।',
    consent_guardian: 'अभिभावक/केयरगिवर के रूप में सहमति',
    consent_agree: 'सहमति दें और आगे बढ़ें',
    consent_decline: 'अस्वीकार करें',
    consent_prompt: 'कृपया डेटा सहमति को ध्यान से सुनें और स्वीकार करें।',
    identify_title: 'रोगी पहचान एवं पंजीकरण',
    identify_subtitle: 'पर्ची का क्यूआर कोड स्कैन करें या टोकन नंबर दर्ज करें।',
    scan_qr_title: 'आभा / टोकन क्यूआर कोड स्कैन करें',
    scan_qr_desc: 'पंजीकरण पर्ची को कैमरे के सामने रखें',
    queue_id_label: 'टोकन / कतार संख्या',
    abha_id_label: 'आभा स्वास्थ्य पहचान पत्र (वैकल्पिक)',
    start_interview_btn: 'स्वास्थ्य साक्षात्कार शुरू करें',
    identify_prompt: 'कृपया अपना टोकन नंबर दर्ज करें या क्यूआर पर्ची स्कैन करें।',
    section_label: 'विभाग',
    mode_badge: 'हिन्दी वॉइस व टच मोड',
    self_report_note: 'डॉक्टर की समीक्षा के लिए रोगी द्वारा दी गई जानकारी',
    mic_start_text: 'माइक दबाकर बोलें — बोलने के बाद नीचे सबमिट बटन दबाएं',
    mic_active_text: '🎙️ लाइव वॉइस चालू है — बोलें और नीचे सबमिट बटन दबाएं',
    mic_tap_stop: 'माइक बंद करने के लिए दोबारा दबाएं',
    voice_submit_btn: 'उत्तर सबमिट करें',
    voice_clear_btn: 'पुनः बोलें',
    unknown_btn: 'मुझे पता नहीं है',
    prefer_not_btn: 'बताना नहीं चाहते',
    initial_q: 'आज आप अस्पताल किस मुख्य बीमारी या तकलीफ के लिए आए हैं?',
    initial_options: ['छाती में दर्द या भारीपन', 'तेज बुखार या कंपकंपी', 'पेट दर्द या अपच', 'खांसी व सांस लेने में तकलीफ', 'सिरदर्द या चक्कर आना', 'कमर या जोड़ों में तेज दर्द', 'अन्य कोई तकलीफ'],
    red_flag_title: 'आपातकालीन सूचना — तत्काल सहायता',
    red_flag_default: 'कृपया तुरंत आपातकालीन डेस्क (Emergency Desk) पर जाएं। स्वास्थ्य कर्मचारी को सूचित किया गया है।',
    red_flag_footer: 'प्राथमिकता अलर्ट सक्रिय',
    scan_title: 'पुराने पर्चे व जांच रिपोर्ट स्कैन करें',
    scan_subtitle: 'दवाई के पर्चे, खून की जांच या अस्पताल डिस्चार्ज रिपोर्ट जोड़ें।',
    scan_add_btn: 'पर्चा या रिपोर्ट अपलोड करें',
    scan_processing: 'रिपोर्ट का विश्लेषण हो रहा है...',
    scan_privacy_note: 'शून्य-डिस्क सुरक्षा: डेटा केवल रैम (RAM) मेमोरी में सुरक्षित रूप से पढ़ा जाता है।',
    uploaded_docs_title: 'संलग्न किए गए दस्तावेज',
    scan_finish_btn: 'साक्षात्कार समाप्त करें व भेजें',
    scan_prompt: 'कृपया अपने पुराने पर्चे या रिपोर्ट स्कैन करें।',
    confirm_title: 'धन्यवाद! आपकी जानकारी दर्ज कर ली गई है।',
    confirm_desc: 'आपकी स्वास्थ्य जानकारी सुरक्षित रूप से डॉक्टर के कंप्यूटर पर भेज दी गई है। कृपया ओपीडी कक्ष के बाहर अपने नाम की प्रतीक्षा करें।',
    home_btn: 'मुख्य पृष्ठ पर जाएं',
    confirm_prompt: 'आपकी जानकारी सुरक्षित रूप से दर्ज कर ली गई है। धन्यवाद!'
  },
  en: {
    name: 'English',
    native: 'English',
    bcp47: 'en-IN',
    app_title: 'MediKiosk Patient Portal',
    change_lang: 'Change Language',
    human_help: 'Human Help',
    help_notified: 'Clinical assistant notified.',
    select_title: 'Select Your Preferred Language',
    select_subtitle: 'Choose your language for continuous voice and touch assistance.',
    select_footer: '10 Major Indian Languages supported with real-time speech AI',
    consent_title: 'Digital Health Data Consent (DPDP)',
    consent_body: 'Your medical information is collected solely for clinical consultation and preliminary intake summary preparation. Your data is protected under India DPDP rules and never shared with third parties.',
    consent_guardian: 'Consent as Guardian / Caregiver for patient',
    consent_agree: 'Agree & Continue',
    consent_decline: 'Decline',
    consent_prompt: 'Please listen carefully to the data consent notice and tap agree to proceed.',
    identify_title: 'Patient Identification & Check-In',
    identify_subtitle: 'Scan your registration QR slip or enter your Queue Token ID.',
    scan_qr_title: 'Scan ABHA / Token QR Code',
    scan_qr_desc: 'Hold your registration slip in front of the camera',
    queue_id_label: 'Queue Token ID',
    abha_id_label: 'ABHA Health ID (Optional)',
    start_interview_btn: 'Start Health Interview',
    identify_prompt: 'Please enter your queue ticket ID or scan your registration slip.',
    section_label: 'Section',
    mode_badge: 'English Voice & Touch Mode',
    self_report_note: 'Self-reported intake information for physician review',
    mic_start_text: 'Tap microphone to speak, then press Submit Answer below',
    mic_active_text: '🎙️ Live Voice Active — Speak and tap Submit below',
    mic_tap_stop: 'Tap microphone again anytime to mute',
    voice_submit_btn: 'Submit Spoken Answer',
    voice_clear_btn: 'Clear & Re-speak',
    unknown_btn: "I don't know / Not sure",
    prefer_not_btn: 'Prefer not to say',
    initial_q: 'What primary symptom or health complaint brings you to the clinic today?',
    initial_options: ['Chest pain or pressure', 'High fever or chills', 'Stomach pain or indigestion', 'Cough & shortness of breath', 'Headache or dizziness', 'Severe back or joint pain', 'Other health problem'],
    red_flag_title: 'EMERGENCY ALERT — Immediate Attention Required',
    red_flag_default: 'Please proceed to the Emergency Desk immediately. A nurse has been alerted.',
    red_flag_footer: 'Triage emergency rule triggered',
    scan_title: 'Scan Previous Prescriptions & Lab Reports',
    scan_subtitle: 'Upload your medicine slips, blood reports, or discharge summaries.',
    scan_add_btn: 'Add Prescription / Report',
    scan_processing: 'Analyzing medical document...',
    scan_privacy_note: 'Zero-Disk Privacy: Processed securely in memory and discarded immediately.',
    uploaded_docs_title: 'Attached Documents',
    scan_finish_btn: 'Finish & Submit to Doctor',
    scan_prompt: 'Please scan or upload your past prescriptions and diagnostic reports.',
    confirm_title: 'Thank You! Your Intake is Recorded.',
    confirm_desc: 'Your clinical history has been securely routed to the physician dashboard. Please wait outside the consultation room for your turn.',
    home_btn: 'Return to Home',
    confirm_prompt: 'Your intake information has been safely recorded. Thank you!'
  },
  mr: {
    name: 'Marathi',
    native: 'मराठी',
    bcp47: 'mr-IN',
    app_title: 'मेडीकिओस्क रुग्ण पोर्टल',
    change_lang: 'भाषा बदला',
    human_help: 'मदतनीस बोलवा',
    help_notified: 'मदतनीसाला सूचना पाठवली आहे.',
    select_title: 'तुमची पसंतीची भाषा निवडा',
    select_subtitle: 'बोलून किंवा स्पर्श करून सुलभ माहिती नोंदवण्यासाठी भाषा निवडा.',
    select_footer: '१० प्रमुख भारतीय भाषांमध्ये व्हॉइस आणि टच सुविधा उपलब्ध',
    consent_title: 'आरोग्य डेटा संमती (DPDP)',
    consent_body: 'तुमची वैद्यकीय माहिती केवळ डॉक्टरांच्या सल्ल्यासाठी आणि पूर्व-तपासणी अहवालासाठी सुरक्षितपणे घेतली जात आहे. ही माहिती पूर्णपणे गोपनीय ठेवली जाते.',
    consent_guardian: 'पालक किंवा काळजीवाहू म्हणून संमती',
    consent_agree: 'संमती द्या आणि पुढे जा',
    consent_decline: 'नाकारा',
    consent_prompt: 'कृपया डेटा संमती काळजीपूर्वक ऐका आणि पुढे जाण्यासाठी स्वीकारा.',
    identify_title: 'रुग्ण ओळख आणि नोंदणी',
    identify_subtitle: 'नोंदणी पावतीवरील क्यूआर कोड स्कॅन करा किंवा टोकन क्रमांक टाका.',
    scan_qr_title: 'आभा / टोकन क्यूआर स्कॅन करा',
    scan_qr_desc: 'नोंदणी पावती कॅमेऱ्यासमोर धरा',
    queue_id_label: 'टोकन / रांग क्रमांक',
    abha_id_label: 'आभा हेल्थ कार्ड नंबर (पर्यायी)',
    start_interview_btn: 'आरोग्य चौकशी सुरू करा',
    identify_prompt: 'कृपया तुमचा टोकन क्रमांक टाका किंवा पावती स्कॅन करा.',
    section_label: 'विभाग',
    mode_badge: 'मराठी व्हॉइस आणि टच मोड',
    self_report_note: 'डॉक्टरांच्या तपासणीसाठी रुग्णाने दिलेली माहिती',
    mic_start_text: 'माईक सुरू करून बोला व खाली दिलेले सबमिट बटण दाबा',
    mic_active_text: '🎙️ लाईव्ह व्हॉइस चालू आहे — बोलून खाली सबमिट दाबा',
    mic_tap_stop: 'माईक बंद करण्यासाठी पुन्हा दाबा',
    voice_submit_btn: 'उत्तर सबमिट करा',
    voice_clear_btn: 'पुन्हा बोला',
    unknown_btn: 'मला माहित नाही',
    prefer_not_btn: 'सांगायचे नाही',
    initial_q: 'आज तुम्ही दवाखान्यात कोणत्या मुख्य त्रासासाठी किंवा आजारासाठी आला आहात?',
    initial_options: ['छातीत दुखणे किंवा जड वाटणे', 'तीव्र ताप किंवा थंडी', 'पोटात दुखणे किंवा गॅसेस', 'खोकला व श्वास घेण्यास त्रास', 'डोकेदुखी किंवा चक्कर', 'कंबर किंवा सांधेदुखी', 'इतर कोणताही त्रास'],
    red_flag_title: 'तातडीची सूचना — त्वरित मदत घ्या',
    red_flag_default: 'कृपया त्वरित इमर्जन्सी डेस्कवर जा. आरोग्य कर्मचाऱ्यांना कळवण्यात आले आहे.',
    red_flag_footer: 'तातडीचा इशारा सक्रिय',
    scan_title: 'जुनी प्रिस्क्रिप्शन आणि रिपोर्ट्स स्कॅन करा',
    scan_subtitle: 'औषधांच्या पावत्या, रक्ताचे रिपोर्ट्स किंवा डिस्चार्ज कार्ड जोडा.',
    scan_add_btn: 'प्रिस्क्रिप्शन / रिपोर्ट जोडा',
    scan_processing: 'रिपोर्ट तपासले जात आहेत...',
    scan_privacy_note: 'गोपनीयता सुरक्षा: माहिती कोणत्याही डिस्कवर साठवली जात नाही.',
    uploaded_docs_title: 'जोडलेली कागदपत्रे',
    scan_finish_btn: 'नोंदणी पूर्ण करा आणि पाठवा',
    scan_prompt: 'कृपया तुमचे जुने रिपोर्ट्स किंवा पावत्या स्कॅन करा.',
    confirm_title: 'धन्यवाद! तुमची माहिती नोंदवली गेली आहे.',
    confirm_desc: 'तुमची माहिती सुरक्षितपणे डॉक्टरांच्या डॅशबोर्डवर पाठवली गेली आहे. कृपया तपासणी कक्षाबाहेर प्रतीक्षा करा.',
    home_btn: 'मुख्य पानावर जा',
    confirm_prompt: 'तुमची माहिती सुरक्षितपणे नोंदवली गेली आहे. धन्यवाद!'
  },
  bn: {
    name: 'Bengali',
    native: 'বাংলা',
    bcp47: 'bn-IN',
    app_title: 'মেডিকিওস্ক রোগী পোর্টাল',
    change_lang: 'ভাষা পরিবর্তন করুন',
    human_help: 'কর্মীর সহায়তা',
    help_notified: 'সহকারী কর্মীকে জানানো হয়েছে।',
    select_title: 'আপনার পছন্দের ভাষা নির্বাচন করুন',
    select_subtitle: 'সহজ ভয়েস এবং স্পর্শ সহায়তার জন্য আপনার ভাষা বেছে নিন।',
    select_footer: '১০টি প্রধান ভারতীয় ভাষায় তাৎক্ষণিক ভয়েস পরিষেবা উপলব্ধ',
    consent_title: 'ডিজিটাল স্বাস্থ্য ডেটা সম্মতি (DPDP)',
    consent_body: 'আপনার স্বাস্থ্য সংক্রান্ত তথ্য শুধুমাত্র ডাক্তারের পরামর্শ এবং প্রাথমিক স্বাস্থ্য সারাংশ তৈরির জন্য নিরাপদে সংগ্রহ করা হচ্ছে। আপনার ডেটা সম্পূর্ণ গোপনীয় এবং সুরক্ষিত থাকবে।',
    consent_guardian: 'অভিভাবক বা যত্নশীল হিসেবে সম্মতি',
    consent_agree: 'সম্মতি দিন ও এগিয়ে যান',
    consent_decline: 'প্রত্যাখ্যান করুন',
    consent_prompt: 'অনুগ্রহ করে ডেটা সম্মতির বিজ্ঞপ্তিটি শুনুন এবং সম্মতি দিন।',
    identify_title: 'রোগীর পরিচয় ও নিবন্ধন',
    identify_subtitle: 'নিবন্ধন স্লিপের কিউআর কোড স্ক্যান করুন অথবা টোকেন নম্বর লিখুন।',
    scan_qr_title: 'আভা / টোকেন কিউআর কোড স্ক্যান করুন',
    scan_qr_desc: 'ক্যামেরার সামনে স্লিপটি ধরুন',
    queue_id_label: 'টোকেন / কিউ নম্বর',
    abha_id_label: 'আভা হেলথ আইডি (ঐচ্ছিক)',
    start_interview_btn: 'স্বাস্থ্য সাক্ষাৎকার শুরু করুন',
    identify_prompt: 'অনুগ্রহ করে আপনার টোকেন নম্বর লিখুন বা স্লিপ স্ক্যান করুন।',
    section_label: 'বিভাগ',
    mode_badge: 'বাংলা ভয়েস ও স্পর্শ মোড',
    self_report_note: 'ডাক্তারের পরীক্ষার জন্য রোগীর দ্বারা প্রদত্ত তথ্য',
    mic_start_text: 'মাইক্রোফোনে কথা বলুন এবং নিচে জমা দিন বাটনে চাপুন',
    mic_active_text: '🎙️ লাইভ ভয়েস চালু আছে — কথা বলে জমা দিন বাটনে চাপুন',
    mic_tap_stop: 'মাইক্রোফোন বন্ধ করতে স্পর্শ করুন',
    voice_submit_btn: 'উত্তর জমা দিন',
    voice_clear_btn: 'পুনরায় বলুন',
    unknown_btn: 'আমার জানা নেই',
    prefer_not_btn: 'বলতে ইচ্ছুক নই',
    initial_q: 'আজ আপনি প্রধানত কী শারীরিক সমস্যা বা অসুস্থতার জন্য হাসপাতালে এসেছেন?',
    initial_options: ['বুকে ব্যথা বা চাপ', 'তীব্র জ্বর বা কাঁপুনি', 'পেটে ব্যথা বা বদহজম', 'কাশি ও শ্বাসকষ্ট', 'মাথাব্যথা বা মাথা ঘোরা', 'কোমর বা অস্থিসন্ধিতে ব্যথা', 'অন্যান্য সমস্যা'],
    red_flag_title: 'জরুরি সতর্কতা — অবিলম্বে সাহায্য নিন',
    red_flag_default: 'অনুগ্রহ করে অবিলম্বে জরুরি বিভাগে যান। স্বাস্থ্যকর্মীকে জানানো হয়েছে।',
    red_flag_footer: 'জরুরি ট্রায়াজ সতর্কতা সক্রিয়',
    scan_title: 'পুরোনো প্রেসক্রিপশন ও রিপোর্ট স্ক্যান করুন',
    scan_subtitle: 'ওষুধের প্রেসক্রিপশন বা ল্যাব টেস্টের রিপোর্ট যোগ করুন।',
    scan_add_btn: 'প্রেসক্রিপশন / রিপোর্ট আপলোড করুন',
    scan_processing: 'নথিপত্র বিশ্লেষণ করা হচ্ছে...',
    scan_privacy_note: 'সম্পূর্ণ গোপনীয়তা: তথ্য কোনো ডিস্কে সংরক্ষণ করা হয় না।',
    uploaded_docs_title: 'সংযুক্ত নথিপত্র',
    scan_finish_btn: 'সম্পূর্ণ করুন ও ডাক্তারের কাছে পাঠান',
    scan_prompt: 'অনুগ্রহ করে আপনার পুরোনো প্রেসক্রিপশন বা রিপোর্ট স্ক্যান করুন।',
    confirm_title: 'ধন্যবাদ! আপনার তথ্য সফলভাবে জমা হয়েছে।',
    confirm_desc: 'আপনার স্বাস্থ্য তথ্য নিরাপদে ডাক্তারের কাছে পৌঁছে গেছে। অনুগ্রহ করে ওপিডি কক্ষের বাইরে অপেক্ষা করুন।',
    home_btn: 'মূল পাতায় ফিরে যান',
    confirm_prompt: 'আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে। ধন্যবাদ!'
  },
  te: {
    name: 'Telugu',
    native: 'తెలుగు',
    bcp47: 'te-IN',
    app_title: 'మెడికియోస్క్ రోగి పోర్టల్',
    change_lang: 'భాషను మార్చండి',
    human_help: 'సహాయకుడిని పిలవండి',
    help_notified: 'సహాయక సిబ్బందికి సమాచారం అందించబడింది.',
    select_title: 'మీకు నచ్చిన భాషను ఎంచుకోండి',
    select_subtitle: 'మాట్లాడటం లేదా తాకడం ద్వారా సులభంగా సమాచారం ఇవ్వడానికి భాషను ఎంచుకోండి.',
    select_footer: '10 ప్రధాన భారతీయ భాషలలో వాయిస్ మరియు టచ్ సౌకర్యం',
    consent_title: 'డిజిటల్ ఆరోగ్య డేటా సమ్మతి (DPDP)',
    consent_body: 'మీ వైద్య సమాచారం కేవలం వైద్యుల సంప్రదింపుల కొరకు మరియు ప్రాథమిక రికార్డు తయారీకి మాత్రమే సురక్షితంగా సేకరించబడుతుంది. మీ డేటా పూర్తిగా గోప్యంగా ఉంచబడుతుంది.',
    consent_guardian: 'సంరక్షకుడిగా సమ్మతి',
    consent_agree: 'అంగీకరించి ముందుకు సాగండి',
    consent_decline: 'తిరస్కరించండి',
    consent_prompt: 'దయచేసి డేటా సమ్మతి నోటీసును విని అంగీకరించండి.',
    identify_title: 'రోగి గుర్తింపు మరియు నమోదు',
    identify_subtitle: 'రిజిస్ట్రేషన్ స్లిప్ క్యూఆర్ కోడ్ స్కాన్ చేయండి లేదా టోకెన్ నంబర్ నమోదు చేయండి.',
    scan_qr_title: 'ఆభా / టోకెన్ క్యూఆర్ స్కాన్ చేయండి',
    scan_qr_desc: 'కెమెరా ముందు రిజిస్ట్రేషన్ స్లిప్ ఉంచండి',
    queue_id_label: 'టోకెన్ / క్యూ సంఖ్య',
    abha_id_label: 'ఆభా హెల్త్ ఐడీ (ఐచ్ఛికం)',
    start_interview_btn: 'ఆరోగ్య ఇంటర్వ్యూ ప్రారంభించండి',
    identify_prompt: 'దయచేసి మీ టోకెన్ నంబర్ నమోదు చేయండి లేదా స్లిప్ స్కాన్ చేయండి.',
    section_label: 'విభాగం',
    mode_badge: 'తెలుగు వాయిస్ & టచ్ మోడ్',
    self_report_note: 'వైద్యుల సమీక్ష కోసం రోగి తెలిపిన వివరాలు',
    mic_start_text: 'మైక్ నొక్కి మాట్లాడండి, ఆపై సమర్పించు బటన్ నొక్కండి',
    mic_active_text: '🎙️ లైవ్ వాయిస్ ఆన్ — మాట్లాడిన తర్వాత సమర్పించండి',
    mic_tap_stop: 'మైక్ ఆపడానికి మళ్లీ తాకండి',
    voice_submit_btn: 'సమాధానం పంపండి',
    voice_clear_btn: 'మళ్లీ మాట్లాడండి',
    unknown_btn: 'నాకు ఖచ్చితంగా తెలియదు',
    prefer_not_btn: 'చెప్పడానికి ఇష్టపడటం లేదు',
    initial_q: 'ఈ రోజు మీరు ఆసుపత్రికి ఏ ప్రధాన సమస్య లేదా అనారోగ్యం కోసం వచ్చారు?',
    initial_options: ['ఛాతీ నొప్పి లేదా బరువుగా ఉండటం', 'తీవ్ర జ్వరం లేదా వణుకు', 'కడుపు నొప్పి లేదా అజీర్ణం', 'దగ్గు మరియు శ్వాస తీసుకోవడంలో ఇబ్బంది', 'తలనొప్పి లేదా తలతిరగడం', 'నడుము లేదా కీళ్ల నొప్పి', 'ఇతర సమస్య'],
    red_flag_title: 'అత్యవసర హెచ్చరిక — వెంటనే సహాయం పొందండి',
    red_flag_default: 'దయచేసి వెంటనే ఎమర్జెన్సీ డెస్క్ వద్దకు వెళ్లండి. వైద్య సిబ్బందికి సమాచారం అందించబడింది.',
    red_flag_footer: 'అత్యవసర ట్రయాజ్ హెచ్చరిక సక్రియం చేయబడింది',
    scan_title: 'పాత ప్రిస్క్రిప్షన్లు & రిపోర్టులు స్కాన్ చేయండి',
    scan_subtitle: 'మందుల చీటీలు లేదా రక్త పరీక్షల నివేదికలను అప్‌లోడ్ చేయండి.',
    scan_add_btn: 'ప్రిస్క్రిప్షన్ / రిపోర్ట్ జోడించండి',
    scan_processing: 'పత్రాలు విశ్లేషించబడుతున్నాయి...',
    scan_privacy_note: 'జీరో-డిస్క్ భద్రత: డేటా ఏ డిస్క్‌లోనూ భద్రపరచబడదు.',
    uploaded_docs_title: 'జోడించిన పత్రాలు',
    scan_finish_btn: 'పూర్తి చేసి వైద్యుడికి పంపండి',
    scan_prompt: 'దయచేసి మీ పాత రిపోర్టులు లేదా మందుల చీటీలను స్కాన్ చేయండి.',
    confirm_title: 'ధన్యవాదాలు! మీ వివరాలు నమోదయ్యాయి.',
    confirm_desc: 'మీ ఆరోగ్య సమాచారం సురక్షితంగా డాక్టర్ కంప్యూటర్‌కు పంపబడింది. దయచేసి సంప్రదింపుల గది బయట వేచి ఉండండి.',
    home_btn: 'హోమ్ పేజీకి వెళ్లండి',
    confirm_prompt: 'మీ సమాచారం విజయవంతంగా నమోదైంది. ధన్యవాదాలు!'
  },
  ta: {
    name: 'Tamil',
    native: 'தமிழ்',
    bcp47: 'ta-IN',
    app_title: 'மெடிகியோஸ்க் நோயாளி போர்டல்',
    change_lang: 'மொழியை மாற்றுக',
    human_help: 'உதவியாளர் உதவி',
    help_notified: 'உதவியாளருக்கு தகவல் தெரிவிக்கப்பட்டது.',
    select_title: 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    select_subtitle: 'பேசுவதன் மூலம் அல்லது தொடுவதன் மூலம் எளிதாக உதவ மொழியைத் தேர்வுசெய்யவும்.',
    select_footer: '10 முக்கிய இந்திய மொழிகளில் குரல் மற்றும் தொடு வசதி',
    consent_title: 'டிஜிட்டல் சுகாதார தரவு ஒப்புதல் (DPDP)',
    consent_body: 'உங்கள் மருத்துவத் தகவல் மருத்துவரின் ஆலோசனைக்காகவும் ஆரம்ப சிகிச்சை சுருக்கத்திற்காகவும் மட்டுமே பாதுகாப்பாக சேகரிக்கப்படுகிறது. உங்கள் தகவல்கள் முழுமையாக பாதுகாக்கப்படும்.',
    consent_guardian: 'பாதுகாவலராக ஒப்புதல் அளித்தல்',
    consent_agree: 'ஏற்றுக்கொண்டு தொடரவும்',
    consent_decline: 'நிராகரிக்கவும்',
    consent_prompt: 'தயவுசெய்து தரவு ஒப்புதல் அறிவிப்பைக் கேட்டு ஏற்கவும்.',
    identify_title: 'நோயாளி அடையாளம் மற்றும் பதிவு',
    identify_subtitle: 'பதிவுச் சீட்டின் க்யூஆர் குறியீட்டை ஸ்கேன் செய்யவும் அல்லது டோக்கன் எண்ணை உள்ளிடவும்.',
    scan_qr_title: 'ஆபா / டோக்கன் க்யூஆர் ஸ்கேன் செய்யவும்',
    scan_qr_desc: 'பதிவுச் சீட்டை கேமரா முன் காட்டவும்',
    queue_id_label: 'டோக்கன் / வரிசை எண்',
    abha_id_label: 'ஆபா சுகாதார அட்டை எண் (விருப்பத்தேர்வு)',
    start_interview_btn: 'சுகாதார நேர்காணலைத் தொடங்குக',
    identify_prompt: 'தயவுசெய்து டோக்கன் எண்ணை உள்ளிடவும் அல்லது சீட்டை ஸ்கேன் செய்யவும்.',
    section_label: 'பிரிவு',
    mode_badge: 'தமிழ் குரல் மற்றும் தொடு முறை',
    self_report_note: 'மருத்துவர் பார்வைக்காக நோயாளி அளித்த விவரங்கள்',
    mic_start_text: 'மைக் அழுத்திப் பேசிவிட்டு சமர்ப்பிக்கவும்',
    mic_active_text: '🎙️ நேரடி குரல் இயங்குகிறது — பேசிவிட்டு கீழே சமர்ப்பிக்கவும்',
    mic_tap_stop: 'மைக்கை நிறுத்த மீண்டும் தொடவும்',
    voice_submit_btn: 'பதிலை அனுப்புக',
    voice_clear_btn: 'மீண்டும் பேசுக',
    unknown_btn: 'எனக்குத் தெரியவில்லை',
    prefer_not_btn: 'கூற விரும்பவில்லை',
    initial_q: 'இன்று நீங்கள் என்ன பிரதான உடல்நலப் பிரச்சனைக்காக மருத்துவமனைக்கு வந்துள்ளீர்கள்?',
    initial_options: ['நெஞ்சு வலி அல்லது இறுக்கம்', 'கடுமையான காய்ச்சல் அல்லது நடுக்கம்', 'வயிற்று வலி அல்லது அஜீரணம்', 'இருமல் மற்றும் மூச்சுத்திணறல்', 'தலைவலி அல்லது தலைச்சுற்றல்', 'இடுப்பு அல்லது மூட்டு வலி', 'மற்ற பிரச்சனைகள்'],
    red_flag_title: 'அவசர எச்சரிக்கை — உடனடி உதவி தேவை',
    red_flag_default: 'தயவுசெய்து உடனடியாக அவசர சிகிச்சைப் பிரிவுக்குச் செல்லவும். ஊழியர்களுக்குத் தெரிவிக்கப்பட்டுள்ளது.',
    red_flag_footer: 'அவசர சிகிச்சை எச்சரிக்கை இயங்குகிறது',
    scan_title: 'பழைய மருந்துச் சீட்டுகள் & அறிக்கைகளை ஸ்கேன் செய்க',
    scan_subtitle: 'மருந்துச் சீட்டுகள் அல்லது ரத்தப் பரிசோதனை அறிக்கைகளைப் பதிவேற்றவும்.',
    scan_add_btn: 'மருந்துச் சீட்டு / அறிக்கை சேர்க்க',
    scan_processing: 'ஆவணங்கள் பரிசீலிக்கப்படுகின்றன...',
    scan_privacy_note: 'முழுப் பாதுகாப்பு: தகவல்கள் எந்த வன்வட்டிலும் சேமிக்கப்படுவதில்லை.',
    uploaded_docs_title: 'இணைக்கப்பட்ட ஆவணங்கள்',
    scan_finish_btn: 'முடித்து மருத்துவருக்கு அனுப்புக',
    scan_prompt: 'தயவுசெய்து உங்கள் பழைய அறிக்கைகள் அல்லது மருந்துச் சீட்டுகளை ஸ்கேன் செய்யவும்.',
    confirm_title: 'நன்றி! உங்கள் தகவல்கள் பதிவு செய்யப்பட்டன.',
    confirm_desc: 'உங்கள் மருத்துவ விவரங்கள் பாதுகாப்பாக மருத்துவருக்கு அனுப்பப்பட்டுள்ளன. தயவுசெய்து ஆலோசனை அறைக்கு வெளியே காத்திருக்கவும்.',
    home_btn: 'முகப்புப் பக்கத்திற்குச் செல்லவும்',
    confirm_prompt: 'உங்கள் தகவல் வெற்றிகரமாக பதிவு செய்யப்பட்டது. நன்றி!'
  },
  gu: {
    name: 'Gujarati',
    native: 'ગુજરાતી',
    bcp47: 'gu-IN',
    app_title: 'મેડિકિયોસ્ક દર્દી પોર્ટલ',
    change_lang: 'ભાષા બદલો',
    human_help: 'માનવ સહાય',
    help_notified: 'સહાયક સ્ટાફને જાણ કરવામાં આવી છે.',
    select_title: 'તમારી પસંદગીની ભાષા પસંદ કરો',
    select_subtitle: 'બોલીને અથવા ટચ કરીને સરળ સહાયતા માટે ભાષા પસંદ કરો.',
    select_footer: '10 મુખ્ય ભારતીય ભાષાઓમાં વૉઇસ અને ટચ સુવિધા ઉપલબ્ધ',
    consent_title: 'ડિજિટલ હેલ્થ ડેટા સંમતિ (DPDP)',
    consent_body: 'તમારી તબીબી માહિતી ફક્ત ડૉક્ટરની સલાહ અને પ્રાથમિક તપાસ સારાંશ માટે સુરક્ષિત રીતે લેવામાં આવી રહી છે. આ વિગતો સંપૂર્ણપણે ગુપ્ત રાખવામાં આવે છે.',
    consent_guardian: 'વાલી અથવા સંભાળ રાખનાર તરીકે સંમતિ',
    consent_agree: 'સંમતિ આપો અને આગળ વધો',
    consent_decline: 'અસ્વીકાર કરો',
    consent_prompt: 'કૃપા કરીને ડેટા સંમતિ સાંભળો અને સ્વીકારો.',
    identify_title: 'દર્દી ઓળખ અને નોંધણી',
    identify_subtitle: 'નોંધણી પાવતીનો ક્યુઆર કોડ સ્કેન કરો અથવા ટોકન નંબર દાખલ કરો.',
    scan_qr_title: 'આભા / ટોકન ક્યુઆર સ્કેન કરો',
    scan_qr_desc: 'કૅમેરા સામે પાવતી રાખો',
    queue_id_label: 'ટોકન / કતાર નંબર',
    abha_id_label: 'આભા હેલ્થ આઈડી (વૈકલ્પિક)',
    start_interview_btn: 'આરોગ્ય ઇન્ટરવ્યુ શરૂ કરો',
    identify_prompt: 'કૃપા કરીને ટોકન નંબર દાખલ કરો અથવા પાવતી સ્કેન કરો.',
    section_label: 'વિભાગ',
    mode_badge: 'ગુજરાતી વૉઇસ અને ટચ મોડ',
    self_report_note: 'ડૉક્ટરની સમીક્ષા માટે દર્દી દ્વારા આપવામાં આવેલી માહિતી',
    mic_start_text: 'માઇક દબાવીને બોલો અને નીચે સબમિટ બટન દબાવો',
    mic_active_text: '🎙️ લાઈવ વૉઇસ ચાલુ છે — બોલીને સબમિટ કરો',
    mic_tap_stop: 'માઇક બંધ કરવા ફરીથી દબાવો',
    voice_submit_btn: 'જવાબ સબમિટ કરો',
    voice_clear_btn: 'ફરીથી બોલો',
    unknown_btn: 'મને ખબર નથી',
    prefer_not_btn: 'જણાવવા માંગતા નથી',
    initial_q: 'આજે તમે કઈ મુખ્ય તકલીફ અથવા સમસ્યા માટે હૉસ્પિટલ આવ્યા છો?',
    initial_options: ['છાતીમાં દુખાવો અથવા દબાણ', 'તીવ્ર તાવ અથવા ધ્રુજારી', 'પેટમાં દુખાવો અથવા અપચો', 'ખાંસી અને શ્વાસ લેવામાં તકલીફ', 'માથાનો દુખાવો અથવા ચક્કર', 'કમર અથવા સાંધાનો દુખાવો', 'અન્ય કોઈ સમસ્યા'],
    red_flag_title: 'કટોકટી ચેતવણી — તાત્કાલિક મદદ લો',
    red_flag_default: 'કૃપા કરીને તરત જ ઈમરજન્સી ડેસ્ક પર જાઓ. આરોગ્ય કર્મચારીઓને જાણ કરવામાં આવી છે.',
    red_flag_footer: 'ઈમરજન્સી ચેતવણી સક્રિય',
    scan_title: 'જૂના પ્રિસ્ક્રિપ્શન અને રિપોર્ટ્સ સ્કેન કરો',
    scan_subtitle: 'દવાઓની પાવતી અથવા લોહીની તપાસના રિપોર્ટ્સ અપલોડ કરો.',
    scan_add_btn: 'પ્રિસ્ક્રિપ્શન / રિપોર્ટ ઉમેરો',
    scan_processing: 'દસ્તાવેજો તપાસાઈ રહ્યા છે...',
    scan_privacy_note: 'સંપૂર્ણ ગોપનીયતા: માહિતી કોઈ ડિસ્ક પર સંગ્રહિત થતી નથી.',
    uploaded_docs_title: 'જોડાયેલા દસ્તાવેજો',
    scan_finish_btn: 'સમાપ્ત કરો અને ડૉક્ટરને મોકલો',
    scan_prompt: 'કૃપા કરીને તમારા જૂના રિપોર્ટ્સ અથવા પ્રિસ્ક્રિપ્શન સ્કેન કરો.',
    confirm_title: 'આભાર! તમારી વિગતો નોંધાઈ ગઈ છે.',
    confirm_desc: 'તમારી માહિતી સુરક્ષિત રીતે ડૉક્ટર પાસે મોકલી દેવામાં આવી છે. કૃપા કરીને તપાસ રૂમની બહાર રાહ જુઓ.',
    home_btn: 'મુખ્ય પૃષ્ઠ પર જાઓ',
    confirm_prompt: 'તમારી માહિતી સુરક્ષિત રીતે નોંધાઈ ગઈ છે. આભાર!'
  },
  kn: {
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    bcp47: 'kn-IN',
    app_title: 'ಮೆಡಿಕಿಯೋಸ್ಕ್ ರೋಗಿ ಪೋರ್ಟಲ್',
    change_lang: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    human_help: 'ಸಹಾಯಕರ ಸಹಾಯ',
    help_notified: 'ಸಹಾಯಕ ಸಿಬ್ಬಂದಿಗೆ ತಿಳಿಸಲಾಗಿದೆ.',
    select_title: 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    select_subtitle: 'ಮಾತನಾಡುವ ಅಥವಾ ಸ್ಪರ್ಶಿಸುವ ಮೂಲಕ ಸುಲಭ ಸಹಾಯಕ್ಕಾಗಿ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    select_footer: '10 ಪ್ರಮುಖ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಧ್ವನಿ ಮತ್ತು ಸ್ಪರ್ಶ ಸೌಲಭ್ಯ',
    consent_title: 'ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ಡೇಟಾ ಸಮ್ಮತಿ (DPDP)',
    consent_body: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯನ್ನು ಕೇವಲ ವೈದ್ಯರ ಸಮಾಲೋಚನೆಗಾಗಿ ಮತ್ತು ಪ್ರಾಥಮಿಕ ಸಾರಾಂಶ ತಯಾರಿಕೆಗೆ ಮಾತ್ರ ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ. ನಿಮ್ಮ ಡೇಟಾ ಸಂಪೂರ್ಣ ಗೌಪ್ಯವಾಗಿರುತ್ತದೆ.',
    consent_guardian: 'ಪೋಷಕರಾಗಿ ಸಮ್ಮತಿ ನೀಡುವುದು',
    consent_agree: 'ಒಪ್ಪಿ ಮುಂದುವರಿಯಿರಿ',
    consent_decline: 'ತಿರಸ್ಕರಿಸಿ',
    consent_prompt: 'ದಯವಿಟ್ಟು ಡೇಟಾ ಸಮ್ಮತಿ ಸೂಚನೆಯನ್ನು ಕೇಳಿ ಒಪ್ಪಿಕೊಳ್ಳಿ.',
    identify_title: 'ರೋಗಿಯ ಗುರುತು ಮತ್ತು ನೋಂದಣಿ',
    identify_subtitle: 'ನೋಂದಣಿ ಚೀಟಿಯ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ ಟೋಕನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
    scan_qr_title: 'ಆಭಾ / ಟೋಕನ್ ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    scan_qr_desc: 'ಕ್ಯಾಮೆರಾ ಮುಂದೆ ಚೀಟಿಯನ್ನು ಹಿಡಿಯಿರಿ',
    queue_id_label: 'ಟೋಕನ್ / ಸರತಿ ಸಂಖ್ಯೆ',
    abha_id_label: 'ಆಭಾ ಹೆಲ್ತ್ ಐಡಿ (ಐಚ್ಛಿಕ)',
    start_interview_btn: 'ಆರೋಗ್ಯ ಸಂದರ್ಶನ ಪ್ರಾರಂಭಿಸಿ',
    identify_prompt: 'ದಯವಿಟ್ಟು ಟೋಕನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಚೀಟಿಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
    section_label: 'ವಿಭಾಗ',
    mode_badge: 'ಕನ್ನಡ ಧ್ವನಿ ಮತ್ತು ಸ್ಪರ್ಶ ಮೋಡ್',
    self_report_note: 'ವೈದ್ಯರ ಪರಿಶೀಲನೆಗಾಗಿ ರೋಗಿ ನೀಡಿರುವ ವಿವರಗಳು',
    mic_start_text: 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಮತ್ತು ಕೆಳಗಿನ ಸಲ್ಲಿಕೆ ಬಟನ್ ಒತ್ತಿರಿ',
    mic_active_text: '🎙️ ಲೈವ್ ಧ್ವನಿ ಸಕ್ರಿಯ — ಮಾತನಾಡಿ ಸಬ್ಮಿಟ್ ಒತ್ತಿ',
    mic_tap_stop: 'ಮೈಕ್ ನಿಲ್ಲಿಸಲು ಮತ್ತೆ ಸ್ಪರ್ಶಿಸಿ',
    voice_submit_btn: 'ಉತ್ತರ ಕಳುಹಿಸಿ',
    voice_clear_btn: 'ಮತ್ತೆ ಮಾತನಾಡಿ',
    unknown_btn: 'ನನಗೆ ಗೊತ್ತಿಲ್ಲ',
    prefer_not_btn: 'ಹೇಳಲು ಇಷ್ಟವಿಲ್ಲ',
    initial_q: 'ಇಂದು ನೀವು ಆಸ್ಪತ್ರೆಗೆ ಯಾವ ಮುಖ್ಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಯಿಂದ ಬಂದಿದ್ದೀರಿ?',
    initial_options: ['ಎದೆ ನೋವು ಅಥವಾ ಭಾರ', 'ತೀವ್ರ ಜ್ವರ ಅಥವಾ ನಡುಕ', 'ಹೊಟ್ಟೆ ನೋವು ಅಥವಾ ಅಜೀರ್ಣ', 'ಕೆಮ್ಮು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ', 'ತಲೆನೋವು ಅಥವಾ ತಲೆಸುತ್ತು', 'ಬೆನ್ನು ಅಥವಾ ಕೀಲು ನೋವು', 'ಇತರ ತೊಂದರೆ'],
    red_flag_title: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ — ತಕ್ಷಣ ಸಹಾಯ ಪಡೆಯಿರಿ',
    red_flag_default: 'ದಯವಿಟ್ಟು ತಕ್ಷಣ ತುರ್ತು ಚಿಕಿತ್ಸಾ ಡೆಸ್ಕ್‌ಗೆ ತೆರಳಿ. ಸಿಬ್ಬಂದಿಗೆ ತಿಳಿಸಲಾಗಿದೆ.',
    red_flag_footer: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯಗೊಂಡಿದೆ',
    scan_title: 'ಹಳೆಯ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ವರದಿಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    scan_subtitle: 'ಔಷಧಿ ಚೀಟಿಗಳು ಅಥವಾ ರಕ್ತ ಪರೀಕ್ಷಾ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    scan_add_btn: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ / ವರದಿ ಸೇರಿಸಿ',
    scan_processing: 'ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    scan_privacy_note: 'ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆ: ಮಾಹಿತಿಯನ್ನು ಯಾವುದೇ ಡಿಸ್ಕ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ.',
    uploaded_docs_title: 'ಲಗತ್ತಿಸಲಾದ ದಾಖಲೆಗಳು',
    scan_finish_btn: 'ಪೂರ್ಣಗೊಳಿಸಿ ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಿ',
    scan_prompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹಳೆಯ ವರದಿಗಳು ಅಥವಾ ಚೀಟಿಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
    confirm_title: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ.',
    confirm_desc: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ವಿವರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ವೈದ್ಯರ ಕಂಪ್ಯೂಟರ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಕೊಠಡಿಯ ಹೊರಗೆ ಕಾಯಿರಿ.',
    home_btn: 'ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ',
    confirm_prompt: 'ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು!'
  },
  ml: {
    name: 'Malayalam',
    native: 'മലയാളം',
    bcp47: 'ml-IN',
    app_title: 'മെഡിക്കിയോസ്ക് പേഷ്യന്റ് പോർട്ടൽ',
    change_lang: 'ഭാഷ മാറ്റുക',
    human_help: 'സഹായം ആവശ്യപ്പെടുക',
    help_notified: 'സഹായ ഉദ്യോഗസ്ഥനെ അറിയിച്ചിട്ടുണ്ട്.',
    select_title: 'നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഭാഷ തിരഞ്ഞെടുക്കുക',
    select_subtitle: 'സംസാരിച്ചോ തൊട്ടോ എളുപ്പത്തിൽ വിവരങ്ങൾ നൽകാൻ ഭാഷ തിരഞ്ഞെടുക്കുക.',
    select_footer: '10 പ്രധാന ഇന്ത്യൻ ഭാഷകളിൽ വോയ്‌സ് & ടച്ച് സൗകര്യം',
    consent_title: 'ഡിജിറ്റൽ ആരോഗ്യ ഡാറ്റാ സമ്മതം (DPDP)',
    consent_body: 'നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ ഡോക്ടറുടെ പരിശോധനയ്ക്കും പ്രാഥമിക ആരോഗ്യ വിവരങ്ങൾ തയ്യാറാക്കുന്നതിനും മാത്രമായി സുരക്ഷിതമായി ശേഖരിക്കുന്നു. വിവരങ്ങൾ പൂർണ്ണമായും രഹസ്യമായിരിക്കും.',
    consent_guardian: 'രക്ഷിതാവ് എന്ന നിലയിൽ സമ്മതം നൽകുക',
    consent_agree: 'സമ്മതിച്ച് മുന്നോട്ട് പോകുക',
    consent_decline: 'നിരസിക്കുക',
    consent_prompt: 'ദയവായി ഡാറ്റാ സമ്മത അറിയിപ്പ് കേട്ട് അംഗീകരിക്കുക.',
    identify_title: 'രോഗിയുടെ തിരിച്ചറിയലും രജിസ്ട്രേഷനും',
    identify_subtitle: 'രജിസ്ട്രേഷൻ സ്ലിപ്പിലെ ക്യുആർ കോഡ് സ്കാൻ ചെയ്യുക അല്ലെങ്കിൽ ടോക്കൺ നമ്പർ നൽകുക.',
    scan_qr_title: 'ആഭാ / ടോക്കൺ ക്യുആർ സ്കാൻ ചെയ്യുക',
    scan_qr_desc: 'ക്യാമറയ്ക്ക് മുന്നിൽ സ്ലിപ്പ് കാണിക്കുക',
    queue_id_label: 'ടോക്കൺ / ക്യൂ നമ്പർ',
    abha_id_label: 'ആഭാ ഹെൽത്ത് ഐഡി (നിർബന്ധമില്ല)',
    start_interview_btn: 'ആരോഗ്യ വിവരങ്ങൾ നൽകാൻ തുടങ്ങുക',
    identify_prompt: 'ദയവായി ടോക്കൺ നമ്പർ നൽകുക അല്ലെങ്കിൽ സ്ലിപ്പ് സ്കാൻ ചെയ്യുക.',
    section_label: 'വിഭാഗം',
    mode_badge: 'മലയാളം വോയ്‌സ് & ടച്ച് മോഡ്',
    self_report_note: 'ഡോക്ടറുടെ പരിശോധനയ്ക്കായി രോഗി നൽകിയ വിവരങ്ങൾ',
    mic_start_text: 'മൈക്ക് ഓൺ ചെയ്ത് സംസാരിക്കുക, ശേഷം സബ്മിറ്റ് അമർത്തുക',
    mic_active_text: '🎙️ ലൈവ് വോയ്‌സ് ഓൺ — സംസാരിച്ച ശേഷം സബ്മിറ്റ് ചെയ്യുക',
    mic_tap_stop: 'മൈക്ക് നിർത്താൻ വീണ്ടും തൊടുക',
    voice_submit_btn: 'ഉത്തരം സമർപ്പിക്കുക',
    voice_clear_btn: 'വീണ്ടും പറയുക',
    unknown_btn: 'എനിക്ക് ഉറപ്പില്ല',
    prefer_not_btn: 'പറയാൻ താല്പര്യമില്ല',
    initial_q: 'ഇന്ന് നിങ്ങൾ എന്തൊക്കെ പ്രധാന അസുഖങ്ങൾക്കാണ് ആശുപത്രിയിൽ എത്തിയത്?',
    initial_options: ['നെഞ്ചുവേദന അല്ലെങ്കിൽ ഭാരം', 'കടുത്ത പനി അല്ലെങ്കിൽ വിറയൽ', 'വയറുവേദന അല്ലെങ്കിൽ ദഹനക്കേട്', 'ചുമയും ശ്വാസംമുട്ടലും', 'തലവേദന അല്ലെങ്കിൽ തലകറക്കം', 'നടുവേദന അല്ലെങ്കിൽ സന്ധിവേദന', 'മറ്റ് അസുഖങ്ങൾ'],
    red_flag_title: 'അടിയന്തിര മുന്നറിയിപ്പ് — ഉടൻ സഹായം തേടുക',
    red_flag_default: 'ദയവായി ഉടൻ തന്നെ എമർജൻസി ഡെസ്കിലേക്ക് പോകുക. ആരോഗ്യപ്രവർത്തകരെ അറിയിച്ചിട്ടുണ്ട്.',
    red_flag_footer: 'എമർജൻസി ട്രയാജ് മുന്നറിയിപ്പ് സജീവമാണ്',
    scan_title: 'പഴയ കുറിപ്പടികളും റിപ്പോർട്ടുകളും സ്കാൻ ചെയ്യുക',
    scan_subtitle: 'മരുന്ന് കുറിപ്പടികൾ അല്ലെങ്കിൽ രക്തപരിശോധനാ റിപ്പോർട്ടുകൾ അപ്‌ലോഡ് ചെയ്യുക.',
    scan_add_btn: 'കുറിപ്പടി / റിപ്പോർട്ട് ചേർക്കുക',
    scan_processing: 'രേഖകൾ പരിശോധിക്കുന്നു...',
    scan_privacy_note: 'പൂർണ്ണ സുരക്ഷിതത്വം: വിവരങ്ങൾ ഡിസ്കിൽ സൂക്ഷിക്കുന്നില്ല.',
    uploaded_docs_title: 'ചേർത്ത രേഖകൾ',
    scan_finish_btn: 'പൂർത്തിയാക്കി ഡോക്ടർക്ക് അയക്കുക',
    scan_prompt: 'ദയവായി നിങ്ങളുടെ പഴയ റിപ്പോർട്ടുകൾ അല്ലെങ്കിൽ കുറിപ്പടികൾ സ്കാൻ ചെയ്യുക.',
    confirm_title: 'നന്ദി! നിങ്ങളുടെ വിവരങ്ങൾ രേഖപ്പെടുത്തി.',
    confirm_desc: 'നിങ്ങളുടെ വിവരങ്ങൾ സുരക്ഷിതമായി ഡോക്ടറുടെ കമ്പ്യൂട്ടറിലേക്ക് അയച്ചു. ദയവായി മുറിക്ക് പുറത്ത് കാത്തിരിക്കുക.',
    home_btn: 'ഹോം പേജിലേക്ക് പോകുക',
    confirm_prompt: 'നിങ്ങളുടെ വിവരങ്ങൾ വിജയകരമായി രേഖപ്പെടുത്തി. നന്ദി!'
  },
  pa: {
    name: 'Punjabi',
    native: 'ਪੰਜਾਬੀ',
    bcp47: 'pa-IN',
    app_title: 'ਮੈਡੀਕਿਓਸਕ ਮਰੀਜ਼ ਪੋਰਟਲ',
    change_lang: 'ਭਾਸ਼ਾ ਬਦਲੋ',
    human_help: 'ਮਦਦਗਾਰ ਦੀ ਸਹਾਇਤਾ',
    help_notified: 'ਸਹਾਇਕ ਸਟਾਫ ਨੂੰ ਸੂਚਿਤ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।',
    select_title: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
    select_subtitle: 'ਬੋਲ ਕੇ ਜਾਂ ਛੂਹ ਕੇ ਆਸਾਨ ਜਾਣਕਾਰੀ ਲਈ ਭਾਸ਼ਾ ਚੁਣੋ।',
    select_footer: '10 ਪ੍ਰਮੁੱਖ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਆਵਾਜ਼ ਅਤੇ ਟੱਚ ਸਹੂਲਤ ਉਪਲਬਧ',
    consent_title: 'ਡਿਜੀਟਲ ਸਿਹਤ ਡਾਟਾ ਸਹਿਮਤੀ (DPDP)',
    consent_body: 'ਤੁਹਾਡੀ ਡਾਕਟਰੀ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਅਤੇ ਮੁੱਢਲੀ ਜਾਂਚ ਰਿਪੋਰਟ ਲਈ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਲਈ ਜਾ ਰਹੀ ਹੈ। ਇਹ ਡਾਟਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਗੁਪਤ ਰੱਖਿਆ ਜਾਵੇਗਾ।',
    consent_guardian: 'ਸਰਪ੍ਰਸਤ ਜਾਂ ਦੇਖਭਾਲ ਕਰਨ ਵਾਲੇ ਵਜੋਂ ਸਹਿਮਤੀ',
    consent_agree: 'ਸਹਿਮਤ ਹੋਵੋ ਅਤੇ ਅੱਗੇ ਵਧੋ',
    consent_decline: 'ਅਸਵੀਕਾਰ ਕਰੋ',
    consent_prompt: 'ਕਿਰਪਾ ਕਰਕੇ ਡਾਟਾ ਸਹਿਮਤੀ ਸੁਣੋ ਅਤੇ ਸਵੀਕਾਰ ਕਰੋ।',
    identify_title: 'ਮਰੀਜ਼ ਦੀ ਪਛਾਣ ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    identify_subtitle: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪਰਚੀ ਦਾ ਕਿਊਆਰ ਕੋਡ ਸਕੈਨ ਕਰੋ ਜਾਂ ਟੋਕਨ ਨੰਬਰ ਦਰਜ ਕਰੋ।',
    scan_qr_title: 'ਆਭਾ / ਟੋਕਨ ਕਿਊਆਰ ਸਕੈਨ ਕਰੋ',
    scan_qr_desc: 'ਕੈਮਰੇ ਦੇ ਸਾਹਮਣੇ ਪਰਚੀ ਰੱਖੋ',
    queue_id_label: 'ਟੋਕਨ / ਕਤਾਰ ਨੰਬਰ',
    abha_id_label: 'ਆਭਾ ਹੈਲਥ ਆਈਡੀ (ਵਿਕਲਪਿਕ)',
    start_interview_btn: 'ਸਿਹਤ ਇੰਟਰਵਿਊ ਸ਼ੁਰੂ ਕਰੋ',
    identify_prompt: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਟੋਕਨ ਨੰਬਰ ਦਰਜ ਕਰੋ ਜਾਂ ਪਰਚੀ ਸਕੈਨ ਕਰੋ।',
    section_label: 'ਵਿਭਾਗ',
    mode_badge: 'ਪੰਜਾਬੀ ਆਵਾਜ਼ ਅਤੇ ਟੱਚ ਮੋਡ',
    self_report_note: 'ਡਾਕਟਰ ਦੀ ਜਾਂਚ ਲਈ ਮਰੀਜ਼ ਦੁਆਰਾ ਦਿੱਤੀ ਗਈ ਜਾਣਕਾਰੀ',
    mic_start_text: 'ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ ਅਤੇ ਹੇਠਾਂ ਦਿੱਤਾ ਸਬਮਿਟ ਬਟਨ ਦਬਾਓ',
    mic_active_text: '🎙️ ਲਾਈਵ ਆਵਾਜ਼ ਚਾਲੂ ਹੈ — ਬੋਲੋ ਅਤੇ ਸਬਮਿਟ ਦਬਾਓ',
    mic_tap_stop: 'ਮਾਈਕ ਬੰਦ ਕਰਨ ਲਈ ਦੁਬਾਰਾ ਦਬਾਓ',
    voice_submit_btn: 'ਜਵਾਬ ਦਰਜ ਕਰੋ',
    voice_clear_btn: 'ਮੁੜ ਬੋਲੋ',
    unknown_btn: 'ਮੈਨੂੰ ਪਤਾ ਨਹੀਂ ਹੈ',
    prefer_not_btn: 'ਦੱਸਣਾ ਨਹੀਂ ਚਾਹੁੰਦੇ',
    initial_q: 'ਅੱਜ ਤੁਸੀਂ ਹਸਪਤਾਲ ਕਿਸ ਮੁੱਖ ਤਕਲੀਫ਼ ਜਾਂ ਬਿਮਾਰੀ ਲਈ ਆਏ ਹੋ?',
    initial_options: ['ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਜਾਂ ਭਾਰਾਪਣ', 'ਤੇਜ਼ ਬੁਖ਼ਾਰ ਜਾਂ ਕੰਬਣੀ', 'ਪੇਟ ਦਰਦ ਜਾਂ ਬਦਹਜ਼ਮੀ', 'ਖੰਘ ਅਤੇ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼', 'ਸਿਰਦਰਦ ਜਾਂ ਚੱਕਰ ਆਉਣਾ', 'ਕਮਰ ਜਾਂ ਜੋੜਾਂ ਦਾ ਦਰਦ', 'ਹੋਰ ਕੋਈ ਸਮੱਸਿਆ'],
    red_flag_title: 'ਐਮਰਜੈਂਸੀ ਚਿਤਾਵਨੀ — ਤੁਰੰਤ ਮਦਦ ਲਵੋ',
    red_flag_default: 'ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਡੈਸਕ ਤੇ ਜਾਓ। ਸਟਾਫ ਨੂੰ ਸੂਚਿਤ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।',
    red_flag_footer: 'ਐਮਰਜੈਂਸੀ ਚਿਤਾਵਨੀ ਚਾਲੂ ਹੈ',
    scan_title: 'ਪੁਰਾਣੀਆਂ ਪਰਚੀਆਂ ਅਤੇ ਰਿਪੋਰਟਾਂ ਸਕੈਨ ਕਰੋ',
    scan_subtitle: 'ਦਵਾਈਆਂ ਦੀਆਂ ਪਰਚੀਆਂ ਜਾਂ ਖੂਨ ਦੀ ਜਾਂਚ ਦੀਆਂ ਰਿਪੋਰਟਾਂ ਅਪਲੋਡ ਕਰੋ।',
    scan_add_btn: 'ਪਰਚੀ / ਰਿਪੋਰਟ ਸ਼ਾਮਲ ਕਰੋ',
    scan_processing: 'ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',
    scan_privacy_note: 'ਪੂਰੀ ਗੁਪਤਤਾ: ਡਾਟਾ ਕਿਸੇ ਵੀ ਡਿਸਕ ਤੇ ਸਟੋਰ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ।',
    uploaded_docs_title: 'ਸ਼ਾਮਲ ਕੀਤੇ ਦਸਤਾਵੇਜ਼',
    scan_finish_btn: 'ਮੁਕੰਮਲ ਕਰੋ ਅਤੇ ਡਾਕਟਰ ਨੂੰ ਭੇਜੋ',
    scan_prompt: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀਆਂ ਪੁਰਾਣੀਆਂ ਰਿਪੋਰਟਾਂ ਜਾਂ ਪਰਚੀਆਂ ਸਕੈਨ ਕਰੋ।',
    confirm_title: 'ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦਰਜ ਹੋ ਗਈ ਹੈ।',
    confirm_desc: 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਡਾਕਟਰ ਦੇ ਕੰਪਿਊਟਰ ਤੇ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕਮਰੇ ਦੇ ਬਾਹਰ ਉਡੀਕ ਕਰੋ।',
    home_btn: 'ਮੁੱਖ ਪੰਨੇ ਤੇ ਜਾਓ',
    confirm_prompt: 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕਰ ਲਈ ਗਈ ਹੈ। ਧੰਨਵਾਦ!'
  }
};

export default function KioskPortal() {
  const [step, setStep] = useState<'language' | 'consent' | 'identify' | 'interview' | 'red_flag' | 'scan' | 'confirm'>('language');
  const [language, setLanguage] = useState<string>('hi');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [queueId, setQueueId] = useState<string>('Q-101');
  const [abhaId, setAbhaId] = useState<string>('');
  const [isGuardian, setIsGuardian] = useState<boolean>(false);
  
  const currentLang = LOCALIZED_LANGUAGES[language] || LOCALIZED_LANGUAGES.hi;

  // Fetch continuous sequential queue token on load
  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (data.next_token) {
          setQueueId(data.next_token);
        }
      })
      .catch(err => console.warn('Could not fetch next queue token:', err));
  }, []);

  // Clinical Mode (Ministry of AYUSH vs Standard Allopathy)
  const [clinicalMode, setClinicalMode] = useState<'allopathy' | 'ayurveda'>('allopathy');
  const [showAyushModal, setShowAyushModal] = useState<boolean>(false);
  const [ayushPasswordInput, setAyushPasswordInput] = useState<string>('');
  const [ayushError, setAyushError] = useState<string | null>(null);

  // Dynamic Interview State
  const [currentQuestion, setCurrentQuestion] = useState<any>({
    id: 'q_chief_complaint',
    question_localized: currentLang.initial_q,
    question_en: 'What primary symptom or complaint brings you to the health center today?',
    section: 'chief_complaint',
    field_name: 'chief_complaint',
    options: currentLang.initial_options
  });
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [answeredHistory, setAnsweredHistory] = useState<any[]>([]);

  // Red Flag Alert State
  const [redFlagTrigger, setRedFlagTrigger] = useState<any>(null);

  // Document Scan State
  const [scannedFiles, setScannedFiles] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [qualityWarning, setQualityWarning] = useState<string | null>(null);

  // Persistent Conversational Speech Recognition Refs
  const recognitionRef = useRef<any>(null);
  const isMicActiveRef = useRef<boolean>(false);
  const isAISpeakingRef = useRef<boolean>(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up Speech Recognition on unmount
  useEffect(() => {
    return () => {
      isMicActiveRef.current = false;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Universal Instant Native Voice Audio Synthesis (Zero-Latency Browser SpeechSynthesis First)
  const speakPrompt = (text: string, overrideLang?: string) => {
    if (typeof window === 'undefined' || !text) return;

    // Stop previous audio / speech
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    isAISpeakingRef.current = true;

    // Pause recognition while speaking
    if (recognitionRef.current && isMicActiveRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const targetLang = overrideLang || language || 'hi';
    const targetPack = LOCALIZED_LANGUAGES[targetLang] || LOCALIZED_LANGUAGES.hi;

    // 1. Instant zero-latency native Web Speech Synthesis
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetPack.bcp47;
        utterance.rate = 0.95;
        utterance.onend = () => {
          isAISpeakingRef.current = false;
          if (isMicActiveRef.current) startListeningLoop();
        };
        utterance.onerror = () => {
          isAISpeakingRef.current = false;
          if (isMicActiveRef.current) startListeningLoop();
        };
        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        console.warn('SpeechSynthesis error, falling back:', e);
      }
    }

    // 2. Fallback Audio proxy
    const audioUrl = `/api/tts?lang=${encodeURIComponent(targetLang)}&text=${encodeURIComponent(text)}`;
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;

    audio.onended = () => {
      isAISpeakingRef.current = false;
      if (isMicActiveRef.current) startListeningLoop();
    };

    audio.onerror = () => {
      isAISpeakingRef.current = false;
      if (isMicActiveRef.current) startListeningLoop();
    };

    audio.play().catch(err => {
      console.warn('Audio play notice (auto-play policy):', err);
      isAISpeakingRef.current = false;
      if (isMicActiveRef.current) startListeningLoop();
    });
  };

  // Start / Resume Continuous Listening Loop in Native Locale
  const startListeningLoop = () => {
    if (!isMicActiveRef.current || isAISpeakingRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.lang = currentLang.bcp47;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const combined = (finalTranscript || interimTranscript).trim();
        if (combined) {
          setLiveTranscript(combined);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
      };

      recognition.onend = () => {
        if (isMicActiveRef.current && !isAISpeakingRef.current) {
          setTimeout(() => {
            if (isMicActiveRef.current && !isAISpeakingRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          }, 200);
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
    }
  };

  // Toggle Microphone (User explicitly starts/stops continuous conversation)
  const toggleSpeechRecognition = () => {
    if (isListening || isMicActiveRef.current) {
      isMicActiveRef.current = false;
      setIsListening(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    } else {
      isMicActiveRef.current = true;
      setIsListening(true);
      startListeningLoop();
    }
  };

  // Select Language and Start Session
  const handleStartSession = async (langCode: string) => {
    setLanguage(langCode);
    const targetPack = LOCALIZED_LANGUAGES[langCode] || LOCALIZED_LANGUAGES.hi;
    
    // Set localized initial question & options (tailored if AYUSH mode)
    const isAyurveda = clinicalMode === 'ayurveda';
    const ayushInitialOptions = [
      'वात दोष / Gas, dryness, joint pain (Vata)',
      'पित्त दोष / Acidity, burning, fever (Pitta)',
      'कफ दोष / Cough, congestion, lethargy (Kapha)',
      'अग्निमांद्य / Indigestion & loss of appetite',
      'अन्य स्वास्थ्य समस्या / Other symptom'
    ];

    setCurrentQuestion({
      id: 'q_chief_complaint',
      question_localized: isAyurveda ? `${targetPack.initial_q} (आयुष मोड)` : targetPack.initial_q,
      question_en: isAyurveda ? 'What primary Ayurvedic or general health symptom brings you here today?' : 'What primary symptom or health complaint brings you to the clinic today?',
      section: isAyurveda ? 'ayush_chief_complaint' : 'chief_complaint',
      field_name: 'chief_complaint',
      options: isAyurveda ? ayushInitialOptions : targetPack.initial_options
    });

    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language: langCode, 
          queue_id: queueId, 
          abha_mock_id: abhaId || null,
          clinical_mode: clinicalMode
        })
      });
      const data = await res.json();
      if (data.session) {
        setSessionId(data.session.id);
        setStep('consent');
        speakPrompt(targetPack.consent_prompt, langCode);
      }
    } catch (err) {
      console.error('Session start error:', err);
      setStep('consent');
    }
  };

  // AYUSH Mode Password Verification Handler (Password: Ayurveda)
  const handleAyushPasswordSubmit = () => {
    if (ayushPasswordInput.trim() === 'Ayurveda') {
      setClinicalMode('ayurveda');
      setShowAyushModal(false);
      setAyushPasswordInput('');
      setAyushError(null);
      alert('🌿 Ministry of AYUSH (Ayurveda) Mode Activated successfully!');
    } else {
      setAyushError('Invalid password. Please enter the official AYUSH password: Ayurveda');
    }
  };

  const handleDisableAyushMode = () => {
    setClinicalMode('allopathy');
    alert('Switched back to Standard Allopathic Mode.');
  };

  // Record Consent
  const handleConsent = async (agreed: boolean) => {
    if (!agreed) {
      alert('Consent declined.');
      return;
    }
    if (sessionId) {
      await fetch(`/api/session/${sessionId}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'touch', language, notice_version: 'v1.0' })
      });
    }
    setStep('identify');
    speakPrompt(currentLang.identify_prompt);
  };

  // Record Interview Turn with Dynamic Follow-Up AI
  const handleAnswerTurn = async (answerValue: string, sourceMode: 'touch' | 'voice' = 'touch') => {
    if (!sessionId || !answerValue.trim()) return;
    
    setAnsweredHistory(prev => [...prev, { question: currentQuestion, answer: answerValue }]);
    setLiveTranscript('');

    try {
      const res = await fetch(`/api/session/${sessionId}/converse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          source_mode: sourceMode,
          transcript_text: answerValue,
          section: currentQuestion.section || 'chief_complaint',
          field_name: currentQuestion.field_name || 'chief_complaint',
          question_text: currentQuestion.question_localized || currentQuestion.question_en
        })
      });

      const data = await res.json();

      // Check Red Flag Interrupt
      if (data.red_flag) {
        setRedFlagTrigger(data.trigger);
        setStep('red_flag');
        speakPrompt(currentLang.red_flag_default);
        return;
      }

      if (data.next_question) {
        setCurrentQuestion(data.next_question);
        speakPrompt(data.next_question.question_localized || data.next_question.question_en);
      } else {
        // Interview Complete -> Proceed to Scan
        setStep('scan');
        speakPrompt(currentLang.scan_prompt);
      }
    } catch (err) {
      console.error('Error submitting turn:', err);
    }
  };

  // Handle Document Upload & Quality Check
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !sessionId) return;
    const file = e.target.files[0];

    setIsScanning(true);
    setQualityWarning(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/session/${sessionId}/scan`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setIsScanning(false);

      if (data.success) {
        setScannedFiles(prev => [...prev, { name: file.name, data: data.raw_extraction }]);
      } else {
        setQualityWarning('Document quality check warning: Please ensure paper is flat and readable.');
      }
    } catch (err) {
      setIsScanning(false);
      setQualityWarning('Upload failed. Please try scanning again.');
    }
  };

  // Final Summary Generation & Recap
  const handleFinishKiosk = async () => {
    if (sessionId) {
      await fetch(`/api/session/${sessionId}/summary`, { method: 'POST' });
    }
    setStep('confirm');
    speakPrompt(currentLang.confirm_prompt);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-between p-4 md:p-6 max-w-5xl mx-auto">
      {/* Kiosk Header */}
      <header className="flex flex-wrap items-center justify-between py-3 border-b border-teal-900/10 mb-6 bg-white rounded-2xl p-4 shadow-sm gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${clinicalMode === 'ayurveda' ? 'bg-[#8B5A2B]' : 'bg-[#2F5D62]'}`}>
            <HeartPulse className="w-6 h-6 text-[#EAF3F2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-lg font-bold ${clinicalMode === 'ayurveda' ? 'text-[#8B5A2B]' : 'text-[#2F5D62]'}`}>{currentLang.app_title}</h1>
              {clinicalMode === 'ayurveda' && (
                <span className="bg-amber-100 text-[#8B5A2B] border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  🌿 Ministry of AYUSH
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{currentLang.name} ({currentLang.native}) {clinicalMode === 'ayurveda' ? '• आयुर्वेद क्लिनिकल मोड' : '• OPD Kiosk'}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2.5 flex-wrap">
          {clinicalMode === 'ayurveda' ? (
            <button 
              onClick={handleDisableAyushMode}
              className="touch-target bg-amber-50 text-[#8B5A2B] border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100"
              title="Click to switch back to Allopathy"
            >
              <span>🌿 AYUSH Active (Click to Exit)</span>
            </button>
          ) : (
            <button 
              onClick={() => { setShowAyushModal(true); setAyushError(null); setAyushPasswordInput(''); }}
              className="touch-target bg-emerald-50 text-[#2E7D4F] border border-emerald-300 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-all"
              title="Activate Ministry of AYUSH Mode (Password Protected)"
            >
              <span>🌿 Ministry of AYUSH Mode</span>
            </button>
          )}

          <button 
            onClick={() => setStep('language')}
            className="touch-target bg-slate-100 text-[#2F5D62] border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200"
          >
            <Globe className="w-4 h-4" />
            <span>{currentLang.change_lang}</span>
          </button>
          <button 
            onClick={() => speakPrompt(currentLang.help_notified)}
            className="touch-target bg-amber-50 text-[#B8860B] border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-100"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{currentLang.human_help}</span>
          </button>
        </div>
      </header>

      {/* AYUSH PASSWORD VERIFICATION MODAL */}
      {showAyushModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border-2 border-amber-300 shadow-2xl animate-in fade-in duration-200">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-amber-100 text-[#8B5A2B] rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                🌿
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Ministry of AYUSH Mode</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the authorized clinical password to activate Tridosha (Vata-Pitta-Kapha) & Agni intake portal.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Authorized Password</label>
                <input 
                  type="password" 
                  value={ayushPasswordInput}
                  onChange={e => setAyushPasswordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAyushPasswordSubmit()}
                  placeholder="Enter password (e.g. Ayurveda)"
                  className="w-full p-3.5 border-2 border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:border-[#8B5A2B] outline-none"
                  autoFocus
                />
              </div>

              {ayushError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {ayushError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowAyushModal(false)}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAyushPasswordSubmit}
                className="w-full py-3 rounded-xl bg-[#8B5A2B] text-white font-bold text-sm hover:bg-amber-900 transition-all shadow-md"
              >
                Verify & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: MULTI-LANGUAGE SELECTION GRID (10 INDIAN LANGUAGES) */}
      {step === 'language' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm text-center my-auto">
          {clinicalMode === 'ayurveda' && (
            <div className="bg-amber-50 border border-amber-300 text-[#8B5A2B] p-3 rounded-2xl mb-5 flex items-center justify-center gap-2 text-xs font-bold">
              <span>🌿 Ministry of AYUSH Mode is ACTIVE — Ayurvedic Prakriti & Tridosha Intake Enabled</span>
            </div>
          )}

          <div className="w-16 h-16 rounded-2xl bg-[#EAF3F2] text-[#2F5D62] flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-2">{currentLang.select_title}</h2>
          <p className="text-slate-600 text-sm mb-6">{currentLang.select_subtitle}</p>

          {/* 10 Regional Languages Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 max-w-4xl mx-auto mb-6">
            {Object.entries(LOCALIZED_LANGUAGES).map(([code, pack]) => (
              <button
                key={code}
                onClick={() => handleStartSession(code)}
                className={`touch-target rounded-2xl p-4 flex flex-col items-center justify-center transition-all group shadow-sm border-2 ${
                  language === code 
                    ? 'border-[#2F5D62] bg-[#EAF3F2]' 
                    : 'bg-slate-50 hover:bg-[#2F5D62] hover:text-white border-slate-200 hover:border-[#2F5D62]'
                }`}
              >
                <span className="text-xl font-extrabold text-slate-900 group-hover:text-white mb-1">{pack.native}</span>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-emerald-100">{pack.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
            {clinicalMode !== 'ayurveda' ? (
              <button
                onClick={() => { setShowAyushModal(true); setAyushError(null); setAyushPasswordInput(''); }}
                className="text-xs font-bold text-[#8B5A2B] bg-amber-50 hover:bg-amber-100 border border-amber-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
              >
                <span>🌿 Switch to Ministry of AYUSH Mode (Password Protected)</span>
              </button>
            ) : (
              <button
                onClick={handleDisableAyushMode}
                className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl"
              >
                Exit AYUSH Mode
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: DPDP CONSENT (FULLY LOCALIZED) */}
      {step === 'consent' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm my-auto">
          <div className="flex items-center gap-3 text-[#2F5D62] mb-4">
            <h2 className="text-2xl font-bold">{currentLang.consent_title}</h2>
          </div>

          <div className="bg-[#EAF3F2] p-6 rounded-2xl mb-6 text-slate-800 text-base leading-relaxed border border-teal-900/10">
            <p className="text-lg font-bold text-slate-900 mb-2">
              {currentLang.consent_body}
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <input 
              type="checkbox" 
              id="guardian" 
              checked={isGuardian} 
              onChange={e => setIsGuardian(e.target.checked)}
              className="w-5 h-5 accent-[#2F5D62] rounded" 
            />
            <label htmlFor="guardian" className="text-sm font-semibold text-slate-700">
              {currentLang.consent_guardian}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleConsent(true)}
              className="touch-target bg-[#2F5D62] text-white hover:bg-teal-800 rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 shadow-md"
            >
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span>{currentLang.consent_agree}</span>
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="touch-target bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl p-4 font-semibold text-lg flex items-center justify-center gap-2"
            >
              <XCircle className="w-6 h-6 text-slate-400" />
              <span>{currentLang.consent_decline}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: IDENTIFY (FULLY LOCALIZED) */}
      {step === 'identify' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm my-auto">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">{currentLang.identify_title}</h2>
          <p className="text-slate-600 text-sm mb-6">{currentLang.identify_subtitle}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border-2 border-dashed border-teal-800/30 rounded-2xl p-6 text-center bg-[#EAF3F2]/50 flex flex-col items-center justify-center">
              <Camera className="w-12 h-12 text-[#2F5D62] mb-3" />
              <span className="font-bold text-slate-800 text-sm">{currentLang.scan_qr_title}</span>
              <span className="text-xs text-slate-500 mt-1">{currentLang.scan_qr_desc}</span>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{currentLang.queue_id_label}</label>
                <input 
                  type="text" 
                  value={queueId} 
                  onChange={e => setQueueId(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-lg font-bold text-[#2F5D62]" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{currentLang.abha_id_label}</label>
                <input 
                  type="text" 
                  placeholder="91-1234-5678-9012"
                  value={abhaId} 
                  onChange={e => setAbhaId(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm" 
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (sessionId) {
                fetch(`/api/session/${sessionId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ queue_id: queueId, abha_mock_id: abhaId || null })
                }).catch(err => console.warn('Identity sync warning:', err));
              }
              setStep('interview');
              speakPrompt(currentQuestion.question_localized || currentQuestion.question_en);
            }}
            className="touch-target w-full bg-[#2F5D62] text-white hover:bg-teal-800 rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 shadow-md"
          >
            <span>{currentLang.start_interview_btn}</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* STEP 4: DYNAMIC AI INTERVIEW (FULLY LOCALIZED VOICE + TOUCH + EXPLICIT SUBMIT) */}
      {step === 'interview' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm my-auto">
          {/* Section Progress Bar */}
          <div className="flex items-center justify-between text-xs font-bold text-[#2F5D62] mb-6 border-b border-slate-100 pb-3">
            <span className="uppercase tracking-wider">{currentLang.section_label}: {currentQuestion.section.replace('_', ' ')}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => speakPrompt(currentQuestion.question_localized || currentQuestion.question_en)}
                className="bg-slate-100 hover:bg-slate-200 text-[#2F5D62] p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                title="Listen Again"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repeat</span>
              </button>
              <span className="bg-[#EAF3F2] px-3 py-1 rounded-full">{currentLang.mode_badge}</span>
            </div>
          </div>

          {/* Question Text in Native Language */}
          <div className="bg-[#EAF3F2] p-6 rounded-2xl mb-6 border border-teal-900/10">
            <h3 className="text-2xl font-extrabold text-[#1A1A1A] leading-snug mb-2">
              {currentQuestion.question_localized || currentQuestion.question_en}
            </h3>
            {currentQuestion.question_en && (
              <p className="text-xs text-slate-500 font-medium">{currentQuestion.question_en}</p>
            )}
          </div>

          {/* Tappable Localized Answer Chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options?.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswerTurn(opt, 'touch')}
                className="touch-target bg-slate-50 hover:bg-[#2F5D62] hover:text-white border-2 border-slate-200 hover:border-[#2F5D62] rounded-2xl p-4 text-left font-bold text-base transition-all text-slate-800 shadow-sm flex items-center justify-between"
              >
                <span>{opt}</span>
                <ChevronRight className="w-5 h-5 opacity-40" />
              </button>
            ))}
          </div>

          {/* Voice Microphone Affordance Card with Explicit Submit Button */}
          <div className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all mb-6 ${
            isListening ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              onClick={toggleSpeechRecognition}
              className={`touch-target w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg mb-3 ${
                isListening 
                  ? 'bg-[#2E7D4F] text-white ring-4 ring-emerald-300 animate-pulse' 
                  : 'bg-[#2F5D62] text-white hover:bg-teal-800'
              }`}
              title={isListening ? currentLang.mic_tap_stop : currentLang.mic_start_text}
            >
              {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
            </button>
            
            <span className="text-xs font-bold text-slate-800 text-center mb-1">
              {isListening 
                ? currentLang.mic_active_text
                : currentLang.mic_start_text
              }
            </span>

            {isListening && (
              <span className="text-[11px] text-emerald-700 font-medium mb-3">
                {currentLang.mic_tap_stop}
              </span>
            )}

            {/* Spoken Text Display & Explicit Submit Button Strip */}
            {liveTranscript ? (
              <div className="w-full mt-2 flex flex-col items-center space-y-3">
                <div className="w-full p-4 bg-white border-2 border-teal-400 rounded-2xl text-base font-bold text-[#2F5D62] text-center shadow-sm">
                  "{liveTranscript}"
                </div>

                {/* Explicit Submit & Clear Action Buttons */}
                <div className="flex items-center gap-3 w-full max-w-md">
                  <button
                    onClick={() => handleAnswerTurn(liveTranscript, 'voice')}
                    className="touch-target flex-1 bg-[#2E7D4F] hover:bg-emerald-800 text-white p-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg hover:scale-102 transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-200" />
                    <span>{currentLang.voice_submit_btn}</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>

                  <button
                    onClick={() => setLiveTranscript('')}
                    className="touch-target px-4 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-xs font-bold flex items-center gap-1.5"
                    title="Clear text"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{currentLang.voice_clear_btn}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Unknown / Prefer Not to Say Options */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <button 
              onClick={() => handleAnswerTurn(currentLang.unknown_btn, 'touch')}
              className="text-slate-500 hover:text-slate-800 underline font-medium"
            >
              {currentLang.unknown_btn}
            </button>
            <button 
              onClick={() => handleAnswerTurn(currentLang.prefer_not_btn, 'touch')}
              className="text-slate-500 hover:text-slate-800 underline font-medium"
            >
              {currentLang.prefer_not_btn}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: RED FLAG EMERGENCY ALERT (FULLY LOCALIZED) */}
      {step === 'red_flag' && (
        <div className="bg-[#C4292A] text-white rounded-3xl p-8 shadow-2xl text-center my-auto animate-pulse">
          <AlertTriangle className="w-20 h-20 mx-auto mb-6 text-amber-300" />
          <h2 className="text-3xl font-extrabold mb-4">{currentLang.red_flag_title}</h2>
          <div className="bg-white/10 p-6 rounded-2xl mb-8 border border-white/20">
            <p className="text-2xl font-bold leading-relaxed">
              {currentLang.red_flag_default}
            </p>
          </div>
          <p className="text-xs text-white/80">{currentLang.red_flag_footer}: {redFlagTrigger?.rule_id || 'EMERGENCY'}</p>
        </div>
      )}

      {/* STEP 6: DOCUMENT SCANNER (FULLY LOCALIZED) */}
      {step === 'scan' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm my-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A]">{currentLang.scan_title}</h2>
              <p className="text-slate-600 text-sm">{currentLang.scan_subtitle}</p>
            </div>
            <FileText className="w-8 h-8 text-[#2F5D62]" />
          </div>

          {qualityWarning && (
            <div className="bg-amber-50 text-[#B8860B] p-4 rounded-xl mb-4 border border-amber-200 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{qualityWarning}</span>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-300 hover:border-[#2F5D62] rounded-3xl p-8 text-center bg-slate-50 mb-6 flex flex-col items-center justify-center transition-colors">
            <Upload className="w-12 h-12 text-[#2F5D62] mb-3" />
            <label className="touch-target bg-[#2F5D62] text-white px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer shadow-md hover:bg-teal-800">
              <span>{isScanning ? currentLang.scan_processing : currentLang.scan_add_btn}</span>
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-xs text-slate-500 mt-2">{currentLang.scan_privacy_note}</span>
          </div>

          {scannedFiles.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{currentLang.uploaded_docs_title} ({scannedFiles.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scannedFiles.map((f, idx) => {
                  const ext = f.data || {};
                  const medCount = Array.isArray(ext.medications) ? ext.medications.length : 0;
                  const labCount = Array.isArray(ext.lab_values) ? ext.lab_values.length : 0;
                  const docType = typeof ext.document_type === 'string' ? ext.document_type.replace(/_/g, ' ') : 'Medical Document';
                  const docHospital = formatClinicalText(ext.doctor_or_hospital);
                  const fileName = typeof f.name === 'string' ? f.name : 'Uploaded Document';

                  return (
                    <div key={idx} className="bg-[#EAF3F2] border border-teal-800/20 rounded-2xl p-4 text-xs flex flex-col justify-between shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-[#2E7D4F] flex-shrink-0" />
                          <span className="font-bold text-slate-900 text-sm truncate">{fileName}</span>
                        </div>
                        <span className="bg-teal-800/10 text-[#2F5D62] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                          {docType}
                        </span>
                      </div>

                      <div className="text-slate-600 space-y-1 mb-2">
                        {docHospital && <p className="font-semibold text-slate-800">{docHospital}</p>}
                        <div className="flex flex-wrap gap-2 text-[11px]">
                          {medCount > 0 && <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-semibold">💊 {medCount} Medicine(s)</span>}
                          {labCount > 0 && <span className="bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md font-semibold">🧪 {labCount} Lab Value(s)</span>}
                        </div>
                      </div>

                      <div className="text-[10px] text-emerald-800 font-medium pt-2 border-t border-teal-900/10 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Mistral Vision OCR • Analyzed with Patient Intake Context</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleFinishKiosk}
            className="touch-target w-full bg-[#2F5D62] text-white hover:bg-teal-800 rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 shadow-md"
          >
            <span>{currentLang.scan_finish_btn}</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* STEP 7: CONFIRMATION (FULLY LOCALIZED) */}
      {step === 'confirm' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center my-auto">
          <div className="w-20 h-20 bg-emerald-100 text-[#2E7D4F] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-3">{currentLang.confirm_title}</h2>
          <p className="text-slate-600 text-base max-w-md mx-auto mb-8">
            {currentLang.confirm_desc}
          </p>

          <Link
            href="/"
            className="touch-target inline-flex items-center gap-2 bg-[#2F5D62] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-teal-800"
          >
            <span>{currentLang.home_btn}</span>
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-2">
        {currentLang.app_title} • 10 Major Indian Languages • DPDP Compliant
      </footer>
    </div>
  );
}
