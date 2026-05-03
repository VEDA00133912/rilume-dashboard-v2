'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { Loading, Empty } from '@/components/ui'
import type { AppCommand, CommandOption } from '@/types/discord'

const COMMAND_TYPE_LABEL: Record<number, string> = {
  1: 'Slash',
  2: 'User',
  3: 'Message',
}

const COMMAND_TYPE_COLOR: Record<number, string> = {
  1: 'text-[#5865f2] bg-[#5865f2]/10 border-[#5865f2]/25',
  2: 'text-[#23d26e] bg-[#23d26e]/10 border-[#23d26e]/25',
  3: 'text-[#fab41e] bg-[#fab41e]/10 border-[#fab41e]/25',
}

const OPTION_TYPE: Record<number, string> = {
  1: 'SUB_COMMAND', 2: 'SUB_COMMAND_GROUP', 3: 'STRING',
  4: 'INTEGER', 5: 'BOOLEAN', 6: 'USER', 7: 'CHANNEL',
  8: 'ROLE', 9: 'MENTIONABLE', 10: 'NUMBER', 11: 'ATTACHMENT',
}

// default_member_permissions のビットフラグを権限名に変換
const PERMISSIONS: Record<string, string> = {
  '8':             'Administrator',
  '16':            'Manage Channels',
  '32':            'Manage Guild',
  '8192':          'Manage Messages',
  '268435456':     'Manage Roles',
  '1099511627776': 'Moderate Members',
}

function permLabel(bits: string | null) {
  if (bits === null) return 'Everyone'
  if (bits === '0') return 'No one'
  return PERMISSIONS[bits] ?? `${bits}`
}

type Tab = 'slash' | 'user' | 'message'

export default function CommandsPage() {
  const { data: session, status } = useSession()
  const [commands, setCommands] = useState<AppCommand[]>([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState<Tab>('slash')
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/login')
    if (status === 'authenticated') {
        fetch('/api/bot/commands')
        .then((r) => r.json())
        .then((d) => {
            setCommands(Array.isArray(d) ? d : [])
            setLoading(false)
        })
    }
  }, [status])

  const typeMap: Record<Tab, number> = { slash: 1, user: 2, message: 3 }
  const filtered = commands
    .filter((c) => c.type === typeMap[tab])
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  if (status === 'loading') return null

  return (
    <div className="flex h-screen bg-[#0a0b0d] text-white overflow-hidden">
      <Sidebar user={session!.user} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/6 flex-shrink-0">
          <div>
            <h1 className="text-lg font-extrabold">Commands</h1>
            <p className="text-xs font-mono text-white/30 mt-0.5">rilume / commands</p>
          </div>
          <div className="bg-[#5865f2]/15 border border-[#5865f2]/30 text-[#7a84f5] text-xs font-mono px-4 py-1.5 rounded-full">
            {commands.length} commands
          </div>
        </header>

        {/* タブ + 検索 */}
        <div className="px-6 pt-3 border-b border-white/5 flex-shrink-0 space-y-3">
          <div className="flex gap-1">
            {(['slash', 'user', 'message'] as Tab[]).map((t) => {
              const count = commands.filter((c) => c.type === typeMap[t]).length
              return (
                <button key={t} onClick={() => { setTab(t); setExpanded(null) }}
                  className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-all flex items-center gap-2 ${
                    tab === t
                      ? 'bg-[#161820] text-white border-t border-x border-white/8'
                      : 'text-white/35 hover:text-white/60'
                  }`}>
                  {COMMAND_TYPE_LABEL[typeMap[t]]}
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      tab === t ? 'bg-[#5865f2]/20 text-[#7a84f5]' : 'bg-white/8 text-white/30'
                    }`}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>
          <input
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 placeholder:text-white/25 outline-none focus:border-white/20 font-mono mb-3"
          />
        </div>

        {/* コマンドリスト */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {loading ? (
            <Loading />
          ) : filtered.length === 0 ? (
            <Empty text="No commands found" />
          ) : (
            filtered.map((cmd) => (
              <div key={cmd.id}
                className="bg-[#161820] border border-white/7 hover:border-white/14 rounded-xl overflow-hidden transition-colors">
                {/* コマンドヘッダー行 */}
                <button
                  onClick={() => setExpanded(expanded === cmd.id ? null : cmd.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-left">
                  {/* タイプバッジ */}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex-shrink-0 ${COMMAND_TYPE_COLOR[cmd.type]}`}>
                    {COMMAND_TYPE_LABEL[cmd.type]}
                  </span>

                  {/* コマンド名 */}
                  <span className="text-sm font-mono font-bold text-white/90">
                    {cmd.type === 1 ? `/${cmd.name}` : cmd.name}
                  </span>

                  {/* 説明 */}
                  {cmd.description && (
                    <span className="text-xs text-white/40 truncate flex-1">
                      {cmd.description}
                    </span>
                  )}

                  {/* メタバッジ */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      cmd.dm_permission
                        ? 'text-[#23d26e] bg-[#23d26e]/8 border-[#23d26e]/20'
                        : 'text-white/25 bg-white/4 border-white/8'
                    }`}>
                      DM {cmd.dm_permission ? 'ON' : 'OFF'}
                    </span>
                    <span className="text-[10px] font-mono text-white/30 bg-white/4 border border-white/8 px-2 py-0.5 rounded">
                      {permLabel(cmd.default_member_permissions)}
                    </span>
                    {/* 展開アイコン */}
                    {(cmd.options?.length ?? 0) > 0 && (
                      <svg viewBox="0 0 24 24" fill="currentColor"
                        className={`w-3.5 h-3.5 text-white/25 transition-transform ${expanded === cmd.id ? 'rotate-180' : ''}`}>
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* オプション展開 */}
                {expanded === cmd.id && cmd.options && cmd.options.length > 0 && (
                  <div className="border-t border-white/5 px-4 py-3 space-y-1.5">
                    <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">
                      Options ({cmd.options.length})
                    </p>
                    {cmd.options.map((opt) => (
                      <OptionRow key={opt.name} opt={opt} depth={0} />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

function OptionRow({ opt, depth }: { opt: CommandOption; depth: number }) {
  return (
    <div className={`${depth > 0 ? 'ml-4 border-l border-white/6 pl-3' : ''}`}>
      <div className="flex items-center gap-2 py-1">
        <span className="text-[10px] font-mono text-white/25 bg-white/4 border border-white/8 px-1.5 py-0.5 rounded flex-shrink-0">
          {OPTION_TYPE[opt.type] ?? opt.type}
        </span>
        <span className="text-xs font-mono text-white/70 font-bold">{opt.name}</span>
        {opt.required && (
          <span className="text-[10px] font-mono text-[#f0545a]">required</span>
        )}
        {opt.description && (
          <span className="text-xs text-white/35 truncate">{opt.description}</span>
        )}
      </div>
      {/* サブオプション（SUB_COMMANDなど）*/}
      {opt.options?.map((sub) => (
        <OptionRow key={sub.name} opt={sub} depth={depth + 1} />
      ))}
    </div>
  )
}