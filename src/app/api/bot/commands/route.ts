import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const res = await fetch(
    `https://discord.com/api/v10/applications/${process.env.DISCORD_CLIENT_ID}/commands`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      cache: 'no-store',
    }
  )

  const data = await res.json()

  if (!res.ok) {
    console.error('Discord API error:', data)
    return NextResponse.json({ error: 'Failed to fetch commands', detail: data }, { status: 500 })
  }

  return NextResponse.json(data)
}