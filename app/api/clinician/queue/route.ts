import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        s.id,
        s.queue_id,
        s.patient_ref,
        s.patient_name,
        s.age,
        s.gender,
        s.language,
        s.status,
        s.started_at,
        (SELECT COUNT(*) FROM red_flag_events rf WHERE rf.session_id = s.id) AS red_flag_count,
        (SELECT COUNT(*) FROM contradictions c WHERE c.session_id = s.id AND c.resolved_at IS NULL) AS contradiction_count,
        (SELECT COUNT(*) FROM extracted_entities ee WHERE ee.session_id = s.id AND ee.needs_verification = TRUE) AS verification_count,
        (SELECT content FROM draft_summaries ds WHERE ds.session_id = s.id ORDER BY ds.generated_at DESC LIMIT 1) AS latest_draft
      FROM sessions s
      ORDER BY 
        red_flag_count DESC, 
        contradiction_count DESC, 
        s.started_at DESC
    `);

    const queue = res.rows.map(row => {
      let draft = row.latest_draft;
      if (typeof draft === 'string') {
        try {
          draft = JSON.parse(draft);
        } catch {
          draft = null;
        }
      }
      return {
        ...row,
        latest_draft: draft
      };
    });

    return NextResponse.json({ success: true, queue });
  } catch (err: any) {
    console.error('Error fetching clinician queue:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
