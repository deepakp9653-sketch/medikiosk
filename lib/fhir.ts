/**
 * MediKiosk Synthetic FHIR R4 Bundle Generator & Validator (Module D §4.3)
 * Builds FHIR R4 Bundle strictly from the Clinician-Attested record (`attested_records`).
 */

export interface FHIRValidationResult {
  valid: boolean;
  resource_count: number;
  validator_version: string;
  issues: string[];
  errors?: string[];
}

export function buildSyntheticFHIRBundle(attestedRecord: any, sessionInfo: any) {
  const bundleId = `bundle-${attestedRecord.id || Date.now()}`;
  const timestamp = new Date().toISOString();
  const patientRef = sessionInfo?.patient_ref || 'Patient/PATIENT_ANONYMOUS';

  const content = typeof attestedRecord.content === 'string' 
    ? JSON.parse(attestedRecord.content) 
    : (attestedRecord.content || {});

  const entries: any[] = [];

  // Normalize gender to valid FHIR code (male | female | other | unknown)
  let fhirGender = 'other';
  const rawGender = (sessionInfo?.gender || '').toLowerCase();
  if (rawGender.includes('male') || rawGender.includes('पुरुष') || rawGender.includes('পুরুষ') || rawGender.includes('ஆண்') || rawGender.includes('పురుషుడు')) {
    fhirGender = rawGender.includes('female') || rawGender.includes('महिला') || rawGender.includes('মহিলা') || rawGender.includes('பெண்') || rawGender.includes('స్త్రీ') ? 'female' : 'male';
  } else if (rawGender.includes('female') || rawGender.includes('महिला') || rawGender.includes('स्त्री') || rawGender.includes('মহিলা') || rawGender.includes('பெண்') || rawGender.includes('స్త్రీ')) {
    fhirGender = 'female';
  }

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
      name: [{ text: sessionInfo?.patient_name || sessionInfo?.patient_ref || 'Anonymous Patient' }],
      gender: fhirGender,
      extension: sessionInfo?.age ? [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/patient-age',
          valueString: String(sessionInfo.age)
        }
      ] : undefined
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

  // 3. Composition Resource (Document Header)
  entries.push({
    fullUrl: `urn:uuid:composition-1`,
    resource: {
      resourceType: 'Composition',
      id: 'composition-1',
      status: 'final',
      type: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '11488-4',
            display: 'Consultation note'
          }
        ]
      },
      subject: { reference: 'urn:uuid:patient-1' },
      encounter: { reference: 'urn:uuid:encounter-1' },
      date: timestamp,
      author: [
        {
          display: `Clinician Dr. ${attestedRecord.attested_by_clinician_id || 'OPD-Physician'}`
        }
      ],
      title: 'MediKiosk Outpatient Intake & Clinical Attestation',
      section: [
        {
          title: 'Chief Complaint',
          text: {
            status: 'generated',
            div: `<div xmlns="http://www.w3.org/1999/xhtml">${content.chief_complaint || 'Not specified'}</div>`
          }
        },
        {
          title: 'History of Present Illness (HPI)',
          text: {
            status: 'generated',
            div: `<div xmlns="http://www.w3.org/1999/xhtml">${content.hpi || 'Not specified'}</div>`
          }
        },
        {
          title: 'Medications',
          text: {
            status: 'generated',
            div: `<div xmlns="http://www.w3.org/1999/xhtml">${content.medications || 'None recorded'}</div>`
          }
        },
        {
          title: 'Allergies',
          text: {
            status: 'generated',
            div: `<div xmlns="http://www.w3.org/1999/xhtml">${content.allergies || 'No known allergies reported'}</div>`
          }
        }
      ]
    }
  });

  // 4. Condition Resources (Diagnoses)
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
        subject: { reference: 'urn:uuid:patient-1' }
      }
    });
  }

  // 5. MedicationStatement Resources
  if (content.medications && content.medications !== 'None recorded') {
    entries.push({
      fullUrl: `urn:uuid:medication-1`,
      resource: {
        resourceType: 'MedicationStatement',
        id: 'medication-1',
        status: 'active',
        medicationCodeableConcept: {
          text: content.medications
        },
        subject: { reference: 'urn:uuid:patient-1' },
        effectiveDateTime: timestamp
      }
    });
  }

  // 6. AllergyIntolerance Resources
  if (content.allergies && content.allergies !== 'None reported' && content.allergies !== 'No known allergies reported') {
    entries.push({
      fullUrl: `urn:uuid:allergy-1`,
      resource: {
        resourceType: 'AllergyIntolerance',
        id: 'allergy-1',
        clinicalStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active' }]
        },
        code: {
          text: content.allergies
        },
        patient: { reference: 'urn:uuid:patient-1' }
      }
    });
  }

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
    issues: issues,
    errors: issues
  };
}

export const validateFHIRBundleSchema = validateFHIRBundle;
