import { createClient } from '@/utils/supabase/server'
import RecordingCard from '@/components/dashboard/RecordingCard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { Mic } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch recordings
    const { data: recordings } = await supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <>
            <DashboardHeader
                title="Your Recordings"
                subtitle="Manage and analyze your voice notes"
            />

            {!recordings || recordings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
                        <Mic className="h-8 w-8 text-zinc-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white">No recordings yet</h3>
                    <p className="mt-2 text-sm text-zinc-500 max-w-sm">
                        Start recording your meetings or ideas to get instant transcriptions and summaries.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {recordings.map((recording) => (
                        <RecordingCard key={recording.id} recording={recording} />
                    ))}
                </div>
            )}
        </>
    )
}
