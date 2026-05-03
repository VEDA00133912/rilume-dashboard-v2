import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { Blacklist } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const data = await Blacklist.find().sort({ addedAt: -1 }).lean()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })
  const doc = await Blacklist.create({ userId })
  return NextResponse.json(doc)
}