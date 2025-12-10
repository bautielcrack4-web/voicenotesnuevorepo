import { Play, Calendar, Clock, FileText, MoreVertical, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Recording {
    id: string
    title: string
    created_at: string
    duration_seconds: number | null
    status: string
}

export default function RecordingCard({ recording }: { recording: Recording }) {
    const isProcessing = recording.status === 'processing'

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '--:--'
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="group relative flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 p-4 transition-all hover:border-blue-500/50 hover:bg-zinc-900">
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isProcessing
                        ? 'bg-yellow-500/10 text-yellow-500 animate-pulse'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                    {isProcessing ? <Clock className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </div>

                <div>
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {recording.title || 'Untitled Recording'}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(recording.duration_seconds)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isProcessing
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-green-500/10 text-green-500'
                    }`}>
                    {recording.status}
                </span>

                <button className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white transition-colors">
                    <MoreVertical className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
