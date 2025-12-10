import Header from '@/components/Header'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Mic, Sparkles, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />

          <div className="container relative mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-blue-400 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now live with Gemini 2.0
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl mb-6">
              Transcribe meetings <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                in real-time
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl mb-10">
              Transform your voice conversations into structured notes, actionable summaries,
              and clear insights instantly using advanced AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login?view=signup"
                className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Start Recording Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#demo"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-black/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Everything you need to capture ideas</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Mic className="h-6 w-6 text-blue-400" />}
                title="Crystal Clear Transcription"
                description="Industry-leading accuracy for real-time speech-to-text, powered by advanced models."
              />
              <FeatureCard
                icon={<Sparkles className="h-6 w-6 text-purple-400" />}
                title="AI Summaries"
                description="Get concise summaries, action items, and key takeaways instantly after your meeting."
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6 text-yellow-400" />}
                title="Instant Search"
                description="Find any moment in any conversation with powerful semantic search capabilities."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section (Simple Preview) */}
        <section id="pricing" className="py-24 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-16">Simple, transparent pricing</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingCard title="Free" price="$0" features={['5 hours/month', 'Basic Transcription', '7-day retention']} />
              <PricingCard title="Pro" price="$19" features={['Unlimited hours', 'Advanced AI Analysis', 'Unlimited retention', 'Priority Support']} highlighted />
              <PricingCard title="Enterprise" price="Custom" features={['Custom Integration', 'SLA', 'Dedicated Manager']} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        <p>© 2025 VoiceScribe AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
      <div className="mb-4 inline-flex items-center justify-center p-3 rounded-lg bg-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function PricingCard({ title, price, features, highlighted = false }: { title: string, price: string, features: string[], highlighted?: boolean }) {
  return (
    <div className={`p-8 rounded-2xl border ${highlighted ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'} flex flex-col`}>
      <h3 className="text-xl font-medium text-gray-300 mb-2">{title}</h3>
      <div className="text-4xl font-bold mb-6">{price}<span className="text-lg text-gray-500 font-normal">/mo</span></div>
      <ul className="space-y-4 mb-8 flex-1 text-left">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-300">
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={title === 'Enterprise' ? '/contact' : '/login?view=signup'} className={`w-full py-3 rounded-xl font-medium transition ${highlighted ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
        Choose {title}
      </Link>
    </div>
  )
}
