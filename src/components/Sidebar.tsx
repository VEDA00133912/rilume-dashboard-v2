'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

type User = {
  name?: string | null
  image?: string | null
}

const navItems = [
  {
    section: 'overview',
    items: [
      { label: 'Dashboard', href: '/', icon: GridIcon },
      { label: 'Commands', href: '/commands', icon: CommandIcon },
    ],
  },
  {
    section: 'management',
    items: [
      { label: 'Servers', href: '/servers', icon: ServerIcon },
      { label: 'Blacklist', href: '/database/blacklist', icon: DatabaseIcon },
      { label: 'Expand', href: '/database/expand', icon: DatabaseIcon },
      { label: 'Impersonate', href: '/database/impersonate', icon: DatabaseIcon },
      { label: 'Logs', href: '/database/logs', icon: DatabaseIcon },
      { label: 'Random Songs', href: '/database/randomsongs', icon: DatabaseIcon }
    ],
  },
]

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const initials = user.name?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <aside className="w-[220px] bg-[#0f1015] border-r border-white/7 flex flex-col py-5 flex-shrink-0">
      {/* Logo */}
      <div className="px-[18px] pb-5 border-b border-white/6 mb-3.5">
        <div className="w-9 h-9 relative mb-2.5">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            sizes="36px"
            className="rounded-xl object-cover"
          />
        </div>

        <p className="text-[13px] font-bold text-white tracking-wide">
          Rilume
        </p>
        <p className="text-[10px] text-white/30 font-mono mt-0.5">
          dev dashboard
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 space-y-4">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-[0.12em] px-2 pb-1.5">
              {section}
            </p>

            {items.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(href + '/')

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] mb-0.5 transition-all ${
                    active
                      ? 'bg-[#5865f2]/15 text-[#7a84f5]'
                      : 'text-white/40 hover:bg-white/4 hover:text-white/70'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-2.5 pt-3.5 border-t border-white/6">
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/4 cursor-pointer hover:bg-white/6 transition-all"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#5865f2] flex items-center justify-center text-[11px] font-bold text-white">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-white/80 font-medium truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-white/30 font-mono">
              ログアウト
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function GridIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
}

function CommandIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M8 17l4-8 4 8M6 15h12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
}

function ServerIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20 5H4v4h16V5zM4 11h16v4H4v-4zm0 6h16v2H4v-2z" /></svg>
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C7.03 2 3 3.79 3 6v12c0 2.21 4.03 4 9 4s9-1.79 9-4V6c0-2.21-4.03-4-9-4zm0 2c4.42 0 7 .99 7 2s-2.58 2-7 2-7-.99-7-2 2.58-2 7-2zm0 14c-4.42 0-7-.99-7-2v-2c1.68 1.02 4.45 1.5 7 1.5s5.32-.48 7-1.5v2c0 1.01-2.58 2-7 2zm0-5c-4.42 0-7-.99-7-2V9c1.68 1.02 4.45 1.5 7 1.5s5.32-.48 7-1.5v2c0 1.01-2.58 2-7 2z"/>
    </svg>
  )
}