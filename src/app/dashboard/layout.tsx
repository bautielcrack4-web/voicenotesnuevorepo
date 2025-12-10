import Sidebar from '@/components/dashboard/Sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Sidebar userEmail={user.email!} />

            <main className="transition-all duration-300 md:pl-64">
                <div className="container mx-auto p-4 md:p-8 max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    )
}
