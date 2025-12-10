import { createClient } from '@/utils/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { recordingId, userId, fileUrl } = await request.json()

        if (!recordingId || !userId || !fileUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = await createClient()

        // 1. Verify User (Security)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || user.id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Download Audio File from Supabase Storage
        // fileUrl is the storage path like "{userId}/{recordingId}.webm"
        const { data: fileData, error: downloadError } = await supabase.storage
            .from('audio-recordings')
            .download(fileUrl)

        if (downloadError || !fileData) {
            console.error('Download error:', downloadError)
            await updateStatus(supabase, recordingId, 'failed')
            return NextResponse.json({ error: 'Failed to download audio' }, { status: 500 })
        }

        // 3. Convert Blob to ArrayBuffer for Gemini
        const audioBuffer = await fileData.arrayBuffer()
        const base64Audio = Buffer.from(audioBuffer).toString('base64')

        // 4. Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        // 5. Generate Content
        // We ask for JSON output for structured data
        const prompt = `
            You are an expert transcription assistant. 
            Please analyze the attached audio file and provide the following in JSON format:
            1. "raw_text": The full, accurate transcription of the audio.
            2. "summary": A concise summary of the content (2-3 sentences).
            3. "key_points": An array of bullet points highlighting key takeaways.
            4. "action_items": An array of any action items or tasks mentioned (if any).
            
            Return ONLY the JSON object.
        `

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "audio/webm",
                    data: base64Audio
                }
            }
        ])

        const response = await result.response
        const textResponse = response.text()

        // Clean up markdown code blocks if present
        const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim()

        let analysisResult
        try {
            analysisResult = JSON.parse(jsonString)
        } catch (e) {
            console.error('JSON Parse Error:', e)
            // Fallback if JSON fails
            analysisResult = {
                raw_text: textResponse,
                summary: "failed to parse structured summary",
                key_points: [],
                action_items: []
            }
        }

        // 6. Save to Database
        // Insert Transcription
        const { error: insertError } = await supabase
            .from('transcriptions')
            .insert({
                recording_id: recordingId,
                user_id: userId,
                raw_text: analysisResult.raw_text || "No text available",
                summary: analysisResult.summary,
                key_points: analysisResult.key_points,
                action_items: analysisResult.action_items
            })

        if (insertError) {
            console.error('Insert error:', insertError)
            throw insertError
        }

        // Update Recording Status
        await updateStatus(supabase, recordingId, 'completed')

        return NextResponse.json({ success: true, data: analysisResult })

    } catch (error: any) {
        console.error('Processing error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

async function updateStatus(supabase: any, recordingId: string, status: string) {
    await supabase.from('recordings').update({ status }).eq('id', recordingId)
}
