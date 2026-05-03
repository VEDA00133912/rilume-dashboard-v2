export function Loading() {
  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-white/30 font-mono text-sm animate-pulse">Loading...</p>
    </div>
  )
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-white/25 font-mono text-sm">{text}</p>
    </div>
  )
}