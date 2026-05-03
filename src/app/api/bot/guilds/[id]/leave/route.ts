import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  const res = await fetch(`https://discord.com/api/v10/users/@me/guilds/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to leave guild" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}