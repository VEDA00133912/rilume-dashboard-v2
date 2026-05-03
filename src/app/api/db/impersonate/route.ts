import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { Impersonate } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const data = await Impersonate.find().lean()
  return NextResponse.json(data)
}