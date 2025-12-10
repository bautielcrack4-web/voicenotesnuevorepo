'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Mic,
    Settings,
    CreditCard,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'
import { logout } from '@/app/login/actions'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Recordings', href: '/dashboard/recordings', icon: Mic },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar({ userEmail }: { userEmail: string }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 rounded-lg bg-zinc-900 p-2 text-white md:hidden"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-black transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <Mic className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">VoiceScribe</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-600/10 text-blue-400'
                                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-white'
                                        }`}
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile */}
                <div className="border-t border-white/10 p-4">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-white">
                            {userEmail[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-white">{userEmail}</p>
                            <p className="truncate text-xs text-zinc-500">Free Plan</p>
                        </div>
                    </div>

                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
