import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { language = 'hi', queue_id, abha_mock_id, patient_ref } = body;

    const res = await query(
      `INSERT INTO sessions (language, queue_id, abha_mock_id, patient_ref, status)
       VALUES ($1, $2, $3, $4, 'in_progress')
       RETURNING *`,
      [language, queue_id || `Q-${Math.floor(100 + Math.random() * 900)}`, abha_mock_id || null, patient_ref || 'PATIENT_GUEST']
    );

    const session = res.rows[0];

    // Log Audit
    await query(
      `INSERT INTO audit_log (actor_id, actor_type, action, table_ref, record_ref)
       VALUES ($1, 'patient', 'CREATE_SESSION', 'sessions', $2)`,
      [session.id, session.id]
    );

    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    console.error('Error creating session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
