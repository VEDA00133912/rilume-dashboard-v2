import { auth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { BlacklistUser } from '@/types/db'
import { NextRequest } from 'next/server'

async function getCol() {
  const client = await clientPromise
  return client.db().collection<BlacklistUser>('blacklistusers')
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await params

  const col = await getCol()
  await col.deleteOne({ userId })
  return Response.json({ success: true })
}