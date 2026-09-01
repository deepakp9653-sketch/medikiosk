import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { checkRedFlagRules } from '@/lib/redflag';
import { generateConversationalFollowUp, generateBilingualSummary } from '@/lib/mistral';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;
    const body = await req.json();
    const { 
      question_id = 'q_chief_complaint', 
      source_mode = 'touch', 
      transcript_text, 
      selected_option, 
      section = 'chief_complaint',
      field_name = 'chief_complaint',
      question_text = ''
    } = body;

    const answerValue = transcript_text || selected_option || 'Unknown';

    // 1. Get current session info
    const sessionRes = await query(`SELECT * FROM sessions WHERE id = $1`, [sessionId]);
    const session = sessionRes.rows[0];
    const language = session?.language || 'hi';

    // 2. Record immutable raw answer (Patient Evidence Layer)
    const rawRes = await query(
      `INSERT INTO raw_answers (session_id, question_id, source_mode, transcript_text, confidence)
       VALUES ($1, $2, $3, $4, 0.95)
       RETURNING *`,
      [sessionId, question_id, source_mode, answerValue]
    );
    const rawAnswerId = rawRes.rows[0].id;

    // 3. Record structured history (Intake Draft Layer)
    await query(
      `INSERT INTO structured_history (session_id, section, field_name, value, source_raw_answer_id, confidence)
       VALUES ($1, $2, $3, $4, $5, 0.95)`,
      [sessionId, section, field_name, answerValue, rawAnswerId]
    );

    // If demographic field, update sessions table directly
    if (field_name === 'patient_name' || section === 'demographics' && field_name.includes('name')) {
      await query(
        `UPDATE sessions SET patient_name = $1, patient_ref = $1 WHERE id = $2`,
        [answerValue, sessionId]
      );
    } else if (field_name === 'gender') {
      await query(
        `UPDATE sessions SET gender = $1 WHERE id = $2`,
        [answerValue, sessionId]
      );
    } else if (field_name === 'age') {
      await query(
        `UPDATE sessions SET age = $1 WHERE id = $2`,
        [answerValue, sessionId]
      );
    }

    // 4. Check Deterministic Red-Flag Rule Engine
    const redFlagTrigger = checkRedFlagRules(answerValue, section, field_name, answerValue);
    if (redFlagTrigger) {
      const rfRes = await query(
        `INSERT INTO red_flag_events (session_id, rule_id, session_state_at_trigger)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [sessionId, redFlagTrigger.rule_id, JSON.stringify({ question_id, answerValue })]
      );

      return NextResponse.json({
        red_flag: true,
        trigger: redFlagTrigger,
        event_id: rfRes.rows[0].id
      });
    }

    // 5. Read all structured history and answers recorded so far for this session
    const allHistoryRes = await query(
      `SELECT sh.section, sh.field_name, sh.value, ra.question_id, ra.transcript_text 
       FROM structured_history sh
       LEFT JOIN raw_answers ra ON sh.source_raw_answer_id = ra.id
       WHERE sh.session_id = $1
       ORDER BY sh.id ASC`,
      [sessionId]
    );

    const historyItems = allHistoryRes.rows.map(h => ({
      question: h.question_id || 'Question',
      answer: h.value || h.transcript_text,
      section: h.section,
      field_name: h.field_name
    }));

    const turnCount = historyItems.length;
    const clinicalMode = session?.clinical_mode || 'allopathy';
    const patientName = session?.patient_name || undefined;

    // 6. Generate next conversational question intelligently via Mistral AI in < 1.5s
    const aiResponse = await generateConversationalFollowUp(historyItems, language, turnCount, clinicalMode, patientName);

    const isCompleted = Boolean(aiResponse.is_intake_complete || turnCount >= 8);

    // 7. If completed, mark status; draft summary can be generated on-demand by the summary route or in the background
    if (isCompleted) {
      await query(`UPDATE sessions SET status = 'completed', ended_at = NOW() WHERE id = $1`, [sessionId]);
      
      // Asynchronously generate the final summary without blocking if completed
      (async () => {
        try {
          const entitiesRes = await query(`SELECT * FROM extracted_entities WHERE session_id = $1`, [sessionId]);
          const summaryJSON = await generateBilingualSummary(allHistoryRes.rows, entitiesRes.rows, language, clinicalMode);
          const inputHash = `hash_${Date.now()}_complete`;
          await query(
            `INSERT INTO draft_summaries (session_id, model_name, model_version, prompt_version, content, input_hash)
             VALUES ($1, 'mistral-small-latest', 'v1.0', 'p1.0', $2, $3)`,
            [sessionId, JSON.stringify(summaryJSON), inputHash]
          );
        } catch (sumErr) {
          console.warn('Async summary generation notice:', sumErr);
        }
      })();
    }

    const isEnglish = language === 'en';
    const nextQuestion = isCompleted ? null : {
      id: `q_${aiResponse.field_name || Date.now()}`,
      question_localized: aiResponse.question_localized || (isEnglish ? 'Please describe your symptoms in detail.' : 'कृपया अपनी समस्या बताएं'),
      question_en: aiResponse.question_en || 'Please describe your symptoms',
      section: aiResponse.section || 'hpi',
      field_name: aiResponse.field_name || 'clinical_note',
      options: aiResponse.options || (isEnglish ? ['Yes', 'No', 'Not sure'] : ['हाँ / Yes', 'नहीं / No', 'पता नहीं / Not sure'])
    };

    return NextResponse.json({
      success: true,
      answered_question_id: question_id,
      next_question: nextQuestion,
      is_completed: isCompleted,
      turn_count: turnCount,
      clinical_mode: clinicalMode
    });
  } catch (err: any) {
    console.error('Error in converse turn:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
