"use client"

import { useState, useEffect } from "react"
import { Loading, Empty } from "@/components/ui"

type Entry = {
  guildId: string
  executorId: string
  messageId: string
  executedAt: string
}

export default function LogsPage() {
  const [logs, setLogs]       = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState("")

  useEffect(() => {
    fetch("/api/db/impersonate-log")
      .then((r) => r.json())
      .then((d) => { setLogs(d); setLoading(false) })
  }, [])

  const filtered = logs.filter((e) =>
    !filter || e.guildId.includes(filter) || e.executorId.includes(filter)
  )

  if (loading) return <Loading />

  return (
    <div className="space-y-2 max-w-4xl">
      <input
        type="text"
        placeholder="Filter by Guild ID or Executor ID..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 placeholder:text-white/25 outline-none focus:border-white/20 font-mono mb-4"
      />
      {filtered.length === 0 ? (
        <Empty text="No logs found" />
      ) : filtered.map((e, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 bg-[#161820] border border-white/7 rounded-xl px-4 py-3">
          {[
            ["Guild",    e.guildId],
            ["Executor", e.executorId],
            ["Message",  e.messageId],
            ["Time",     new Date(e.executedAt).toLocaleString("ja-JP")],
          ].map(([label, val]) => (
            <div key={label} className="min-w-0">
              <p className="text-[10px] font-mono text-white/25">{label}</p>
              <p className="text-xs font-mono text-white/60 truncate">{val}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}