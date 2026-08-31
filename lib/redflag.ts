/**
 * MediKiosk Deterministic Red-Flag Rule Engine (Module A §4.2)
 * Pure deterministic rule engine — NEVER LLM generated.
 * Returns red-flag rule object if matched, or null if clear.
 */

export interface RedFlagTrigger {
  rule_id: string;
  severity: 'CRITICAL' | 'HIGH';
  title: string;
  patient_instruction_hi: string;
  patient_instruction_en: string;
  triage_alert_message: string;
}

export function checkRedFlagRules(
  transcript: string,
  section: string,
  field_name: string,
  value: string
): RedFlagTrigger | null {
  const text = `${transcript} ${field_name} ${value}`.toLowerCase();

  // Rule 1: Acute Crushing Chest Pain / Cardiac Warning
  if (
    (text.includes('chest pain') || text.includes('छाती में दर्द') || text.includes('सीना दर्द')) &&
    (text.includes('crushing') || text.includes('radiat') || text.includes('arm') || text.includes('sweat') || text.includes('breathless') || text.includes('सांस फूलना') || text.includes('बांह'))
  ) {
    return {
      rule_id: 'RF_CARDIAC_ACUTE',
      severity: 'CRITICAL',
      title: 'Acute Crushing Chest Pain Suspicion',
      patient_instruction_hi: 'कृपया तुरंत आपातकालीन (Emergency) काउंटर पर जाएं — एक नर्स को सूचित कर दिया गया है।',
      patient_instruction_en: 'Please proceed directly to the Emergency desk now — a nurse has been notified.',
      triage_alert_message: 'CRITICAL: Patient reported acute chest pain with radiating symptoms / dyspnea.',
    };
  }

  // Rule 2: FAST Stroke Protocol Symptoms
  if (
    text.includes('facial droop') ||
    text.includes('slurred speech') ||
    text.includes('sudden weakness') ||
    text.includes('बोलने में तकलीफ') ||
    text.includes('मुंह टेढ़ा') ||
    text.includes('लकवा')
  ) {
    return {
      rule_id: 'RF_STROKE_FAST',
      severity: 'CRITICAL',
      title: 'Acute Stroke Symptoms (FAST)',
      patient_instruction_hi: 'कृपया तुरंत आपातकालीन डेस्क पर जाएं।',
      patient_instruction_en: 'Please proceed to the Emergency desk immediately.',
      triage_alert_message: 'CRITICAL: Patient reported sudden facial/speech/weakness symptoms (FAST stroke flag).',
    };
  }

  // Rule 3: Severe Respiratory Distress
  if (
    (text.includes('breathless') || text.includes('gasping') || text.includes('सांस नहीं आ रही')) &&
    (text.includes('severe') || text.includes('at rest') || text.includes('बहुत तेज'))
  ) {
    return {
      rule_id: 'RF_RESPIRATORY_DISTRESS',
      severity: 'CRITICAL',
      title: 'Severe Respiratory Distress',
      patient_instruction_hi: 'कृपया तुरंत आपातकालीन डेस्क पर जाएं — मेडिकल टीम को सूचित कर दिया गया है।',
      patient_instruction_en: 'Please proceed to the Emergency desk immediately — medical staff is alerted.',
      triage_alert_message: 'HIGH: Patient reported severe dyspnea / shortness of breath at rest.',
    };
  }

  // Rule 4: Anaphylaxis Warning
  if (
    (text.includes('allergy') || text.includes('एलर्जी')) &&
    (text.includes('swelling') || text.includes('throat') || text.includes('lip') || text.includes('सूजन'))
  ) {
    return {
      rule_id: 'RF_ANAPHYLAXIS',
      severity: 'HIGH',
      title: 'Severe Anaphylactic Reaction Warning',
      patient_instruction_hi: 'कृपया तुरंत सहायता काउंटर पर जाएं।',
      patient_instruction_en: 'Please step to the Triage help desk immediately.',
      triage_alert_message: 'HIGH: Potential anaphylactic reaction with facial/airway swelling.',
    };
  }

  return null;
}
