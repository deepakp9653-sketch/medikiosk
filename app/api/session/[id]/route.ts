import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;
    const body = await req.json();
    const { queue_id, abha_mock_id, patient_name, age, gender } = body;

    const res = await query(
      `UPDATE sessions
       SET queue_id = COALESCE($1, queue_id),
           abha_mock_id = COALESCE($2, abha_mock_id),
           patient_name = COALESCE($3, patient_name),
           age = COALESCE($4, age),
           gender = COALESCE($5, gender)
       WHERE id = $6
       RETURNING *`,
      [queue_id || null, abha_mock_id || null, patient_name || null, age ? parseInt(String(age), 10) : null, gender || null, sessionId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Also persist demographics into structured_history
    if (patient_name) {
      await query(
        `INSERT INTO structured_history (session_id, section, field_name, value, confidence)
         VALUES ($1, 'demographics', 'patient_name', $2, 1.0)`,
        [sessionId, patient_name]
      ).catch(() => {});
    }
    if (age) {
      await query(
        `INSERT INTO structured_history (session_id, section, field_name, value, confidence)
         VALUES ($1, 'demographics', 'age', $2, 1.0)`,
        [sessionId, String(age)]
      ).catch(() => {});
    }
    if (gender) {
      await query(
        `INSERT INTO structured_history (session_id, section, field_name, value, confidence)
         VALUES ($1, 'demographics', 'gender', $2, 1.0)`,
        [sessionId, gender]
      ).catch(() => {});
    }

    return NextResponse.json({ success: true, session: res.rows[0] });
  } catch (err: any) {
    console.error('Error updating session demographics:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
