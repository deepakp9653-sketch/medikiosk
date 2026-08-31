import Link from 'next/link';
import { Stethoscope, Smartphone, ShieldCheck, HeartPulse, FileText, CheckCircle2 } from '@/components/Icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-emerald-900/10 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#2F5D62] text-white flex items-center justify-center font-bold text-xl shadow-md">
            <HeartPulse className="w-7 h-7 text-[#EAF3F2]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#2F5D62] tracking-tight">MediKiosk</h1>
            <p className="text-xs font-medium text-emerald-800/70">Bilingual Voice AI & Clinical Review System</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#EAF3F2] px-3 py-1.5 rounded-full text-xs font-semibold text-[#2F5D62]">
          <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
          <span>DPDP & ABDM FHIR R4 Ready</span>
        </div>
      </header>

      {/* Main Selection Hub */}
      <main className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 my-auto">
        {/* Patient Experience Card */}
        <Link 
          href="/kiosk" 
          className="group relative bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-[#2F5D62] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAF3F2] rounded-bl-full -z-0 opacity-60 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF3F2] text-[#2F5D62] flex items-center justify-center mb-6 group-hover:bg-[#2F5D62] group-hover:text-white transition-colors">
              <Smartphone className="w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-[#2F5D62] text-xs font-bold rounded-full mb-3">
              Patient Interface (Phone / Kiosk)
            </span>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#2F5D62]">
              Patient Kiosk Portal
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Accessible bilingual voice & touch intake (Hindi/English). Complete health history interview, scan prescriptions & lab reports, and receive clear recap.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
            <ul className="text-xs text-slate-500 space-y-1">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F]" /> Voice & Touch Input</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F]" /> Prescription Scanner</li>
            </ul>
            <span className="w-10 h-10 rounded-full bg-[#C15B3A] text-white flex items-center justify-center font-bold text-lg group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        {/* Clinician Dashboard Card */}
        <Link 
          href="/clinician" 
          className="group relative bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-[#2F5D62] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 opacity-60 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-[#B8860B] flex items-center justify-center mb-6 group-hover:bg-[#2F5D62] group-hover:text-white transition-colors">
              <Stethoscope className="w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-[#B8860B] text-xs font-bold rounded-full mb-3">
              Doctor Dashboard (Laptop / Desktop)
            </span>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#2F5D62]">
              Clinician Review Dashboard
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Sub-60-second summary read, contradiction resolution cards, low-confidence document verification, attestation sign-off gate, and FHIR export.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
            <ul className="text-xs text-slate-500 space-y-1">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F]" /> Contradiction Cards</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F]" /> Synthetic FHIR Export</li>
            </ul>
            <span className="w-10 h-10 rounded-full bg-[#2F5D62] text-white flex items-center justify-center font-bold text-lg group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-4 text-xs text-slate-400 border-t border-slate-200 mt-8">
        MediKiosk System Architecture • Powered by Next.js, Neon PostgreSQL & Mistral AI • 100% Mobile & Laptop Responsive
      </footer>
    </div>
  );
}
