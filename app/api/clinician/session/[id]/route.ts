import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;

    // 1. Session master record
    const sessionRes = await query(`SELECT * FROM sessions WHERE id = $1`, [sessionId]);
    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    const session = sessionRes.rows[0];

    // 2. Structured History
    const historyRes = await query(
      `SELECT * FROM structured_history WHERE session_id = $1 ORDER BY id ASC`,
      [sessionId]
    );

    // 3. Extracted Entities
    const entitiesRes = await query(
      `SELECT * FROM extracted_entities WHERE session_id = $1 ORDER BY id ASC`,
      [sessionId]
    );

    // 4. Raw Answers
    const rawRes = await query(
      `SELECT * FROM raw_answers WHERE session_id = $1 ORDER BY id ASC`,
      [sessionId]
    );

    // 5. Latest Draft Summary
    const draftRes = await query(
      `SELECT * FROM draft_summaries WHERE session_id = $1 ORDER BY generated_at DESC LIMIT 1`,
      [sessionId]
    );

    let draftContent = null;
    if (draftRes.rows.length > 0) {
      const row = draftRes.rows[0];
      draftContent = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    } else {
      // Synthesize from live structured history
      const cc = historyRes.rows.find(h => h.section === 'chief_complaint')?.value || 'Interview in progress';
      const hpiItems = historyRes.rows.filter(h => h.section === 'hpi').map(h => `${h.field_name?.replace(/_/g, ' ')}: ${h.value}`).join('; ');
      const meds = entitiesRes.rows.filter(e => e.entity_type === 'medication').map(e => e.fields?.name || e.name).join(', ');
      const allergies = historyRes.rows.find(h => h.section === 'allergies')?.value || 'No known allergies reported';

      draftContent = {
        patient_summary_bilingual: 'Intake in progress',
        clinician_summary: {
          chief_complaint: String(cc),
          hpi: hpiItems || 'Patient interview currently active.',
          past_medical_surgical: 'None reported',
          medications: meds || 'No medications recorded',
          allergies: String(allergies),
          ayush_profile: 'Standard',
          review_of_systems: 'Completed',
          prior_investigations: 'Pending document scan'
        }
      };
    }

    // 6. Contradictions
    const contradictionsRes = await query(
      `SELECT * FROM contradictions WHERE session_id = $1 ORDER BY id ASC`,
      [sessionId]
    );

    // 7. Review Actions (using acted_at)
    const reviewRes = await query(
      `SELECT * FROM review_actions WHERE session_id = $1 ORDER BY acted_at ASC`,
      [sessionId]
    );

    // 8. Attested Record
    const attestedRes = await query(
      `SELECT * FROM attested_records WHERE session_id = $1 ORDER BY attested_at DESC LIMIT 1`,
      [sessionId]
    );

    return NextResponse.json({
      success: true,
      session,
      structured_history: historyRes.rows,
      extracted_entities: entitiesRes.rows,
      raw_answers: rawRes.rows,
      latest_draft: draftContent,
      contradictions: contradictionsRes.rows,
      review_actions: reviewRes.rows,
      attested_record: attestedRes.rows[0] || null
    });
  } catch (err: any) {
    console.error('Error fetching session details:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
