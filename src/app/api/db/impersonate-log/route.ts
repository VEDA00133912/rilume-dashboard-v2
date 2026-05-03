import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { ImpersonateLog } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const { searchParams } = new URL(req.url)
  const guildId = searchParams.get("guildId")
  const query = guildId ? { guildId } : {}
  const data = await ImpersonateLog.find(query).sort({ executedAt: -1 }).limit(100).lean()
  return NextResponse.json(data)
}