'use client'

import { useState, Suspense } from 'react'
import { login, signup } from './actions'
import { Loader2, Mic, Sparkles } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function LoginContent() {
    const searchParams = useSearchParams()
    const viewParam = searchParams.get('view')

    const [isLogin, setIsLogin] = useState(viewParam !== 'signup')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        try {
            const action = isLogin ? login : signup
            const result = await action(formData)

            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
            }
        } catch (e) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-black text-white selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
                <div className="absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
            </div>

            <div className="z-10 flex w-full flex-col items-center justify-center px-4">
                <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600">
                        <Mic className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">VoiceScribe</span>
                </div>

                <div className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                    <div className="mb-8 flex w-full rounded-lg bg-black/20 p-1">
                        <button
                            onClick={() => { setIsLogin(true); setError(null); }}
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(null); }}
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${!isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {isLogin
                                ? 'Enter your credentials to access your recordings'
                                : 'Join thousands of users transcribing with AI'
                            }
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="mb-2 block text-xs font-medium uppercase text-gray-400">
                                    Full Name
                                </label>
                                <input
                                    name="fullName"
                                    type="text"
                                    required={!isLogin}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:bg-white/5"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase text-gray-400">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:bg-white/5"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase text-gray-400">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:bg-white/5"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    {!isLogin && <Sparkles className="h-4 w-4" />}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        {isLogin ? (
                            <a href="#" className="hover:text-white transition">Forgot your password?</a>
                        ) : (
                            <p>By signing up, you agree to our Terms & Privacy Policy</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoginLoading() {
    return (
        <div className="flex min-h-screen w-full bg-black items-center justify-center text-white">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginContent />
        </Suspense>
    )
}
