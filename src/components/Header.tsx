import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Mic } from 'lucide-react'

export default async function Header() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-md z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
                    <Mic className="h-6 w-6 text-blue-500" />
                    <span>VoiceScribe</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="#features" className="hover:text-white transition">Features</Link>
                    <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
                    <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-300 hidden sm:block">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <button className="text-sm font-medium text-gray-300 hover:text-white transition">
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">
                                Sign In
                            </Link>
                            <Link
                                href="/login?view=signup"
                                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
