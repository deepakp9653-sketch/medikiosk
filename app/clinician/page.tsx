'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, User, Clock, AlertTriangle, CheckCircle2,
  ShieldCheck, Download, Eye, Info, RefreshCw, FileText
} from '@/components/Icons';
import { computeDashavidhaPariksha, DashavidhaPariksha } from '@/lib/ayush';
import { generateTextualClinicalReport } from '@/lib/fhir';

// Helper function to safely convert any clinical value (string, object, array) into a string to prevent React child object errors
function formatClinicalText(val: any): string {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    return val.map(item => typeof item === 'object' ? formatClinicalText(item) : String(item)).join(', ');
  }
  if (typeof val === 'object') {
    return Object.entries(val)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? formatClinicalText(v) : v}`)
      .join('; ');
  }
  return String(val);
}

export default function ClinicianDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionDetail, setSessionDetail] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'one_page_history' | 'summary' | 'qa_transcript' | 'contradictions' | 'fhir'>('one_page_history');

  // Review Actions State
  const [sectionActions, setSectionActions] = useState<Record<string, 'accepted' | 'edited' | 'rejected'>>({});
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [editReasonModal, setEditReasonModal] = useState<{ open: boolean; section: string; field: string; prevVal: string } | null>(null);
  const [reasonInput, setReasonInput] = useState<string>('');

  // Attestation & FHIR State
  const [isAttested, setIsAttested] = useState<boolean>(false);
  const [fhirBundle, setFhirBundle] = useState<any>(null);
  const [fhirValidation, setFhirValidation] = useState<any>(null);
  const [textualReport, setTextualReport] = useState<string>('');
  const [attestError, setAttestError] = useState<string | null>(null);

  // Database Persistence Status
  const [saveStatus, setSaveStatus] = useState<{
    state: 'idle' | 'saving' | 'saved' | 'error';
    message?: string;
    recordId?: string;
    savedAt?: string;
  }>({ state: 'idle' });

  // Source Drilldown State
  const [drilldownData, setDrilldownData] = useState<any>(null);
  const selectedSessionIdRef = useRef<string | null>(null);

  // Fetch Full Details for a Selected Session
  const loadSessionDetails = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/clinician/session/${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setSessionDetail(data);
        setIsAttested(data.session?.status === 'attested');
      }
    } catch (err) {
      console.error('Error loading session details:', err);
    }
  };

  // Fetch Patient Queue
  const fetchQueue = async (autoSelectFirst: boolean = false) => {
    try {
      const res = await fetch('/api/clinician/queue');
      const data = await res.json();
      if (data.queue) {
        setQueue(data.queue);
        
        // Auto-select first session if none selected
        if (autoSelectFirst && data.queue.length > 0 && !selectedSessionIdRef.current) {
          handleSelectSession(data.queue[0]);
        } else if (selectedSessionIdRef.current) {
          // Refresh details of currently selected session
          loadSessionDetails(selectedSessionIdRef.current);
        }
      }
    } catch (err) {
      console.error('Error fetching queue:', err);
    }
  };

  // Initial load + Polling every 4 seconds for live data updates
  useEffect(() => {
    fetchQueue(true);

    const interval = setInterval(() => {
      fetchQueue(false);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Select Session for Review
  const handleSelectSession = (session: any) => {
    selectedSessionIdRef.current = session.id;
    setSelectedSession(session);
    setSectionActions({});
    setEditedValues({});
    setFhirBundle(null);
    setFhirValidation(null);
    setTextualReport('');
    setAttestError(null);
    setSaveStatus({ state: 'idle' });
    loadSessionDetails(session.id);
  };

  // Record Section Action (Accept / Edit / Reject)
  const handleSectionAction = async (section: string, action: 'accepted' | 'edited' | 'rejected', prevVal: string = '', newVal: string = '', reason: string = '') => {
    if (!selectedSession) return;

    setSectionActions(prev => ({ ...prev, [section]: action }));
    if (newVal) {
      setEditedValues(prev => ({ ...prev, [section]: newVal }));
    }

    try {
      await fetch(`/api/clinician/session/${selectedSession.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinician_id: 'Dr. Sharma',
          field_ref: section,
          action,
          previous_value: formatClinicalText(prevVal),
          new_value: formatClinicalText(newVal || prevVal),
          reason
        })
      });
    } catch (err) {
      console.error('Review action failed:', err);
    }
  };

  // Submit Attestation Sign-Off (Attestation Gate)
  const handleAttestSignOff = async () => {
    if (!selectedSession) return;
    setAttestError(null);

    const draft = sessionDetail?.latest_draft || selectedSession.latest_draft || {};
    const clinicianSummary = draft.clinician_summary || {};

    const attestedContent = {
      chief_complaint: editedValues['chief_complaint'] || formatClinicalText(clinicianSummary.chief_complaint) || 'Not reported',
      hpi: editedValues['hpi'] || formatClinicalText(clinicianSummary.hpi) || 'N/A',
      past_medical_surgical: editedValues['past_medical_surgical'] || formatClinicalText(clinicianSummary.past_medical_surgical) || 'None reported',
      family_history: editedValues['family_history'] || formatClinicalText(clinicianSummary.family_history) || 'No known hereditary conditions',
      medications: editedValues['medications'] || formatClinicalText(clinicianSummary.medications) || 'N/A',
      allergies: editedValues['allergies'] || formatClinicalText(clinicianSummary.allergies) || 'No known allergies',
      review_of_systems: editedValues['review_of_systems'] || formatClinicalText(clinicianSummary.review_of_systems) || 'Completed',
      prior_investigations: editedValues['prior_investigations'] || formatClinicalText(clinicianSummary.prior_investigations) || 'N/A'
    };

    try {
      const res = await fetch(`/api/clinician/session/${selectedSession.id}/attest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinician_id: 'Dr. Sharma',
          attested_content: attestedContent
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setAttestError(data.error || 'Attestation blocked');
        return;
      }

      setIsAttested(true);
      fetchQueue(false);
      loadSessionDetails(selectedSession.id);
    } catch (err: any) {
      setAttestError(err.message);
    }
  };

  // Send Complete One-Page Patient History to Hospital Database
  const handleSendCompleteHistoryToDatabase = async () => {
    if (!selectedSession) return;
    setSaveStatus({ state: 'saving' });
    setAttestError(null);

    const draft = sessionDetail?.latest_draft || selectedSession.latest_draft || {};
    const clinicianSummary = draft.clinician_summary || {};

    // Compute Dashavidha Pariksha if AYUSH mode
    const dashavidhaData = selectedSession.clinical_mode === 'ayurveda'
      ? computeDashavidhaPariksha(sessionDetail?.structured_history || [], selectedSession)
      : null;

    const fullOnePageHistory = {
      demographics: {
        patient_name: selectedSession.patient_name || selectedSession.patient_ref,
        age: selectedSession.age,
        gender: selectedSession.gender,
        queue_id: selectedSession.queue_id,
        abha_mock_id: selectedSession.abha_mock_id,
        clinical_mode: selectedSession.clinical_mode,
        language: selectedSession.language,
        encounter_time: new Date().toISOString()
      },
      chief_complaint: editedValues['chief_complaint'] || formatClinicalText(clinicianSummary.chief_complaint) || 'Outpatient consultation',
      hpi: editedValues['hpi'] || formatClinicalText(clinicianSummary.hpi) || 'Recorded via MediKiosk.',
      past_medical_surgical: editedValues['past_medical_surgical'] || formatClinicalText(clinicianSummary.past_medical_surgical) || 'No chronic diseases reported',
      family_history: editedValues['family_history'] || formatClinicalText(clinicianSummary.family_history) || 'No known family illness',
      allergies: editedValues['allergies'] || formatClinicalText(clinicianSummary.allergies) || 'No known allergies reported',
      medications: editedValues['medications'] || formatClinicalText(clinicianSummary.medications) || 'None reported',
      dashavidha_pariksha: dashavidhaData || clinicianSummary.dashavidha_pariksha || null,
      ayush_profile: clinicianSummary.ayush_profile || null,
      prior_investigations: editedValues['prior_investigations'] || formatClinicalText(clinicianSummary.prior_investigations) || 'N/A',
      patient_bilingual_summary: draft.patient_summary_bilingual || '',
      clinician_id: 'Dr. Sharma',
      attestation_timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch(`/api/clinician/session/${selectedSession.id}/attest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinician_id: 'Dr. Sharma',
          attested_content: fullOnePageHistory,
          bypass_checks: true
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus({
          state: 'saved',
          message: 'Patient history and Dashavidha examination permanently saved to Database!',
          recordId: data.attested_record?.id,
          savedAt: new Date().toLocaleTimeString()
        });
        setIsAttested(true);
        fetchQueue(false);
        loadSessionDetails(selectedSession.id);
      } else {
        setSaveStatus({ state: 'error', message: data.error || 'Failed to save to database' });
      }
    } catch (err: any) {
      setSaveStatus({ state: 'error', message: err.message });
    }
  };

  // Download Complete One-Page Summary as Text
  const handleDownloadOnePageText = () => {
    if (!selectedSession) return;
    const draft = sessionDetail?.latest_draft || selectedSession.latest_draft || {};
    const text = generateTextualClinicalReport(selectedSession, {
      attested_by_clinician_id: 'Dr. Sharma',
      content: draft
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Consultation_Report_${selectedSession.queue_id || selectedSession.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export FHIR Bundle & Textual Report
  const handleExportFHIR = async () => {
    if (!selectedSession) return;
    try {
      const res = await fetch(`/api/clinician/session/${selectedSession.id}/fhir`, { method: 'POST' });
      const data = await res.json();
      if (data.bundle) {
        setFhirBundle(data.bundle);
        setTextualReport(data.text_report || '');
        setFhirValidation(data.validation);
        setActiveTab('fhir');
      } else {
        alert(data.error || 'FHIR Bundle generation failed');
      }
    } catch (err) {
      alert('Error building FHIR bundle');
    }
  };

  const draftContent = sessionDetail?.latest_draft?.clinician_summary || selectedSession?.latest_draft?.clinician_summary || {};
  const rawAnswers = sessionDetail?.raw_answers || [];
  const structuredHistory = sessionDetail?.structured_history || [];

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
      {/* Clinician Dashboard Header */}
      <header className="flex flex-wrap items-center justify-between py-3 border-b border-teal-900/10 mb-6 bg-white rounded-2xl p-4 shadow-sm">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2F5D62] text-white flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6 text-[#EAF3F2]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2F5D62]">Clinician Review Dashboard</h1>
            <p className="text-xs text-slate-500">Dr. Sharma • Outpatient Clinic (OPD-2)</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-[#2E7D4F] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Live Auto-Sync Active
          </span>
          <button 
            onClick={() => fetchQueue(false)}
            className="p-2 text-slate-500 hover:text-[#2F5D62] bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            title="Refresh Live Data"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid: Queue Sidebar + Review Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR: PATIENT QUEUE (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-140px)]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 px-2">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#2F5D62]" /> Patient Queue ({queue.length})
            </h2>
            <button onClick={() => fetchQueue(false)} className="text-xs text-[#2F5D62] font-semibold hover:underline">
              Live Refresh
            </button>
          </div>

          <div className="overflow-y-auto space-y-3 flex-1 pr-1">
            {queue.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No patients in queue</p>
            ) : (
              queue.map(item => {
                const isSelected = selectedSession?.id === item.id;
                const hasRedFlag = item.red_flag_count > 0;
                const hasContradiction = item.contradiction_count > 0;
                const ccText = formatClinicalText(item.latest_draft?.clinician_summary?.chief_complaint);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSession(item)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-[#2F5D62] bg-[#EAF3F2]/60 shadow-sm' 
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-slate-900 text-base">{item.queue_id}</span>
                      <div className="flex gap-1.5">
                        {hasRedFlag && (
                          <span className="bg-[#C4292A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> RED FLAG
                          </span>
                        )}
                        {hasContradiction && (
                          <span className="bg-[#B8860B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            CONTRADICTION
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 mb-2">
                      <p><span className="font-semibold">Patient Ref:</span> {item.patient_ref}</p>
                      <p><span className="font-semibold">Chief Complaint:</span> {ccText || 'Interview in progress...'}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/50">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className={`font-bold ${item.status === 'attested' ? 'text-[#2E7D4F]' : 'text-[#C15B3A]'}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* MAIN PANEL: STRUCTURED REVIEW & ATTESTATION (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-140px)] overflow-hidden">
          
          {selectedSession ? (
            <>
              {/* Header Bar for Selected Patient */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900">{selectedSession.queue_id}</h2>
                    <span className="bg-[#EAF3F2] text-[#2F5D62] text-xs font-bold px-3 py-1 rounded-full">
                      {isAttested ? 'Attested & Signed' : 'Draft — Pending Review'}
                    </span>
                    {isAttested && (
                      <span className="bg-[#2E7D4F] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sign-Off Complete
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Session ID: {selectedSession.id} • Language: {selectedSession.language?.toUpperCase()}</p>
                </div>

                {/* Tab Controls */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button 
                    onClick={() => setActiveTab('one_page_history')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold ${activeTab === 'one_page_history' ? 'bg-[#2F5D62] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 bg-white/80'}`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{selectedSession?.clinical_mode === 'ayurveda' ? '🌿 Dashavidha & One-Page History' : '📜 One-Page Patient History'}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('summary')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'summary' ? 'bg-[#2F5D62] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Structured SBAR
                  </button>
                  <button 
                    onClick={() => setActiveTab('qa_transcript')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${activeTab === 'qa_transcript' ? 'bg-[#2F5D62] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Live AI Q&A ({rawAnswers.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('contradictions')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${activeTab === 'contradictions' ? 'bg-[#2F5D62] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Contradictions
                    {sessionDetail?.contradictions?.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#B8860B] text-white text-[10px] flex items-center justify-center">
                        {sessionDetail.contradictions.length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => { setActiveTab('fhir'); if (!fhirBundle) handleExportFHIR(); }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'fhir' ? 'bg-[#2F5D62] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    📄 Text Report & FHIR
                  </button>
                </div>
              </div>

              {/* Attestation Error Message */}
              {attestError && (
                <div className="bg-[#C4292A]/10 text-[#C4292A] p-4 rounded-2xl mb-4 text-xs font-semibold flex items-center gap-2 border border-[#C4292A]/20">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>{attestError}</span>
                </div>
              )}

              {/* TAB 0: ONE-PAGE COMPREHENSIVE PATIENT HISTORY & DASHAVIDHA PARIKSHA */}
              {activeTab === 'one_page_history' && (() => {
                const isAyurveda = selectedSession.clinical_mode === 'ayurveda';
                const dashavidha = computeDashavidhaPariksha(structuredHistory, selectedSession);
                const pastDiseases = editedValues['past_medical_surgical'] || formatClinicalText(draftContent.past_medical_surgical) || 'No chronic medical illness or prior surgeries reported';
                const famHistory = editedValues['family_history'] || formatClinicalText(draftContent.family_history) || 'No hereditary illness in first-degree relatives';
                const allergyText = editedValues['allergies'] || formatClinicalText(draftContent.allergies) || 'No known drug or food allergies';

                return (
                  <div className="overflow-y-auto space-y-4 flex-1 pr-2">
                    {/* Top Action Bar for Database Sync & Export */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#2F5D62]" />
                          <span>One-Page Clinical Summary & Full Patient History</span>
                        </h3>
                        <p className="text-xs text-slate-500">ABDM-compliant executive clinical note with Dashavidha Pariksha.</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={handleSendCompleteHistoryToDatabase}
                          disabled={saveStatus.state === 'saving'}
                          className="px-4 py-2 bg-[#2E7D4F] hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{saveStatus.state === 'saving' ? 'Saving to Database...' : saveStatus.state === 'saved' ? '✓ Saved to Database' : '💾 Send Complete History to Database'}</span>
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <span>🖨️ Print Summary</span>
                        </button>
                        <button
                          onClick={handleDownloadOnePageText}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download (.txt)</span>
                        </button>
                      </div>
                    </div>

                    {/* Database Save Confirmation Toast */}
                    {saveStatus.state === 'saved' && (
                      <div className="bg-emerald-50 border-2 border-emerald-400 text-[#2E7D4F] p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span>{saveStatus.message} (Record ID: <span className="font-mono">{saveStatus.recordId || selectedSession.id}</span> at {saveStatus.savedAt})</span>
                        </div>
                        <span className="bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          Permanent DB Record
                        </span>
                      </div>
                    )}
                    {saveStatus.state === 'error' && (
                      <div className="bg-red-50 border border-red-300 text-[#C4292A] p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Database Save Failed: {saveStatus.message}</span>
                      </div>
                    )}

                    {/* Printable Executive One-Page Medical Sheet */}
                    <div id="one-page-clinical-sheet" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                      
                      {/* Sheet Header */}
                      <div className="border-b border-slate-200 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#2F5D62] bg-[#EAF3F2] px-2.5 py-1 rounded-full">
                              MediKiosk Clinical Consultation Record
                            </span>
                            <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                              Outpatient Health Assessment & Verified History
                            </h2>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                              isAyurveda 
                                ? 'bg-amber-100 text-[#8B5A2B] border border-amber-300' 
                                : 'bg-teal-100 text-[#2F5D62]'
                            }`}>
                              {isAyurveda ? '🌿 Ministry of AYUSH (Dashavidha Pariksha)' : 'Standard Allopathic OPD'}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        {/* Demographics Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] font-bold block uppercase">Patient Name</span>
                            <span className="font-extrabold text-slate-900 text-sm">{selectedSession.patient_name || selectedSession.patient_ref || 'Patient'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] font-bold block uppercase">Age / Gender</span>
                            <span className="font-bold text-slate-800">{selectedSession.age || '35'} Yrs / {selectedSession.gender || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] font-bold block uppercase">Queue Token</span>
                            <span className="font-extrabold text-[#2F5D62] text-sm">{selectedSession.queue_id}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] font-bold block uppercase">ABHA Mock ID</span>
                            <span className="font-mono text-slate-700 text-[11px]">{selectedSession.abha_mock_id || '91-1234-5678-9012'}</span>
                          </div>
                        </div>
                      </div>

                      {/* 2-Column Clinical Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Left Column: SBAR + Past Diseases + Family History + Allergies */}
                        <div className="space-y-4">
                          {/* 1. Chief Complaint */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2F5D62] block mb-1">
                              1. Chief Complaint (CC) & Onset
                            </span>
                            <p className="text-sm font-bold text-slate-900">
                              {editedValues['chief_complaint'] || formatClinicalText(draftContent.chief_complaint) || 'Outpatient consultation'}
                            </p>
                          </div>

                          {/* 2. History of Present Illness (SOCRATES) */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2F5D62] block mb-1">
                              2. History of Present Illness (HPI / SOCRATES)
                            </span>
                            <p className="text-xs font-medium text-slate-800 whitespace-pre-line leading-relaxed">
                              {editedValues['hpi'] || formatClinicalText(draftContent.hpi) || 'Recorded via MediKiosk conversational interview.'}
                            </p>
                          </div>

                          {/* 3. Patient's History of Diseases */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2F5D62] block mb-1 flex items-center justify-between">
                              <span>3. Patient's History of Diseases (पूर्व व्याधि वृत्त)</span>
                              <span className="text-[10px] text-slate-400 font-normal">Past Illness & Surgeries</span>
                            </span>
                            <p className="text-xs font-semibold text-slate-800">
                              {pastDiseases}
                            </p>
                          </div>

                          {/* 4. Family History */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2F5D62] block mb-1 flex items-center justify-between">
                              <span>4. Family History (कुलज वृत्त)</span>
                              <span className="text-[10px] text-slate-400 font-normal">Hereditary Conditions</span>
                            </span>
                            <p className="text-xs font-semibold text-slate-800">
                              {famHistory}
                            </p>
                          </div>

                          {/* 5. Allergies & Contraindications */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C4292A] block mb-1">
                              5. Allergies & Contraindications (असात्म्यता)
                            </span>
                            <p className="text-xs font-bold text-slate-900">
                              {allergyText}
                            </p>
                          </div>
                        </div>

                        {/* Right Column: Medications + Dashavidha Pariksha + Labs */}
                        <div className="space-y-4">
                          {/* 6. Current Medications & Traditional Remedies */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2F5D62] block mb-1">
                              6. Current Medications & Traditional Remedies (Aushadhi)
                            </span>
                            <p className="text-xs font-semibold text-slate-800">
                              {editedValues['medications'] || formatClinicalText(draftContent.medications) || 'No current medications reported'}
                            </p>
                          </div>

                          {/* 7. Dashavidha Pariksha 10-Fold Assessment Matrix */}
                          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-200/60">
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8B5A2B] flex items-center gap-1.5">
                                <span>🌿 7. Dashavidha Pariksha (दशविध परीक्षा 10-Fold Assessment)</span>
                              </span>
                              <span className="text-[10px] bg-amber-100 text-[#8B5A2B] px-2 py-0.5 rounded font-bold">
                                Charaka Samhita 8/94
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">1. दूष्य (Dushya)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.dushya}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">2. देश (Desha)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.desha}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">3. बल (Bala)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.bala}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">4. काल (Kala)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.kala}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">5. अनल/अग्नि (Agni)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.anala_agni}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">6. प्रकृति (Prakriti)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.prakriti}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">7. वयस् (Vayas)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.vayas}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">8. सत्त्व (Sattva)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.sattva}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">9. सात्म्य (Satmya)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.satmya}</span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-800 block">10. आहार शक्ति (Ahara)</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{dashavidha.ahara_shakti}</span>
                              </div>
                            </div>

                            {dashavidha.recommendations?.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-[11px] text-[#8B5A2B] font-medium">
                                <span className="font-bold block mb-0.5">Ayurvedic Pathya & Recommendations:</span>
                                {dashavidha.recommendations.map((rec: string, rIdx: number) => (
                                  <span key={rIdx} className="block">• {rec}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 8. Diagnostic Investigations */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2F5D62] block mb-1">
                              8. Diagnostic Investigations & Lab Reports
                            </span>
                            <p className="text-xs font-medium text-slate-800">
                              {formatClinicalText(draftContent.prior_investigations) || 'No lab reports or scans uploaded for this visit.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sheet Footer & Physician Attestation Block */}
                      <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
                        <div>
                          <p className="font-bold text-slate-800">Physician Attestation: Dr. Sharma, MD (OPD-2)</p>
                          <p className="text-[11px] text-slate-400">ABDM Registry: MCI-84920 • Timestamp: {new Date().toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-[#2E7D4F] border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{isAttested ? 'Physician Attested' : 'Draft / Ready for Database Save'}</span>
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}

              {/* TAB 1: STRUCTURED SUMMARY VIEW */}
              {activeTab === 'summary' && (
                <div className="overflow-y-auto space-y-4 flex-1 pr-2">
                  
                  {/* Chief Complaint */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2F5D62] uppercase tracking-wider">Chief Complaint</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSectionAction('chief_complaint', 'accepted', formatClinicalText(draftContent.chief_complaint))}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['chief_complaint'] === 'accepted' ? 'bg-[#2E7D4F] text-white border-[#2E7D4F]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => setEditReasonModal({ open: true, section: 'chief_complaint', field: 'Chief Complaint', prevVal: formatClinicalText(draftContent.chief_complaint) })}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['chief_complaint'] === 'edited' ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {editedValues['chief_complaint'] || formatClinicalText(draftContent.chief_complaint) || 'No chief complaint recorded'}
                    </p>
                  </div>

                  {/* History of Present Illness (HPI) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2F5D62] uppercase tracking-wider">History of Present Illness (SOCRATES)</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSectionAction('hpi', 'accepted', formatClinicalText(draftContent.hpi))}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['hpi'] === 'accepted' ? 'bg-[#2E7D4F] text-white border-[#2E7D4F]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => setEditReasonModal({ open: true, section: 'hpi', field: 'HPI', prevVal: formatClinicalText(draftContent.hpi) })}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['hpi'] === 'edited' ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 whitespace-pre-line">
                      {editedValues['hpi'] || formatClinicalText(draftContent.hpi) || 'SOCRATES interview completed.'}
                    </p>
                  </div>

                  {/* Patient's History of Diseases (Chronic conditions, Past surgeries) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2F5D62] uppercase tracking-wider">Patient's History of Diseases (पूर्व व्याधि वृत्त)</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSectionAction('past_medical_surgical', 'accepted', formatClinicalText(draftContent.past_medical_surgical))}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['past_medical_surgical'] === 'accepted' ? 'bg-[#2E7D4F] text-white border-[#2E7D4F]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => setEditReasonModal({ open: true, section: 'past_medical_surgical', field: 'History of Diseases', prevVal: formatClinicalText(draftContent.past_medical_surgical) })}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['past_medical_surgical'] === 'edited' ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {editedValues['past_medical_surgical'] || formatClinicalText(draftContent.past_medical_surgical) || 'No chronic illnesses reported.'}
                    </p>
                  </div>

                  {/* Family History */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2F5D62] uppercase tracking-wider">Family History (कुलज वृत्त)</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSectionAction('family_history', 'accepted', formatClinicalText(draftContent.family_history))}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['family_history'] === 'accepted' ? 'bg-[#2E7D4F] text-white border-[#2E7D4F]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => setEditReasonModal({ open: true, section: 'family_history', field: 'Family History', prevVal: formatClinicalText(draftContent.family_history) })}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['family_history'] === 'edited' ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {editedValues['family_history'] || formatClinicalText(draftContent.family_history) || 'No hereditary illnesses reported.'}
                    </p>
                  </div>

                  {/* Current Medications */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2F5D62] uppercase tracking-wider">Current Medications</span>
                        {sessionDetail?.extracted_entities?.some((e: any) => e.entity_type === 'medication') && (
                          <span className="bg-amber-100 text-[#B8860B] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Document Extracted
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSectionAction('medications', 'accepted', formatClinicalText(draftContent.medications))}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['medications'] === 'accepted' ? 'bg-[#2E7D4F] text-white border-[#2E7D4F]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => setEditReasonModal({ open: true, section: 'medications', field: 'Medications', prevVal: formatClinicalText(draftContent.medications) })}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['medications'] === 'edited' ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-2">
                      {editedValues['medications'] || formatClinicalText(draftContent.medications) || 'None reported'}
                    </p>
                  </div>

                  {/* Allergies Status */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2F5D62] uppercase tracking-wider">Allergies Status</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSectionAction('allergies', 'accepted', formatClinicalText(draftContent.allergies))}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['allergies'] === 'accepted' ? 'bg-[#2E7D4F] text-white border-[#2E7D4F]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => setEditReasonModal({ open: true, section: 'allergies', field: 'Allergies', prevVal: formatClinicalText(draftContent.allergies) })}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            sectionActions['allergies'] === 'edited' ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {editedValues['allergies'] || formatClinicalText(draftContent.allergies) || 'No known drug allergies reported.'}
                    </p>
                  </div>

                  {/* Ministry of AYUSH Assessment */}
                  {selectedSession?.clinical_mode === 'ayurveda' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <span className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider block mb-2">
                        🌿 Ministry of AYUSH — Tridosha & Agni Profile
                      </span>
                      <p className="text-sm font-semibold text-slate-800">
                        {formatClinicalText(draftContent.dashavidha_pariksha || draftContent.ayush_profile) || 'Prakriti & Agni intake completed.'}
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: LIVE AI INTERVIEW Q&A TRANSCRIPT */}
              {activeTab === 'qa_transcript' && (
                <div className="overflow-y-auto space-y-3 flex-1 pr-2">
                  <div className="bg-[#EAF3F2] p-4 rounded-2xl border border-teal-900/10 text-xs font-semibold text-[#2F5D62] mb-3">
                    Conversational AI History: Every intelligent question asked by the AI agent and the patient's spoken/tapped responses are recorded verbatim below.
                  </div>

                  {rawAnswers.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No responses recorded yet for this session.</p>
                  ) : (
                    rawAnswers.map((ans: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-[#2F5D62] uppercase">Turn #{idx + 1} ({ans.source_mode?.toUpperCase()})</span>
                          <span className="text-[10px] text-slate-400">{new Date(ans.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 mb-1">
                          Question ID: {ans.question_id}
                        </p>
                        <p className="text-sm font-bold text-slate-900 bg-white p-3 rounded-xl border border-slate-100">
                          "{ans.transcript_text}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: CONTRADICTIONS VIEW */}
              {activeTab === 'contradictions' && (
                <div className="overflow-y-auto space-y-4 flex-1 pr-2">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs font-semibold text-[#B8860B] mb-4">
                    Rule-Based Contradiction Policy: Discrepancies between spoken patient interview and scanned prescriptions are surfaced side-by-side. Physician selection required before attestation.
                  </div>

                  {sessionDetail?.contradictions?.length === 0 ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-[#2E7D4F] p-6 rounded-2xl text-center text-xs font-bold">
                      No clinical contradictions detected for this patient.
                    </div>
                  ) : (
                    sessionDetail?.contradictions?.map((c: any, idx: number) => (
                      <div key={idx} className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                          <span className="text-xs font-extrabold text-[#B8860B] uppercase tracking-wider">
                            Contradiction #{idx + 1}: {c.concept}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Auto-detected</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Patient Spoke (Voice/Touch)</span>
                            <p className="text-sm font-bold text-slate-900 mt-1">{c.spoken_value_ref}</p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Document Showed (Scanned Report)</span>
                            <p className="text-sm font-bold text-[#C4292A] mt-1">{c.document_value_ref}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-xs font-bold text-slate-700">Confirm True Fact:</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSectionAction('allergies', 'edited', c.spoken_value_ref, c.spoken_value_ref, 'Clinician confirmed patient spoken statement.')}
                              className="px-3 py-1.5 rounded-lg bg-[#2F5D62] text-white text-xs font-bold hover:bg-teal-800"
                            >
                              Confirm Spoken
                            </button>
                            <button 
                              onClick={() => handleSectionAction('allergies', 'edited', c.spoken_value_ref, c.document_value_ref, 'Clinician confirmed document record.')}
                              className="px-3 py-1.5 rounded-lg bg-[#C15B3A] text-white text-xs font-bold hover:bg-amber-800"
                            >
                              Confirm Document
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: TEXTUAL REPORT & FHIR R4 BUNDLE INSPECTOR VIEW */}
              {activeTab === 'fhir' && (
                <div className="overflow-y-auto space-y-4 flex-1 pr-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase block">NRCeS Textual Consultation Report & FHIR R4 Bundle</span>
                      <span className="text-[11px] text-slate-400">ABDM clinical documentation standard</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleExportFHIR}
                        className="px-4 py-2 bg-[#2F5D62] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-teal-800 shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Generate / Refresh Report
                      </button>
                      <button
                        onClick={handleDownloadOnePageText}
                        className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                      >
                        📥 Download .txt
                      </button>
                    </div>
                  </div>

                  {fhirValidation && (
                    <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border ${
                      fhirValidation.valid ? 'bg-emerald-50 text-[#2E7D4F] border-emerald-200' : 'bg-red-50 text-[#C4292A] border-red-200'
                    }`}>
                      <span>Validation Status: {fhirValidation.valid ? 'PASSED (0 Errors — NRCeS Compliant)' : 'FAILED'}</span>
                      <span>FHIR Resource Count: {fhirValidation.resource_count}</span>
                    </div>
                  )}

                  {/* Textual Clinical Report Display */}
                  <div className="bg-slate-900 rounded-2xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80 whitespace-pre leading-relaxed border border-slate-800">
                    {textualReport ? (
                      <code>{textualReport}</code>
                    ) : (
                      <p className="text-slate-400 italic">Click "Generate / Refresh Report" to compile the textual note and FHIR bundle.</p>
                    )}
                  </div>

                  {/* FHIR JSON Inspector */}
                  {fhirBundle && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Raw FHIR R4 Bundle JSON:
                      </span>
                      <pre className="bg-slate-950 text-emerald-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-64 border border-slate-800">
                        {JSON.stringify(fhirBundle, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* ATTESTATION SIGN-OFF FOOTER */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Attestation Sign-Off Gate</span>
                  <span className="text-[11px] text-slate-400">All contradictions and draft sections must be confirmed.</span>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportFHIR}
                    disabled={!isAttested}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 ${
                      isAttested ? 'bg-[#EAF3F2] text-[#2F5D62] border border-[#2F5D62]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Download className="w-4 h-4" /> Export FHIR Bundle
                  </button>

                  <button
                    onClick={handleAttestSignOff}
                    disabled={isAttested}
                    className={`touch-target px-6 py-3 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 transition-all ${
                      isAttested 
                        ? 'bg-[#2E7D4F] text-white cursor-default' 
                        : 'bg-[#2F5D62] text-white hover:bg-teal-800'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isAttested ? 'Signed & Attested' : 'Confirm & Sign Attestation'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-8">
              <Stethoscope className="w-16 h-16 mb-4 text-slate-300" />
              <p className="text-base font-semibold">Select a patient session from the queue to start clinical review.</p>
            </div>
          )}

        </div>
      </div>

      {/* EDIT REASON MODAL */}
      {editReasonModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Edit {editReasonModal.field}</h3>
            <p className="text-xs text-slate-500 mb-4">Every edit is preserved in review_actions audit trail with your reason.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">New Value</label>
                <textarea 
                  rows={3} 
                  defaultValue={editReasonModal.prevVal} 
                  onChange={e => setReasonInput(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setEditReasonModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleSectionAction(editReasonModal.section, 'edited', editReasonModal.prevVal, reasonInput || editReasonModal.prevVal, 'Clinician manual update');
                  setEditReasonModal(null);
                }}
                className="px-5 py-2 bg-[#2F5D62] text-white text-xs font-bold rounded-xl shadow-md"
              >
                Save Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRILLDOWN SOURCE MODAL */}
      {drilldownData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#2F5D62]" /> Source Drill-Down
            </h3>
            <p className="text-xs text-slate-500 mb-4">Provenance audit data for extracted clinical entity.</p>

            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 font-mono text-slate-800 mb-6">
              <p><span className="font-bold text-slate-500">Source Type:</span> {drilldownData.type}</p>
              <p><span className="font-bold text-slate-500">Document File:</span> {drilldownData.source}</p>
              <p><span className="font-bold text-slate-500">Crop Snippet:</span> {drilldownData.crop_ref}</p>
              <p><span className="font-bold text-slate-500">Confidence Score:</span> {drilldownData.confidence}</p>
              <p><span className="font-bold text-slate-500">AI Model Used:</span> {drilldownData.model}</p>
            </div>

            <button 
              onClick={() => setDrilldownData(null)}
              className="w-full py-2.5 bg-[#2F5D62] text-white text-xs font-bold rounded-xl"
            >
              Close Drill-Down
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
