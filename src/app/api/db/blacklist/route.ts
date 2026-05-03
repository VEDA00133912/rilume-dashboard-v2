import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import type { BlacklistUser } from '@/types/db'

async function getCol() {
  const client = await clientPromise
  return client.db().collection<BlacklistUser>('blacklistusers')
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const col = await getCol()
  const data = await col.find().sort({ addedAt: -1 }).toArray()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const col = await getCol()
  const doc: BlacklistUser = { userId, addedAt: new Date() }
  await col.insertOne(doc)
  return NextResponse.json(doc)
}