"use client"

import { useState, useEffect } from "react"
import { Loading, Empty } from "@/components/ui"

type Entry = { userId: string; addedAt: string }

export default function BlacklistPage() {
  const [list, setList]       = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [newId, setNewId]     = useState("")
  const [adding, setAdding]   = useState(false)

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    setLoading(true)
    const res = await fetch("/api/db/blacklist")
    setList(await res.json())
    setLoading(false)
  }

  async function addEntry() {
    if (!newId.trim()) return
    setAdding(true)
    const res = await fetch("/api/db/blacklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: newId.trim() }),
    })
    const doc = await res.json()
    setList((p) => [doc, ...p])
    setNewId("")
    setAdding(false)
  }

  async function removeEntry(userId: string) {
    await fetch(`/api/db/blacklist/${userId}`, { method: "DELETE" })
    setList((p) => p.filter((e) => e.userId !== userId))
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-3 max-w-3xl">
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Discord User ID"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addEntry()}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 placeholder:text-white/25 outline-none focus:border-white/20 font-mono"
        />
        <button onClick={addEntry} disabled={adding}
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-50">
          {adding ? "Adding..." : "+ Add"}
        </button>
      </div>

      {list.length === 0 ? (
        <Empty text="No blacklisted users" />
      ) : list.map((e) => (
        <div key={e.userId} className="flex items-center gap-4 bg-[#161820] border border-white/7 rounded-xl px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-mono text-white/80">{e.userId}</p>
            <p className="text-[10px] font-mono text-white/25 mt-0.5">
              Added: {new Date(e.addedAt).toLocaleString("ja-JP")}
            </p>
          </div>
          <button onClick={() => removeEntry(e.userId)}
            className="text-xs font-bold text-[#f0545a] bg-[#f0545a]/8 border border-[#f0545a]/25 px-3 py-1.5 rounded-lg hover:bg-[#f0545a]/18 transition-all flex-shrink-0">
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}