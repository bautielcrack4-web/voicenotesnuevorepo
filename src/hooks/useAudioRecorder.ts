import { useState, useRef, useEffect, useCallback } from 'react'

export interface AudioRecorderState {
    isRecording: boolean
    isPaused: boolean
    duration: number
    audioBlob: Blob | null
}

export function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [duration, setDuration] = useState(0)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const startTimeRef = useRef<number>(0)
    const durationOffsetRef = useRef<number>(0)

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            setMediaStream(stream)

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm' // Standard for web recording
            })

            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                setAudioBlob(blob)

                // Cleanup stream tracks
                stream.getTracks().forEach(track => track.stop())
                setMediaStream(null)
            }

            mediaRecorder.start(200) // Collect data every 200ms

            setIsRecording(true)
            setIsPaused(false)
            setError(null)

            // Start timer
            startTimeRef.current = Date.now() - durationOffsetRef.current
            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
            }, 100)

        } catch (err: any) {
            setError(err.message || 'Could not access microphone')
            console.error('Error starting recording:', err)
        }
    }, [])

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause()
            setIsPaused(true)

            if (timerRef.current) {
                clearInterval(timerRef.current)
                durationOffsetRef.current = Date.now() - startTimeRef.current
            }
        }
    }, [isRecording, isPaused])

    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume()
            setIsPaused(false)

            startTimeRef.current = Date.now() - durationOffsetRef.current
            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
            }, 100)
        }
    }, [isRecording, isPaused])

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            setIsPaused(false)

            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isRecording])

    const resetRecording = useCallback(() => {
        setAudioBlob(null)
        setDuration(0)
        durationOffsetRef.current = 0
        setError(null)

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop())
            setMediaStream(null)
        }
    }, [mediaStream])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (mediaStream) mediaStream.getTracks().forEach(track => track.stop())
        }
    }, [mediaStream])

    return {
        isRecording,
        isPaused,
        duration,
        audioBlob,
        error,
        mediaStream, // Exposed for visuals
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        resetRecording
    }
}
