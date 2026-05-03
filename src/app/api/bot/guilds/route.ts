import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch(
    'https://discord.com/api/v10/users/@me/guilds?with_counts=true',
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: 500 })
  }

  const guilds = await res.json()
  return NextResponse.json(guilds)
}