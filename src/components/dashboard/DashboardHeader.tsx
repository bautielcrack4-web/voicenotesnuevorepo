import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardHeader({ title, subtitle }: { title: string, subtitle?: string }) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-zinc-400">{subtitle}</p>}
            </div>

            <Link href="/dashboard/record" className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                <Plus className="h-4 w-4" />
                New Recording
            </Link>
        </div>
    )
}
