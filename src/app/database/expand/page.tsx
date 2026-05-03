"use client"

import { useState, useEffect } from "react"
import { Loading, Empty } from "@/components/ui"

type Entry = { guildId: string; expand: boolean }

export default function ExpandPage() {
  const [list, setList]       = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/db/expand")
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
  }, [])

  async function toggle(guildId: string, current: boolean) {
    await fetch(`/api/db/expand/${guildId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expand: !current }),
    })
    setList((p) => p.map((e) => e.guildId === guildId ? { ...e, expand: !current } : e))
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-2 max-w-3xl">
      {list.length === 0 ? (
        <Empty text="No expand settings" />
      ) : list.map((e) => (
        <div key={e.guildId} className="flex items-center gap-4 bg-[#161820] border border-white/7 rounded-xl px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-white/25">Guild ID</p>
            <p className="text-sm font-mono text-white/80">{e.guildId}</p>
          </div>
          <button onClick={() => toggle(e.guildId, e.expand)}
            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
              e.expand ? "bg-[#5865f2]" : "bg-white/15"
            }`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
              e.expand ? "left-5" : "left-0.5"
            }`} />
          </button>
          <span className={`text-xs font-mono w-8 flex-shrink-0 ${e.expand ? "text-[#5865f2]" : "text-white/30"}`}>
            {e.expand ? "ON" : "OFF"}
          </span>
        </div>
      ))}
    </div>
  )
}