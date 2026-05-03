import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { Blacklist } from "@/lib/models"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId } = await context.params

  await connectDB()
  await Blacklist.deleteOne({ userId })

  return NextResponse.json({ success: true })
}