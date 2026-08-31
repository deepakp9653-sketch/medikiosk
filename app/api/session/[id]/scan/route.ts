import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { extractDocumentEntitiesFromBase64, generateBilingualSummary } from '@/lib/mistral';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No document file uploaded' }, { status: 400 });
    }

    const mimeType = file.type || 'image/jpeg';
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString('base64');

    // 1. Fetch patient's prior interview context from structured_history to provide context knowledge
    const historyRes = await query(
      `SELECT section, field_name, value FROM structured_history WHERE session_id = $1 ORDER BY id ASC`,
      [sessionId]
    );
    const patientContext = historyRes.rows;

    // 2. Perform zero-disk RAM extraction with Mistral Pixtral Vision model infused with Patient Context Knowledge
    const extractedData = await extractDocumentEntitiesFromBase64(base64Image, mimeType, patientContext);

    const isReadable = extractedData.is_readable !== false;
    const qualityResult = isReadable ? 'PASSED' : 'FAILED_UNREADABLE';

    // 3. Record document upload entry in Patient Evidence Layer
    let docUploadId = null;
    try {
      const docRes = await query(
        `INSERT INTO document_uploads (session_id, file_ref, mime_type, quality_check_result)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [sessionId, `ram_buffer_${Date.now()}`, mimeType, qualityResult]
      );
      docUploadId = docRes.rows[0]?.id;
    } catch (e: any) {
      console.warn('document_uploads insert notice:', e.message);
    }

    // 4. Store extracted entities into Intake Draft Layer safely
    const entityInserts = [];

    // Save diagnoses
    if (extractedData.diagnoses && Array.isArray(extractedData.diagnoses)) {
      for (const diag of extractedData.diagnoses) {
        const diagName = typeof diag === 'string' ? diag : (diag.name || JSON.stringify(diag));
        const confidence = typeof diag?.confidence === 'number' ? diag.confidence : 0.90;
        const needsVerification = confidence < 0.70;
        const fieldsObj = typeof diag === 'object' && diag !== null ? diag : { name: diagName };

        try {
          const res = await query(
            `INSERT INTO extracted_entities (session_id, source_doc_id, entity_type, raw_text, confidence, needs_verification, fields)
             VALUES ($1, $2, 'diagnosis', $3, $4, $5, $6::jsonb)
             RETURNING *`,
            [sessionId, docUploadId, diagName, confidence, needsVerification, JSON.stringify(fieldsObj)]
          );
          entityInserts.push(res.rows[0]);
        } catch (e: any) {
          console.warn('Diagnosis entity insert notice:', e.message);
        }
      }
    }

    // Save medications
    if (extractedData.medications && Array.isArray(extractedData.medications)) {
      for (const med of extractedData.medications) {
        const medName = typeof med === 'string' ? med : (med.name || JSON.stringify(med));
        const confidence = typeof med?.confidence === 'number' ? med.confidence : 0.90;
        const needsVerification = confidence < 0.70;
        const fieldsObj = typeof med === 'object' && med !== null ? med : { name: medName };

        try {
          const res = await query(
            `INSERT INTO extracted_entities (session_id, source_doc_id, entity_type, raw_text, confidence, needs_verification, fields)
             VALUES ($1, $2, 'medication', $3, $4, $5, $6::jsonb)
             RETURNING *`,
            [sessionId, docUploadId, medName, confidence, needsVerification, JSON.stringify(fieldsObj)]
          );
          entityInserts.push(res.rows[0]);
        } catch (e: any) {
          console.warn('Medication entity insert notice:', e.message);
        }
      }
    }

    // Save lab values
    if (extractedData.lab_values && Array.isArray(extractedData.lab_values)) {
      for (const lab of extractedData.lab_values) {
        const labText = typeof lab === 'string' ? lab : `${lab.name || 'Lab'}: ${lab.value || ''} ${lab.unit || ''}`;
        const confidence = typeof lab?.confidence === 'number' ? lab.confidence : 0.90;
        const needsVerification = confidence < 0.70;
        const fieldsObj = typeof lab === 'object' && lab !== null ? lab : { name: labText };

        try {
          const res = await query(
            `INSERT INTO extracted_entities (session_id, source_doc_id, entity_type, raw_text, confidence, needs_verification, fields)
             VALUES ($1, $2, 'lab_result', $3, $4, $5, $6::jsonb)
             RETURNING *`,
            [sessionId, docUploadId, labText, confidence, needsVerification, JSON.stringify(fieldsObj)]
          );
          entityInserts.push(res.rows[0]);
        } catch (e: any) {
          console.warn('Lab value entity insert notice:', e.message);
        }
      }
    }

    // Save key findings or clinical notes
    if (extractedData.key_findings) {
      const noteStr = typeof extractedData.key_findings === 'string' ? extractedData.key_findings : JSON.stringify(extractedData.key_findings);
      try {
        await query(
          `INSERT INTO extracted_entities (session_id, source_doc_id, entity_type, raw_text, confidence, needs_verification, fields)
           VALUES ($1, $2, 'clinical_note', $3, 0.95, false, $4::jsonb)`,
          [sessionId, docUploadId, noteStr, JSON.stringify({ note: noteStr, doctor: extractedData.doctor_or_hospital || 'Doctor' })]
        );
      } catch (e: any) {
        console.warn('Clinical note entity insert notice:', e.message);
      }
    }

    // 5. Automatically refresh the bilingual clinical summary with the newly extracted evidence
    try {
      const allEntitiesRes = await query(`SELECT * FROM extracted_entities WHERE session_id = $1`, [sessionId]);
      const sessionInfo = await query(`SELECT preferred_language FROM sessions WHERE id = $1`, [sessionId]);
      const lang = sessionInfo.rows[0]?.preferred_language || 'hi';

      const summaryJSON = await generateBilingualSummary(historyRes.rows, allEntitiesRes.rows, lang);
      const inputHash = `hash_${Date.now()}_scan`;

      await query(
        `INSERT INTO draft_summaries (session_id, model_name, model_version, prompt_version, content, input_hash)
         VALUES ($1, 'mistral-small-latest', 'v1.0', 'p1.0', $2::jsonb, $3)`,
        [sessionId, JSON.stringify(summaryJSON), inputHash]
      );
    } catch (sumErr: any) {
      console.warn('Summary auto-refresh notice after scan:', sumErr.message);
    }

    return NextResponse.json({
      success: true,
      quality_assessment: extractedData.quality_assessment || 'good',
      doc_id: docUploadId,
      raw_extraction: extractedData,
      saved_entities: entityInserts
    });
  } catch (err: any) {
    console.error('Error during document scanning:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
