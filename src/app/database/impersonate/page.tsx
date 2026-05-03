"use client"

import { useState, useEffect } from "react"
import { Loading, Empty } from "@/components/ui"

type Entry = {
  guildId: string
  channelId: string | null
  webhookId: string | null
  webhookToken: string | null
  enabled: boolean
}

export default function ImpersonatePage() {
  const [list, setList]       = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/db/impersonate")
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
  }, [])

  async function toggleEnabled(guildId: string, current: boolean) {
    await fetch(`/api/db/impersonate/${guildId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !current }),
    })
    setList((p) => p.map((e) => e.guildId === guildId ? { ...e, enabled: !current } : e))
  }

  async function deleteEntry(guildId: string) {
    await fetch(`/api/db/impersonate/${guildId}`, { method: "DELETE" })
    setList((p) => p.filter((e) => e.guildId !== guildId))
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-3 max-w-3xl">
      {list.length === 0 ? (
        <Empty text="No impersonate settings" />
      ) : list.map((e) => (
        <div key={e.guildId} className="bg-[#161820] border border-white/7 rounded-xl px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-mono text-white/80">{e.guildId}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleEnabled(e.guildId, e.enabled)}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  e.enabled ? "bg-[#23d26e]" : "bg-white/15"
                }`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                  e.enabled ? "left-5" : "left-0.5"
                }`} />
              </button>
              <span className={`text-xs font-mono w-8 ${e.enabled ? "text-[#23d26e]" : "text-white/30"}`}>
                {e.enabled ? "ON" : "OFF"}
              </span>
              <button onClick={() => deleteEntry(e.guildId)}
                className="text-xs font-bold text-[#f0545a] bg-[#f0545a]/8 border border-[#f0545a]/25 px-3 py-1.5 rounded-lg hover:bg-[#f0545a]/18 transition-all">
                Delete
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
            {[
              ["Channel ID", e.channelId],
              ["Webhook ID", e.webhookId],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[10px] font-mono text-white/25">{label}</p>
                <p className="text-xs font-mono text-white/55 truncate">{val ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}