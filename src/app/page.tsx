import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/Sidebar"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex h-screen bg-[#0a0b0d] text-white overflow-hidden">
      <Sidebar user={session.user} />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Rilume Dashboard
          </h1>
          <p className="text-xs font-mono text-white/30 mt-3">
            Welcome, {session.user.name}
          </p>
        </div>
      </main>
    </div>
  )
}