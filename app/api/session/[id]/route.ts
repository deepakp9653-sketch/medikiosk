import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;
    const body = await req.json();
    const { queue_id, abha_mock_id } = body;

    const res = await query(
      `UPDATE sessions
       SET queue_id = COALESCE($1, queue_id),
           abha_mock_id = COALESCE($2, abha_mock_id)
       WHERE id = $3
       RETURNING *`,
      [queue_id || null, abha_mock_id || null, sessionId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, session: res.rows[0] });
  } catch (err: any) {
    console.error('Error updating session identity:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
