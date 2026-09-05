/**
 * MediKiosk Hospital Doctor Roster & Room Allocation Engine
 * Supports Orthopedics, Pediatrics, General Medicine, Emergency Ward, and AYUSH.
 */

export interface DoctorProfile {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  department_code: 'general' | 'ortho' | 'pedia' | 'emergency' | 'ayush';
  room_number: string;
  room_display: string;
  floor: string;
  avg_consult_minutes: number;
  badge_color: string;
  avatar_initials: string;
  // Room Selector Theme Colors
  theme_color: string;
  pill_active: string;
  pill_inactive: string;
  badge_pill: string;
  // Dynamic Title Bar Styling
  title_bar_gradient: string;
  title_bar_icon_bg: string;
  title_bar_tag_bg: string;
}

export const DOCTOR_ROSTER: Record<string, DoctorProfile> = {
  emergency: {
    id: 'dr_nair',
    name: 'Dr. Priya Nair',
    qualification: 'MBBS, MEM (Emergency Medicine & Trauma)',
    specialty: 'Emergency Medicine & Critical Care',
    department_code: 'emergency',
    room_number: 'Room ER-1',
    room_display: 'Emergency Resuscitation Bay (Room ER-1)',
    floor: 'Ground Floor, Immediate Emergency Wing',
    avg_consult_minutes: 0,
    badge_color: 'bg-rose-100 text-rose-800 border-rose-300',
    avatar_initials: 'PN',
    theme_color: 'rose',
    pill_active: 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-300/40 ring-2 ring-rose-400/50',
    pill_inactive: 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100 hover:border-rose-300',
    badge_pill: 'bg-rose-200 text-rose-950 font-black',
    title_bar_gradient: 'bg-gradient-to-r from-rose-950 via-rose-900 to-red-900 text-white border-rose-700/60 shadow-xl shadow-rose-950/20',
    title_bar_icon_bg: 'bg-rose-600 text-white ring-2 ring-rose-300/40',
    title_bar_tag_bg: 'bg-rose-500/30 text-rose-100 border-rose-400/50'
  },
  ortho: {
    id: 'dr_verma',
    name: 'Dr. Rajesh Verma',
    qualification: 'MBBS, MS (Orthopedics)',
    specialty: 'Orthopedics & Joint Care',
    department_code: 'ortho',
    room_number: 'Room 102',
    room_display: 'Room 102 (Orthopedic OPD)',
    floor: '1st Floor, Corridor B (Near X-Ray)',
    avg_consult_minutes: 10,
    badge_color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    avatar_initials: 'RV',
    theme_color: 'indigo',
    pill_active: 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/40 ring-2 ring-indigo-400/50',
    pill_inactive: 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300',
    badge_pill: 'bg-indigo-200 text-indigo-950 font-black',
    title_bar_gradient: 'bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white border-indigo-700/60 shadow-xl shadow-indigo-950/20',
    title_bar_icon_bg: 'bg-indigo-600 text-white ring-2 ring-indigo-300/40',
    title_bar_tag_bg: 'bg-indigo-500/30 text-indigo-100 border-indigo-400/50'
  },
  pedia: {
    id: 'dr_sen',
    name: 'Dr. Ananya Sen',
    qualification: 'MBBS, MD (Pediatrics), DCH',
    specialty: 'Pediatrics & Child Health',
    department_code: 'pedia',
    room_number: 'Room 105',
    room_display: 'Room 105 (Pediatric Care OPD)',
    floor: '1st Floor, Child Care Wing',
    avg_consult_minutes: 8,
    badge_color: 'bg-purple-100 text-purple-900 border-purple-300',
    avatar_initials: 'AS',
    theme_color: 'purple',
    pill_active: 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-300/40 ring-2 ring-purple-400/50',
    pill_inactive: 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100 hover:border-purple-300',
    badge_pill: 'bg-purple-200 text-purple-950 font-black',
    title_bar_gradient: 'bg-gradient-to-r from-purple-950 via-fuchsia-950 to-indigo-950 text-white border-purple-700/60 shadow-xl shadow-purple-950/20',
    title_bar_icon_bg: 'bg-purple-600 text-white ring-2 ring-purple-300/40',
    title_bar_tag_bg: 'bg-purple-500/30 text-purple-100 border-purple-400/50'
  },
  ayush: {
    id: 'dr_vaidya',
    name: 'Dr. Harish Vaidya',
    qualification: 'BAMS, MD (Ayurveda - Kayachikitsa)',
    specialty: 'Ayurvedic Medicine & Panchakarma',
    department_code: 'ayush',
    room_number: 'Room 108',
    room_display: 'Room 108 (AYUSH Wellness Wing)',
    floor: '2nd Floor, Ministry of AYUSH Center',
    avg_consult_minutes: 12,
    badge_color: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    avatar_initials: 'HV',
    theme_color: 'emerald',
    pill_active: 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-300/40 ring-2 ring-emerald-400/50',
    pill_inactive: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300',
    badge_pill: 'bg-emerald-200 text-emerald-950 font-black',
    title_bar_gradient: 'bg-gradient-to-r from-emerald-950 via-teal-950 to-green-950 text-white border-emerald-700/60 shadow-xl shadow-emerald-950/20',
    title_bar_icon_bg: 'bg-emerald-600 text-white ring-2 ring-emerald-300/40',
    title_bar_tag_bg: 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50'
  },
  general: {
    id: 'dr_sharma',
    name: 'Dr. Vikram Sharma',
    qualification: 'MBBS, MD (General Medicine)',
    specialty: 'General Medicine & Adult OPD',
    department_code: 'general',
    room_number: 'Room 101',
    room_display: 'Room 101 (General OPD)',
    floor: 'Ground Floor, Central OPD Corridor',
    avg_consult_minutes: 8,
    badge_color: 'bg-teal-100 text-teal-900 border-teal-300',
    avatar_initials: 'VS',
    theme_color: 'teal',
    pill_active: 'bg-pine-teal text-white border-pine-teal shadow-md shadow-teal-900/30 ring-2 ring-teal-500/50',
    pill_inactive: 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100 hover:border-teal-300',
    badge_pill: 'bg-teal-200 text-teal-950 font-black',
    title_bar_gradient: 'bg-gradient-to-r from-[#003835] via-pine-teal to-[#0A5A55] text-white border-teal-700/60 shadow-xl shadow-pine-teal/20',
    title_bar_icon_bg: 'bg-pine-teal text-metallic-gold ring-2 ring-metallic-gold/30',
    title_bar_tag_bg: 'bg-peach-glow/20 text-cornsilk border-peach-glow/30'
  }
};

/**
 * Intelligent Room & Doctor Allocation
 * Decides doctor & room based on emergency status, age, clinical mode, and reported symptoms.
 */
export function allocateDoctorAndRoom(params: {
  age?: number | string | null;
  clinical_mode?: string | null;
  is_red_flag?: boolean | null;
  red_flag_count?: number | string | null;
  symptoms_text?: string | null;
}): DoctorProfile {
  const { age, clinical_mode, is_red_flag, red_flag_count, symptoms_text = '' } = params;

  // 1. Critical Red Flag -> Emergency Bay immediately
  const hasRedFlag = Boolean(is_red_flag) || Number(red_flag_count) > 0;
  if (hasRedFlag) {
    return DOCTOR_ROSTER.emergency;
  }

  // 2. Pediatric Patient (Age <= 14)
  const numericAge = age ? parseInt(String(age), 10) : NaN;
  if (!isNaN(numericAge) && numericAge > 0 && numericAge <= 14) {
    return DOCTOR_ROSTER.pedia;
  }

  // 3. Ministry of AYUSH Mode -> Ayurvedic Wing
  if (clinical_mode === 'ayurveda') {
    return DOCTOR_ROSTER.ayush;
  }

  // 4. Orthopedic Keywords Detection
  const text = (symptoms_text || '').toLowerCase();
  const orthoKeywords = [
    'joint', 'bone', 'fracture', 'spine', 'knee', 'hip', 'shoulder', 'elbow', 'wrist',
    'ankle', 'foot', 'leg pain', 'back pain', 'backache', 'arthritis', 'sprain', 'ligament',
    'कमर दर्द', 'जोड़', 'हड्डी', 'घुटने', 'मोच', 'गठिया', 'हाथ दर्द', 'पैर दर्द'
  ];

  const isOrtho = orthoKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  if (isOrtho) {
    return DOCTOR_ROSTER.ortho;
  }

  // 5. Default General Medicine Adult OPD
  return DOCTOR_ROSTER.general;
}

/**
 * Calculates Estimated Wait Time String
 */
export function getEstimatedQueueTime(
  patientsAhead: number,
  doctor: DoctorProfile
): { timeString: string; minutes: number } {
  if (doctor.department_code === 'emergency') {
    return {
      timeString: 'Immediate (Zero Wait — Emergency Protocol)',
      minutes: 0
    };
  }

  if (patientsAhead <= 0) {
    return {
      timeString: 'Next in line (~2–5 minutes)',
      minutes: 3
    };
  }

  const estMin = Math.max(5, patientsAhead * doctor.avg_consult_minutes);
  const minRange = Math.max(5, estMin - 3);
  const maxRange = estMin + 4;

  return {
    timeString: `Approx. ${minRange}–${maxRange} mins (${patientsAhead} patient${patientsAhead > 1 ? 's' : ''} ahead)`,
    minutes: estMin
  };
}

/**
 * Synthesizes an emergency ward siren alarm sound in the browser using Web Audio API
 */
export function playEmergencySirenAudio(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);

    // Two-tone high-low alarm warble (960Hz to 770Hz)
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(960, now);
    osc.frequency.setValueAtTime(770, now + 0.25);
    osc.frequency.setValueAtTime(960, now + 0.5);
    osc.frequency.setValueAtTime(770, now + 0.75);
    osc.frequency.setValueAtTime(960, now + 1.0);
    osc.frequency.setValueAtTime(770, now + 1.25);

    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.6);
  } catch (err) {
    console.warn('Web Audio Siren not supported or blocked:', err);
  }
}

/**
 * Synthesizes a calming medical announcement chime (E5 -> C5)
 */
export function playHospitalChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // Tone 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Tone 2: C5 (523.25 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.25);
    gain2.gain.setValueAtTime(0.25, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.8);
  } catch (err) {
    console.warn('Web Audio Chime error:', err);
  }
}
