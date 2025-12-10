'use client'

import { useEffect, useState } from 'react'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useUploadRecording } from '@/hooks/useUploadRecording'
import AudioVisualizer from '@/components/recorder/AudioVisualizer'
import { Mic, Square, Pause, Play, Upload, RotateCcw } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function RecordPage() {
    const {
        isRecording,
        isPaused,
        duration,
        audioBlob,
        mediaStream,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        resetRecording
    } = useAudioRecorder()

    const { uploadRecording, isUploading, uploadProgress, error: uploadError } = useUploadRecording()
    const [userId, setUserId] = useState<string | null>(null)
    const [title, setTitle] = useState('')

    // Fetch User ID on mount
    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        fetchUser()
    }, [])

    const handleUpload = async () => {
        if (!audioBlob || !userId) return
        await uploadRecording(audioBlob, userId, title || `Recording ${new Date().toLocaleString()}`)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="max-w-4xl mx-auto">
            <DashboardHeader title="New Recording" subtitle="Capture your thoughts, meetings, or ideas" />

            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/50 p-12 backdrop-blur-xl">

                {/* Visualizer Area */}
                <div className="mb-12 h-40 w-full max-w-2xl overflow-hidden rounded-xl border border-white/5 bg-black/40">
                    <AudioVisualizer stream={mediaStream} isRecording={isRecording && !isPaused} />
                </div>

                {/* Timer */}
                <div className="mb-12 text-7xl font-bold tracking-tighter text-white tabular-nums">
                    {formatTime(duration)}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                    {!isRecording && !audioBlob && (
                        <button
                            onClick={startRecording}
                            className="group flex h-20 w-20 items-center justify-center rounded-full bg-red-600 transition-all hover:scale-105 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
                        >
                            <Mic className="h-8 w-8 text-white" />
                        </button>
                    )}

                    {isRecording && (
                        <>
                            {isPaused ? (
                                <button
                                    onClick={resumeRecording}
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 transition-all hover:bg-zinc-700"
                                >
                                    <Play className="h-6 w-6 text-white" />
                                </button>
                            ) : (
                                <button
                                    onClick={pauseRecording}
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 transition-all hover:bg-zinc-700"
                                >
                                    <Pause className="h-6 w-6 text-white" />
                                </button>
                            )}

                            <button
                                onClick={stopRecording}
                                className="group flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/10 bg-transparent transition-all hover:border-red-500/50 hover:bg-red-500/10"
                            >
                                <div className="h-8 w-8 rounded text-red-500 transition-transform group-hover:scale-90">
                                    <Square className="h-full w-full fill-current" />
                                </div>
                            </button>
                        </>
                    )}

                    {audioBlob && !isUploading && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={resetRecording}
                                className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Discard
                            </button>

                            <button
                                onClick={handleUpload}
                                disabled={!userId}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Upload className="h-4 w-4" />
                                Save & Transcribe
                            </button>
                        </div>
                    )}

                    {isUploading && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-2 w-48 overflow-hidden rounded-full bg-zinc-800">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <span className="text-sm text-zinc-400">Uploading... {uploadProgress}%</span>
                        </div>
                    )}
                </div>

                {/* Title Input (after stop) */}
                {audioBlob && !isUploading && (
                    <div className="mt-8 w-full max-w-sm">
                        <label className="mb-2 block text-xs font-medium uppercase text-zinc-500">
                            Recording Title (Optional)
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={`Recording ${new Date().toLocaleTimeString()}`}
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500"
                        />
                    </div>
                )}

                {uploadError && (
                    <p className="mt-4 text-sm text-red-400">{uploadError}</p>
                )}

            </div>
        </div>
    )
}
