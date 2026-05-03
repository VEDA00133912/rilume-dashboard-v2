import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { Expand } from "@/lib/models"
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
  const { expand } = await req.json()

  await connectDB()

  const doc = await Expand.findOneAndUpdate(
    { guildId },
    { expand },
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
  await Expand.deleteOne({ guildId })

  return NextResponse.json({ success: true })
}