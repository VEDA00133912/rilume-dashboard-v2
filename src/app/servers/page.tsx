"use client"

import { useState, useEffect, useCallback } from "react"
import Sidebar from "@/components/Sidebar"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Image from "next/image"

type Guild = {
  id: string
  name: string
  icon: string | null
  approximate_member_count?: number
  approximate_presence_count?: number
}

export default function ServersPage() {
  const { data: session, status } = useSession()
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [leaving, setLeaving] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const fetchGuilds = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/bot/guilds")
    const data = await res.json()
    setGuilds(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login")
    if (status === "authenticated") fetchGuilds()
  }, [status, fetchGuilds])

  async function leaveGuild(id: string) {
    setLeaving(id)
    await fetch(`/api/bot/guilds/${id}/leave`, { method: "DELETE" })
    setGuilds((prev) => prev.filter((g) => g.id !== id))
    setLeaving(null)
    setConfirmId(null)
  }

  const filtered = guilds.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  function getIconUrl(guild: Guild) {
    if (guild.icon) return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`
    return null
  }

  if (status === "loading") return null

  return (
    <div className="flex h-screen bg-[#0a0b0d] text-white overflow-hidden">
      <Sidebar user={session!.user} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/6 flex-shrink-0">
          <div>
            <h1 className="text-lg font-extrabold">Server Management</h1>
            <p className="text-xs font-mono text-white/30 mt-0.5">rilume / servers</p>
          </div>
          <div className="bg-[#5865f2]/15 border border-[#5865f2]/30 text-[#7a84f5] text-xs font-mono px-4 py-1.5 rounded-full">
            {guilds.length} servers
          </div>
        </header>

        {/* 検索 */}
        <div className="px-6 py-3 border-b border-white/5 flex-shrink-0">
          <input
            type="text"
            placeholder="Search servers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 placeholder:text-white/25 outline-none focus:border-white/20 font-mono"
          />
        </div>

        {/* サーバーリスト */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-white/30 font-mono text-sm animate-pulse">Loading servers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-white/30 font-mono text-sm">No servers found</p>
            </div>
          ) : (
            filtered.map((guild) => {
              const iconUrl = getIconUrl(guild)
              const initials = guild.name.slice(0, 1).toUpperCase()
              const colors = ["#5865f2","#23d26e","#fab41e","#f0545a","#7a84f5","#23b2d2"]
              const color = colors[parseInt(guild.id.slice(-1), 16) % colors.length]

              return (
                <div key={guild.id}
                  className="flex items-center gap-4 bg-[#161820] border border-white/7 hover:border-white/14 rounded-xl px-4 py-3 transition-colors">
                  {/* アイコン */}
                  {iconUrl ? (
                    <Image
                      src={iconUrl}
                      alt=""
                      width={44}
                      height={44}
                      className="rounded-xl flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-black text-white"
                      style={{ background: color }}>
                      {initials}
                    </div>
                  )}

                  {/* サーバー情報 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white/90 truncate">{guild.name}</p>
                    <p className="text-xs font-mono text-white/30 mt-0.5">ID: {guild.id}</p>
                  </div>

                  {/* メンバー数とオンライン人数 */}
                  <div className="flex items-center gap-3 mr-2 flex-shrink-0">
                    {guild.approximate_member_count != null && (
                      <div className="text-right">
                        <p className="text-xs font-mono text-white/60">
                          {guild.approximate_member_count.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-mono text-white/25">members</p>
                      </div>
                    )}
                    {guild.approximate_presence_count != null && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {/* オンラインの緑ドット */}
                          <div className="w-1.5 h-1.5 rounded-full bg-[#23d26e]" />
                          <p className="text-xs font-mono text-[#23d26e]">
                            {guild.approximate_presence_count.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-[10px] font-mono text-white/25 text-right">online</p>
                      </div>
                    )}
                  </div>

                  {/* 脱退ボタン */}
                  {confirmId === guild.id ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-white/40 font-mono">Sure?</span>
                      <button
                        onClick={() => leaveGuild(guild.id)}
                        disabled={leaving === guild.id}
                        className="bg-[#f0545a] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#d94046] transition-colors disabled:opacity-50">
                        {leaving === guild.id ? "..." : "Yes, leave"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs text-white/40 font-mono hover:text-white/70 px-2">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(guild.id)}
                      className="flex-shrink-0 bg-[#f0545a]/8 border border-[#f0545a]/25 text-[#f0545a] text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#f0545a]/18 transition-all">
                      Leave
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}