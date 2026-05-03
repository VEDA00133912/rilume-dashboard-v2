'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const tabs = [
  { label: 'Blacklist',   href: '/database/blacklist' },
  { label: 'Expand',      href: '/database/expand' },
  { label: 'Impersonate', href: '/database/impersonate' },
  { label: 'Logs',        href: '/database/logs' },
]

const pageNames: Record<string, string> = {
  '/database/blacklist':   'blacklist',
  '/database/expand':      'expand',
  '/database/impersonate': 'impersonate',
  '/database/logs':        'logs',
}

export default function DatabaseLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') return null
  if (status === 'unauthenticated') redirect('/login')

  return (
    <div className="flex h-screen bg-[#0a0b0d] text-white overflow-hidden">
      <Sidebar user={session!.user} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/6 flex-shrink-0">
          <div>
            <h1 className="text-lg font-extrabold">Database</h1>
            <p className="text-xs font-mono text-white/30 mt-0.5">
              rilume / {pageNames[pathname] ?? 'database'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#23d26e]" />
            <span className="text-xs font-mono text-[#23d26e]">MongoDB</span>
          </div>
        </header>

        <div className="flex gap-1 px-6 pt-3 border-b border-white/5 flex-shrink-0">
          {tabs.map((t) => {
            const active = pathname === t.href
            return (
              <Link key={t.href} href={t.href}
                className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-all ${
                  active
                    ? 'bg-[#161820] text-white border-t border-x border-white/8'
                    : 'text-white/35 hover:text-white/60'
                }`}>
                {t.label}
              </Link>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}