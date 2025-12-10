import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function useUploadRecording() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const uploadRecording = async (blob: Blob, userId: string, title: string = 'New Recording') => {
        setIsUploading(true)
        setError(null)
        setUploadProgress(10)

        try {
            // 1. Generate unique file path
            const recordingId = crypto.randomUUID()
            const fileExt = 'webm'
            const fileName = `${userId}/${recordingId}.${fileExt}`
            const file = new File([blob], fileName, { type: 'audio/webm' })

            // 2. Upload file to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from('audio-recordings')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError
            setUploadProgress(60)

            // 3. Get Public URL (optional, depending on privacy needs)
            // For private buckets, we generally just store the path or signed URL generation on demand
            // storing the path is enough: data.path

            // 4. Create Database Record
            const { error: dbError } = await supabase
                .from('recordings')
                .insert({
                    id: recordingId,
                    user_id: userId,
                    title: title,
                    audio_url: data.path, // Storing the storage path
                    status: 'processing',
                    // Calculate estimated duration if possible, or update later
                    duration_seconds: null
                })

            if (dbError) throw dbError
            setUploadProgress(100)

            // 5. Trigger Processing (Async)
            // We don't await this to keep UI responsive, or we can await if we want to show "Processing..."
            fetch('/api/process-recording', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recordingId,
                    userId,
                    fileUrl: data.path
                })
            }).catch(err => console.error('Trigger processing failed:', err))

            // 6. Redirect on success
            router.push('/dashboard')
            router.refresh()

        } catch (err: any) {
            console.error('Upload failed:', err)
            setError(err.message || 'Failed to upload recording')
        } finally {
            setIsUploading(false)
        }
    }

    return {
        uploadRecording,
        isUploading,
        uploadProgress,
        error
    }
}
