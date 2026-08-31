/**
 * MediKiosk Synthetic FHIR R4 Bundle Generator & Validator (Module D §4.3)
 * Builds FHIR R4 Bundle strictly from the Clinician-Attested record (`attested_records`).
 */

export interface FHIRValidationResult {
  valid: boolean;
  resource_count: number;
  validator_version: string;
  issues: string[];
}

export function buildSyntheticFHIRBundle(attestedRecord: any, sessionInfo: any) {
  const bundleId = `bundle-${attestedRecord.id || Date.now()}`;
  const timestamp = new Date().toISOString();
  const patientRef = sessionInfo?.patient_ref || 'Patient/PATIENT_ANONYMOUS';

  const content = typeof attestedRecord.content === 'string' 
    ? JSON.parse(attestedRecord.content) 
    : (attestedRecord.content || {});

  const entries: any[] = [];

  // 1. Patient Resource
  entries.push({
    fullUrl: `urn:uuid:patient-1`,
    resource: {
      resourceType: 'Patient',
      id: 'patient-1',
      identifier: [
        {
          system: 'https://healthid.ndhm.gov.in',
          value: sessionInfo?.abha_mock_id || '91-1234-5678-9012'
        }
      ],
      name: [{ text: sessionInfo?.patient_name || 'Anonymous Patient' }],
      gender: 'other',
    }
  });

  // 2. Encounter Resource
  entries.push({
    fullUrl: `urn:uuid:encounter-1`,
    resource: {
      resourceType: 'Encounter',
      id: 'encounter-1',
      status: 'finished',
      class: {
        system: 'http://terminology.hlpt.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'ambulatory'
      },
      subject: { reference: 'urn:uuid:patient-1' },
      period: {
        start: sessionInfo?.started_at || timestamp,
        end: timestamp
      }
    }
  });

  // 3. Condition Resource (Chief Complaint & History)
  if (content.chief_complaint) {
    entries.push({
      fullUrl: `urn:uuid:condition-1`,
      resource: {
        resourceType: 'Condition',
        id: 'condition-1',
        clinicalStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }]
        },
        verificationStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed' }]
        },
        code: {
          text: content.chief_complaint
        },
        subject: { reference: 'urn:uuid:patient-1' },
        encounter: { reference: 'urn:uuid:encounter-1' }
      }
    });
  }

  // 4. MedicationStatement Resource
  if (content.medications) {
    entries.push({
      fullUrl: `urn:uuid:medication-1`,
      resource: {
        resourceType: 'MedicationStatement',
        id: 'medication-1',
        status: 'active',
        medicationCodeableConcept: {
          text: content.medications
        },
        subject: { reference: 'urn:uuid:patient-1' }
      }
    });
  }

  // 5. Composition Resource (Main Clinical Header)
  const composition = {
    fullUrl: `urn:uuid:composition-1`,
    resource: {
      resourceType: 'Composition',
      id: 'composition-1',
      status: 'final',
      type: {
        coding: [{ system: 'http://loinc.org', code: '11506-3', display: 'Progress note' }],
        text: 'MediKiosk Clinician-Attested Outpatient Intake Note'
      },
      subject: { reference: 'urn:uuid:patient-1' },
      encounter: { reference: 'urn:uuid:encounter-1' },
      date: timestamp,
      author: [{ display: attestedRecord.clinician_id || 'Dr. Attending Clinician' }],
      title: 'MediKiosk Clinical Consultation Record',
      section: [
        {
          title: 'Chief Complaint',
          text: { status: 'generated', div: `<div>${content.chief_complaint || 'N/A'}</div>` }
        },
        {
          title: 'History of Present Illness',
          text: { status: 'generated', div: `<div>${content.hpi || 'N/A'}</div>` }
        },
        {
          title: 'Current Medications',
          text: { status: 'generated', div: `<div>${content.medications || 'N/A'}</div>` }
        }
      ]
    }
  };

  entries.unshift(composition);

  // 6. Provenance Resource (Sign-Off Record)
  entries.push({
    fullUrl: `urn:uuid:provenance-1`,
    resource: {
      resourceType: 'Provenance',
      id: 'provenance-1',
      target: [{ reference: 'urn:uuid:composition-1' }],
      recorded: timestamp,
      agent: [
        {
          who: { display: attestedRecord.clinician_id || 'Attending Clinician' }
        }
      ]
    }
  });

  const bundle = {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'document',
    timestamp: timestamp,
    entry: entries
  };

  return bundle;
}

export function validateFHIRBundle(bundle: any): FHIRValidationResult {
  const issues: string[] = [];

  if (!bundle || bundle.resourceType !== 'Bundle') {
    issues.push('Invalid resourceType: must be "Bundle"');
  }

  if (bundle.type !== 'document') {
    issues.push('Invalid Bundle type: must be "document"');
  }

  if (!Array.isArray(bundle.entry) || bundle.entry.length === 0) {
    issues.push('Bundle contains no entry resources');
  }

  // Check Composition entry
  const hasComposition = bundle.entry?.some((e: any) => e.resource?.resourceType === 'Composition');
  if (!hasComposition) {
    issues.push('Document Bundle missing required first entry "Composition"');
  }

  return {
    valid: issues.length === 0,
    resource_count: bundle.entry?.length || 0,
    validator_version: 'MediKiosk-FHIR-R4-v1.0 (NRCeS Aligned Sandbox)',
    issues: issues
  };
}
