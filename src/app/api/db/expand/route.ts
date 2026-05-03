import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { Expand } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const data = await Expand.find().lean()
  return NextResponse.json(data)
}