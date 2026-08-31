import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateBilingualSummary } from '@/lib/mistral';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;

    // 1. Read session info
    const sessionRes = await query(`SELECT * FROM sessions WHERE id = $1`, [sessionId]);
    const session = sessionRes.rows[0];
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // 2. Read structured history (Module A)
    const historyRes = await query(`SELECT * FROM structured_history WHERE session_id = $1`, [sessionId]);
    const structuredHistory = historyRes.rows;

    // 3. Read extracted entities (Module B)
    const entitiesRes = await query(`SELECT * FROM extracted_entities WHERE session_id = $1`, [sessionId]);
    const extractedEntities = entitiesRes.rows;

    // 4. Generate bilingual draft summary via Mistral
    const summaryJSON = await generateBilingualSummary(structuredHistory, extractedEntities, session.language || 'hi');

    // 5. Store draft summary (Intake Draft Layer)
    const inputHash = `hash_${Date.now()}_${structuredHistory.length}_${extractedEntities.length}`;
    const draftRes = await query(
      `INSERT INTO draft_summaries (session_id, model_name, model_version, prompt_version, content, input_hash)
       VALUES ($1, 'mistral-small-latest', 'v1.0', 'p1.0', $2, $3)
       RETURNING *`,
      [sessionId, JSON.stringify(summaryJSON), inputHash]
    );

    // 6. Perform Rule-Based Contradiction Detection
    const spokenAllergy = structuredHistory.find(h => h.section === 'allergies' || h.field_name === 'allergies')?.value;
    const docMeds = extractedEntities.filter(e => e.entity_type === 'medication');

    if (spokenAllergy && spokenAllergy.includes('No allergies') && docMeds.length > 0) {
      const existingContradiction = await query(
        `SELECT * FROM contradictions WHERE session_id = $1 AND concept = 'allergy_vs_medication'`,
        [sessionId]
      );

      if (existingContradiction.rows.length === 0) {
        await query(
          `INSERT INTO contradictions (session_id, concept, spoken_value_ref, document_value_ref)
           VALUES ($1, 'allergy_vs_medication', $2, $3)`,
          [sessionId, `Spoken: ${spokenAllergy}`, `Document shows active medication: ${docMeds.map(m => m.fields?.name || m.raw_text).join(', ')}`]
        );
      }
    }

    // Fetch all active contradictions
    const contradictionsRes = await query(`SELECT * FROM contradictions WHERE session_id = $1`, [sessionId]);

    return NextResponse.json({
      success: true,
      draft_summary: draftRes.rows[0],
      contradictions: contradictionsRes.rows
    });
  } catch (err: any) {
    console.error('Error generating summary:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
