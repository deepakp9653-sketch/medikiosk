import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { buildSyntheticFHIRBundle, validateFHIRBundleSchema } from '@/lib/fhir';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;

    // 1. Check if session has been attested by a clinician
    const attestRes = await query(
      `SELECT * FROM attested_records WHERE session_id = $1 ORDER BY attested_at DESC LIMIT 1`,
      [sessionId]
    );

    if (attestRes.rows.length === 0) {
      return NextResponse.json({
        error: 'FHIR Export Blocked: Attestation Gate requires physician sign-off before FHIR export.'
      }, { status: 403 });
    }

    const attestedRecord = attestRes.rows[0];

    // 2. Fetch session and patient info
    const sessionRes = await query(`SELECT * FROM sessions WHERE id = $1`, [sessionId]);
    const session = sessionRes.rows[0];

    // 3. Generate synthetic FHIR R4 Bundle
    const fhirBundle = buildSyntheticFHIRBundle(session, attestedRecord);

    // 4. Validate FHIR Bundle Schema
    const validation = validateFHIRBundleSchema(fhirBundle);

    if (!validation.valid) {
      return NextResponse.json({
        error: 'FHIR Schema Validation Failed',
        errors: validation.errors
      }, { status: 422 });
    }

    // 5. Store valid FHIR bundle in Clinician-Attested Layer
    const bundleRes = await query(
      `INSERT INTO fhir_bundles (session_id, attested_record_id, bundle_type, bundle_json, validation_status)
       VALUES ($1, $2, 'document', $3, 'valid')
       RETURNING *`,
      [sessionId, attestedRecord.id, JSON.stringify(fhirBundle)]
    );

    return NextResponse.json({
      success: true,
      bundle: fhirBundle,
      validation,
      record_id: bundleRes.rows[0].id
    });
  } catch (err: any) {
    console.error('Error exporting FHIR bundle:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
