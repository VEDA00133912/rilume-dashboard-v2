import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { Impersonate } from "@/lib/models"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { guildId } = await context.params
  const body = await req.json()

  await connectDB()

  const doc = await Impersonate.findOneAndUpdate(
    { guildId },
    body,
    { new: true }
  )

  return NextResponse.json(doc)
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { guildId } = await context.params

  await connectDB()
  await Impersonate.deleteOne({ guildId })

  return NextResponse.json({ success: true })
}